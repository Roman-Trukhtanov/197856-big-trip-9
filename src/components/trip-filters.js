import AbstractComponent from "./abstract-component";

export default class TripFilters extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
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
