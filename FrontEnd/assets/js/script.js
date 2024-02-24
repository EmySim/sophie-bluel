console.log("scriptjs-port");

async function loadData() {
    try {
        const [worksResponse, categoriesResponse] = await Promise.all([
            fetch('http://localhost:5678/api/works').then(res => res.json()),
            fetch('http://localhost:5678/api/categories').then(res => res.json())
        ]);

        displayGallery(worksResponse);
        displayWorks(categoriesResponse);
        checkUserStatus();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function displayGallery(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = "";
    works.forEach(work => {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;

        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.textContent = work.title;
        figcaptionElement.setAttribute('data-category-id', work.categoryId);
        figcaptionElement.setAttribute('data-work-id', work.id);

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);
        gallery.appendChild(figureElement);
    });
}

function displayWorks(categories) {
    const filterButtonsContainer = document.querySelector('.filters');
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.setAttribute('data-category-id', category.id);
        button.classList.add('filter');
        filterButtonsContainer.appendChild(button);
    });

    const filterButtons = document.querySelectorAll('.filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const categoryId = event.target.getAttribute('data-category-id');
            filterImages(categoryId);
            console.log("Listener for categoryId", categoryId);
        });
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

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

function checkUserStatus() {
    const token = sessionStorage.getItem('token');
    if (token) {
        console.log('Utilisateur connecté');
        updateUI('admin');
    } else {
        console.log('Utilisateur déconnecté');
        updateUI('guest');
    }
}

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

loadData();

export { loadData };