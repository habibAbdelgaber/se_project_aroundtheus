import Popup from "./Popup.js";

export default class PopupWithConfirm extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._confirmButton = this._popup.querySelector(
      ".modal__button_type_confirm"
    );
    this._handleOnConfirm = null;
    this._handleClick = this._handleClick.bind(this);
  }

  setEventListeners() {
    super.setEventListeners();
    this._confirmButton.addEventListener("click", this._handleClick);
  }

  open(onConfirm) {
    this._handleOnConfirm = onConfirm;
    super.open();
  }

  close() {
    super.close();
    // Reset the confirm handler
    if (this._handleOnConfirm) {
      this._confirmButton.removeEventListener("click", this._handleClick);
      this._handleOnConfirm = null;
    }
  }

  async _handleClick() {
    if (typeof this._handleOnConfirm === "function") {
      const originalText = this._confirmButton.textContent;

      // Show loading state
      this._confirmButton.textContent = "Deleting...";
      this._confirmButton.disabled = true;

      try {
        await this._handleOnConfirm(); // await the async deletion
      } catch (err) {
        console.error("Error during deletion:", err);
      } finally {
        // Restore original state and close
        this._confirmButton.textContent = originalText;
        this._confirmButton.disabled = false;
        this.close();
      }
    }
  }
}
