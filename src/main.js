import {wayPointsData, getMenuData, getFiltersData, getInfoData} from "./data";
import {wayPointTypes, cities, monthsNames} from "./config";
import App from "./controllers/app-controller";

const controlsContainer = document.querySelector(`.trip-controls`);

const tripInfoContainer = document.querySelector(`.trip-info`);

const eventsContainer = document.querySelector(`.trip-events`);

const newPointBtn = document.querySelector(`.trip-main__event-add-btn`);

const app = new App(
    wayPointsData,
    getMenuData(),
    getFiltersData(),
    cities,
    monthsNames,
    wayPointTypes,
    getInfoData,
    eventsContainer,
    tripInfoContainer,
    controlsContainer,
    newPointBtn
);

app.init();
