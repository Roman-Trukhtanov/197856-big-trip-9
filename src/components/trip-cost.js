import {reducer} from "../utils";
import {wayPointsData} from "../data";

const getTotalPrice = (wayPoints) => wayPoints.map((wayPoint) => wayPoint.totalPrice).reduce(reducer);

export const getTripCostLayout = () => {
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(wayPointsData)}</span>
  </p>`.trim();
};
