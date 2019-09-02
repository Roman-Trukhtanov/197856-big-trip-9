import AbstractComponent from "./abstract-component";

export default class Day extends AbstractComponent {
  constructor(data, monthsNames, number) {
    super();
    this._data = data;
    this._monthsNames = monthsNames;
    this._dayNumber = number;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._dayNumber}</span>
        <time class="day__date" datetime="2019-03-18">${this._monthsNames[new Date(this._data[0].time.startTime).getMonth()]} ${new Date(this._data[0].time.startTime).getDate()}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
  }
}
