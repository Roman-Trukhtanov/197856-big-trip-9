import {MAX_SENTENCE_AMOUNT, MIN_SENTENCE_AMOUNT, description} from "./config";

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

export const getRandomBool = () => Math.random() >= 0.5;

export const shuffleArray = (array) => {
  const copiedArray = [...array];

  for (let i = copiedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
  }

  return copiedArray;
};

export const reducer = (sum, current) => sum + current;

export const getCapitalizedString = (string) => `${string.trim()[0].toUpperCase()}${string.slice(1)}`;

export const getWayPointDescription = (descriptions = description) => {
  const sentencesAmount = getRandomInt(MIN_SENTENCE_AMOUNT, MAX_SENTENCE_AMOUNT);

  const sentences = shuffleArray(descriptions.split(`. `).splice(0, sentencesAmount)).join(`. `);

  return `${sentences}${sentences.length !== 0 ? `.` : ``}`;
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const createElement = (template) => {
  const newElement = document.createElement(`template`);
  newElement.innerHTML = template;
  const newElementContent = newElement.content;

  if (newElementContent.childElementCount === 1) {
    return newElementContent.firstChild;
  }

  return newElementContent;
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const isEscKey = (evt) => {
  return evt.key === `Escape` || evt.key === `Esc`;
};

export const isLinkTag = (evt) => evt.target.tagName === `A`;
export const isInputTag = (evt) => evt.target.tagName === `INPUT`;

export const sortDataByTime = (dataArr) => {
  dataArr.sort((left, right) => left.time.startTime - right.time.startTime);
};
