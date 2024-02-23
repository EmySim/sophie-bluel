console.log('login')
//ajout ecouteur d'événement submit
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const{ email, password } = Object.fromEntries(formData); // Récupérer l'email depuis les données du formulaire
    
    // Envoyer la requête POST vers l'API avec les données du formulaire
    try {
        const res = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }), // Convertir les données en format JSON
            headers: {
                'Accept': 'application/json', //Spécifier le type de contenu accepté
                'Content-Type': 'application/json' // Indiquer que le contenu est JSON
            },
        })

        if (res.status === 200) {
            const responseData = await res.json();// Traiter la réponse, stocker le token dans le stockage local
            sessionStorage.setItem('token', responseData.token);
            window.location.href = 'index.html';// Rediriger l'utilisateur vers accueil admin
        } else {
            if (res.status === 401) {
                alert('mot de passe incorrect');
            } else if (res.status === 404) {
                alert('Identifiant inconnu');
            }
        }
    } catch (error) {
        console.error('(︶︹︶) :', error);
    }
});
