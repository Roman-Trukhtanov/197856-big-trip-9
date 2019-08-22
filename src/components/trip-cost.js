import {reducer} from "../utils";
import {createElement} from "../utils";

export default class TripCost {
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
    return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._data.map((dataItem) => dataItem.totalPrice).reduce(reducer)}</span>
    </p>`.trim();
  }
}
