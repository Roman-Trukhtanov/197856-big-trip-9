import {Position, render, sortDataByTime} from "../utils";
import Days from "../components/days";
import Day from "../components/day";
import Sort from "../components/sort";
import PointController from "./point-controller";

export default class TripController {
  constructor(container, wayPointsData, wayPointTypes, cities, monthsNames, onMainDataChange) {
    this._container = container;
    this._wayPointsData = wayPointsData;
    this._wayPointsTypes = wayPointTypes;
    this._cities = cities;
    this._monthsNames = monthsNames;
    this._days = new Days();
    this._sort = new Sort();
    this._subscriptions = [];
    this.onChangeView = this.onChangeView.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this._onMainDataChange = onMainDataChange;
  }

  onChangeView() {
    this._subscriptions.forEach((setDefaultViewCall) => setDefaultViewCall());
  }

  onDataChange(newData, oldData) {
    if (newData !== `undefined` && oldData !== `undefined`) {
      this._wayPointsData[this._wayPointsData.findIndex((taskData) => taskData === oldData)] = newData;

      sortDataByTime(this._wayPointsData);
    }

    this._onMainDataChange(this._wayPointsData);

    this._subscriptions = [];
    this._days.getElement().innerHTML = ``;
    this._renderDays();
  }

  _renderEvents(data, container) {
    const pointController = new PointController(data, container, this._wayPointsTypes, this._cities, this.onDataChange, this.onChangeView);

    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  init() {
    this._renderSort();
    this._renderDays();
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

  _renderDays() {
    const daysElement = this._days.getElement();

    const daysData = this._getDays(this._wayPointsData);

    const daysKeys = Object.keys(daysData);

    for (const key of daysKeys) {
      const dayItemData = daysData[key];
      const dayEvents = dayItemData.events;
      const dayNumber = dayItemData.dayNumber;

      const day = new Day(dayEvents, this._monthsNames, dayNumber);
      const dayElement = day.getElement();

      const eventsListContainer = dayElement.querySelector(`.trip-events__list`);

      for (const dataItem of dayEvents) {
        this._renderEvents(dataItem, eventsListContainer);
      }

      render(daysElement, dayElement, Position.BEFOREEND);
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
      this._renderEvents(dataItem, eventsListContainer);
    }

    render(daysElement, dayElement, Position.BEFOREEND);
  }

  _renderSort() {
    const sortingElement = this._sort.getElement();

    sortingElement.addEventListener(`click`, (evt) => this._onSortItemClick(evt));

    render(this._container, sortingElement, Position.BEFOREEND);
  }

  _onSortItemClick(evt) {
    if (!evt.target.hasAttribute(`data-sort-type`)) {
      return;
    }

    this._days.getElement().innerHTML = ``;

    const sortType = evt.target.dataset.sortType;

    switch (sortType) {
      case `sort-event`:
        this._renderDays();
        break;
      case `sort-time`:
        const sortedByTimeEventsData = this._wayPointsData.slice().sort((a, b) => {
          const durationLeft = Math.abs(a.time.endTime - a.time.startTime);
          const durationRight = Math.abs(b.time.endTime - b.time.startTime);
          return durationRight - durationLeft;
        });
        this._renderAllDaysList(sortedByTimeEventsData);
        break;
      case `sort-price`:
        const sortedByPriceEventsData = this._wayPointsData.slice().sort((a, b) => b.wayPointPrice - a.wayPointPrice);

        this._renderAllDaysList(sortedByPriceEventsData);
        break;
    }
  }
}
