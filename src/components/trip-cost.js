import {reducer} from "../utils";

const getTotalPrice = (data) => data.map((dataItem) => dataItem.totalPrice).reduce(reducer);

export const getTripCostLayout = (data) => {
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(data)}</span>
  </p>`.trim();
};
