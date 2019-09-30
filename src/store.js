const outputError = (error, items) => {
  throw new Error(`Error parse items. Error: ${error}. Items: ${items}`);
};

export default class Store {
  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }

  setItem({key, item, group}) {
    const items = this.getAll();

    if (key === null) {
      items[group] = item;
    } else {
      if (items[group] === undefined) {
        items[group] = {};
      }

      items[group][key] = item;
    }

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getItem({key, group}) {
    const items = this.getAll();
    return items[group][key];
  }

  removeItem({key, group}) {
    const items = this.getAll();
    delete items[group][key];

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (err) {
      outputError(err, items);
      return emptyItems;
    }
  }
}
