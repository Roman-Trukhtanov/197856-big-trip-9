import {createElement} from "../utils";

export default class TripFilters {
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
    return `<form class="trip-filters" action="#" method="get">
      ${this._data
        .map(({title, isChecked}) => {
          return `<div class="trip-filters__filter">
            <input id="filter-${title}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${title}" ${isChecked ? `checked` : ``}>
            <label class="trip-filters__filter-label" for="filter-${title}">${title}</label>
          </div>`;
        }).join(``)}
  
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }
}
