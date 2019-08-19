import {getCapitalizedString, getVisibleTime} from "../utils";
import {wayPointTypes} from "../config";
import {additionalOffers} from "../config";
import {cities} from "../config";

const getTimeString = (timestamp) => {
  const date = new Date(timestamp);

  return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${getVisibleTime(timestamp)}`;
};

export const getTripEditLayout = ({type, city, time, description, photos, wayPointPrice}) => {
  const startTime = getTimeString(time.startTime);

  const endTime = getTimeString(time.endTime);

  return `<form class="event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.srcIconName}" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            
            ${(Object.keys(wayPointTypes).filter((item) => wayPointTypes[item].group === `transfer`)).map((typeItem) => {
    const title = wayPointTypes[typeItem].title;

    return `<div class="event__type-item">
      <input id="event-type-${title}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${title}" ${type.title === title ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${wayPointTypes[typeItem].title}" for="event-type-${wayPointTypes[typeItem].title}-1">${getCapitalizedString(title)}</label>
    </div>`;
  }).join(``)}

          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            ${(Object.keys(wayPointTypes).filter((item) => wayPointTypes[item].group === `activity`)).map((typeItem) => {
    const title = wayPointTypes[typeItem].title;

    return `<div class="event__type-item">
      <input id="event-type-${title}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${title}" ${type.title === title ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${wayPointTypes[typeItem].title}" for="event-type-${wayPointTypes[typeItem].title}-1">${getCapitalizedString(title)}</label>
    </div>`;
  }).join(``)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">${type.prefixTemplate}</label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${cities.map((cityItem) => `<option value="${cityItem}"></option>`).join(``)}
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${wayPointPrice}">
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
          ${additionalOffers.map((additionalOffer) => `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${additionalOffer.title}-1" type="checkbox" name="event-offer-${additionalOffer.title}" ${additionalOffer.isSelected ? `checked` : ``}>
            <label class="event__offer-label" for="event-offer-${additionalOffer.title}-1">
              <span class="event__offer-title">${additionalOffer.title}</span>&plus; &euro;&nbsp;<span class="event__offer-price">${additionalOffer.price}</span>
            </label>
          </div>`).join(``)}
          
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photos.map((photoSrc) => `<img class="event__photo" src="${photoSrc}" alt="Event photo">`).join(``)}
          </div>
        </div>
      </section>
    </section>
  </form>`;
};
