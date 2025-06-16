// CSS
import "../pages/index.css";

// Components
import APIClient from "../components/APICliend.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithConfirm from "../components/PopupWithConfirm.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";

// Utilities
import { handleImageClick } from "../utils/utils.js";

// Constants
import {
  CARD_TEMPLATE_SELECTOR,
  CARD_LIST_SELECTOR,
  config,
} from "../constants/domSelectors.js";
import { API_BASE_URL, AUTH_TOKEN } from "../constants/constants.js";

// Main
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const profileEditButton = document.querySelector(".content__edit-button");
  const addCardButton = document.querySelector(".profile__add-button");
  const profilePicture = document.querySelector(".profile__image");
  const updateUserAvatarButton = document.querySelector(
    ".profile__update-avatar-button"
  );

  const formElements = document.querySelectorAll(".form");
  const profileNameInput = profileForm.elements["name"];
  const profileDescriptionInput = profileForm.elements["description"];
  const footerYear = document.querySelector(".footer__year");

  // Set current year in footer
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Form Validation
  const formValidators = {};
  formElements.forEach((form) => {
    const formId = form.getAttribute("id");
    const validator = new FormValidator(config, form);
    validator.enableValidation();
    formValidators[formId] = validator;
  });

  // API Client
  const apiClient = new APIClient({ baseUrl: API_BASE_URL });

  // User Info
  const userInfo = new UserInfo({
    nameSelector: ".content__title",
    descriptionSelector: ".content__description",
  });

  // Fetch User Info
  (async function fetchUserData() {
    try {
      const userData = await apiClient.get("/users/me", {
        headers: { authorization: AUTH_TOKEN },
      });
      userInfo.setUserInfo({
        name: userData.name,
        description: userData.about,
      });
      profilePicture.src = userData.avatar;
      profilePicture.alt = userData.name || "User Avatar";
    } catch (error) {
      console.error(`Error fetching user data: ${error.message}`);
    }
  })();

  // Popups
  const imagePopup = new PopupWithImage(".modal_type_image");
  imagePopup.setEventListeners();

  const deleteCardPopup = new PopupWithConfirm(".modal_type_confirm-delete");
  deleteCardPopup.setEventListeners();

  const updateAvatarPopupForm = new PopupWithForm(
    ".modal_type_update-avatar",
    async (formData) => {
      const avatar = formData.imageUrl?.trim();
      try {
        const updateUserAvatar = await apiClient.patch(
          "/users/me/avatar",
          {
            avatar,
          },
          { headers: { authorization: AUTH_TOKEN } }
        );
        profilePicture.src = updateUserAvatar.avatar;
        profilePicture.alt = "User Avatar";
        updateAvatarPopupForm.close();
      } catch (error) {
        console.error("Failed to update avatar:", error.message);
        throw error;
      }
    }
  );
  updateAvatarPopupForm.setEventListeners();
  // Open Update Avatar Form
  updateUserAvatarButton.addEventListener("click", () => {
    console.log("Opening update avatar form");
    // Reset form validation
    formValidators["updateAvatarForm"].resetValidation();
    updateAvatarPopupForm.open();
  });

  // Renderer
  function renderer(cardData) {
    const card = new Card({
      data: cardData,
      cardSelector: CARD_TEMPLATE_SELECTOR,
      handleImageClick: (name, link) =>
        handleImageClick(name, link, imagePopup),
      handleDeleteConfirm: (id, element) => {
        deleteCardPopup.open(async () => {
          try {
            await apiClient.delete(`/cards/${id}`, {
              headers: { authorization: AUTH_TOKEN },
            });
            element.remove();
            console.log("This post has been deleted");
          } catch (err) {
            console.error("Failed to delete card:", err.message);
          }
        });
      },
      handleLikeToggle: async (cardId, isliked) => {
        try {
          const method = isliked ? "PUT" : "DELETE";
          const response = await apiClient._request(`/cards/${cardId}/likes`, {
            method,
            headers: { authorization: AUTH_TOKEN },
          });
          return response;
        } catch (error) {
          console.error("Failed to toggle like:", error.message);
          throw error;
        }
      },
    });

    const cardElement = card.generateCard();
    section.addItem(cardElement);
  }

  // Section
  const section = new Section({ items: [], renderer }, CARD_LIST_SELECTOR);

  // Load Initial Cards
  (async function init() {
    try {
      const cards = await apiClient.get("/cards", {
        headers: { authorization: AUTH_TOKEN },
      });
      section.setItems(cards);
      section.renderItems();
    } catch (error) {
      console.error(`Error fetching initial cards: ${error.message}`);
    } finally {
      console.log("Rendering completed");
    }
  })();

  // Popup: Edit Profile
  const profileFormPopup = new PopupWithForm(
    ".modal_type_profile",
    async (formData) => {
      const name = formData.name?.trim();
      const about = formData.description?.trim();

      const originalText = profileFormPopup._submitButton.textContent;
      profileFormPopup._submitButton.textContent = "Saving...";
      profileFormPopup._submitButton.disabled = true;

      try {
        const updatedUser = await apiClient.patch(
          "/users/me",
          { name, about },
          { headers: { authorization: AUTH_TOKEN } }
        );

        userInfo.setUserInfo({
          name: updatedUser.name,
          description: updatedUser.about,
        });
      } catch (error) {
        console.error("Failed to update profile:", error.message);
      } finally {
        profileFormPopup._submitButton.textContent = originalText;
        profileFormPopup._submitButton.disabled = false;
      }
    }
  );
  profileFormPopup.setEventListeners();

  // Popup: Add Card
  const addCardFormPopup = new PopupWithForm(
    ".modal_type_card",
    async (formData) => {
      const name = formData.title?.trim();
      const link = formData.imageUrl?.trim();

      try {
        const createdCard = await apiClient.post(
          "/cards",
          { name, link },
          { headers: { authorization: AUTH_TOKEN } }
        );

        renderer(createdCard);
      } catch (error) {
        console.error("Error creating card:", error.message);
        throw error;
      }
    }
  );
  addCardFormPopup.setEventListeners();

  // Open Profile Edit Form
  profileEditButton.addEventListener("click", () => {
    const userData = userInfo.getUserInfo();
    profileNameInput.value = userData.name;
    profileDescriptionInput.value = userData.description;
    formValidators["profileForm"].resetValidation();
    profileFormPopup.open();
  });

  // Open Add Card Form
  addCardButton.addEventListener("click", () => {
    formValidators["cardForm"].resetValidation();
    addCardFormPopup.open();
  });
});
