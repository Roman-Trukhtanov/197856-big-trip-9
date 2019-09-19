import {MAX_VISIBLE_OFFERS_AMOUNT} from "../config";
import moment from "moment";
import AbstractComponent from "./abstract-component";

export default class Event extends AbstractComponent {
  constructor({time, type, city, wayPointPrice, offers}) {
    super();
    this._time = time;
    this._type = type;
    this._city = city;
    this._wayPointPrice = wayPointPrice;
    this._offers = offers;
    this._visibleOffersAmount = 1;
  }

  _getOffersLayout() {
    return this._offers.map((offer) => {
      if (offer.isSelected === false || this._visibleOffersAmount > MAX_VISIBLE_OFFERS_AMOUNT) {
        return ``;
      }

      this._visibleOffersAmount++;
      return `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`.trim();
    }).join(``);
  }

  _getVisibleTime(timeStamp) {
    return moment(timeStamp).format(`HH:mm`);
  }

  _getTimeDuration(startTimestamp, endTimestamp) {
    const duration = moment.duration((moment(endTimestamp).diff(startTimestamp)));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    return `${days}D ${hours}H ${minutes}M`;
  }

  getTemplate() {
    const startTime = this._getVisibleTime(this._time.startTime);
    const endTime = this._getVisibleTime(this._time.endTime);

    const timeDuration = this._getTimeDuration(this._time.startTime, this._time.endTime);

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
          ${this._getOffersLayout()}
        </ul>
  
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`.trim();
  }
}
