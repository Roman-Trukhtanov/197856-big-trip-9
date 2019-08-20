import {getRandomInt, reducer, shuffleArray} from "./utils";

import {
  wayPointTypes,
  MIN_POINT_PRICE,
  MAX_POINT_PRICE,
  MIN_SENTENCE_AMOUNT,
  MAX_SENTENCE_AMOUNT,
  description,
  MAX_PHOTOS_AMOUNT,
  additionalOffers,
  cities,
  TIME_CONFIG,
} from "./config";

const {
  DAYS_IN_WEEK,
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  SECONDS_IN_MINUTE,
  MS_IN_SECOND,
} = TIME_CONFIG;

const getRandomWayPointType = (types) => {
  const wayPointTypeNames = Object.keys(types);

  return types[wayPointTypeNames[getRandomInt(0, wayPointTypeNames.length - 1)]];
};

const getWayPointPrice = () => getRandomInt(MIN_POINT_PRICE, MAX_POINT_PRICE);

const getOffers = (allOffers) => {
  const copyAllOffers = [...allOffers];

  const offersAmount = getRandomInt(0, 2);

  return shuffleArray(copyAllOffers).splice(0, offersAmount);
};

const getWayPointPhotos = () => {
  const photosNumber = getRandomInt(0, MAX_PHOTOS_AMOUNT);

  return new Array(photosNumber).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const getWayPointDescription = (descriptions) => {
  const sentencesAmount = getRandomInt(MIN_SENTENCE_AMOUNT, MAX_SENTENCE_AMOUNT);

  const sentences = shuffleArray(descriptions.split(`. `).splice(0, sentencesAmount)).join(`. `);

  return `${sentences}${sentences.length !== 0 ? `.` : ``}`;
};

const getTime = () => {
  const msInDay = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MS_IN_SECOND;

  const randomDate = Date.now() + getRandomInt(0, DAYS_IN_WEEK - 1) * msInDay;

  const startTime = randomDate + getRandomInt(0, 1) * getRandomInt(0, HOURS_IN_DAY) * getRandomInt(0, MINUTES_IN_HOUR) * SECONDS_IN_MINUTE * MS_IN_SECOND;
  const endTime = randomDate + getRandomInt(1, 3) * getRandomInt(0, HOURS_IN_DAY) * getRandomInt(0, MINUTES_IN_HOUR) * SECONDS_IN_MINUTE * MS_IN_SECOND;

  const diff = Math.abs(endTime - startTime);

  let minutes = Math.floor((diff / 1000) / 60) % 60;
  let hours = Math.floor(diff / (3600 * 1000)) % 24;
  let days = Math.floor((diff / (3600 * 1000)) / 24);

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (days < 10) {
    days = `0${days}`;
  }

  return {
    startTime,
    endTime,
    duration: {
      minutes,
      hours,
      days
    }
  };
};

const getWayPointData = () => ({
  type: getRandomWayPointType(wayPointTypes),
  city: cities[getRandomInt(0, cities.length - 1)],
  wayPointPrice: getWayPointPrice(),
  time: getTime(),
  description: getWayPointDescription(description),
  photos: getWayPointPhotos(),
  offers: getOffers(additionalOffers),

  get totalPrice() {
    let offerPrices = 0;

    if (this.offers.length > 0) {
      offerPrices += this.offers.map((offer) => offer.price).reduce(reducer);
    }

    return this.wayPointPrice + offerPrices;
  }
});

export const wayPointsData = new Array(getRandomInt(3, 5)).fill(``).map(() => getWayPointData());

const getAllCities = (wayPoints) => wayPoints.map((wayPoint) => wayPoint.city);

const getTimes = (wayPoints) => ({
  startDate: wayPoints[0].time.startTime,
  endDate: wayPoints[wayPoints.length - 1].time.endTime,
});

export const infoData = {
  cities: getAllCities(wayPointsData),
  times: getTimes(wayPointsData),
};

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
