import {getRandomBool} from "./utils";

export const TIME_CONFIG = {
  MS_IN_SECOND: 1000,
  SECONDS_IN_MINUTE: 60,
  MINUTES_IN_HOUR: 60,
  HOURS_IN_DAY: 24,
  DAYS_IN_WEEK: 7,
};

export const MAX_PHOTOS_AMOUNT = 6;

export const MIN_SENTENCE_AMOUNT = 0;

export const MAX_SENTENCE_AMOUNT = 3;

export const MIN_POINT_PRICE = 20;

export const MAX_POINT_PRICE = 500;

export const wayPointTypes = {
  'taxi': {
    title: `taxi`,
    srcIconName: `taxi.png`,
    prefixTemplate: `Taxi to`,
    group: `transfer`,
  },
  'bus': {
    title: `bus`,
    srcIconName: `bus.png`,
    prefixTemplate: `Bus to`,
    group: `transfer`,
  },
  'train': {
    title: `train`,
    srcIconName: `train.png`,
    prefixTemplate: `Train to`,
    group: `transfer`,
  },
  'ship': {
    title: `ship`,
    srcIconName: `ship.png`,
    prefixTemplate: `Ship to`,
    group: `transfer`,
  },
  'transport': {
    title: `transport`,
    srcIconName: `transport.png`,
    prefixTemplate: `Transport to`,
    group: `transfer`,
  },
  'drive': {
    title: `drive`,
    srcIconName: `drive.png`,
    prefixTemplate: `Drive to`,
    group: `transfer`,
  },
  'flight': {
    title: `flight`,
    srcIconName: `flight.png`,
    prefixTemplate: `Flight to`,
    group: `transfer`,
  },
  'check-in': {
    title: `check-in`,
    srcIconName: `check-in.png`,
    prefixTemplate: `Check in`,
    group: `activity`,
  },
  'sightseeing': {
    title: `sightseeing`,
    srcIconName: `sightseeing.png`,
    prefixTemplate: `Sightseeing in`,
    group: `activity`,
  },
  'restaurant': {
    title: `restaurant`,
    srcIconName: `restaurant.png`,
    prefixTemplate: `Eat at`,
    group: `activity`,
  },
};

export const cities = [
  `Venice`,
  `Budapest`,
  `Paris`,
  `Brugge`,
  `Amsterdam`,
  `Athens`,
  `Saint Petersburg`,
  `Moscow`,
  `Sydney`
];

export const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;

export const additionalOffers = [
  {
    title: `Add luggage`,
    price: 30,
    isSelected: getRandomBool(),
  },
  {
    title: `Switch to comfort class`,
    price: 100,
    isSelected: getRandomBool(),
  },
  {
    title: `Add meal`,
    price: 15,
    isSelected: getRandomBool(),
  },
  {
    title: `Choose seats`,
    price: 5,
    isSelected: getRandomBool(),
  },
  {
    title: `Travel by train`,
    price: 40,
    isSelected: getRandomBool(),
  }
];

export const monthsNames = [
  `jan`,
  `feb`,
  `mar`,
  `apr`,
  `may`,
  `jun`,
  `jul`,
  `aug`,
  `sep`,
  `oct`,
  `nov`,
  `dec`,
];
