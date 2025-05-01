// form objects
const config = {
  formSelector: ".form",
  inputSelector: ".form__input",
  submitButtonSelector: ".form__submit",
  inactiveButtonClass: "form__submit_disabled",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__error_visible",
};

// Show input error message
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  console.log(inputElement);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

// Hide input error message
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
};

// Check input validity and show/hide error message
const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    // If the input is invalid, show the error message
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Check if any input is invalid
// and disable the submit button if so
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

// Toggle the state of the submit button based on input validity
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

// Set event listeners for each input field in the form
// and the submit button
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    // Initially hide errors for pre-filled fields
    hideInputError(formElement, inputElement, config);

    // Input event - while typing
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });

    // Focus event - clear error when user focuses
    inputElement.addEventListener("focus", function () {
      hideInputError(formElement, inputElement, config);
    });

    // Blur event - re-check validation when user leaves field
    inputElement.addEventListener("blur", function () {
      checkInputValidity(formElement, inputElement, config);
    });
  });

  // Set initial button state
  toggleButtonState(inputList, buttonElement, config);
};
// Enable validation for all forms on the page
// by adding event listeners to each form element
const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, config);
  });
};

const resetFormValidation = (formElement, config) => {
  // Reset the actual form fields
  formElement.reset();
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config); // Clear all errors
  });

  // Re-evaluate the button state based on current input values
  toggleButtonState(inputList, buttonElement, config);
};

// Initialize validation
enableValidation(config);
// Reset validation on form reset
const formElements = document.querySelectorAll(config.formSelector);
formElements.forEach((formElement) => {
  formElement.addEventListener("reset", () => {
    resetFormValidation(formElement, config);
  });
});
