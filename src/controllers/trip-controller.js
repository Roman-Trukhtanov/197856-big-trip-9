import {isEscKey, Position, render} from "../utils";
import Days from "../components/days";
import Day from "../components/day";
import Event from "../components/event";
import EventEdit from "../components/event-edit";

export default class TripController {
  constructor(container, wayPointsData, wayPointTypes, additionalOffers, cities, monthsNames) {
    this._container = container;
    this._wayPointsData = wayPointsData;
    this._wayPointsTypes = wayPointTypes;
    this._offers = additionalOffers;
    this._cities = cities;
    this._monthsNames = monthsNames;
    this._days = new Days();
  }

  _renderEvents(data, container) {
    const event = new Event(data);
    const eventElement = event.getElement();

    const eventEdit = new EventEdit(data, this._wayPointsTypes, this._offers, this._cities);
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
    const daysElement = this._days.getElement();

    const day = new Day(this._wayPointsData, this._monthsNames);
    const dayElement = day.getElement();

    const eventsListContainer = dayElement.querySelector(`.trip-events__list`);

    for (const dataItem of this._wayPointsData) {
      this._renderEvents(dataItem, eventsListContainer, this._wayPointsTypes, this._offers, this._cities);
    }

    render(daysElement, dayElement, Position.BEFOREEND);

    render(this._container, daysElement, Position.BEFOREEND);
  }
}
