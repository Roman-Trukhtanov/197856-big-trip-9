import {render, Position} from "./utils";
import Tabs from "./components/tabs";
import Tab from "./components/tab";
import TripInfo from "./components/trip-info";
import TripCost from "./components/trip-cost";
import TripFilters from "./components/trip-filters";
import Sorting from "./components/sorting";
import TripController from "./controllers/trip-controller";
import EventsMsg from "./components/events-msg";
import {infoData, menuData, filtersData, wayPointsData} from "./data";
import {wayPointTypes, additionalOffers, cities, monthsNames} from "./config";

const copiedWayPointsData = [...wayPointsData];

const controlsContainer = document.querySelector(`.trip-controls`);

const tripInfoContainer = document.querySelector(`.trip-info`);

const eventsContainer = document.querySelector(`.trip-events`);

const renderTabs = (controlsData) => {
  const tabs = new Tabs();
  const tabsElement = tabs.getElement();

  for (const menu of controlsData) {
    const tab = new Tab(menu);
    const tabElement = tab.getElement();

    render(tabsElement, tabElement, Position.BEFOREEND);
  }

  render(controlsContainer, tabsElement, Position.BEFOREEND);
};

const renderTripInfo = (data, months) => {
  if (data.times !== null) {
    const tripInfo = new TripInfo(data, months);
    const tripInfoElement = tripInfo.getElement();

    render(tripInfoContainer, tripInfoElement, Position.BEFOREEND);
  }
};

const renderTripCost = (data) => {
  const tripCost = new TripCost(data);
  const tripCostElement = tripCost.getElement();

  render(tripInfoContainer, tripCostElement, Position.BEFOREEND);
};

const renderTripFilters = (data) => {
  const tripFilters = new TripFilters(data);
  const tripFiltersElements = tripFilters.getElement();

  render(controlsContainer, tripFiltersElements, Position.BEFOREEND);
};

const renderSortingForm = () => {
  const sorting = new Sorting();
  const sortingElement = sorting.getElement();

  render(eventsContainer, sortingElement, Position.BEFOREEND);
};

const renderEventsMessage = () => {
  const eventsMsg = new EventsMsg();
  const eventsMsgElement = eventsMsg.getElement();

  render(eventsContainer, eventsMsgElement, Position.BEFOREEND);
};

const initApp = () => {
  renderTabs(menuData);
  renderTripInfo(infoData, monthsNames);
  renderTripCost(wayPointsData);
  renderTripFilters(filtersData);
  renderSortingForm();

  if (copiedWayPointsData.length === 0) {
    renderEventsMessage();
  } else {
    const tripController = new TripController(eventsContainer, wayPointsData, wayPointTypes, additionalOffers, cities, monthsNames);

    tripController.init();
  }
};

initApp();
