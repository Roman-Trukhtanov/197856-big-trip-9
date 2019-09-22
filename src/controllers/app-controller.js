import {isLinkTag, Position, render, unrender} from "../utils";
import Tabs from "../components/tabs";
import Tab from "../components/tab";
import TripInfo from "../components/trip-info";
import TripCost from "../components/trip-cost";
import TripFilters from "../components/trip-filters";
import EventsMsg from "../components/events-msg";
import TripController from "./trip-controller";
import Statistics from "../components/statistics";

export default class App {
  constructor(
      pointsData,
      menuData,
      filtersData,
      cities,
      monthsNames,
      wayPointTypes,
      getInfoData,
      container,
      infoContainer,
      controlsContainer
  ) {
    this._data = pointsData;
    this._menuData = menuData;
    this._filtersData = filtersData;
    this._cities = cities;
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
    this._eventsMsg = new EventsMsg();
    this._statistics = new Statistics();
    this._onMainDataChange = this._onMainDataChange.bind(this);
  }

  init() {
    this._renderTabs();
    this._renderTripInfo(this._getInfoData(this._data));
    this._renderTripCost();
    this._renderTripFilters();
    this._renderTripMain();
    this._renderStatistics();

    this._addListenerToTabs();
  }

  _onMainDataChange(newData) {
    this._data = newData;

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
      this._tripInfo = new TripInfo(infoData, this._monthsNames);
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

    render(this._controlsContainer, tripFiltersElements, Position.BEFOREEND);
  }

  _renderEventsMessage() {
    const eventsMsgElement = this._eventsMsg.getElement();

    render(this._mainContainer, eventsMsgElement, Position.BEFOREEND);
  }

  _renderTripMain() {
    this._tripController = new TripController(
        this._mainContainer,
        this._data,
        this._wayPointTypes,
        this._cities,
        this._monthsNames,
        this._onMainDataChange
    );

    if (this._data.length === 0) {
      this._renderEventsMessage();
    } else {
      this._tripController.init();
    }
  }

  _renderStatistics() {
    const mainContainer = document.querySelector(`.page-main .page-body__container`);
    render(mainContainer, this._statistics.getElement(), Position.BEFOREEND);
  }

  _showEvents() {
    this._tripController.show();
    this._statistics.hide();
  }

  _showStatistics() {
    this._tripController.hide();
    this._statistics.show();
  }

  _addListenerToTabs() {
    const tabItems = this._tabs.getElement().querySelectorAll(`.trip-tabs__btn`);

    this._tabs.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (!isLinkTag(evt)) {
        return;
      }

      for (const tabItem of tabItems) {
        tabItem.classList.remove(`trip-tabs__btn--active`);
      }

      const tabType = evt.target.dataset.tabType;

      evt.target.classList.add(`trip-tabs__btn--active`);

      switch (tabType) {
        case `table`:
          this._showEvents();
          break;
        case `stats`:
          this._showStatistics();
          break;
      }
    });
  }
}
