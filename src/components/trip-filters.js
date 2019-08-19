import {filtersData} from "../data";

export const getTripFiltersLayout = () => {
  return `<form class="trip-filters" action="#" method="get">
    ${filtersData.map((filter) => `<div class="trip-filters__filter">
      <input id="filter-${filter.title}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.title}" ${filter.isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filter.title}">${filter.title}</label>
    </div>`).join(``)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};
