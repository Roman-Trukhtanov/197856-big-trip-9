import {renderComponent} from "./utils";
import {getTabs} from "./components/tabs";
import {getTripRouteLayout} from "./components/trip-info";
import {getTripFiltersLayout} from "./components/trip-filters";
import {getTripSortLayout} from "./components/sorting";
import {getTripEditLayout} from "./components/trip-edit";
import {getTripDaysLayout} from "./components/days";

const controlsContainer = document.querySelector(`.trip-controls`);

const tripInfoContainer = document.querySelector(`.trip-info`);

const eventsContainer = document.querySelector(`.trip-events`);

const initApp = () => {
  renderComponent(controlsContainer, getTabs(), `afterbegin`);
  renderComponent(tripInfoContainer, getTripRouteLayout(), `afterbegin`);
  renderComponent(controlsContainer, getTripFiltersLayout(), `beforeend`);
  renderComponent(eventsContainer, getTripSortLayout(), `beforeend`);
  renderComponent(eventsContainer, getTripEditLayout(), `beforeend`);
  renderComponent(eventsContainer, getTripDaysLayout(), `beforeend`);
};

initApp();
