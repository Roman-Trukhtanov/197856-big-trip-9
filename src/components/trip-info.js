import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class TripInfo extends AbstractComponent {
  constructor({cities, times}) {
    super();
    this._cities = cities;
    this._times = times;
  }

  getTemplate() {
    const tripInfoTitle = `${this._cities.length > 3 ? `${this._cities[0]} &mdash; ... &mdash; ${this._cities[this._cities.length - 1]}` : `${this._cities.join(` &mdash; `)}`}`;

    const infoDate = `${moment(this._times.startDate).format(`MMM DD`)} &mdash; ${moment(this._times.endDate).format(`MMM DD`)}`;

    return `<div class="trip-info__main">
      <h1 class="trip-info__title">${tripInfoTitle}</h1>
      <p class="trip-info__dates">${infoDate}</p>
    </div>`;
  }
}
