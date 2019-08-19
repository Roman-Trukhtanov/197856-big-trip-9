import {menuData} from "../data";

export const getTabs = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuData.map((menuItem) => `<a class="trip-tabs__btn ${menuItem.isActive ? `trip-tabs__btn--active` : ``}" href="#">${menuItem.title}</a>
    `).join(``)}
  </nav>`;
};
