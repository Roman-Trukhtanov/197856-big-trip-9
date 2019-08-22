import {monthsNames} from "../config";
import {createElement} from "../utils";

export default class Day {
  constructor(data) {
    this._data = data;
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
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">${monthsNames[new Date(this._data[0].time.startTime).getMonth()]} ${new Date(this._data[0].time.startTime).getDate()}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
  }
}
