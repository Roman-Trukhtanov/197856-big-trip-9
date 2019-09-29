import ModelPoint from "./model-point";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const StatusNumber = {
  SUCCESSFUL: 200,
  REDIRECT: 300,
};

const UrlPath = {
  POINTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
};

const checkStatus = (response) => {
  if (response.status >= StatusNumber.SUCCESSFUL && response.status < StatusNumber.REDIRECT) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: UrlPath.POINTS})
      .then(toJSON)
      .then(ModelPoint.parsePoints);
  }

  getDestinations() {
    return this._load({url: UrlPath.DESTINATIONS})
      .then(toJSON);
  }

  getOffers() {
    return this._load({url: UrlPath.OFFERS})
      .then(toJSON);
  }

  createPoint(pointData) {
    return this._load({
      url: UrlPath.POINTS,
      method: Method.POST,
      body: JSON.stringify(pointData),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoint(pointData) {
    return this._load({
      url: `${UrlPath.POINTS}/${pointData.id}`,
      method: Method.PUT,
      body: JSON.stringify(pointData),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `${UrlPath.POINTS}/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
