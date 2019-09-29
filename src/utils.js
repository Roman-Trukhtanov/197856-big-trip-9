export const reducer = (sum, current) => sum + current;

export const getCapitalizedString = (string) => `${string.trim()[0].toUpperCase()}${string.slice(1)}`;

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

export const debounce = (callback, wait = 200) => {
  let timeOut = null;
  return (...args) => {
    const next = () => callback(...args);
    clearTimeout(timeOut);
    timeOut = setTimeout(next, wait);
  };
};
