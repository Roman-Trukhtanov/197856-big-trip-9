const getFilterItem = ({title, isChecked}) => {
  return `<div class="trip-filters__filter">
      <input id="filter-${title}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${title}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${title}">${title}</label>
    </div>`;
};

export const getTripFiltersLayout = (filtersData) => {
  return `<form class="trip-filters" action="#" method="get">
    ${filtersData.map((filter) => getFilterItem(filter)).join(``)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};
