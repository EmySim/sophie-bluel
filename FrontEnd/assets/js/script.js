console.log("script.js");

//Chargement des nouvelles données
export async function loadWorks() {
    try {
        const res = await fetch('http://localhost:5678/api/works');
        const data = await res.json();

        const gallery = document.querySelector('.gallery');
        // Supprimez les anciens éléments de la galerie
        gallery.innerHTML = "";

        // Ajoutez les nouveaux éléments à la galerie
        for (let i = 0; i < data.length; i++) {
            const figureElement = document.createElement('figure');
            const imgElement = document.createElement('img');
            imgElement.src = data[i].imageUrl;
            imgElement.alt = data[i].title;

            const figcaptionElement = document.createElement('figcaption');
            figcaptionElement.textContent = data[i].title;
            figcaptionElement.setAttribute('data-category-id', data[i].categoryId);
            figcaptionElement.setAttribute('data-work-id', data[i].id);
            figureElement.appendChild(imgElement);
            figureElement.appendChild(figcaptionElement);
            gallery.appendChild(figureElement);
        }
    } catch (error) {
        alert("Erreur chargement Works");
    }
}

//2)création des filtres Categories
async function getCategories() {
    try {
        const res = await fetch('http://localhost:5678/api/categories');
        const data = await res.json();

        const filterButtonsContainer = document.querySelector('.filters');
        data.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.setAttribute('data-category-id', category.id);
            button.classList.add('filter');
            filterButtonsContainer.appendChild(button);
        });

        const filterButtons = document.querySelectorAll('.filter');

        filterButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                const categoryId = event.target.getAttribute('data-category-id');
                filterImages(categoryId);
            });
        });
        //return data;
    } catch (error) {
        alert("la requete Catégorie ne peut aboutir");
    }
}
getCategories();

function filterImages(categoryId) {
    const gallery = document.querySelector('.gallery');
    const figures = gallery.querySelectorAll('figure');
    figures.forEach(figure => {
        const categoryData = figure.querySelector('figcaption').getAttribute('data-category-id');
        if (categoryId === '0' || categoryData === 'all' || categoryId === categoryData) {
            figure.style.display = 'block';
        } else {
            figure.style.display = 'none';
        }
    });
}


//II Gestion affichage profils Guest / Admin
export function checkUserStatus() {
    const token = sessionStorage.getItem('token');
    if (token) {
        console.log('Utilisateur connecté');
        updateUI('admin');
    } else {
        console.log('Utilisateur déconnecté');
        updateUI('guest');
    }
    return token;
}
checkUserStatus();

function logout() {
    sessionStorage.removeItem('token');
    checkUserStatus();
}

document.getElementById('logoutLink').addEventListener('click', function (event) {
    event.preventDefault();
    logout();
});

function updateUI(userType) {
    const adminFeatures = document.getElementsByClassName('adminfeature-edition');
    const guests = document.getElementsByClassName('guest');

    for (let i = 0; i < adminFeatures.length; i++) {
        adminFeatures[i].style.display = userType === 'admin' ? 'flex' : 'none';
    }

    for (let i = 0; i < guests.length; i++) {
        guests[i].style.display = userType === 'guest' ? 'flex' : 'none';
    }
}
loadWorks();
