document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form data
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    if (!email || !password) {
      alert("Veuillez remplir tous les champs")
      return
    }

    // Prepare login data
    const loginData = {
      email: email,
      mdp: password,
    }

    console.log("[v0] Tentative de connexion:", loginData)

    // Here you would send the data to your backend for authentication
    // For now, we'll just show a success message
    alert("Connexion réussie ! Redirection...")
    window.location.href = "home.html"
  })
})
