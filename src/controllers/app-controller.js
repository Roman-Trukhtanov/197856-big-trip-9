import {isInputTag, isLinkTag, Position, render, unrender} from "../utils";
import Tabs from "../components/tabs";
import Tab from "../components/tab";
import TripInfo from "../components/trip-info";
import TripCost from "../components/trip-cost";
import TripFilters from "../components/trip-filters";
import EventsMsg from "../components/events-msg";
import TripController from "./trip-controller";
import Statistics from "../components/statistics";
import {Message} from "../config";

export default class App {
  constructor(
      api,
      pointsData,
      destinations,
      offersByTypes,
      menuData,
      filtersData,
      monthsNames,
      wayPointTypes,
      getInfoData,
      container,
      infoContainer,
      controlsContainer,
      newPointBtn
  ) {
    this._api = api;
    this._data = pointsData;
    this._destinations = destinations;
    this._offersByTypes = offersByTypes;
    this._menuData = menuData;
    this._filtersData = filtersData;
    this._monthsNames = monthsNames;
    this._wayPointTypes = wayPointTypes;
    this._mainContainer = container;
    this._infoContainer = infoContainer;
    this._controlsContainer = controlsContainer;
    this._getInfoData = getInfoData;
    this._tabs = new Tabs();
    this._tripController = null;
    this._tripCost = null;
    this._tripInfo = null;
    this._tripFilters = new TripFilters(this._filtersData);
    this._eventsMsg = new EventsMsg(Message.FIRST_POINT);
    this._statistics = new Statistics(this._data);
    this._newPointBtn = newPointBtn;
    this._onMainDataChange = this._onMainDataChange.bind(this);
    this._isInitedTripController = false;
    this._currentTab = null;
  }

  init() {
    this._renderTabs();
    this._renderTripInfo(this._getInfoData(this._data));
    this._renderTripCost();
    this._renderTripFilters();
    this._renderTripMain();
    this._renderStatistics();

    this._addListenerToTabs();
    this._addListenerToNewPointBtn();
  }

  _onMainDataChange(newData) {
    this._data = newData;

    if (this._data.length === 0) {
      this._mainContainer.innerHTML = ``;
      this._renderEventsMessage();
    }

    this._changeTripInfo();
    this._changeTripCost();
  }

  _changeTripCost() {
    if (this._tripCost) {
      unrender(this._tripCost.getElement());
      this._tripCost.removeElement();
    }

    this._renderTripCost();
  }

  _changeTripInfo() {
    if (this._tripInfo) {
      unrender(this._tripInfo.getElement());
      this._tripInfo.removeElement();
    }

    this._renderTripInfo(this._getInfoData(this._data));
  }

  _renderTabs() {
    const tabsElement = this._tabs.getElement();

    for (const menu of this._menuData) {
      const tab = new Tab(menu);
      const tabElement = tab.getElement();

      render(tabsElement, tabElement, Position.BEFOREEND);
    }

    render(this._controlsContainer, tabsElement, Position.BEFOREEND);
  }

  _renderTripInfo(infoData) {
    if (infoData.times !== null) {
      this._tripInfo = new TripInfo(infoData);
      const tripInfoElement = this._tripInfo.getElement();

      render(this._infoContainer, tripInfoElement, Position.BEFOREEND);
    }
  }

  _renderTripCost() {
    this._tripCost = new TripCost(this._data);
    const tripCostElement = this._tripCost.getElement();

    render(this._infoContainer, tripCostElement, Position.BEFOREEND);
  }

  _renderTripFilters() {
    const tripFiltersElements = this._tripFilters.getElement();

    tripFiltersElements
      .addEventListener(`change`, (evt) => {
        evt.preventDefault();

        if (!isInputTag(evt) || this._data.length === 0) {
          evt.target.checked = false;
          this._tripFilters.getElement().querySelector(`#filter-everything`).checked = true;
          return;
        }

        this._tripController.filterPoints(evt.target.value);
      });

    render(this._controlsContainer, tripFiltersElements, Position.BEFOREEND);
  }

  _renderEventsMessage() {
    const eventsMsgElement = this._eventsMsg.getElement();

    render(this._mainContainer, eventsMsgElement, Position.BEFOREEND);
  }

  _renderTripMain() {
    this._tripController = new TripController(
        this._api,
        this._mainContainer,
        this._data,
        this._destinations,
        this._offersByTypes,
        this._wayPointTypes,
        this._monthsNames,
        this._onMainDataChange
    );

    if (this._data.length === 0) {
      this._renderEventsMessage();
    } else {
      this._tripController.init();
      this._isInitedTripController = true;
    }

    this._statistics.hide();
  }

  _renderStatistics() {
    const mainContainer = document.querySelector(`.page-main .page-body__container`);
    render(mainContainer, this._statistics.getElement(), Position.BEFOREEND);
  }

  _showEvents() {
    this._tripController.show();
    this._statistics.hide();
    this._newPointBtn.disabled = false;
    this._tripFilters.getElement().classList.remove(`visually-hidden`);
  }

  _showStatistics() {
    this._tripController.hide();
    this._statistics.show(this._data);
    this._newPointBtn.disabled = true;
    this._tripFilters.getElement().classList.add(`visually-hidden`);
  }

  _addListenerToTabs() {
    const tabItems = this._tabs.getElement().querySelectorAll(`.trip-tabs__btn`);

    this._tabs.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (!isLinkTag(evt) || this._data.length === 0) {
        return;
      }

      for (const tabItem of tabItems) {
        tabItem.classList.remove(`trip-tabs__btn--active`);
      }

      const tabType = evt.target.dataset.tabType;

      evt.target.classList.add(`trip-tabs__btn--active`);

      if (tabType === this._currentTab) {
        return;
      } else {
        this._currentTab = tabType;

        switch (tabType) {
          case `table`:
            this._showEvents();
            break;
          case `stats`:
            this._showStatistics();
            break;
        }
      }
    });
  }

  _addListenerToNewPointBtn() {
    this._newPointBtn.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      // При первом заходе в приложение и нет ни одного поинта
      if (this._isInitedTripController === false) {
        this._isInitedTripController = true;
        this._mainContainer.innerHTML = ``;
        this._tripController.init();
      }

      // Конда TripController был инициализирован, но пользователь удалил все поинты
      if (this._data.length === 0 && this._isInitedTripController === true) {
        this._mainContainer.innerHTML = ``;
        this._tripController.init();
      }

      this._tripFilters.getElement().querySelector(`#filter-everything`).checked = true;

      this._tripController.onChangeView();
      this._tripController.createEvent();
    });
  }
}
