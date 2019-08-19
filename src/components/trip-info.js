import {monthsNames} from "../config";

export const getTripRouteLayout = ({cities, times}) => {
  const tripInfoTitle = `${cities.length > 3 ? `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}` : `${cities.join(` &mdash; `)}`}`;

  const infoDate = `${monthsNames[new Date(times.startDate).getMonth()]} ${new Date(times.startDate).getDate()} &mdash; ${new Date(times.endDate).getDate()}`;

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${tripInfoTitle}</h1>

    <p class="trip-info__dates">${infoDate}</p>
  </div>`;
};
