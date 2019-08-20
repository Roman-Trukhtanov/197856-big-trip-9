import {getDayItem} from "./day";

export const getTripDaysLayout = (data) => {
  const daysItemsLayout = getDayItem(data);

  return `<ul class="trip-days">
    ${daysItemsLayout}
  </ul>`;
};
