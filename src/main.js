import {renderComponent} from "./utils";
import {getTabs} from "./components/tabs";
import {getTripRouteLayout} from "./components/trip-info";
import {getTripCostLayout} from "./components/trip-cost";
import {getTripFiltersLayout} from "./components/trip-filters";
import {getTripSortLayout} from "./components/sorting";
import {getTripDaysLayout} from "./components/days";
import {infoData} from "./data";

const controlsContainer = document.querySelector(`.trip-controls`);

const tripInfoContainer = document.querySelector(`.trip-info`);

const eventsContainer = document.querySelector(`.trip-events`);

const initApp = () => {
  renderComponent(controlsContainer, getTabs());
  renderComponent(tripInfoContainer, getTripRouteLayout(infoData));
  renderComponent(tripInfoContainer, getTripCostLayout());
  renderComponent(controlsContainer, getTripFiltersLayout());
  renderComponent(eventsContainer, getTripSortLayout());
  renderComponent(eventsContainer, getTripDaysLayout());
};

initApp();
