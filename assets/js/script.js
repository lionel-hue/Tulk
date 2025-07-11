//Le fonctionnement de resultats des recherches
const searchInput = document.getElementById('searchInput');
const searchTooltip = document.getElementById('searchTooltip');

if (searchInput && searchTooltip) {
  searchInput.addEventListener('input', function() {
    if (this.value.length > 0) {
      searchTooltip.style.display = 'block';
    } else {
      searchTooltip.style.display = 'none';
    }
  });

  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchTooltip.contains(e.target)) {
      searchTooltip.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
    // Sélection des champs
    const prenom = document.getElementById("prenom");
    const nom = document.getElementById("nom");
    const email = document.getElementById("email");
    const motdepasse = document.getElementById("motdepasse");
    const div = document.querySelector(".email");
    const passwordInfo = document.querySelector(".password-info");

    // Validation du prénom
    prenom.addEventListener("change", function() {
        const prenomValue = prenom.value.trim();
        if (!/^[A-Za-zÀ-ÿ\- ]+$/.test(prenomValue)) {
            prenom.setCustomValidity("Le prénom ne doit contenir que des lettres.");
            prenom.reportValidity();
        } else {
            prenom.setCustomValidity("");
        }
    });

    // Validation du nom
    nom.addEventListener("change", function() {
        const nomValue = nom.value.trim();
        if (!/^[A-Za-zÀ-ÿ\- ]+$/.test(nomValue)) {
            nom.setCustomValidity("Le nom ne doit contenir que des lettres.");
            nom.reportValidity();
        } else {
            nom.setCustomValidity("");
        }
    });

    // Validation de l'email
    email.addEventListener("change", function() {
        const emailValue = email.value.trim();
        const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (test.test(emailValue)) {
            div.innerHTML = "<span class='text-success'>Email valide</span>";
            email.setCustomValidity("");
        } else {
            div.innerHTML = "<span class='text-danger'>Email invalide</span>";
            email.setCustomValidity("Email invalide");
            email.reportValidity();
        }
    });

    // Validation du mot de passe
    motdepasse.addEventListener("change", function() {
        const motdepasseValue = motdepasse.value;
        if (motdepasseValue.length >= 8) {
            passwordInfo.innerHTML = "<span class='text-success'>Mot de passe valide</span>";
            motdepasse.setCustomValidity("");
        } else {
            passwordInfo.innerHTML = "<span class='text-danger'>Le mot de passe doit contenir au moins 8 caractères.</span>";
            motdepasse.setCustomValidity("Le mot de passe doit contenir au moins 8 caractères.");
            motdepasse.reportValidity();
        }
    });
});
