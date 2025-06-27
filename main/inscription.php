<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Créer un compte | Facebook</title>
  <link rel="stylesheet" href="../assets/css/inscription.css">
</head>
<body>
    <!--logo Facebook en haut -->
    <div class="logo">Facebook</div>
   
    <!-- Formulaire d'inscription -->
    <div class="form-container">
      <h3>Créer un compte</h3>


      <form action="index.php" method="POST" onsubmit="return validateForm()">
        <input type="text" name="first_name" placeholder="Prénom" required>
        <input type="text" name="last_name" placeholder="Nom de famille" required>

        <label for="birthday">Date de naissance</label>
        <div class="birthday">
          <select name="birth_month" required>
            <option>Jan</option><option>Feb</option><option>Mar</option><option>Apr</option>
            <option>May</option><option>Jun</option><option>Jul</option><option>Aug</option>
            <option>Sep</option><option>Oct</option><option>Nov</option><option>Dec</option>
          </select>
          <input type="number" name="birth_day" min="1" max="31" placeholder="Jour" required>
          <input type="number" name="birth_year" min="1900" max="2025" placeholder="Annee" required>
        </div>

        <label>Genre</label>
        <div class="gender">
          <label><input type="radio" name="gender" value="Female" required> Femme</label>
          <label><input type="radio" name="gender" value="Male"> Homme</label>
        </div>

        <input type="email" name="email" placeholder="Numéro mobile ou e-mail" required>
        <input type="password" name="password" placeholder="Nouveau mot-de-passe" required>

        <button type="submit">s'inscrire</button>
      </form>

      <p class="login-link"><a href="seconnecter.php">Vous aviez déja un compte?</a></p>
    </div>
  </div>

</body>
</html>