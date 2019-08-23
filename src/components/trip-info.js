import {createElement} from "../utils";
import {monthsNames} from "../config";

export default class TripInfo {
  constructor({cities, times}) {
    this._cities = cities;
    this._times = times;
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
    const tripInfoTitle = `${this._cities.length > 3 ? `${this._cities[0]} &mdash; ... &mdash; ${this._cities[this._cities.length - 1]}` : `${this._cities.join(` &mdash; `)}`}`;

    const infoDate = `${monthsNames[new Date(this._times.startDate).getMonth()]} ${new Date(this._times.startDate).getDate()} &mdash; ${new Date(this._times.endDate).getDate()}`;

    return `<div class="trip-info__main">
      <h1 class="trip-info__title">${tripInfoTitle}</h1>
      <p class="trip-info__dates">${infoDate}</p>
    </div>`;
  }
}
