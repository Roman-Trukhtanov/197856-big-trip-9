import ModelPoint from "./model-point";
import {DataGroup} from "./config";

export default class Provider {
  constructor({api, store, isOnline}) {
    this._api = api;
    this._store = store;
    this._isOnline = isOnline;
  }

  updatePoint(pointData) {
    if (this._isOnline()) {
      return this._api.updatePoint(pointData)
        .then((point) => {
          this._store.setItem({key: point.id, item: point.toRAW(), group: DataGroup.POINTS});
          return point;
        });
    } else {
      const point = pointData;
      this._store.setItem({key: point.id, item: point, group: DataGroup.POINTS});
      return Promise.resolve(ModelPoint.parsePoint(point));
    }
  }

  createPoint({point, id}) {
    if (this._isOnline()) {
      return this._api.createPoint(point)
        .then((pointData) => {
          this._store.setItem({key: pointData.id, item: pointData.toRAW(), group: DataGroup.POINTS});
          return pointData;
        });
    } else {
      point.id = id;

      this._store.setItem({key: point.id, item: point, group: DataGroup.POINTS});
      return Promise.resolve(ModelPoint.parsePoint(point));
    }
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._store.removeItem({key: id, group: DataGroup.POINTS});
        });
    } else {
      this._store.removeItem({key: id, group: DataGroup.POINTS});
      return Promise.resolve(true);
    }
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.forEach((point) => this._store.setItem({key: point.id, item: point.toRAW(), group: DataGroup.POINTS}));
          return points;
        });
    } else {
      const allData = this._store.getAll();
      const rawPointsMap = allData[DataGroup.POINTS];
      const pointsRAW = Object.values(rawPointsMap);
      const points = ModelPoint.parsePoints(pointsRAW);

      return Promise.resolve(points);
    }
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setItem({key: null, item: destinations, group: DataGroup.DESTINATIONS});
          return destinations;
        });
    } else {
      const allData = this._store.getAll();
      const destinations = allData[DataGroup.DESTINATIONS];

      return Promise.resolve(destinations);
    }
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setItem({key: null, item: offers, group: DataGroup.OFFERS_BY_TYPES});
          return offers;
        });
    } else {
      const allData = this._store.getAll();
      const offers = allData[DataGroup.OFFERS_BY_TYPES];

      return Promise.resolve(offers);
    }
  }

  getAllData(resolve, reject) {
    const serverData = {};

    Promise.all([
      this.getPoints()
        .then((points) => (serverData.points = points)),
      this.getDestinations()
        .then((destinations) => (serverData.destinations = destinations)),
      this.getOffers()
        .then((offers) => (serverData.offersByTypes = offers))
    ])
      .then(() => resolve(serverData))
      .catch((err) => reject(err));
  }

  syncPoints() {
    const allData = this._store.getAll();
    const rawPointsMap = allData[DataGroup.POINTS];
    const pointsRAW = Object.values(rawPointsMap);

    return this._api.syncPoints({points: pointsRAW});
  }
}
