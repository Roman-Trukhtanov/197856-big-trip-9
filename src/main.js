import {getMenuData, getFiltersData, getInfoData} from "./data";
import {Position, render, unrender} from "./utils";
import {wayPointTypes, monthsNames, Message} from "./config";
import EventsMsg from "./components/events-msg";
import API from "./api";
import App from "./controllers/app-controller";

const AUTHORIZATION = `Basic RT_Space_Web_Dev_98`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const controlsContainer = document.querySelector(`.trip-controls`);

const tripInfoContainer = document.querySelector(`.trip-info`);

const eventsContainer = document.querySelector(`.trip-events`);

const newPointBtn = document.querySelector(`.trip-main__event-add-btn`);

const eventMessage = new EventsMsg(Message.LOADING);

const initApp = ({points, destinations, offersByTypes}) => {
  const app = new App(
      api,
      points,
      destinations,
      offersByTypes,
      getMenuData(),
      getFiltersData(),
      monthsNames,
      wayPointTypes,
      getInfoData,
      eventsContainer,
      tripInfoContainer,
      controlsContainer,
      newPointBtn
  );

  app.init();
};

const renderLoadingMessage = (container, element) => {
  render(container, element, Position.BEFOREEND);
};

const unRenderLoadingMessage = (element) => {
  unrender(element);
};

renderLoadingMessage(eventsContainer, eventMessage.getElement());

const serverData = {};

Promise.all([
  api.getPoints()
    .then((points) => (serverData.points = points)),
  api.getDestinations()
    .then((destinations) => (serverData.destinations = destinations)),
  api.getOffers()
    .then((offers) => (serverData.offersByTypes = offers))
])
  .then(() => {
    unRenderLoadingMessage(eventMessage.getElement());
    eventMessage.removeElement();
    newPointBtn.disabled = false;
    initApp(serverData);
  })
  .catch(() => (eventMessage.getElement().textContent = Message.ERROR));
