import { loadData } from "./script.js";

let fileInput = document.getElementById('fileInput');

// Définition des éléments
const triggerModalElements = document.querySelectorAll('.trigger-modal');
const modalWorksModification = document.getElementById("dialog-worksmodification");
const modalboxGallery = document.getElementById("modalbox-gallery");
const modalboxAddPicture = document.getElementById("modalbox-addpicture");
const closingButtons = document.querySelectorAll('.close-modal');
const openModalbox2 = document.getElementById("open-modalbox2");
const token = localStorage.getItem('token');


//Fonction ouverture et fermeture modales
function showOverlay() {
    document.getElementById("overlay").style.display = 'block';
}

function hideOverlay() {
    document.getElementById("overlay").style.display = 'none';
}

function openModalboxGallery() {
    // Sélection de la modale 1
    modalWorksModification.style.display = 'block';
    modalboxGallery.style.display = 'flex';
    modalboxAddPicture.style.display = 'none';
    showOverlay();
}

//Selection de la modale 2
function openModalboxAddPicture() {
    modalWorksModification.style.display = 'block';
    modalboxAddPicture.style.display = 'flex';
    modalboxGallery.style.display = 'none';
    showOverlay();
}

//Fermer la modale
function closeModal() {
    modalWorksModification.style.display = 'none';
    modalboxAddPicture.style.display = 'none';
    modalboxGallery.style.display = 'none';
    hideOverlay();

    //Nettoyage du formulaire = > à revoir
    alert('Vos données ne seront pas sauvegardées')
    const imgContainer = document.getElementById('picture-container');
    const uploadedImg = imgContainer.querySelector('#uploaded-img');

    if (uploadedImg) {
        imgContainer.removeChild(uploadedImg);
    }

    const titleInput = document.getElementById('title');
    const categoryDropdown = document.getElementById('category-dropdownlist');

    // Reset champs file
    fileInput.value = '';
    titleInput.value = '';
    categoryDropdown.selectedIndex = 0;
}

// EventListener retour modale 1
const backArrow = document.getElementById('back-arrow');
backArrow.addEventListener('click', function (event) {
    closeModal();
    openModalboxGallery();
});

//Ouvrir/retourner sur la modale1
for (let i = 0; i < triggerModalElements.length; i++) {
    triggerModalElements[i].addEventListener('click', function (event) {
        openModalboxGallery();
    });
}

//ouvrir la modale2
openModalbox2.addEventListener('click', function (event) {
    openModalboxAddPicture();
});

//fermer la modale
closingButtons.forEach(button => {
    button.addEventListener("click", () => {
        closeModal();
    });
});

const overlay = document.getElementById("overlay");
overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
        closeModal();
    }
});

//MODALE 1
function getWorks() {
    fetch('http://localhost:5678/api/works')
        .then(res => res.json())
        .then(data => {
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
                deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
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
            console.log("( ✜︵✜ )la requete Works ne peut aboutir", error);
        });
}
getWorks();

function deleteWork(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('La requête DELETE a échoué.');
            }
            alert('Work supprimé avec succès.');

        })
        .catch(error => {
            alert('Une erreur est survenue lors de la suppression du work.');
        });
}

//MODALE 2
//1 gestion du formulaire
//upload et apercu image
function createImgContainer(file) {
    const imgContainer = document.getElementById('picture-container');
    const img = document.createElement('img');
    img.id = 'uploaded-img';
    img.alt = 'uploaded image';

    // Placer l'image dans le container
    const paragraphElement = imgContainer.querySelector('p');
    imgContainer.insertBefore(img, paragraphElement);
}

//EventListener pour upload
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner un fichier image (jpg, png, etc.).');
            this.value = null; // Reset 
            return;
        }
        if (file.size <= 4194304) { //4MB = 
            createImgContainer(file);
            const img = document.getElementById('uploaded-img');
            //img.src = URL.createObjectURL(file); 
            const reader = new FileReader();
            reader.onload = function (event) {
                img.src = event.target.result;
            };

            reader.readAsDataURL(file);
            console.log('uplodaImg', file)

        } else {
            alert('L\'image ne doit dépasser 4Mo.');
            this.value = null;
            console.log('value1', value)
        }
    }
});

// DropDownList
//recupération des données catégories
function categoryDropdownList() {
    fetch('http://localhost:5678/api/categories', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
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
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}
categoryDropdownList();

// EventListener pour soumission formulaire
document.querySelector('.add-work-form').addEventListener('submit', function (event) {
    console.log('d[-_-]b submit écouteur')
    event.preventDefault();

    // récupérer le fichier choisi
    //const file = fileInput.files[0];
    const file = document.getElementById('fileInput').value;
    const img2send = document.getElementById('uploaded-img');
    const title = document.getElementById('title').value;
    const category = document.getElementById('category-dropdownlist').value;

    if (!file) {
        alert('Image jgp ou png uniquement.');
        return;
    }

    //creation du formulaire  
    const fileinput = document.getElementById('fileInput')
    const formData = new FormData();
    const fileData = fileinput.files[0];
    console.log("(ﾉ◕ヮ◕)ﾉ*" + img2send)
    // Ajout des fichier au formdata
    formData.append('image', fileData, fileData.name);
    formData.append('title', title);
    formData.append('category', category);

    //printFormData(formData);

    //envoi du formulaire
    function postWork(id) {
        fetch(`http://localhost:5678/api/works/`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Work mis à jour');
                    //Reset
                    fileInput.value = null;
                    document.getElementById('title').value = '';
                    document.getElementById('category-dropdownlist').selectedIndex = 0;
                } else {
                    alert('Work non mis à jour');
                }
            })
            .catch(error => {
                console.error('Erreur formulaire', error);
            });
    }  
    postWork();
});
