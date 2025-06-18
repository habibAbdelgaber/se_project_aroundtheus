export default class UserInfo {
  constructor({ nameSelector, descriptionSelector, imageSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._descriptionElement = document.querySelector(descriptionSelector);
    this._imageElement = document.querySelector(imageSelector);
  }

  // Get user information
  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      description: this._descriptionElement.textContent,
      image: {
        src: this._imageElement.src,
        alt: this._imageElement.alt,
      },
    };
  }

  // Set user information
  setUserInfo({ name, description, image }) {
    if (name) this._nameElement.textContent = name;
    if (description) this._descriptionElement.textContent = description;
    if (image) {
      if (image.src) this._imageElement.src = image.src;
      if (image.alt) this._imageElement.alt = image.alt;
    }
  }
}
