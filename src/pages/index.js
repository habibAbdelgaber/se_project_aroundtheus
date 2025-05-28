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
  const profileNameInput = profileForm.elements["name"];
  const profileDescriptionInput = profileForm.elements["description"];

  const formValidators = {};
  formElements.forEach((form) => {
    const formId = form.getAttribute("id");
    const validator = new FormValidator(config, form);
    validator.enableValidation();
    formValidators[formId] = validator;
  });

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
      // Close the popup after updating user info
      profileFormPopup.close();
    }
  );
  profileFormPopup.setEventListeners();

  // // PopupWithForm: card creation form
  const addCardFormPopup = new PopupWithForm(".modal_type_card", (formData) => {
    // section.addItem(newCard.generateCard());
    renderer({
      name: formData.title,

      link: formData.imageUrl,
    });
    // Reset the form after adding the card
    formValidators["cardForm"].resetValidation();
    // Close the popup after adding the card
    addCardFormPopup.close();
  });
  addCardFormPopup.setEventListeners();

  // Open profile form along with pre-filling data
  profileEditButton.addEventListener("click", () => {
    const userData = userInfo.getUserInfo();

    // Pre-fill the form with current user data
    profileNameInput.value = userData.name;
    profileDescriptionInput.value = userData.description;

    // Reset validation state
    formValidators["profileForm"].resetValidation();
    // Open the profile modal
    profileFormPopup.open();
  });

  // Open add card form
  addCardButton.addEventListener("click", () => {
    // Open the add card modal
    addCardFormPopup.open();
  });

  // Insert year in the footer dynamically
  const currentYear = new Date().getFullYear();
  const footerYear = document.querySelector(".footer__year");
  if (footerYear) {
    footerYear.textContent = currentYear;
  }
});
