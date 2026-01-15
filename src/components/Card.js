export default class Card {
  constructor({
    data,
    cardSelector,
    handleImageClick,
    handleLikeToggle,
    handleDeleteConfirm,
  }) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id; // Assuming 'id' is part of the data object
    this._isLiked = data.isLiked;
    this._handleLikeToggle = handleLikeToggle; // Function to handle like toggle
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteConfirm = handleDeleteConfirm;

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

    this._updateLikeState(); // Set initial like state
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
    const toggleLike = !this._isLiked; // Toggle the like state
    this._handleLikeToggle(this._id, toggleLike)
      .then(() => {
        this._isLiked = toggleLike; // Update the like state based on the response
        this._updateLikeState(); // Update the UI
      })
      .catch((error) => {
        console.error("Error toggling like state:", error);
      });
  }

  _updateLikeState() {
    if (this._isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  // Private method: delete the card
  _handleDeleteButton() {
    // Assuming handleDeleteConfirm is a function that takes the card ID and the card element to remove it
    this._handleDeleteConfirm(this._id, this._element);
  }
}
