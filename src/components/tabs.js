const getTabItemLayout = ({title, isActive}) => {
  return `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${title}</a>
    `;
};

export const getTabs = (menuData) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuData.map((menuItem) => getTabItemLayout(menuItem)).join(``)}
  </nav>`;
};
