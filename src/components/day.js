import {monthsNames} from "../config";
import {getEventsListLayout} from "./events";
import {getTripEditLayout} from "./trip-edit";

export const getDayItem = (data) => {
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">${monthsNames[new Date(data[0].time.startTime).getMonth()]} ${new Date(data[0].time.startTime).getDate()}</time>
      </div>

      <ul class="trip-events__list">
        ${getTripEditLayout(data.splice(0, 1)[0])}
        ${data.map((dataItem) => getEventsListLayout(dataItem)).join(``)}
      </ul>
    </li>`;
};
