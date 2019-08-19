import {wayPointsData} from "../data";
import {monthsNames} from "../config";
import {getEventsListLayout} from "./events";
import {getTripEditLayout} from "./trip-edit";

const copiedWayPointsData = [...wayPointsData];

export const getDayItem = () => {
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">${monthsNames[new Date(copiedWayPointsData[0].time.startTime).getMonth()]} ${new Date(copiedWayPointsData[0].time.startTime).getDate()}</time>
      </div>

      <ul class="trip-events__list">
        ${getTripEditLayout(copiedWayPointsData.splice(0, 1)[0])}
        ${copiedWayPointsData.map((wayPoint) => getEventsListLayout(wayPoint)).join(``)}
      </ul>
    </li>`;
};
