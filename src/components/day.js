import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class Day extends AbstractComponent {
  constructor(data, number) {
    super();
    this._data = data[0];
    this._dayNumber = number;
  }

  getTemplate() {
    const date = this._data.time.startTime ? moment(this._data.time.startTime).format(`MMM D`) : ``;

    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._dayNumber}</span>
        <time class="day__date" datetime="2019-03-18">${date}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
  }
}
