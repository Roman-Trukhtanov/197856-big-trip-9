import {getCapitalizedString, getRandomInt, getWayPointDescription, shuffleArray} from "../utils";
import moment from "moment";
import AbstractComponent from "./abstract-component";

const getTimeString = (timestamp) => {
  return moment(timestamp).format(`DD/MM/YYYY HH:mm`);
};

export default class EventEdit extends AbstractComponent {
  constructor({id, type, city, time, description, photos, wayPointPrice, isFavorite}, wayPointTypes, additionalOffers, cities) {
    super();
    this._type = type;
    this._city = city;
    this._time = time;
    this._description = description;
    this._photos = photos;
    this._wayPointPrice = wayPointPrice;
    this._wayPointTypes = wayPointTypes;
    this._additionalOffers = additionalOffers;
    this._id = id;
    this._cities = cities;
    this._isFavorite = isFavorite;

    this._addListenersToEventType();
    this._addListenerToFavorite();
  }

  _getEventTypeGroupItem(groupName) {
    return `${(Object.keys(this._wayPointTypes).filter((item) => this._wayPointTypes[item].group === groupName)).map((typeItem) => {
      const title = this._wayPointTypes[typeItem].title;

      return `<div class="event__type-item">
        <input id="event-type-${title}-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${title}" ${this._type.title === title ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${this._wayPointTypes[typeItem].title}" for="event-type-${this._wayPointTypes[typeItem].title}-${this._id}">${getCapitalizedString(title)}</label>
      </div>`;
    }).join(``)}`;
  }

  getTemplate() {
    const startTime = getTimeString(this._time.startTime);

    const endTime = getTimeString(this._time.endTime);

    return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-${this._id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.srcIconName}" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-${this._id}" type="checkbox" name="event-type" value="${this._type.title}">
    
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${this._getEventTypeGroupItem(`transfer`)}
              </fieldset>
    
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${this._getEventTypeGroupItem(`activity`, this._type, this._wayPointTypes, this._id)}
              </fieldset>
            </div>
          </div>
    
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${this._id}">${this._type.prefixTemplate}</label>
            <input class="event__input  event__input--destination" id="event-destination-${this._id}" type="text" name="event-destination" value="${this._city}" list="destination-list-${this._id}">
            <datalist id="destination-list-${this._id}">
              ${this._cities.map((cityItem) => `<option value="${cityItem}"></option>`).join(``)}
            </datalist>
          </div>
    
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${this._id}">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-${this._id}" type="text" name="event-start-time" value="${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${this._id}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${this._id}" type="text" name="event-end-time" value="${endTime}">
          </div>
    
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${this._id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${this._id}" type="text" name="event-price" value="${this._wayPointPrice}">
          </div>
    
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
    
          <input id="event-favorite-${this._id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-${this._id}">
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
              ${this._additionalOffers.map((additionalOffer, index) => `<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${additionalOffer.name}-${this._id}-${index}" type="checkbox" name="event-offer" value="${additionalOffer.name}" ${additionalOffer.isSelected ? `checked` : ``}>
                <label class="event__offer-label" for="event-offer-${additionalOffer.name}-${this._id}-${index}">
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

  _changeDataList() {
    const datalist = this.getElement().querySelector(`datalist`);

    datalist.innerHTML = ``;

    const newCities = shuffleArray(this._cities).slice(getRandomInt(3, this._cities.length - 1));

    for (const city of newCities) {
      datalist.insertAdjacentHTML(`beforeend`, `<option value="${city}"></option>`);
    }
  }

  _onEventTypeInputChange(evt) {
    evt.preventDefault();

    const typeIconElement = this.getElement().querySelector(`.event__type-icon`);
    const typeOutputElement = this.getElement().querySelector(`.event__type-output`);
    const typeToggle = this.getElement().querySelector(`.event__type-toggle`);

    this._changeDataList();

    const destinationDescription = this.getElement().querySelector(`.event__destination-description`);

    destinationDescription.textContent = getWayPointDescription();

    const newType = evt.target.value;
    const newTypeData = this._wayPointTypes[newType];

    typeIconElement.src = `img/icons/${newTypeData.srcIconName}`;
    typeOutputElement.textContent = newTypeData.prefixTemplate;
    typeToggle.value = newTypeData.title;
  }

  _addListenersToEventType() {
    const eventTypeInputs = this.getElement().querySelectorAll(`.event__type-input`);

    eventTypeInputs.forEach((eventTypeInput) => eventTypeInput.addEventListener(`change`, (evt) => this._onEventTypeInputChange(evt)));
  }

  _addListenerToFavorite() {
    const favoriteItem = this.getElement().querySelector(`.event__favorite-checkbox`);

    favoriteItem.addEventListener(`change`, (evt) => {
      evt.preventDefault();

      this._isFavorite = !this._isFavorite;
    });
  }
}
