import {getDayItem} from "./day";
import {wayPointsData} from "../data";

export const getTripDaysLayout = () => {
  const daysItemsLayout = getDayItem(wayPointsData);

  return `<ul class="trip-days">
    ${daysItemsLayout}
  </ul>`;
};
