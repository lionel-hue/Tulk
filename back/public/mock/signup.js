document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm")
  const stages = document.querySelectorAll(".form-stage")
  const steps = document.querySelectorAll(".step")
  const imageInput = document.getElementById("image")
  const imagePreview = document.getElementById("imagePreview")
  const appLogo = document.getElementById("appLogo")

  let currentStage = 1
  const totalStages = 4

  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        imagePreview.innerHTML = `<img src="${event.target.result}" alt="Aperçu">`
        imagePreview.classList.add("show")
      }
      reader.readAsDataURL(file)
    } else {
      imagePreview.classList.remove("show")
      imagePreview.innerHTML = ""
    }
  })

  const firstInput = document.querySelector('input[id="nom"]')
  firstInput.addEventListener("focus", () => {
    appLogo.classList.add("move-to-side")
  })

  function updateStage() {
    stages.forEach((stage, index) => {
      stage.classList.remove("active")
      if (index + 1 === currentStage) {
        stage.classList.add("active")
      }
    })

    steps.forEach((step, index) => {
      step.classList.remove("active", "completed")
      if (index + 1 === currentStage) {
        step.classList.add("active")
      } else if (index + 1 < currentStage) {
        step.classList.add("completed")
      }
    })
  }

  function validateStage() {
    const currentStageElement = document.querySelector(`.form-stage[data-stage="${currentStage}"]`)
    const requiredInputs = currentStageElement.querySelectorAll("input[required]")

    for (const input of requiredInputs) {
      if (!input.value.trim()) {
        input.focus()
        showCustomAlert("Erreur", "Veuillez remplir tous les champs obligatoires")
        return false
      }
    }

    if (currentStage === 2) {
      const password = document.getElementById("mdp").value
      const confirmPassword = document.getElementById("confirmMdp").value

      if (password !== confirmPassword) {
        showCustomAlert("Erreur", "Les mots de passe ne correspondent pas")
        return false
      }

      if (password.length < 6) {
        showCustomAlert("Erreur", "Le mot de passe doit contenir au moins 6 caractères")
        return false
      }
    }

    if (currentStage === 4) {
      const verificationCode = document.getElementById("verificationCode").value
      if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
        showCustomAlert("Erreur", "Veuillez entrer un code de vérification valide à 6 chiffres")
        return false
      }
    }

    return true
  }

  function showCustomAlert(title, message) {
    alert(`${title}: ${message}`)
  }

  document.getElementById("nextBtn1").addEventListener("click", () => {
    if (validateStage()) {
      currentStage++
      updateStage()
    }
  })

  document.getElementById("prevBtn2").addEventListener("click", () => {
    currentStage--
    updateStage()
  })

  document.getElementById("nextBtn2").addEventListener("click", () => {
    if (validateStage()) {
      currentStage++
      updateStage()
    }
  })

  document.getElementById("prevBtn3").addEventListener("click", () => {
    currentStage--
    updateStage()
  })

  document.getElementById("nextBtn3").addEventListener("click", () => {
    if (validateStage()) {
      // Simulate sending verification code
      showCustomAlert("Code envoyé", "Un code de vérification a été envoyé à votre email !")
      currentStage++
      updateStage()
    }
  })

  document.getElementById("prevBtn4").addEventListener("click", () => {
    currentStage--
    updateStage()
  })

  document.getElementById("resendCodeBtn").addEventListener("click", () => {
    showCustomAlert("Code renvoyé", "Un nouveau code de vérification a été envoyé à votre email !")
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!validateStage()) {
      return
    }

    const sexeInput = document.querySelector('input[name="sexe"]:checked')

    const userData = {
      nom: document.getElementById("nom").value,
      prenom: document.getElementById("prenom").value || null,
      email: document.getElementById("email").value,
      mdp: document.getElementById("mdp").value,
      sexe: sexeInput ? sexeInput.value : null,
      verificationCode: document.getElementById("verificationCode").value,
    }

    console.log("[v0] Inscription réussie:", userData)

    alert("Compte créé avec succès ! Redirection vers la page de connexion...")
    window.location.href = "login.html"
  })

  // Initialize
  updateStage()
})
