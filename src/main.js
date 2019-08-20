import {renderComponent} from "./utils";
import {getTabs} from "./components/tabs";
import {getTripRouteLayout} from "./components/trip-info";
import {getTripCostLayout} from "./components/trip-cost";
import {getTripFiltersLayout} from "./components/trip-filters";
import {getTripSortLayout} from "./components/sorting";
import {getTripDaysLayout} from "./components/days";
import {infoData, menuData, filtersData, wayPointsData} from "./data";

const copiedWayPointsData = [...wayPointsData];

const controlsContainer = document.querySelector(`.trip-controls`);

const tripInfoContainer = document.querySelector(`.trip-info`);

const eventsContainer = document.querySelector(`.trip-events`);

const initApp = () => {
  renderComponent(controlsContainer, getTabs(menuData));
  renderComponent(tripInfoContainer, getTripRouteLayout(infoData));
  renderComponent(tripInfoContainer, getTripCostLayout(wayPointsData));
  renderComponent(controlsContainer, getTripFiltersLayout(filtersData));
  renderComponent(eventsContainer, getTripSortLayout());
  renderComponent(eventsContainer, getTripDaysLayout(copiedWayPointsData));
};

initApp();
