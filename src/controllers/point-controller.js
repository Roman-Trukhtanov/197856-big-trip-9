import {isEscKey, Position, render} from "../utils";
import Event from "../components/event";
import EventEdit from "../components/event-edit";

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {Mode} from "./trip-controller";

export default class PointController {
  constructor(data, container, wayPointTypes, cities, onDataChange, onChangeView, mode) {
    this._eventData = data;
    this._container = container;
    this._wayPointsTypes = wayPointTypes;
    this._cities = cities;
    this._event = new Event(data);
    this._eventEdit = new EventEdit(this._eventData, this._wayPointsTypes, this._eventData.offers, this._cities, mode);

    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._flatPickrs = [];
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._mode = mode;
    this.init();
  }

  init() {
    this._renderEvents();
  }

  _initFlatPickr(element, timeStamp) {
    this._flatPickrs.push(flatpickr(element, {
      altInput: true,
      altFormat: `d/m/Y H:i`,
      allowInput: true,
      enableTime: true,
      defaultDate: timeStamp ? timeStamp : Date.now()
    }));
  }

  removeFlatPickr() {
    if (this._flatPickrs.length !== 0) {
      this._flatPickrs.forEach((flatPickr) => flatPickr.destroy());
    }
  }

  _onEscKeyDown(evt) {
    if (isEscKey(evt)) {
      this.removeFlatPickr();

      switch (this._mode) {
        case Mode.DEFAULT:
          this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
          break;
        case Mode.ADDING:
          this._container.removeChild(this._eventEdit.getElement());
          this._onDataChange(null, null);
          break;
      }

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _renderEvents() {
    let renderPosition = Position.BEFOREEND;
    this._currentView = this._event;

    if (this._mode === Mode.ADDING) {
      renderPosition = Position.AFTERBEGIN;
      this._currentView = this._eventEdit;

      this._initFlatPickr(this._eventEdit.getElement()
        .querySelector(`input[name="event-start-time"]`), this._eventData.time.startTime);

      this._initFlatPickr(this._eventEdit.getElement()
        .querySelector(`input[name="event-end-time"]`), this._eventData.time.endTime);

      document.addEventListener(`keydown`, this._onEscKeyDown);
    } else {
      const eventElement = this._event.getElement();

      eventElement
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, (evt) => {
          evt.preventDefault();

          this._onChangeView();

          this.removeFlatPickr();

          this._initFlatPickr(eventEditElement.querySelector(`input[name="event-start-time"]`), this._eventData.time.startTime);

          this._initFlatPickr(eventEditElement.querySelector(`input[name="event-end-time"]`), this._eventData.time.endTime);

          this._container.replaceChild(eventEditElement, eventElement);
          document.addEventListener(`keydown`, this._onEscKeyDown);
        });

      const eventEditRollUpBtn = this._eventEdit.getElement()
        .querySelector(`.event__rollup-btn`);

      if (eventEditRollUpBtn) {
        eventEditRollUpBtn.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          this.removeFlatPickr();
          this._container.replaceChild(eventElement, eventEditElement);
          document.removeEventListener(`keydown`, this._onEscKeyDown);
        });
      }
    }

    const eventEditElement = this._eventEdit.getElement();

    eventEditElement
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        this._container.replaceChild(this._event.getElement(), eventEditElement);

        this._onDataChange(this._getNewData(), this._mode === Mode.DEFAULT ? this._eventData : null);

        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });

    eventEditElement
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        this._onDataChange(null, this._mode === Mode.DEFAULT ? this._eventData : null);

        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });

    render(this._container, this._currentView.getElement(), renderPosition);
  }

  _getNewOffersData(checkedOffers) {
    const copiedOffers = this._eventData.offers.map((offer) => Object.assign({}, offer));

    copiedOffers.forEach((offer) => {
      offer.isSelected = false;
    });

    for (const checkedOffer of checkedOffers) {
      const offerItemIndex = copiedOffers.findIndex((offer) => offer.name === checkedOffer);
      copiedOffers[offerItemIndex].isSelected = true;
    }

    return copiedOffers;
  }

  _getNewData() {
    const formData = new FormData(this._eventEdit.getElement().querySelector(`.event--edit`));

    const newOffers = this._getNewOffersData(formData.getAll(`event-offer`));

    const placeDescription = this._eventEdit.getElement().querySelector(`.event__destination-description`).textContent;

    const newStartTime = formData.get(`event-start-time`) !== null ? new Date(formData.get(`event-start-time`)).getTime() : Date.now();

    const newEndTime = formData.get(`event-end-time`) !== null ? new Date(formData.get(`event-end-time`)).getTime() : Date.now();

    const newType = this._wayPointsTypes[formData.get(`event-type`)];

    return Object.assign(this._eventData, {
      type: newType,
      city: formData.get(`event-destination`),
      wayPointPrice: parseInt(formData.get(`event-price`), 10),
      time: {
        startTime: newStartTime,
        endTime: newEndTime,
      },
      description: placeDescription,
      offers: newOffers,
    });
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this.removeFlatPickr();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }
}
