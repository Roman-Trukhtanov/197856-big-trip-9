export const renderComponent = (container, layoutTemplate) => {
  container.insertAdjacentHTML(`beforeend`, layoutTemplate);
};

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

export const getRandomBool = () => Math.random() >= 0.5;

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const reducer = (sum, current) => sum + current;

export const getCapitalizedString = (string) => `${string.trim()[0].toUpperCase()}${string.slice(1)}`;

export const getVisibleTime = (timestamp) => new Date(timestamp).toString().split(` `)[4].slice(0, 5);

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
