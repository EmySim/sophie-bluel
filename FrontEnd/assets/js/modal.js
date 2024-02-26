console.log("modal26");
//import { loadData, getWorks, getCategories, checkUserStatus } from "./script";

let fileInput = document.getElementById('fileInput');

// Définition des éléments
const token = localStorage.getItem('token');
const triggerModalElements = document.querySelectorAll('.trigger-modal');
const modalWorksModification = document.getElementById("dialog-worksmodification");
const modalboxGallery = document.getElementById("modalbox-gallery");
const modalboxAddPicture = document.getElementById("modalbox-addpicture");
const closingButtons = document.querySelectorAll('.close-modal');
const openModalbox2 = document.getElementById("open-modalbox2");
//?const overlay = document.getElementById("overlay");
const backArrow = document.getElementById('back-arrow');

//Gestion ouverture et fermeture modales
const showOverlay = () => overlay.style.display = 'block';
const hideOverlay = () => overlay.style.display = 'none';

const openModalboxGallery = () => {
    modalWorksModification.style.display = 'block';
    modalboxGallery.style.display = 'flex';
    modalboxAddPicture.style.display = 'none';
    showOverlay();
};

const openModalboxAddPicture = () => {
    modalWorksModification.style.display = 'block';
    modalboxAddPicture.style.display = 'flex';
    modalboxGallery.style.display = 'none';
    showOverlay();
};

const closeModal = () => {
    modalWorksModification.style.display = 'none';
    modalboxAddPicture.style.display = 'none';
    modalboxGallery.style.display = 'none';
    hideOverlay();
};
    
// EventListener retour modale 1
backArrow.addEventListener('click', () => {
    closeModal();
    openModalboxGallery();
});

//Ouvrir/retourner sur la modale1
for (let element of triggerModalElements) {
    element.addEventListener('click', openModalboxGallery);
}

//ouvrir la modale2
openModalbox2.addEventListener('click', openModalboxAddPicture); 

//fermer la modale
closingButtons.forEach(button => button.addEventListener("click", closeModal));

overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        closeModal();
    }
});

//Modale 1
