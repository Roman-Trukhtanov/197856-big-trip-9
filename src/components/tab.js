import AbstractComponent from "./abstract-component";

export default class Tab extends AbstractComponent {
  constructor({title, isActive}) {
    super();
    this._title = title;
    this._isActive = isActive;
  }

  getTemplate() {
    return `<a class="trip-tabs__btn ${this._isActive ? `trip-tabs__btn--active` : ``}" href="#">${this._title}</a>`.trim();
  }
}
