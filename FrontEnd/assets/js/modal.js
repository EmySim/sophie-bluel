console.log("modal.js");

import { loadWorks , getCategories, checkUserStatus } from "./script.js";
//import { getWorks } from "./script.js";

// Selecteurs DOM
const token = checkUserStatus();
const triggerModalElements = document.querySelectorAll('.trigger-modal');
const modalWorksModification = document.getElementById("dialog-worksmodification");
const modalboxGallery = document.getElementById("modalbox-gallery");
const modalboxAddPicture = document.getElementById("modalbox-addpicture");
const closingButtons = document.querySelectorAll('.close-modal');
const openModalbox2 = document.getElementById("open-modalbox2");
const backArrow = document.getElementById('back-arrow');
const title = document.getElementById('title');
const categoryDropdownlist = document.getElementById('category-dropdownlist');
const pictureContainer = document.getElementById('picture-container');
const overlay = document.getElementById('overlay');

//Rafraichissement du formulaire
const resetForm = () => {
    fileInput.value = '';
    title.value = '';
    categoryDropdownlist.selectedIndex = 0;

    const uploadedImg = pictureContainer.querySelector('#uploaded-img');
    if (uploadedImg) {
        pictureContainer.removeChild(uploadedImg);
    }
};

//Gestion ouverture et fermeture modales
const showOverlay = () => overlay.style.display = 'block';
const hideOverlay = () => overlay.style.display = 'none';

const openModal = (galleryDisplay, addPictureDisplay) => {
    modalWorksModification.style.display = 'block';
    modalboxGallery.style.display = galleryDisplay;
    modalboxAddPicture.style.display = addPictureDisplay;
    showOverlay();
};

const closeModal = () => {
    modalWorksModification.style.display = 'none';
    modalboxAddPicture.style.display = 'none';
    modalboxGallery.style.display = 'none';
    hideOverlay();
    resetForm();
};

// EventListener retour modale 1
backArrow.addEventListener('click', () => {
    closeModal();
    openModal('flex', 'none');
});

//Ouvrir/retourner sur la modale1
triggerModalElements.forEach(element => {
    element.addEventListener('click', () => openModal('flex', 'none'));
});

//ouvrir la modale2
openModalbox2.addEventListener('click', () => openModal('none', 'flex'));

//fermer la modale
closingButtons.forEach(button => button.addEventListener("click", closeModal));

overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        closeModal();
    }
});

//Modale 1 Modalbox Gallery
//Affichage galerie sur la modale
loadWorks().then(data => {
    const modalGallery = document.querySelector('.modal-gallery');
    modalGallery.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const imgElement = document.createElement('img');
        imgElement.src = data[i].imageUrl;
        imgElement.alt = data[i].title;
        imgElement.setAttribute('data-category-id', data[i].categoryId);
        imgElement.setAttribute('data-work-id', data[i].id);

        // créer le bouton delete
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('trash-btn');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can fa-2xs" style="color: #ffffff;"></i>';
        deleteButton.addEventListener('click', function () {
            const workId = data[i].id;
            deleteWork(workId);
        });

        // Créer le wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');
        imageWrapper.appendChild(imgElement);
        imageWrapper.appendChild(deleteButton);
        modalGallery.appendChild(imageWrapper);
    }
})
    .catch(error => {
        alert("la requete Works de la modale Galerie ne peut aboutir", error);
    });

//Effacer le work
async function deleteWork(id) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('La requête DELETE a échoué.');
        }

        alert('Work supprimé avec succès.');
        closeModal();
        loadWorks();
        //a l'emplacement ss les filtres refaire le get work
    } catch (error) {
        alert('Une erreur est survenue lors de la suppression du work.');
    }
}

//Modale 2 Modalbox Addpicture
//Section upload
function createImgContainer(file) {
    const imgContainer = document.getElementById('picture-container');
    const img = document.createElement('img');
    img.id = 'uploaded-img';

    // Placer l'image dans le container
    const paragraphElement = imgContainer.querySelector('p');
    imgContainer.insertBefore(img, paragraphElement);
}

//EventListener pour upload

let fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Veuillez sélectionner un fichier image jpg ou png.');
            this.value = null;
            return;
        }
        if (file.size <= 4194304) { //4MB = 
            createImgContainer(file);
            const img = document.getElementById('uploaded-img');
            const reader = new FileReader();
            reader.onload = function (event) {
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('L\'image ne doit dépasser 4Mo.');
            this.value = null;
        }
    }
});

//Section dropdownlist
getCategories().then(data => {
    const dropdownList = document.getElementById('category-dropdownlist');
    dropdownList.innerHTML = '';

    // option vide
    const emptyOption = document.createElement('option');
    emptyOption.setAttribute('value', ''); // vide
    dropdownList.appendChild(emptyOption);

    // Ajouter les options
    data.forEach(category => {
        const option = document.createElement('option');
        option.setAttribute('data-category-id', category.id);
        option.classList.add('option');
        option.value = category.id;
        option.textContent = category.name;
        dropdownList.appendChild(option);
    });

    //Sélectionner la catégorie
    dropdownList.addEventListener('change', () => {
        const selectedCategoryId = dropdownList.value; //1
        const validerButton = document.getElementById('valider-js');
        if (selectedCategoryId) {
            validerButton.disabled = false;
        } else {
            validerButton.disabled = true;
        }
    });

}).catch(error => {
    console.error("la requete Categories de la modale Addpicture ne peut aboutir", error);
});

// EventListener pour soumission formulaire
document.querySelector('.add-work-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // récupérer le fichier choisi
    const fileinput = document.getElementById('fileInput')
    const title = document.getElementById('title').value;
    const category = document.getElementById('category-dropdownlist').value;

    //creation du formulaire  
    const formData = new FormData();
    const fileData = fileinput.files[0];

    // Ajout des fichier au formdata
    formData.append('image', fileData, fileData.name);
    formData.append('title', title);
    formData.append('category', category);

    //envoi du formulaire
    async function postWork(token) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            })

            if (response.ok) {
                alert('Work mis à jour');
                closeModal();
                loadWorks();
                //a l'emplacement ss les filtres refaire le get work
            } else {
                alert('Work non mis à jour');
            }
        } catch (error) {
            console.error('Erreur soumission formulaire', error);
        }
    }
    if (token) {
        postWork(token);
    }
});