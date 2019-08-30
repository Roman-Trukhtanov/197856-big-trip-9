import AbstractComponent from "./abstract-component";

export default class TripInfo extends AbstractComponent {
  constructor({cities, times}, monthsNames) {
    super();
    this._cities = cities;
    this._times = times;
    this._monthsNames = monthsNames;
  }

  getTemplate() {
    const tripInfoTitle = `${this._cities.length > 3 ? `${this._cities[0]} &mdash; ... &mdash; ${this._cities[this._cities.length - 1]}` : `${this._cities.join(` &mdash; `)}`}`;

    const infoDate = `${this._monthsNames[new Date(this._times.startDate).getMonth()]} ${new Date(this._times.startDate).getDate()} &mdash; ${new Date(this._times.endDate).getDate()}`;

    return `<div class="trip-info__main">
      <h1 class="trip-info__title">${tripInfoTitle}</h1>
      <p class="trip-info__dates">${infoDate}</p>
    </div>`;
  }
}
