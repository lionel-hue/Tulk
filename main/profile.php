<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clone Facebook</title>
  <link rel="stylesheet" href="../assets/css/bootstrap.css">
  <link rel="stylesheet" href="profile.css?v=1.1">
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-light">

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
  <div class="container-fluid">
    <a class="navbar-brand d-flex align-items-center" href="#">
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" width="36" height="36" class="me-2">
      Facebook
    </a>
    <form class="d-none d-md-flex ms-3">
      <input class="form-control rounded-pill" type="search" placeholder="Recherche" aria-label="Recherche">
    </form>
    <div class="ms-auto d-flex align-items-center gap-3">
      <i data-lucide="home"></i>
      <i data-lucide="tv"></i>
      <i data-lucide="shopping-cart"></i>
      <i data-lucide="users"></i>
      <i data-lucide="bell"></i>
      <i data-lucide="settings"></i>
      <i data-lucide="user"></i>
    </div>
  </div>
</nav>

<!-- Main Layout -->
<div class="container-fluid mt-3">
  <div class="row">
    <!-- Sidebar gauche -->
    <aside class="col-lg-2 d-none d-lg-block">
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex align-items-center"><i data-lucide="home" class="me-2"></i> Accueil</li>
        <li class="list-group-item d-flex align-items-center"><i data-lucide="file-text" class="me-2"></i> Pages</li>
        <li class="list-group-item d-flex align-items-center"><i data-lucide="users" class="me-2"></i> Groupes</li>
        <li class="list-group-item d-flex align-items-center"><i data-lucide="shopping-cart" class="me-2"></i> Marketplace</li>
        <li class="list-group-item d-flex align-items-center"><i data-lucide="tv" class="me-2"></i> Vidéos</li>
      </ul>
    </aside>

    <!-- Zone principale -->
    <main class="col-lg-7">
      <div class="position-relative bg-white rounded shadow-sm mb-4">
        <!-- Bannière -->
        <div class="profile-banner position-relative">
          <img src="../fend_models/planete 1.jpg" alt="Bannière" class="w-100 rounded-top" style="height: 320px; object-fit: cover;">
          <!-- Photo de profil -->
          <img src="../fend_models/planete 2.jpg" alt="Photo de profil" class="rounded-circle border border-4 border-white position-absolute top-100 start-50 translate-middle" style="width: 160px; height: 160px; object-fit: cover;">
        </div>
        <!-- Infos profil -->
        <div class="text-center mt-5 pt-3">
          <h2 class="fw-bold mb-1">Jean Dupont</h2>
          <button class="btn btn-primary btn-sm">Modifier le profil</button>
        </div>
        <!-- Onglets -->
        <ul class="nav nav-tabs justify-content-center mt-4">
          <li class="nav-item"><a class="nav-link active" href="#">Historique</a></li>
          <li class="nav-item"><a class="nav-link" href="#">À propos</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Amis</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Photos</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Vidéos</a></li>
        </ul>
        <!-- Zone de post -->
        <div class="bg-light p-3 rounded-bottom">
          <div class="mb-3">
            <input type="text" class="form-control rounded-pill" placeholder="Quoi de neuf, Jean ?">
          </div>
          <!-- Exemple de post -->
          <div class="card mb-2">
            <div class="card-body">
              <div class="d-flex align-items-center mb-2">
                <img src="../fend_models/planete 2.jpg" class="rounded-circle me-2" width="40" height="40">
                <div>
                  <strong>Jean Dupont</strong><br>
                  <small class="text-muted">il y a 2 h</small>
                </div>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div>
                <button class="btn btn-light btn-sm"><i data-lucide="thumbs-up"></i> Ajouter</button>
                <button class="btn btn-light btn-sm"><i data-lucide="message-circle"></i> Ajouter</button>
                <button class="btn btn-light btn-sm"><i data-lucide="share-2"></i> Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Sidebar droite -->
    <aside class="col-lg-3 d-none d-lg-block">
      <div class="bg-white rounded shadow-sm p-3 mb-3">
        <h5>Votre story</h5>
        <img src="../fend_models/planete 1.jpg" class="img-fluid rounded mb-2">
        <div><small>Anniversaires</small><br><span class="text-danger">Laura fête jour!</span></div>
      </div>
      <div class="bg-white rounded shadow-sm p-3">
        <h6>Personnes qui pourraient vous connaître</h6>
        <ul class="list-unstyled">
          <li class="d-flex align-items-center mb-2">
            <img src="../fend_models/planete 2.jpg" class="rounded-circle me-2" width="36" height="36">
            <span>Thomas Lefevro</span>
            <button class="btn btn-link btn-sm ms-auto">Ajouter</button>
          </li>
          <!-- Ajoute d'autres suggestions ici -->
        </ul>
        <h6>Contacts</h6>
        <ul class="list-unstyled">

          <li class="d-flex align-items-center mb-2">
            <img src="../fend_models/planete 2.jpg" class="rounded-circle me-2" width="28" height="28">
            <span>Lucie</span>
            <span class="badge bg-success ms-auto rounded-circle" style="width:10px;height:10px;">&nbsp;</span>
          </li>

          <li class="d-flex align-items-center mb-2">
            <img src="../fend_models/planete 2.jpg" class="rounded-circle me-2" width="28" height="28">
            <span>Marc</span>
            <span class="badge bg-success ms-auto rounded-circle" style="width:10px;height:10px;">&nbsp;</span>
          </li>

          <li class="d-flex align-items-center mb-2">
            <img src="../fend_models/planete 2.jpg" class="rounded-circle me-2" width="28" height="28">
            <span>Émilie</span>
            <span class="badge bg-success ms-auto rounded-circle" style="width:10px;height:10px;">&nbsp;</span>
          </li>

          <li
          $*
           class="d-flex align-items-center mb-2">
            <img src="../fend_models/planete 2.jpg" class="rounded-circle me-2" width="28" height="28">
            <span>Antoine</span>
            <span class="badge bg-success ms-auto rounded-circle" style="width:10px;height:10px;">&nbsp;</span>
          </li>
          <!-- Ajoute d'autres contacts ici -->
        </ul>
      </div>
    </aside>
  </div>
</div>

<script src="../assets/js/bootstrap.js"></script>
<script>
  lucide.createIcons();
</script>
</body>
</html>