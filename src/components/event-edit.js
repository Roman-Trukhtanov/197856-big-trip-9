import {createElement, getCapitalizedString, Position, render, unrender} from "../utils";
import moment from "moment";
import AbstractComponent from "./abstract-component";
import {Mode} from "../controllers/trip-controller";

const getTimeString = (timestamp) => {
  return moment(timestamp).format(`DD/MM/YYYY HH:mm`);
};

export default class EventEdit extends AbstractComponent {
  constructor(
      {
        id,
        type,
        destination,
        time,
        offers,
        wayPointPrice,
        isFavorite
      }, pointLength, wayPointTypes, offersByTypes, destinations, mode) {
    super();
    this._id = id ? id : pointLength;
    this._type = type;
    this._destination = destination;
    this._time = time;
    this._offers = offers;
    this._wayPointPrice = wayPointPrice;
    this._isFavorite = isFavorite;
    this._wayPointTypes = wayPointTypes;
    this._offersByTypes = offersByTypes;
    this._destinations = destinations;
    this._mode = mode;

    this._addListenersToEventType();
    this._addListenerToDestinationInput();
    this._addListenerToInputPrice();
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

  _getOffersLayout(offers) {
    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
       
      <div class="event__available-offers">
        ${offers.map((offer, index) => `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${this._id}-${index}" type="checkbox" name="event-offer" value="${offer.title}" ${offer.accepted ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${this._id}-${index}">
            <span class="event__offer-title">${offer.title}</span>&plus; &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`).join(``)}
      </div>
     </section>`.trim();
  }

  _getDestinationLayout(destination) {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join(``)}
        </div>
      </div>
    </section>`.trim();
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
            <input class="event__input  event__input--destination" id="event-destination-${this._id}" type="text" name="event-destination" value="${this._destination.name}" list="destination-list-${this._id}" required>
            <datalist id="destination-list-${this._id}">
              ${this._destinations.map((destination) => `<option value="${destination.name}"></option>`).join(``)}
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
          
          ${this._mode === Mode.DEFAULT ? `
            <input id="event-favorite-${this._id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
            <label class="event__favorite-btn" for="event-favorite-${this._id}">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
            </label>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>` : ``}
        </header>
    
        <section class="event__details">
          ${this._offers.length > 0 ? this._getOffersLayout(this._offers) : ``}
          ${this._destination.name !== `` ? this._getDestinationLayout(this._destination) : ``}
        </section>
      </form>
    </li>`.trim();
  }

  _onEventTypeInputChange(evt) {
    evt.preventDefault();

    const typeIconElement = this.getElement().querySelector(`.event__type-icon`);
    const typeOutputElement = this.getElement().querySelector(`.event__type-output`);
    const typeToggle = this.getElement().querySelector(`.event__type-toggle`);

    const newType = evt.target.value;
    const newTypeData = this._wayPointTypes[newType];

    typeIconElement.src = `img/icons/${newTypeData.srcIconName}`;
    typeOutputElement.textContent = newTypeData.prefixTemplate;
    typeToggle.value = newTypeData.title;

    const {offers} = this._offersByTypes.find((offer) => offer.type === newType);
    const currentOffersLayout = this.getElement().querySelector(`.event__section--offers`);

    if (currentOffersLayout) {
      unrender(currentOffersLayout);
    }

    if (offers.length > 0) {
      const eventDetailsItem = this.getElement().querySelector(`.event__details`);

      const newOffersLayout = createElement(this._getOffersLayout(offers));

      render(eventDetailsItem, newOffersLayout, Position.AFTERBEGIN);
    }
  }

  _addListenersToEventType() {
    const eventTypeInputs = this.getElement().querySelectorAll(`.event__type-input`);

    eventTypeInputs.forEach((eventTypeInput) => eventTypeInput.addEventListener(`change`, (evt) => this._onEventTypeInputChange(evt)));
  }

  _onDestinationInputChange(evt) {
    evt.preventDefault();

    const destinationName = evt.target.value;

    const destinationLayout = this.getElement().querySelector(`.event__section--destination`);

    if (destinationLayout) {
      unrender(destinationLayout);
    }

    const newDestinationIndex = this._destinations.findIndex((destination) => destination.name === destinationName);

    if (newDestinationIndex > 0) {
      const eventDetailsItem = this.getElement().querySelector(`.event__details`);
      const newDestinationData = this._destinations[newDestinationIndex];

      const newDestinationLayout = createElement(this._getDestinationLayout(newDestinationData));

      render(eventDetailsItem, newDestinationLayout, Position.BEFOREEND);
    }
  }

  _addListenerToDestinationInput() {
    const destinationInput = this.getElement().querySelector(`.event__input--destination`);

    destinationInput.addEventListener(`change`, (evt) => this._onDestinationInputChange(evt));
  }

  _addListenerToInputPrice() {
    const inputPriceItem = this.getElement().querySelector(`.event__input--price`);

    inputPriceItem.addEventListener(`input`, (evt) => {
      evt.preventDefault();

      evt.target.value = evt.target.value.replace(/[^\d]/g, ``);
    });
  }
}
