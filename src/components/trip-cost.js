import {reducer} from "../utils";
import AbstractComponent from "./abstract-component";

export default class TripCost extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._data.length > 0 ? this._data.map((dataItem) => dataItem.totalPrice).reduce(reducer) : 0}</span>
    </p>`.trim();
  }
}
