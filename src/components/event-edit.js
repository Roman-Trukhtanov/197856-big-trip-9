import {createElement, getCapitalizedString, getVisibleTime} from "../utils";

const getTimeString = (timestamp) => {
  const date = new Date(timestamp);

  return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${getVisibleTime(timestamp)}`;
};

const getEventTypeGroupItem = (groupName, type, allTypes) => {
  return `${(Object.keys(allTypes).filter((item) => allTypes[item].group === groupName)).map((typeItem) => {
    const title = allTypes[typeItem].title;

    return `<div class="event__type-item">
      <input id="event-type-${title}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${title}" ${type.title === title ? `checked` : ``}>
  <label class="event__type-label  event__type-label--${allTypes[typeItem].title}" for="event-type-${allTypes[typeItem].title}-1">${getCapitalizedString(title)}</label>
    </div>`;
  }).join(``)}`;
};

export default class EventEdit {
  constructor({type, city, time, description, photos, wayPointPrice}, wayPointTypes, additionalOffers, cities) {
    this._type = type;
    this._city = city;
    this._time = time;
    this._description = description;
    this._photos = photos;
    this._wayPointPrice = wayPointPrice;
    this._wayPointTypes = wayPointTypes;
    this._additionalOffers = additionalOffers;
    this._cities = cities;
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
    const startTime = getTimeString(this._time.startTime);

    const endTime = getTimeString(this._time.endTime);

    return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.srcIconName}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
    
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${getEventTypeGroupItem(`transfer`, this._type, this._wayPointTypes)}
              </fieldset>
    
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${getEventTypeGroupItem(`activity`, this._type, this._wayPointTypes)}
              </fieldset>
            </div>
          </div>
    
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">${this._type.prefixTemplate}</label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${this._cities.map((cityItem) => `<option value="${cityItem}"></option>`).join(``)}
            </datalist>
          </div>
    
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
          </div>
    
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._wayPointPrice}">
          </div>
    
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
    
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
    
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
    
        <section class="event__details">
    
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    
            <div class="event__available-offers">
              ${this._additionalOffers.map((additionalOffer) => `<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${additionalOffer.title}-1" type="checkbox" name="event-offer-${additionalOffer.title}" ${additionalOffer.isSelected ? `checked` : ``}>
                <label class="event__offer-label" for="event-offer-${additionalOffer.title}-1">
                  <span class="event__offer-title">${additionalOffer.title}</span>&plus; &euro;&nbsp;<span class="event__offer-price">${additionalOffer.price}</span>
                </label>
              </div>`).join(``)}
              
            </div>
          </section>
    
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${this._description}</p>
    
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${this._photos.map((photoSrc) => `<img class="event__photo" src="${photoSrc}" alt="Event photo">`).join(``)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`.trim();
  }
}
