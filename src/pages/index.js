import "../pages/index.css";
import PopupWithForm from "../components/PopupWithForm.js";
import Card from "../components/Card.js";
import { handleImageClick } from "../utils/utils.js";
import { initialCards } from "../constants/constants.js";
import { CARD_LIST_SELECTOR, config } from "../constants/domSelectors.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithImage from "../components/PopupWithImage.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";

// Make sure DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const profileEditButton = document.querySelector(".content__edit-button");
  const addCardButton = document.querySelector(".profile__add-button");
  const formElements = document.querySelectorAll(".form");

  // UserInfo instance
  const userInfo = new UserInfo({
    nameSelector: ".content__title",
    descriptionSelector: ".content__description",
  });
  // Image popup instance
  const imagePopup = new PopupWithImage(".modal_type_image");
  imagePopup.setEventListeners();

  // Section instance
  const section = new Section(
    {
      items: initialCards,
      renderer: renderer,
    },
    CARD_LIST_SELECTOR
  );

  // Renderer card
  function renderer(cardData) {
    const card = new Card({
      data: cardData,
      cardSelector: "#card-template",
      handleImageClick: (name, link) =>
        handleImageClick(name, link, imagePopup),
    });
    const cardElement = card.generateCard();
    section.addItem(cardElement);
  }

  // Render initial cards data
  section.renderItems();

  // PopupWithForm: user profile edit form
  const profileFormPopup = new PopupWithForm(
    ".modal_type_profile",
    (formData) => {
      userInfo.setUserInfo({
        name: formData.name,
        description: formData.description,
      });
    }
  );
  profileFormPopup.setEventListeners();

  // // PopupWithForm: card creation form
  const addCardFormPopup = new PopupWithForm(".modal_type_card", (formData) => {
    const newCard = new Card({
      data: {
        name: formData.title,
        link: formData.imageUrl,
      },
      cardSelector: "#card-template",
      handleImageClick: (name, link) =>
        handleImageClick(name, link, imagePopup),
    });
    section.addItem(newCard.generateCard());
    // Close the popup after adding the card
  });
  addCardFormPopup.setEventListeners();

  // Open profile form along with pre-filling data
  profileEditButton.addEventListener("click", () => {
    const userData = userInfo.getUserInfo();
    const profileNameInput = profileForm.elements["name"];
    const profileDescriptionInput = profileForm.elements["description"];

    // Pre-fill the form with current user data
    profileNameInput.value = userData.name;
    profileDescriptionInput.value = userData.description;

    // Open the profile modal
    profileFormPopup.open();
  });

  // Open add card form
  addCardButton.addEventListener("click", () => {
    // Reset the form fields
    const cardForm = document.querySelector("#cardForm");
    cardForm.reset();

    // Open the add card modal
    addCardFormPopup.open();
  });

  const formValidators = {};
  formElements.forEach((form) => {
    const formId = form.getAttribute("id");
    const validator = new FormValidator(config, form);
    validator.enableValidation();
    formValidators[formId] = validator;
  });
  // Insert year in the footer dynamically
  const currentYear = new Date().getFullYear();
  const footerYear = document.querySelector(".footer__year");
  if (footerYear) {
    footerYear.textContent = currentYear;
  }
});
