import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".form");
    this._inputList = Array.from(this._form.querySelectorAll(".form__input"));
    this._submitButton = this._form.querySelector(".form__submit");
    this._submitBtnText = this._submitButton.textContent;
  }
  // add 2 params: isLoading and loadingText with a default text
  renderLoading(isLoading, loadingText = "Saving...") {
    if (isLoading) {
      this._submitButton.textContent = loadingText;
    } else {
      // here we return back the initial text. So, you don’t need to bother yourself about it
      this._submitButton.textContent = this._submitBtnText;
    }
  }

  // Get input values from the form
  _getInputValues() {
    const inputValues = {};
    this._inputList.forEach((input) => {
      inputValues[input.name] = input.value.trim();
    });
    return inputValues;
  }

  // Get the form element
  getForm() {
    return this._form;
  }

  // Set the submit button text
  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const inputValues = this._getInputValues();
      this.renderLoading(true); // Show loading state
      try {
        await this._handleFormSubmit(inputValues);
        this.close(); // Close the popup after successful submission
      } catch (error) {
        console.error("Error during form submission:", error);
      } finally {
        this.renderLoading(false); // Reset the button text after submission
      }
    });
  }

  // Close the popup and reset the form
  close() {
    super.close();
    this._form.reset();
  }
}
