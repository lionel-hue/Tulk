document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotPasswordForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("forgot-email").value

    if (!email) {
      alert("Veuillez entrer votre email")
      return
    }

    const resetData = {
      email: email,
    }

    console.log("[v0] Demande de réinitialisation:", resetData)

    alert("Un lien de réinitialisation a été envoyé à votre email !")
    setTimeout(() => {
      window.location.href = "login.html"
    }, 2000)
  })
})
