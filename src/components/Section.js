export default class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  setItems(items) {
    this._items = items;
  }

  renderItems() {
    this._items.forEach((item) => this._renderer(item));
  }

  addItem(element, method = "prepend") {
    this._container[method](element);
  }
}
