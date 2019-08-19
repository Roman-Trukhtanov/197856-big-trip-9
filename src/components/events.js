import {getVisibleTime} from "../utils";

export const getEventsListLayout = ({time, type, city, wayPointPrice, offers}) => {
  const startTime = getVisibleTime(time.startTime);
  const endTime = getVisibleTime(time.endTime);

  const timeDuration = `${time.duration.days}D ${time.duration.hours}H ${time.duration.minutes}M`;

  return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.srcIconName}" alt="Event type icon - ${type.title}">
      </div>
      <h3 class="event__title">${type.prefixTemplate} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${endTime}</time>
        </p>
        <p class="event__duration">${timeDuration}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${wayPointPrice}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offers.map((offer) => `<li class="event__offer">
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
};
