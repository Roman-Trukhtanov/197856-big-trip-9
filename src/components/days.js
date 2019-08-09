import {getDayItem} from "./day";

export const getTripDaysLayout = () => {
  let daysItemsLayout = ``;

  new Array(3).fill(``).forEach(() => {
    daysItemsLayout += getDayItem();
  });

  return `<ul class="trip-days">
    ${daysItemsLayout}
  </ul>`;
};
