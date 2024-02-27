console.log("login.js");
//ajout ecouteur d'événement submit
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const{ email, password } = Object.fromEntries(formData);
    
    // Envoyer la requête POST vers l'API avec les données du formulaire de connexion
    try {
        const res = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        if (res.status === 200) {
            const responseData = await res.json();
            sessionStorage.setItem('token', responseData.token);
            window.location.href = 'index.html';
        } else {
            if (res.status === 401) {
                alert('mot de passe incorrect');
            } else if (res.status === 404) {
                alert('Identifiant inconnu');
            }
        }
    } catch (error) {
        console.error("la requete Login ne peut aboutir", error);
    }
});
