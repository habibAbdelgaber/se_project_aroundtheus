// Shows the error message for an input field
function showInputError(inputElement, errorMessage, config) {
  // Find the error element by input's ID
  const inputId = inputElement.id;
  let errorElement = document.querySelector(`.${inputId}-error`);

  // Fallback if not found by ID to finding within parent
  if (!errorElement) {
    errorElement = inputElement.parentElement.querySelector(".form__error");
  }

  // Add error class to input
  inputElement.classList.add(config.inputErrorClass);

  // Set error message and show it
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
}

// Hides the error message for an input field
function hideInputError(inputElement, config) {
  // Find the error element by input's ID
  const inputId = inputElement.id;
  let errorElement = document.querySelector(`.${inputId}-error`);

  // Fallback if not found by ID to finding within parent
  if (!errorElement) {
    errorElement = inputElement.parentElement.querySelector(".form__error");
  }

  // Remove error class from input
  inputElement.classList.remove(config.inputErrorClass);

  // Clear error message and hide it
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove(config.errorClass);
  }
}

// Error state for the submit button
function showButtonError(buttonElement, config) {
  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
}

// Hides error state for the submit button
function hideButtonError(buttonElement, config) {
  buttonElement.classList.remove(config.inactiveButtonClass);
  buttonElement.disabled = false;
}

//  If any input in the form is invalid
function hasInvalidInput(inputList) {
  return Array.from(inputList).some((inputElement) => {
    // Skip validation for pre-populated fields that haven't been touched yet
    if (
      inputElement.dataset.touched !== "true" &&
      inputElement.value.trim() !== ""
    ) {
      return false;
    }

    // Required empty fields count as invalid for button state purposes,
    // even if we're not showing an error message yet
    if (
      inputElement.hasAttribute("required") &&
      inputElement.value.trim() === ""
    ) {
      return true;
    }
    return !inputElement.validity.valid;
  });
}

// Toggles the state of the submit button based on input validity
function toggleButtonState(inputList, buttonElement, config) {
  if (hasInvalidInput(inputList)) {
    showButtonError(buttonElement, config);
  } else {
    hideButtonError(buttonElement, config);
  }
}

// Checks the validity of an input element and shows/hides errors
function checkInputValidity(inputElement, config, forceValidation = false) {
  // Check if the input has been touched or if we are forcing validation
  const isTouched = inputElement.dataset.touched === "true" || forceValidation;

  if (!inputElement.validity.valid) {
    // Only show error messages if the field has been touched or validation is forced
    if (isTouched) {
      // Check for specific types of errors and customize messages
      if (inputElement.validity.valueMissing) {
        showInputError(inputElement, "Please fill out this field.", config);
      } else if (
        inputElement.validity.typeMismatch &&
        inputElement.type === "url"
      ) {
        showInputError(inputElement, "Please enter a web address.", config);
      } else if (inputElement.validity.tooShort) {
        const minLength = inputElement.getAttribute("minlength");
        showInputError(
          inputElement,
          `Please lengthen this text to ${minLength} characters or more.`,
          config
        );
      } else if (inputElement.validity.tooLong) {
        const maxLength = inputElement.getAttribute("maxlength");
        showInputError(
          inputElement,
          `Please shorten this text to no more than ${maxLength} characters.`,
          config
        );
      } else {
        showInputError(inputElement, inputElement.validationMessage, config);
      }
    }
    return false;
  } else {
    hideInputError(inputElement, config);
    return true;
  }
}

// Sets up event listeners for all inputs and the submit button in a form
function setEventListeners(formElement, config) {
  const inputList = formElement.querySelectorAll(config.inputSelector);
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  // Add event listeners for each input
  inputList.forEach((inputElement) => {
    // Initialize the touched state
    inputElement.dataset.touched = "false";

    // No initial error messages, even for required fields
    // Just hiding errors to ensure a clean initial state
    hideInputError(inputElement, config);

    // Handle input events (typing)
    inputElement.addEventListener("input", () => {
      // Mark the field as touched on first input
      inputElement.dataset.touched = "true";

      // Now check validity and update button state
      checkInputValidity(inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });

    // Handle blur events (field loses focus)
    inputElement.addEventListener("blur", () => {
      // Mark the field as touched when it loses focus
      inputElement.dataset.touched = "true";

      // Validate the field now that it's been touched
      checkInputValidity(inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });

  // Set initial button state - this needs to happen AFTER setting up listeners
  // and initializing the touched state, to handle pre-populated fields properly
  toggleButtonState(inputList, buttonElement, config);
}

// Resets all form validation states to default - Considers pre-populated fields as valid
function resetFormValidation(formElement, config) {
  if (!formElement) return;

  const inputList = formElement.querySelectorAll(config.inputSelector);
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  // Reset each input
  inputList.forEach((inputElement) => {
    // Force remove all error classes from the input
    inputElement.classList.remove(config.inputErrorClass);

    // Clear and hide all error messages
    const inputId = inputElement.id;
    let errorElement = document.querySelector(`.${inputId}-error`);

    // Fallback if not found by ID
    if (!errorElement) {
      errorElement = inputElement.parentElement.querySelector(".form__error");
    }

    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove(config.errorClass);
    }

    // Reset touched state
    inputElement.dataset.touched = "false";

    // For pre-populated fields, ensure they don't show errors
    if (inputElement.value.trim() !== "") {
      // Consider pre-populated fields as valid but untouched
      inputElement.dataset.prepopulated = "true";
    } else {
      inputElement.dataset.prepopulated = "false";
    }
  });

  // Check if button should be enabled/disabled based on current input values
  // but allow pre-populated required fields to be considered valid
  if (buttonElement) {
    // Enable button if all required fields are either filled or pre-populated
    const hasRequiredEmpty = Array.from(inputList).some(
      (input) => input.required && input.value.trim() === ""
    );

    if (hasRequiredEmpty) {
      showButtonError(buttonElement, config);
    } else {
      hideButtonError(buttonElement, config);
    }
  }
}

/**
 * Initializes form validation for all matching forms
 * @param {Object} config - Configuration object containing selector classes
 */
function enableValidation(config) {
  const formList = document.querySelectorAll(config.formSelector);

  formList.forEach((formElement) => {
    // Prevent default form submission
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();

      // Force validation of all fields on submit attempt
      const inputList = formElement.querySelectorAll(config.inputSelector);
      inputList.forEach((inputElement) => {
        // Force validation on all fields when form is submitted
        checkInputValidity(inputElement, config, true);
      });

      // Only proceed with submission if form is valid
      if (!hasInvalidInput(inputList)) {
        //form submission
        console.log("Form submitted successfully");
      }
    });

    // Set up listeners for all inputs
    setEventListeners(formElement, config);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Define the validation config object
  const validationConfig = {
    formSelector: ".form",
    inputSelector: ".form__input",
    submitButtonSelector: ".form__submit",
    inactiveButtonClass: "form__button_disabled",
    inputErrorClass: "form__input_type_error",
    errorClass: "form__error_visible",
  };

  // Initialize form validation
  enableValidation(validationConfig);

  // Function to handle modal open events
  const handleModalOpen = (modal) => {
    const form = modal.querySelector(validationConfig.formSelector);
    if (form) {
      resetFormValidation(form, validationConfig);
    }
  };

  // Look for open buttons that might trigger modals
  const modalOpenButtons = document.querySelectorAll("[data-modal]");
  if (modalOpenButtons.length > 0) {
    modalOpenButtons.forEach((button) => {
      const modalId = button.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        button.addEventListener("click", () => {
          setTimeout(() => handleModalOpen(modal), 100);
        });
      }
    });
  }

  // Add a MutationObserver to detect when modals become visible
  const modals = document.querySelectorAll(".modal");
  if (modals.length > 0) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const modal = mutation.target;
          const isVisible = modal.classList.contains("modal_opened");

          if (isVisible) {
            handleModalOpen(modal);
          }
        }
      });
    });

    modals.forEach((modal) => {
      observer.observe(modal, { attributes: true });

      // Listen for custom events that might be used to open modals
      modal.addEventListener("open", () => handleModalOpen(modal));
    });
  }

  // Global event listener for ESC key to close modals
  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape" || evt.key === "Esc") {
      setTimeout(() => {
        const openModals = document.querySelectorAll(".modal_opened");
        openModals.forEach((modal) => {
          handleModalOpen(modal);
        });
      }, 300);
    }
  });
});
