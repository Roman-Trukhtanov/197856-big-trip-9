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
