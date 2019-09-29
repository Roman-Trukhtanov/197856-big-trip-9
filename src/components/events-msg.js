import AbstractComponent from "./abstract-component";

export default class EventsMsg extends AbstractComponent {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return `<p class="trip-events__msg">${this._message ? this._message : ``}</p>`.trim();
  }
}
