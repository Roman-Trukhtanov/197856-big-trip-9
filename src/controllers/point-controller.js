import {isEscKey, Position, render, debounce} from "../utils";
import Event from "../components/event";
import EventEdit from "../components/event-edit";

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {Mode} from "./trip-controller";

const ButtonState = {
  SAVE: `save`,
  SAVING: `saving...`,
  DELETE: `delete`,
  DELETING: `deleting...`,
};

export default class PointController {
  constructor(
      api,
      data,
      wayPointTypes,
      destinations,
      offersByTypes,
      pointsLength,
      container,
      onDataChange,
      onChangeView,
      mode
  ) {
    this._api = api;
    this._eventData = data;
    this._container = container;
    this._wayPointsTypes = wayPointTypes;
    this._offersByTypes = offersByTypes;
    this._destinations = destinations;
    this._event = new Event(data);
    this._eventEdit = new EventEdit(
        this._eventData,
        pointsLength,
        this._wayPointsTypes,
        this._offersByTypes,
        this._destinations,
        mode
    );
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._flatPickrs = [];
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFavoriteInputChange = this._onFavoriteInputChange.bind(this);
    this._updateFavoriteStatus = debounce(this._updateFavoriteStatus.bind(this));
    this._mode = mode;
    this._saveBtn = this._eventEdit.getElement().querySelector(`.event__save-btn`);
    this._deleteBtn = this._eventEdit.getElement().querySelector(`.event__reset-btn`);
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

  _shake(element) {
    const ANIMATION_TIMEOUT = 600;
    element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  _blockButtons() {
    this._saveBtn.disabled = true;
    this._deleteBtn.disabled = true;
  }

  _unblockButtons() {
    this._saveBtn.disabled = false;
    this._deleteBtn.disabled = false;
  }

  _updateFavoriteStatus(favoriteInput) {
    this._eventData.isFavorite = !this._eventData.isFavorite;

    this._api.updatePoint(this._eventData.toRAW())
      .then(() => {
        favoriteInput.checked = this._eventData.isFavorite;
        this._unblockButtons();
      })
      .catch(() => {
        favoriteInput.checked = !this._eventData.isFavorite;
        this._eventData.isFavorite = !this._eventData.isFavorite;
        this._shake(this._eventEdit.getElement());
        this._unblockButtons();
      });
  }

  _onFavoriteInputChange(evt) {
    evt.preventDefault();
    const favoriteInput = evt.target;
    this._blockButtons();

    this._updateFavoriteStatus(favoriteInput);
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

      const favoriteItem = this._eventEdit.getElement().querySelector(`.event__favorite-checkbox`);

      if (favoriteItem) {
        favoriteItem.addEventListener(`click`, this._onFavoriteInputChange);
      }
    }

    const eventEditElement = this._eventEdit.getElement();

    eventEditElement
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        this._blockButtons();

        const saveBtn = eventEditElement.querySelector(`.event__save-btn`);
        saveBtn.textContent = ButtonState.SAVING;

        const newData = this._getNewData();

        if (this._mode === Mode.ADDING) {
          this._api.createPoint(newData.toRAW())
            .then((serverData) => {
              this._onDataChange(serverData, null);
            })
            .catch(() => {
              saveBtn.textContent = ButtonState.SAVE;
              this._unblockButtons();
              this._shake(this._eventEdit.getElement());
            });
        } else {
          this._api.updatePoint(newData.toRAW())
            .then((serverData) => {
              this._onDataChange(serverData, this._eventData);
            })
            .catch(() => {
              saveBtn.textContent = ButtonState.SAVE;
              this._unblockButtons();
              this._shake(this._eventEdit.getElement());
            });
        }

        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });

    eventEditElement
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        this._blockButtons();

        const deleteBtn = evt.target;
        deleteBtn.textContent = ButtonState.DELETING;

        if (this._mode === Mode.ADDING) {
          this._onDataChange(null, this._mode === Mode.DEFAULT ? this._eventData : null);
        } else {
          this._api.deletePoint(this._eventData.toRAW())
            .then(() => {
              this._onDataChange(null, this._mode === Mode.DEFAULT ? this._eventData : null);
            })
            .catch(() => {
              deleteBtn.textContent = ButtonState.DELETE;
              this._unblockButtons();
              this._shake(this._eventEdit.getElement());
            });
        }

        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });

    render(this._container, this._currentView.getElement(), renderPosition);
  }

  _getNewOffersData(checkedOffers, eventType) {
    const {offers} = this._offersByTypes.find((offer) => offer.type === eventType);

    const copiedOffers = offers.map((offer) => Object.assign({}, offer));

    copiedOffers.forEach((offer) => {
      offer.accepted = false;
    });

    for (const checkedOffer of checkedOffers) {
      const offerItemIndex = copiedOffers.findIndex((offer) => offer.title === checkedOffer);
      copiedOffers[offerItemIndex].accepted = true;
    }

    return copiedOffers;
  }

  _getNewDestination(destinationName) {
    const foundDestinationIndex = this._destinations.findIndex((destination) => destination.name === destinationName);

    if (foundDestinationIndex > 0) {
      return this._destinations[foundDestinationIndex];
    } else {
      return {
        description: ``,
        name: destinationName,
        pictures: [],
      };
    }
  }

  _getNewData() {
    const formData = new FormData(this._eventEdit.getElement().querySelector(`.event--edit`));

    const eventType = formData.get(`event-type`);

    const newOffers = this._getNewOffersData(formData.getAll(`event-offer`), eventType);

    const newDestination = this._getNewDestination(formData.get(`event-destination`));

    const newStartTime = formData.get(`event-start-time`) !== null
      ? new Date(formData.get(`event-start-time`)).getTime()
      : Date.now();

    const newEndTime = formData.get(`event-end-time`) !== null
      ? new Date(formData.get(`event-end-time`)).getTime()
      : Date.now();

    const newType = this._wayPointsTypes[eventType];

    const pointPrice = formData.get(`event-price`) !== ``
      ? parseInt(formData.get(`event-price`), 10)
      : 0;

    return Object.assign(this._eventData, {
      type: newType,
      destination: newDestination,
      wayPointPrice: pointPrice,
      time: {
        startTime: newStartTime,
        endTime: newEndTime,
      },
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
