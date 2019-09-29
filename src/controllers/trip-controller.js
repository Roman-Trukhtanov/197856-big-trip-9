import {Position, render, sortDataByTime} from "../utils";
import Days from "../components/days";
import Day from "../components/day";
import Sort from "../components/sort";
import PointController from "./point-controller";
import ModelPoint from "../model-point";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

const DEFAULT_OFFER_TYPE = `taxi`;

export default class TripController {
  constructor(
      api,
      container,
      wayPointsData,
      destinations,
      offersByTypes,
      wayPointTypes,
      monthsNames,
      onMainDataChange
  ) {
    this._api = api;
    this._container = container;
    this._wayPointsData = wayPointsData;
    this._wayPointsTypes = wayPointTypes;
    this._destinations = destinations;
    this._offersByTypes = offersByTypes;
    this._monthsNames = monthsNames;
    this._days = new Days();
    this._sort = new Sort();
    this._addListenerToSortItems();
    this._subscriptions = [];
    this._flatPickrs = [];
    this.onChangeView = this.onChangeView.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this._onMainDataChange = onMainDataChange;
    this._sortType = `sort-event`;
    this._filterType = `everything`;
    this._creatingTask = null;
  }

  init() {
    this._renderSort();
    this._renderDays(this._wayPointsData);
  }

  onChangeView() {
    // Если новый поинт был создан, но не сохранен -> удалить его
    if (this._creatingTask) {
      this._days.getElement().firstChild.remove();
      this._creatingTask = null;
    }

    this._subscriptions.forEach((setDefaultViewCall) => setDefaultViewCall());
  }

  onDataChange(newData, oldData) {
    const pointIndex = this._wayPointsData.findIndex((taskData) => taskData === oldData);

    if (newData === null && oldData === null) {
      this._creatingTask = null;
    } else if (newData === null) {
      this._wayPointsData = [...this._wayPointsData.slice(0, pointIndex), ...this._wayPointsData.slice(pointIndex + 1)];
      this._creatingTask = null;
    } else if (oldData === null) {
      this._creatingTask = null;
      this._wayPointsData = [newData, ...this._wayPointsData];
    } else {
      this._creatingTask = null;
      this._wayPointsData[pointIndex] = newData;
    }

    sortDataByTime(this._wayPointsData);

    this._onMainDataChange(this._wayPointsData);

    this._subscriptions = [];
    this._days.getElement().innerHTML = ``;

    this.filterPoints(this._filterType);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  createEvent() {
    if (this._creatingTask) {
      return;
    }

    if (this._filterType !== FilterType.EVERYTHING) {
      this.filterPoints(FilterType.EVERYTHING);
    }

    const offerData = this._offersByTypes.find((offer) => offer.type === DEFAULT_OFFER_TYPE);

    const dayNumber = ``;

    const defaultEventData = {
      'type': DEFAULT_OFFER_TYPE,
      'destination': {
        name: ``,
        description: ``,
        pictures: [],
      },
      'date_from': Date.now(),
      'date_to': Date.now(),
      'base_price': 0,
      'offers': offerData.offers ? offerData.offers : [],
      'is_favorite': false,
    };

    const modelPoints = [ModelPoint.parsePoint(defaultEventData)];

    this._creatingTask = true;

    this._renderDay(modelPoints, dayNumber, this._days.getElement(), Mode.ADDING);
  }

  _renderEvent(data, container, mode) {
    const pointController = new PointController(
        this._api,
        data,
        this._wayPointsTypes,
        this._destinations,
        this._offersByTypes,
        this._wayPointsData.length,
        container,
        this.onDataChange,
        this.onChangeView,
        mode
    );

    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
    this._flatPickrs.push(pointController.removeFlatPickr.bind(pointController));
  }

  _getDays(data) {
    const days = {};
    let targetDayNumber = 1;

    for (const dataItem of data) {
      const dayKey = `${this._monthsNames[new Date(dataItem.time.startTime).getMonth()]}_${new Date(dataItem.time.startTime).getDate()}`;

      if (days.hasOwnProperty(dayKey)) {
        days[dayKey].events.push(dataItem);
      } else {
        days[dayKey] = {
          events: [dataItem],
          dayNumber: targetDayNumber++,
        };
      }
    }

    return days;
  }

  _renderDay(dayEvents, dayNumber, daysElement, mode) {
    let renderPosition = Position.BEFOREEND;

    if (mode === Mode.ADDING) {
      renderPosition = Position.AFTERBEGIN;
    }

    const day = new Day(dayEvents, dayNumber, mode);
    const dayElement = day.getElement();

    const eventsListContainer = dayElement.querySelector(`.trip-events__list`);

    for (const dataItem of dayEvents) {
      this._renderEvent(dataItem, eventsListContainer, mode);
    }

    render(daysElement, dayElement, renderPosition);
  }

  _renderDays(data) {
    const daysElement = this._days.getElement();

    const daysData = this._getDays(data);

    const daysKeys = Object.keys(daysData);

    for (const key of daysKeys) {
      const dayItemData = daysData[key];
      const dayEvents = dayItemData.events;
      const dayNumber = dayItemData.dayNumber;

      this._renderDay(dayEvents, dayNumber, daysElement, Mode.DEFAULT);
    }

    render(this._container, daysElement, Position.BEFOREEND);
  }

  _renderAllDaysList(data) {
    const daysElement = this._days.getElement();

    const day = new Day(data, null);
    const dayElement = day.getElement();
    dayElement.querySelector(`.day__info`).innerHTML = ``;

    const eventsListContainer = dayElement.querySelector(`.trip-events__list`);

    for (const dataItem of data) {
      this._renderEvent(dataItem, eventsListContainer, Mode.DEFAULT);
    }

    render(daysElement, dayElement, Position.BEFOREEND);
  }

  _renderSort() {
    const sortingElement = this._sort.getElement();

    render(this._container, sortingElement, Position.BEFOREEND);
  }

  _addListenerToSortItems() {
    const sortingElement = this._sort.getElement();
    sortingElement.addEventListener(`change`, (evt) => this._onSortItemClick(evt));
  }

  filterPoints(filterType) {
    this._creatingTask = null;

    this._filterType = filterType;

    this._flatPickrs.forEach((removeFlatPickrs) => removeFlatPickrs());
    this._flatPickrs = [];

    this._days.getElement().innerHTML = ``;

    switch (filterType) {
      case FilterType.EVERYTHING:
        this._sortEvents(this._wayPointsData);
        break;
      case FilterType.FUTURE:
        const filteredByFuture = this._wayPointsData.slice().filter(({time}) => {
          return time.startTime > Date.now();
        });
        this._sortEvents(filteredByFuture);
        break;
      case FilterType.PAST:
        const filteredByPast = this._wayPointsData.slice().filter(({time}) => {
          return time.startTime < Date.now();
        });
        this._sortEvents(filteredByPast);
        break;
    }
  }

  _sortEvents(data = this._wayPointsData) {
    this._flatPickrs.forEach((removeFlatPickrs) => removeFlatPickrs());
    this._flatPickrs = [];

    switch (this._sortType) {
      case SortType.EVENT:
        this._renderDays(data);
        break;
      case SortType.TIME:
        const sortedByTimeEventsData = data.slice().sort((a, b) => {
          const durationLeft = Math.abs(a.time.endTime - a.time.startTime);
          const durationRight = Math.abs(b.time.endTime - b.time.startTime);
          return durationRight - durationLeft;
        });
        this._renderAllDaysList(sortedByTimeEventsData);
        break;
      case SortType.PRICE:
        const sortedByPriceEventsData = data.slice().sort((a, b) => b.wayPointPrice - a.wayPointPrice);

        this._renderAllDaysList(sortedByPriceEventsData);
        break;
    }
  }

  _onSortItemClick(evt) {
    if (!evt.target.hasAttribute(`data-sort-type`) || this._wayPointsData.length === 0) {
      return;
    }

    this._days.getElement().innerHTML = ``;

    this._sortType = evt.target.dataset.sortType;

    this.filterPoints(this._filterType);
  }
}
