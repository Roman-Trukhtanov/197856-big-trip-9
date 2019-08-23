import {render, Position, isEscKey} from "./utils";
import Tabs from "./components/tabs";
import Tab from "./components/tab";
import TripInfo from "./components/trip-info";
import TripCost from "./components/trip-cost";
import TripFilters from "./components/trip-filters";
import Sorting from "./components/sorting";
import Days from "./components/days";
import Day from "./components/day";
import Event from "./components/event";
import EventEdit from "./components/event-edit";
import EventsMsg from "./components/events-msg";
import {infoData, menuData, filtersData, wayPointsData} from "./data";
import {wayPointTypes, additionalOffers, cities} from "./config";

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

const renderTripInfo = (data) => {
  if (data.times !== null) {
    const tripInfo = new TripInfo(data);
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

const renderEvents = (data, container, pointTypes, offers, citiesNames) => {
  const event = new Event(data);
  const eventElement = event.getElement();

  const eventEdit = new EventEdit(data, pointTypes, offers, citiesNames);
  const eventEditElement = eventEdit.getElement();

  const onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      container.replaceChild(eventElement, eventEditElement);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventElement
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      container.replaceChild(eventEditElement, eventElement);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  eventEditElement
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      container.replaceChild(eventElement, eventEditElement);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  eventEditElement
    .querySelector(`.event--edit`)
    .addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      container.replaceChild(eventElement, eventEditElement);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  render(container, eventElement, Position.BEFOREEND);
};

const renderTripDays = (data, pointTypes, offers, citiesNames) => {
  const days = new Days();
  const daysElement = days.getElement();

  const day = new Day(data);
  const dayElement = day.getElement();

  const eventsListContainer = dayElement.querySelector(`.trip-events__list`);

  for (const dataItem of data) {
    renderEvents(dataItem, eventsListContainer, pointTypes, offers, citiesNames);
  }

  render(daysElement, dayElement, Position.BEFOREEND);

  render(eventsContainer, daysElement, Position.BEFOREEND);
};

const renderEventsMessage = () => {
  const eventsMsg = new EventsMsg();
  const eventsMsgElement = eventsMsg.getElement();

  render(eventsContainer, eventsMsgElement, Position.BEFOREEND);
};

const initApp = () => {
  renderTabs(menuData);
  renderTripInfo(infoData);
  renderTripCost(wayPointsData);
  renderTripFilters(filtersData);
  renderSortingForm();

  if (copiedWayPointsData.length === 0) {
    renderEventsMessage();
  } else {
    renderTripDays(copiedWayPointsData, wayPointTypes, additionalOffers, cities);
  }
};

initApp();
