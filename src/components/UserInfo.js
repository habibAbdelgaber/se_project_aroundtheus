export default class UserInfo {
  constructor({ nameSelector, descriptionSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._descriptionElement = document.querySelector(descriptionSelector);
  }

  // Get user information
  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      description: this._descriptionElement.textContent,
    };
  }

  // Set user information
  setUserInfo({ name, description }) {
    this._nameElement.textContent = name;
    this._descriptionElement.textContent = description;
  }
}
