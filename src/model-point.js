import {reducer} from "./utils";
import {wayPointTypes} from "./config";

export default class ModelPoint {
  constructor(data) {
    if (data[`id`]) {
      this.id = data[`id`];
    }
    this.type = wayPointTypes[data[`type`]];
    this.destination = data[`destination`];
    this.wayPointPrice = data[`base_price`];
    this.time = {
      startTime: data[`date_from`],
      endTime: data[`date_to`],
    };
    this.offers = data[`offers`];
    this.isFavorite = data[`is_favorite`];
  }

  get totalPrice() {
    let offerPrices = 0;

    if (this.offers.length > 0) {
      offerPrices += this.offers.map((offer) => offer.accepted ? offer.price : 0).reduce(reducer);
    }

    return this.wayPointPrice + offerPrices;
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }

  toRAW() {
    const dataRAW = {
      'type': this.type.title,
      'destination': this.destination,
      'base_price': this.wayPointPrice,
      'date_from': this.time.startTime,
      'date_to': this.time.endTime,
      'offers': this.offers,
      'is_favorite': this.isFavorite,
    };

    if (this.id) {
      dataRAW[`id`] = this.id;
    }

    return dataRAW;
  }
}
