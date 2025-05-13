import FormValidator from "../components/formValidator.js";
import Card from "../components/Card.js";

// DOM elements
const cardModal = document.querySelector(".modal-card");
const profileModal = document.querySelector(".modal-profile");
const popupModal = document.querySelector(".modal-image");
const profileEditButton = document.querySelector(".content__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
// form elements
const formElements = document.querySelectorAll(".form");

// Initial cards data
const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

// toggle modal
function toggleModal(modal) {
  modal.classList.toggle("modal_opened");
}

// Close modal buttons
document.querySelectorAll(".modal__close-button").forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => toggleModal(modal));
});

// Image Handler
function handleImageClick(name, link) {
  const popupImage = document.querySelector("#popupImage");
  const popupCaption = document.querySelector("#popupCaption");
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  toggleModal(popupModal);
}

// Create and render card
const cardList = document.querySelector(".cards__list");
initialCards.forEach((cardData) => {
  const card = new Card({
    data: cardData,
    cardSelector: "#card-template",
    handleImageClick: handleImageClick,
  });
  const cardElement = card.generateCard();
  cardList.append(cardElement);
});

// form objects
const config = {
  formSelector: ".form",
  inputSelector: ".form__input",
  submitButtonSelector: ".form__submit",
  inactiveButtonClass: "form__submit_disabled",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__error_visible",
};

// validate or reset form validation
const formValidators = {};

// Card modal form
addCardButton.addEventListener("click", () => {
  formValidators["cardForm"].resetValidation();
  toggleModal(cardModal);
});

//Profile modal form - pre-populate/pre-fill current profile data
profileEditButton.addEventListener("click", () => {
  const profileForm = document.querySelector("#profileForm");
  const profileNameInput = profileForm.querySelector("#name");
  const profileDescriptionInput = profileForm.querySelector("#description");

  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;

  formValidators["profileForm"].resetValidation();
  toggleModal(profileModal);
});

const profileName = document.querySelector(".content__title");
const profileDescription = document.querySelector(".content__description");
formElements.forEach((form) => {
  const formId = form.getAttribute("id");

  // Create and enable validator
  const validator = new FormValidator(config, form);
  validator.enableValidation();
  formValidators[formId] = validator;

  // Add form submit listener
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (formId === "cardForm") {
      const title = form.querySelector("#title").value;
      const link = form.querySelector("#imageUrl").value;

      const newCardData = { name: title, link: link };

      const card = new Card({
        data: newCardData,
        cardSelector: "#card-template",
        handleImageClick: handleImageClick,
      });

      cardList.prepend(card.generateCard());
      toggleModal(cardModal); // Close card modal
    } else if (formId === "profileForm") {
      const profileNameInput = form.querySelector("#name").value;
      const profileDescriptionInput = form.querySelector("#description").value;

      profileName.textContent = profileNameInput;
      profileDescription.textContent = profileDescriptionInput;
      toggleModal(profileModal); // Close profile modal
    }

    // Reset and clean validation
    form.reset();
    formValidators[formId].resetValidation();
  });
});

// Insert year in the footer dynamically
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector(".footer__year");
if (footerYear) {
  footerYear.textContent = currentYear;
}
