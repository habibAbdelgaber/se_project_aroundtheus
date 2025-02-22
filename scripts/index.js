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

const cardList = document.querySelector(".cards__list");
cardList.innerHTML = "";

for (let card of initialCards) {
  const cardElement = document.createElement("li");
  cardElement.classList.add("card");

  cardElement.innerHTML = `
    <img src="${card.link}" alt="${card.name}" class="card__image" />
    <div class="card__footer">
      <h3 class="card__title">${card.name}</h3>
      <button class="card__like-button"></button>
    </div>
  `;

  cardList.appendChild(cardElement);
}

// Add event listener to open and close modal buttons

// Modal Functionality
const modal = document.querySelector(".modal");
const profileEditButton = document.querySelector(".content__edit-button");
const closeModalButton = document.querySelector(".modal__close");

profileEditButton.addEventListener("click", () => {
  modal.style.display = "block";
});

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});
