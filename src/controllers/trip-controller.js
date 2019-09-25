import {Position, reducer, render, sortDataByTime} from "../utils";
import Days from "../components/days";
import Day from "../components/day";
import Sort from "../components/sort";
import PointController from "./point-controller";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

export const FilterTypes = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const SortTypes = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

export default class TripController {
  constructor(
      container,
      wayPointsData,
      wayPointTypes,
      cities,
      monthsNames,
      onMainDataChange
  ) {
    this._container = container;
    this._wayPointsData = wayPointsData;
    this._wayPointsTypes = wayPointTypes;
    this._cities = cities;
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

    this._sortEvents();
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

    if (this._filterType !== FilterTypes.EVERYTHING) {
      this.filterPoints(FilterTypes.EVERYTHING);
    }

    const defaultEventData = {
      dayNumber: ``,
      events: [{
        id: this._wayPointsData.length,
        type: {
          title: `taxi`,
          srcIconName: `taxi.png`,
          prefixTemplate: `Taxi to`,
          group: `transfer`,
        },
        city: ``,
        wayPointPrice: 0,
        time: {
          startTime: ``,
          endTime: ``,
        },
        description: ``,
        photos: [],
        offers: [],
        isFavorite: false,

        get totalPrice() {
          let offerPrices = 0;

          if (this.offers.length > 0) {
            offerPrices += this.offers.map((offer) => offer.isSelected ? offer.price : 0).reduce(reducer);
          }

          return this.wayPointPrice + offerPrices;
        }
      }]
    };

    this._creatingTask = true;

    this._renderDay(defaultEventData.events, defaultEventData.dayNumber, this._days.getElement(), Mode.ADDING);
  }

  _renderEvent(data, container, mode) {
    const pointController = new PointController(data, container, this._wayPointsTypes, this._cities, this.onDataChange, this.onChangeView, mode);

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

    const day = new Day(dayEvents, dayNumber);
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

    const day = new Day(data, this._monthsNames, 0);
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
      case FilterTypes.EVERYTHING:
        this._renderDays(this._wayPointsData);
        break;
      case FilterTypes.FUTURE:
        const filteredByFuture = this._wayPointsData.slice().filter(({time}) => {
          return time.startTime > Date.now();
        });
        this._renderDays(filteredByFuture);
        break;
      case FilterTypes.PAST:
        const filteredByPast = this._wayPointsData.slice().filter(({time}) => {
          return time.startTime < Date.now();
        });
        this._renderDays(filteredByPast);
        break;
    }
  }

  _sortEvents() {
    this._flatPickrs.forEach((removeFlatPickrs) => removeFlatPickrs());
    this._flatPickrs = [];

    switch (this._sortType) {
      case SortTypes.EVENT:
        this._renderDays(this._wayPointsData);
        break;
      case SortTypes.TIME:
        const sortedByTimeEventsData = this._wayPointsData.slice().sort((a, b) => {
          const durationLeft = Math.abs(a.time.endTime - a.time.startTime);
          const durationRight = Math.abs(b.time.endTime - b.time.startTime);
          return durationRight - durationLeft;
        });
        this._renderAllDaysList(sortedByTimeEventsData);
        break;
      case SortTypes.PRICE:
        const sortedByPriceEventsData = this._wayPointsData.slice().sort((a, b) => b.wayPointPrice - a.wayPointPrice);

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

    this._sortEvents();
  }
}
