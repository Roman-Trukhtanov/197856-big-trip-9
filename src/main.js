import {getMenuData, getFiltersData, getInfoData} from "./data";
import {Position, render, unrender} from "./utils";
import {wayPointTypes, monthsNames, Message} from "./config";
import EventsMsg from "./components/events-msg";
import API from "./api";
import Store from "./store";
import Provider from "./provider";
import App from "./controllers/app-controller";

const AUTHORIZATION = `Basic RT_Space_Web_Dev_03`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;
const APP_STORE_KEY = `app-store-key`;
const checkOnlineStatus = () => {
  return window.navigator.onLine;
};

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: APP_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, isOnline: checkOnlineStatus});

window.addEventListener(`offline`, () => {
  document.title = `${document.title} - [OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(` - [OFFLINE]`)[0];
  provider.syncPoints();
});

const controlsContainer = document.querySelector(`.trip-controls`);

const tripInfoContainer = document.querySelector(`.trip-info`);

const eventsContainer = document.querySelector(`.trip-events`);

const newPointBtn = document.querySelector(`.trip-main__event-add-btn`);

const eventMessage = new EventsMsg(Message.LOADING);

const initApp = ({points, destinations, offersByTypes}) => {
  const app = new App(
      provider,
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

const resolveData = (data) => {
  unRenderLoadingMessage(eventMessage.getElement());
  eventMessage.removeElement();
  newPointBtn.disabled = false;
  initApp(data);
};

const rejectData = (err) => {
  eventMessage.getElement().textContent = Message.ERROR;
  throw new Error(err);
};

provider.getAllData(resolveData, rejectData);
