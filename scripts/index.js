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

// Card list element container
const cardList = document.querySelector(".cards__list");

// Template element
const cardTemplate = document.querySelector("#card-template").content;

// Function to create a card element from a data object
function getCardElement(data) {
  // Clonimg the template
  const cardElement = cardTemplate.cloneNode(true);

  // Clone the elements inside the card element
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  return cardElement;
}

// Clear existing content
cardList.innerHTML = "";

// Looping through the initial cards and append them to the list
initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  cardList.appendChild(cardElement);
});

// Modal variables
const modal = document.querySelector(".modal");
const profileEditButton = document.querySelector(".content__edit-button");
const closeModalButton = document.querySelector(".modal__close");

function toggleModal() {
  // Toggling modal on and off
  modal.classList.toggle("modal_opened");
}

// Add event listener to open the modal
profileEditButton.addEventListener("click", toggleModal);

// Profile variables
const profileContentTitle = document.querySelector(".content__title");
const profileContentDescription = document.querySelector(
  ".content__description"
);

// Input fields
const formInputName = document.querySelector(".form__input-name");
const formInputDescription = document.querySelector(".form__input-description");

// Profile form
const profileForm = document.forms["profile-form"];

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
