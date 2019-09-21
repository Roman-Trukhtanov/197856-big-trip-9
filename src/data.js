import {getRandomInt, reducer, getWayPointDescription, sortDataByTime} from "./utils";
import moment from "moment";

import {
  wayPointTypes,
  MIN_POINT_PRICE,
  MAX_POINT_PRICE,
  description,
  MAX_PHOTOS_AMOUNT,
  cities,
  TIME_CONFIG,
  getAdditionalOffers,
} from "./config";

const {
  DAYS_IN_WEEK,
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
} = TIME_CONFIG;

const getRandomWayPointType = (types) => {
  const wayPointTypeNames = Object.keys(types);

  return types[wayPointTypeNames[getRandomInt(0, wayPointTypeNames.length - 1)]];
};

const getWayPointPrice = () => getRandomInt(MIN_POINT_PRICE, MAX_POINT_PRICE);

const getWayPointPhotos = () => {
  const photosNumber = getRandomInt(0, MAX_PHOTOS_AMOUNT);

  return new Array(photosNumber).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const getTime = () => {
  const randomDate = moment().add(getRandomInt(0, DAYS_IN_WEEK), `days`);

  const randomHourNum = getRandomInt(0, HOURS_IN_DAY);
  const randomMinutesNum = getRandomInt(0, MINUTES_IN_HOUR);

  const startTime = moment(randomDate)
    .add(randomHourNum, `hours`)
    .add(randomMinutesNum, `minutes`)
    .valueOf();

  const endTime = moment(randomDate)
    .add(randomHourNum + getRandomInt(0, HOURS_IN_DAY), `hours`)
    .add(randomMinutesNum + getRandomInt(0, MINUTES_IN_HOUR), `minutes`)
    .valueOf();

  return {
    startTime,
    endTime,
  };
};

const getWayPointData = () => ({
  type: getRandomWayPointType(wayPointTypes),
  city: cities[getRandomInt(0, cities.length - 1)],
  wayPointPrice: getWayPointPrice(),
  time: getTime(),
  description: getWayPointDescription(description),
  photos: getWayPointPhotos(),
  offers: getAdditionalOffers(),

  get totalPrice() {
    let offerPrices = 0;

    if (this.offers.length > 0) {
      offerPrices += this.offers.map((offer) => offer.isSelected ? offer.price : 0).reduce(reducer);
    }

    return this.wayPointPrice + offerPrices;
  }
});

const getFullData = () => {
  const generatedData = new Array(getRandomInt(0, 5))
    .fill(``)
    .map(() => getWayPointData());

  sortDataByTime(generatedData);

  generatedData.forEach((itemData, index) => {
    itemData.id = index;
  });

  return generatedData;
};

export const wayPointsData = getFullData();

const getAllCities = (wayPoints) => wayPoints.map((wayPoint) => wayPoint.city);

const getTimes = (wayPoints) => ({
  startDate: wayPoints[0].time.startTime,
  endDate: wayPoints[wayPoints.length - 1].time.endTime,
});

export const getInfoData = (data) => ({
  cities: getAllCities(data),
  times: data.length > 0 ? getTimes(data) : null,
});

export const menuData = [
  {
    title: `Table`,
    isActive: true,
  },
  {
    title: `Stats`,
    isActive: false,
  },
];

export const filtersData = [
  {
    title: `everything`,
    isChecked: true,
  },
  {
    title: `future`,
    isChecked: false,
  },
  {
    title: `past`,
    isChecked: false,
  },
];
