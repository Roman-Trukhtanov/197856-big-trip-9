import {isEscKey, Position, render} from "../utils";
import Days from "../components/days";
import Day from "../components/day";
import Event from "../components/event";
import EventEdit from "../components/event-edit";
import Sort from "../components/sort";

export default class TripController {
  constructor(container, wayPointsData, daysData, wayPointTypes, cities, monthsNames) {
    this._container = container;
    this._wayPointsData = wayPointsData;
    this._daysData = daysData;
    this._wayPointsTypes = wayPointTypes;
    this._cities = cities;
    this._monthsNames = monthsNames;
    this._days = new Days();
    this._sort = new Sort();
  }

  _renderEvents(data, container) {
    const event = new Event(data);
    const eventElement = event.getElement();

    const eventEdit = new EventEdit(data, this._wayPointsTypes, data.offers, this._cities);
    const eventEditElement = eventEdit.getElement();

    const onEscKeyDown = (evt) => {
      if (isEscKey(evt)) {
        container.replaceChild(eventElement, eventEditElement);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventElement
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        container.replaceChild(eventEditElement, eventElement);
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditElement
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        container.replaceChild(eventElement, eventEditElement);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    eventEditElement
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        container.replaceChild(eventElement, eventEditElement);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(container, eventElement, Position.BEFOREEND);
  }

  init() {
    this._renderSort();
    this._renderDays();
  }

  _renderDays() {
    const daysElement = this._days.getElement();

    const daysKeys = Object.keys(this._daysData);

    for (const key of daysKeys) {
      const dayItemData = this._daysData[key];
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
