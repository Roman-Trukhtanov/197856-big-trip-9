import AbstractComponent from "./abstract-component";

export default class Tabs extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs"></nav>`.trim();
  }
}
