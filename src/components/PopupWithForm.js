import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".form");
    this._inputList = Array.from(this._form.querySelectorAll(".form__input"));
    this._submitButton = this._form.querySelector(".form__submit");
  }

  // Get input values from the form
  _getInputValues() {
    const inputValues = {};
    this._inputList.forEach((input) => {
      inputValues[input.name] = input.value.trim();
    });
    return inputValues;
  }

  // Set the submit button text
  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const inputValues = this._getInputValues();

      // Show loading state
      const originalButtonText = this._submitButton.textContent;
      this._submitButton.textContent = "Saving...";
      this._submitButton.disabled = true;

      try {
        await this._handleFormSubmit(inputValues);
        // this._form.reset();
        this.close(); // Close the popup after successful submission
      } catch (error) {
        console.error("Error during form submission:", error);
      } finally {
        // Restore button state
        this._submitButton.textContent = originalButtonText;
        this._submitButton.disabled = false;
      }
    });
  }

  // Close the popup and reset the form
  close() {
    super.close();
    this._form.reset();
  }
}
