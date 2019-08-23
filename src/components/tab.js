import {createElement} from "../utils";

export default class Tab {
  constructor({title, isActive}) {
    this._title = title;
    this._isActive = isActive;
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
    return `<a class="trip-tabs__btn ${this._isActive ? `trip-tabs__btn--active` : ``}" href="#">${this._title}</a>`.trim();
  }
}
