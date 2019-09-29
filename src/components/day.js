import AbstractComponent from "./abstract-component";
import moment from "moment";
import {Mode} from "../controllers/trip-controller";

export default class Day extends AbstractComponent {
  constructor(data, number, mode) {
    super();
    this._data = data[0];
    this._dayNumber = number;
    this._mode = mode;
  }

  getTemplate() {
    const date = this._mode === Mode.DEFAULT ? moment(this._data.time.startTime).format(`MMM D`) : ``;

    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._dayNumber}</span>
        <time class="day__date" datetime="2019-03-18">${date}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
  }
}
