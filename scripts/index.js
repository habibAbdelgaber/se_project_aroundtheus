// DOM Elements - Modal Related
const modals = document.querySelectorAll(".modal");
const profileModal = document.querySelector(".modal-profile");
const cardModal = document.querySelector(".modal-card");
const imageModal = document.querySelector(".modal-image");
const profileEditButton = document.querySelector(".content__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const closeModalButtons = document.querySelectorAll(".modal__close-button");

// Form Elements - with unified class names
const profileForm = profileModal?.querySelector(".form");
const cardForm = cardModal?.querySelector(".form");
const profileNameInput = document.querySelector(".form__input-name");
const profileDescriptionInput = document.querySelector(
  ".form__input-description"
);
const profileName = document.querySelector(".content__title");
const profileDescription = document.querySelector(".content__description");

// Image Popup Elements
const modalImage = document.querySelector(".modal__image");
const modalCaption = document.querySelector(".modal__caption");

// Cards Elements
const cardTemplate = document.querySelector("#card-template").content;
const cardsList = document.querySelector(".cards__list");
const emptyCardState = document.querySelector(".empty-state");

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

// Current cards data
let cards = [...initialCards];

// Universal Modal Functions
function openModal(modal) {
  // Check if modal exists before trying to access it
  if (!modal) {
    console.error("Modal element is null or undefined");
    return;
  }

  modal.classList.add("modal_opened");
  document.querySelector(".page").classList.add("hidden");
  document.addEventListener("keydown", handleEscKey);
}

function closeModal(modal) {
  // Check if modal exists before trying to access it
  if (!modal) {
    console.error("Modal element is null or undefined");
    return;
  }

  modal.classList.remove("modal_opened");
  document.querySelector(".page").classList.remove("hidden");

  if (!document.querySelector(".modal_opened")) {
    document.removeEventListener("keydown", handleEscKey);
  }
}

function handleEscKey(e) {
  if (e.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Profile Functions
function fillProfileForm() {
  if (
    !profileNameInput ||
    !profileDescriptionInput ||
    !profileName ||
    !profileDescription
  ) {
    console.error("One or more profile elements is missing");
    return;
  }

  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
}

function handleProfileFormSubmit(e) {
  e.preventDefault();

  // Get inputs directly from the submitted form
  const form = e.target;
  const nameInput = form.querySelector(".form__input-name");
  const descriptionInput = form.querySelector(".form__input-description");

  if (!profileName || !profileDescription || !nameInput || !descriptionInput) {
    console.error("One or more profile elements is missing");
    return;
  }

  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;

  if (profileModal) {
    closeModal(profileModal);
  }

  // Clear inputs after submission
  form.reset();
}

// Card Functions
function createCardElement(data) {
  if (!cardTemplate) {
    console.error("Card template is missing");
    return null;
  }

  const cardElement = cardTemplate.cloneNode(true);
  const cardItem = cardElement.querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete");

  if (!cardItem || !cardImage || !cardTitle || !likeButton || !deleteButton) {
    console.error("One or more card elements is missing");
    return null;
  }

  cardItem.setAttribute(
    "data-id",
    data.id || `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  );

  cardImage.src = data.link;
  cardImage.alt = `Scenic view of ${data.name} landscape`;
  cardTitle.textContent = data.name;

  if (data.liked) {
    likeButton.classList.add("card__like-button_active");
  }

  // Event Listeners
  cardImage.addEventListener("click", () =>
    openImagePopup(data.link, data.name)
  );
  likeButton.addEventListener("click", handleLikeClick);
  deleteButton.addEventListener("click", handleDeleteClick);

  return cardElement;
}

function handleLikeClick(e) {
  e.target.classList.toggle("card__like-button_active");

  const card = e.target.closest(".card");
  if (!card) return;

  const cardId = card.getAttribute("data-id");
  if (!cardId) return;

  const cardIndex = cards.findIndex((item) => item.id === cardId);
  if (cardIndex !== -1) {
    cards[cardIndex].liked = e.target.classList.contains(
      "card__like-button_active"
    );
  }
}

function handleDeleteClick(e) {
  const card = e.target.closest(".card");
  if (!card) return;

  const cardId = card.getAttribute("data-id");

  card.classList.add("card__fade-out");

  setTimeout(() => {
    card.remove();

    if (cardsList && cardsList.querySelectorAll(".card").length === 0) {
      if (emptyCardState) emptyCardState.classList.add("empty");
    }
  }, 300);

  cards = cards.filter((item) => item.id !== cardId);
}

function handleCardFormSubmit(e) {
  e.preventDefault();

  // Get inputs from the form that was submitted
  const form = e.target;
  const titleInput = form.querySelector("#title");
  const urlInput = form.querySelector("#imageUrl");

  if (!titleInput || !urlInput) {
    console.error("Title or URL input is missing");
    return;
  }

  if (!titleInput.value.trim() || !urlInput.value.trim()) {
    alert("Please fill in all fields");
    return;
  }

  const newCard = {
    name: titleInput.value,
    link: urlInput.value,
    liked: false,
    id: `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  };

  cards.unshift(newCard);

  const cardElement = createCardElement(newCard);
  if (!cardElement) return;

  if (cardsList && cardsList.children.length > 0) {
    cardsList.insertBefore(cardElement, cardsList.firstChild);
  } else if (cardsList) {
    cardsList.appendChild(cardElement);
  }

  if (emptyCardState) emptyCardState.classList.remove("empty");

  if (cardModal) {
    closeModal(cardModal);
  }

  // Clear inputs after submission
  form.reset();
}

function renderCards() {
  if (!cardsList) {
    console.error("Cards list element is missing");
    return;
  }

  cardsList.innerHTML = "";

  if (cards.length === 0) {
    if (emptyCardState) emptyCardState.classList.add("empty");
  } else {
    if (emptyCardState) emptyCardState.classList.remove("empty");

    cards.forEach((cardData) => {
      const cardElement = createCardElement(cardData);
      if (cardElement) cardsList.appendChild(cardElement);
    });
  }
}

// Image Popup Function
function openImagePopup(src, caption) {
  if (!modalImage || !modalCaption) {
    console.error("Image modal elements are missing");
    return;
  }

  // Set src value only when opening the modal
  modalImage.src = src;
  modalImage.alt = `Full size view of ${caption}`;
  modalCaption.textContent = caption;

  if (!imageModal) {
    console.error("Image modal is missing");
    return;
  }

  // Small delay to ensure image loads properly
  setTimeout(() => {
    openModal(imageModal);
  }, 10);
}

// Debug function to check if all necessary elements exist
function checkElements() {
  console.log({
    profileModal,
    cardModal,
    imageModal,
    profileEditButton,
    addCardButton,
    closeModalButtons,
    profileForm,
    cardForm,
    profileNameInput,
    profileDescriptionInput,
    profileName,
    profileDescription,
    modalImage,
    modalCaption,
    cardTemplate,
    cardsList,
    emptyCardState,
  });
}

// Set up event listeners - only if elements exist
// Modal close buttons
if (closeModalButtons.length > 0) {
  closeModalButtons.forEach((button) => {
    const modal = button.closest(".modal");
    if (modal) {
      button.addEventListener("click", () => closeModal(modal));
    }
  });
}

// Close on backdrop click
if (modals.length > 0) {
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
}

// Open modals
if (profileEditButton) {
  profileEditButton.addEventListener("click", () => {
    fillProfileForm();
    if (profileModal) {
      openModal(profileModal);
    }
  });
}

if (addCardButton) {
  addCardButton.addEventListener("click", () => {
    if (cardModal) {
      openModal(cardModal);
    }
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  if (profileModal) {
    const profileFormInModal = profileModal.querySelector(".form");
    if (profileFormInModal) {
      // Set up event listener directly on the form element
      profileFormInModal.addEventListener("submit", handleProfileFormSubmit);
    }
  }

  if (cardModal) {
    const cardFormInModal = cardModal.querySelector(".form");
    if (cardFormInModal) {
      // Set up event listener directly on the form element
      cardFormInModal.addEventListener("submit", handleCardFormSubmit);
    }
  }

  // Debug to check all elements
  checkElements();

  renderCards();
  fillProfileForm();
});
