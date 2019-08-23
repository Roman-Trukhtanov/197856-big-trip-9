import {createElement, getVisibleTime} from "../utils";

export default class Event {
  constructor({time, type, city, wayPointPrice, offers}) {
    this._time = time;
    this._type = type;
    this._city = city;
    this._wayPointPrice = wayPointPrice;
    this._offers = offers;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    const startTime = getVisibleTime(this._time.startTime);
    const endTime = getVisibleTime(this._time.endTime);

    const timeDuration = `${this._time.duration.days}D ${this._time.duration.hours}H ${this._time.duration.minutes}M`;

    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type.srcIconName}" alt="Event type icon - ${this._type.title}">
        </div>
        <h3 class="event__title">${this._type.prefixTemplate} ${this._city}</h3>
  
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${endTime}</time>
          </p>
          <p class="event__duration">${timeDuration}</p>
        </div>
  
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${this._wayPointPrice}</span>
        </p>
  
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${this._offers.map((offer) => `<li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
           </li>`.trim()).join(``)}
        </ul>
  
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`.trim();
  }
}
