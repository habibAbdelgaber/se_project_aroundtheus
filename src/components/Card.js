export default class Card {
  constructor({ data, cardSelector, handleImageClick }) {
    this._name = data.name;
    this._link = data.link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;

    // Bind handlers to ensure 'this' refers to the class instance
    this._handleLikeButton = this._handleLikeButton.bind(this);
    this._handleDeleteButton = this._handleDeleteButton.bind(this);
  }

  // Public method to generate a card element
  generateCard() {
    this._element = this._getTemplate();

    this._cardImage = this._element.querySelector(".card__image");
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete");
    this._titleElement = this._element.querySelector(".card__title");

    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._titleElement.textContent = this._name;

    this._setEventListeners();

    return this._element;
  }

  // Private method: clones the template
  _getTemplate() {
    const cardTemplate = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardTemplate;
  }

  // Private method: set all required event listeners
  _setEventListeners() {
    this._likeButton.addEventListener("click", this._handleLikeButton);
    this._deleteButton.addEventListener("click", this._handleDeleteButton);
    this._cardImage.addEventListener("click", () => {
      this._handleImageClick(this._name, this._link);
    });
  }

  // Private method: toggle the like state
  _handleLikeButton() {
    this._likeButton.classList.toggle("card__like-button_active");
  }

  // Private method: delete the card
  _handleDeleteButton() {
    this._element.remove();
    this._element = null;
  }
}
