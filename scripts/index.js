// DOM Elements
const openModalBtn = document.querySelector("#openModal");
const closeModalBtn = document.querySelector("#closeModal");
const modal = document.querySelector(".modal");
const placeForm = document.querySelector("#placeForm");
const cardsList = document.querySelector("#cardsList");
const cardTemplate = document.querySelector("#card-template").content;
const emptyState = document.querySelector("#emptyState");

// Image popup elements
const imagePopup = document.querySelector("#imagePopup");
const popupImage = document.querySelector("#popupImage");
const popupClose = document.querySelector("#popupClose");
const popupCaption = document.querySelector("#popupCaption");

// Sample initial cards data (for testing)
let initialCards = [];

// Load cards from local storage or use initial cards if none exist
function loadCards() {
  const savedCards = localStorage.getItem("cards");
  if (savedCards) {
    return JSON.parse(savedCards);
  }
  return initialCards;
}

// Save cards to local storage
function saveCards(cards) {
  localStorage.setItem("cards", JSON.stringify(cards));
}

// Current cards data
let cards = loadCards();

// Function to create a card element from data
function createCardElement(data) {
  // Cloning the template to get the template content
  const cardElement = cardTemplate.cloneNode(true);

  // Get elements from the cloned template
  const cardItem = cardElement.querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete");

  // Set card data
  if (cardImage) {
    cardImage.src = data.link;
    cardImage.alt = data.name;

    // Add click event to open the image popup
    cardImage.addEventListener("click", () => {
      openImagePopup(data.link, data.name);
    });
  }

  if (cardTitle) {
    cardTitle.textContent = data.name;
  }

  // Set unique ID for the card
  if (cardItem) {
    cardItem.setAttribute("data-id", data.id);
  }

  // Set like button state if card is liked
  if (likeButton && data.liked) {
    likeButton.classList.add("active");
  }

  // Add event listeners
  if (likeButton) {
    likeButton.addEventListener("click", handleLikeClick);
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", handleDeleteClick);
  }

  return cardElement;
}

// Handle like button click
function handleLikeClick(event) {
  const likeButton = event.target;
  likeButton.classList.toggle("active");

  // Update card data
  const card = likeButton.closest(".card");
  if (!card) return;

  const cardId = card.getAttribute("data-id");
  if (!cardId) return;

  // Find and update the card in our data
  const cardIndex = cards.findIndex((item) => item.id === cardId);
  if (cardIndex !== -1) {
    cards[cardIndex].liked = likeButton.classList.contains("active");
    saveCards(cards);
  }
}

// Handle delete button click
function handleDeleteClick(event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const cardId = card.getAttribute("data-id");
  if (!cardId) return;

  // Remove from DOM with animation
  card.style.opacity = 0;
  card.style.transition = "opacity 0.3s ease-in-out";

  setTimeout(() => {
    if (card.parentNode) {
      card.parentNode.removeChild(card);
    }

    // Check if we need to show empty state
    if (cardsList.querySelectorAll(".card").length === 0) {
      emptyState.style.display = "block";
    }
  }, 300);

  // Remove from data
  cards = cards.filter((item) => item.id !== cardId);
  saveCards(cards);
}

// Render all cards
function renderCards() {
  // Clear existing cards
  while (cardsList.firstChild) {
    cardsList.removeChild(cardsList.firstChild);
  }

  // Show empty state if no cards
  if (cards.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";

    // Add all cards
    cards.forEach((cardData) => {
      const cardElement = createCardElement(cardData);
      cardsList.appendChild(cardElement);
    });
  }
}

// Image popup functions
function openImagePopup(src, caption) {
  popupImage.src = src;
  popupCaption.textContent = caption;
  imagePopup.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closeImagePopup() {
  imagePopup.classList.remove("active");
  document.body.style.overflow = "auto"; // Re-enable scrolling

  // Clear the src after transition to prevent potential memory issues
  setTimeout(() => {
    if (!imagePopup.classList.contains("active")) {
      popupImage.src = "";
    }
  }, 300);
}

// Add event listeners for the image popup
popupClose.addEventListener("click", closeImagePopup);

// Close on click outside the image
imagePopup.addEventListener("click", (e) => {
  if (e.target === imagePopup) {
    closeImagePopup();
  }
});

// Close on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && imagePopup.classList.contains("active")) {
    closeImagePopup();
  }
});

// Initial render
renderCards();

// Modal functions
// Open modal
openModalBtn.addEventListener("click", () => {
  document.body.style.overflow = "hidden";
  modal.classList.remove("hidden");
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  closeModal();
});

// Close modal if clicking outside of modal content
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal function
function closeModal() {
  modal.classList.add("hidden");

  // Wait for the transition to complete before resetting
  setTimeout(() => {
    document.body.style.overflow = "auto";
    placeForm.reset();
  }, 300);
}

// Form submission - add new card
placeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const title = document.getElementById("title").value;
  const imageUrl = document.getElementById("imageUrl").value;

  // Validate input (basic validation)
  if (!title.trim() || !imageUrl.trim()) {
    alert("Please fill in all fields");
    return;
  }

  // Create new card data
  const newCard = {
    name: title,
    link: imageUrl,
    liked: false,
    id: "card-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
  };

  // Add to cards array
  cards.unshift(newCard); // Add to beginning of array
  saveCards(cards);

  // Create and add card element
  const cardElement = createCardElement(newCard);

  // Add the new card to the DOM
  if (cardsList.children.length > 0) {
    cardsList.insertBefore(cardElement, cardsList.firstChild);
  } else {
    cardsList.appendChild(cardElement);
  }

  // Hide empty state if visible
  emptyState.style.display = "none";

  // Close the modal
  closeModal();
});

// Close modal on Escape key press
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Profile modal and form
const profileModal = document.querySelector(".profile-modal");
const profileEditButton = document.querySelector(".content__edit-button");
const closeModalButton = document.querySelector(".profile-modal__close");

function toggleModal() {
  // Toggling modal on and off
  profileModal.classList.toggle("profile-modal_opened");
}

// Add event listener to open the modal
profileEditButton.addEventListener("click", toggleModal);

// Profile variables
const profileContentTitle = document.querySelector(".content__title");
const profileContentDescription = document.querySelector(
  ".content__description"
);

// Input fields
const formInputName = document.querySelector(".profile-form__input-name");
const formInputDescription = document.querySelector(
  ".profile-form__input-description"
);

// Profile form
const profileForm = document.forms["profileForm"];

// Function to get the input fields with the current profile data
function getProfileData() {
  formInputName.value = profileContentTitle.textContent;
  formInputDescription.value = profileContentDescription.textContent;
}

// Function to update the profile when form is submitted
function updateProfileData(event) {
  event.preventDefault();

  profileContentTitle.textContent = formInputName.value;
  profileContentDescription.textContent = formInputDescription.value;
  toggleModal(); // Close the modal after updating the profile data
}

// Get the form fields when the form is opened
document.addEventListener("DOMContentLoaded", getProfileData);

// Add event listener to form submission
profileForm.addEventListener("submit", updateProfileData);
closeModalButton.addEventListener("click", toggleModal);
