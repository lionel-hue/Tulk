<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Accueil Facebook Clone</title>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
    <link rel = "stylesheet" href="./assets/css/style.css" />
    <link rel="stylesheet" href="./assets/css/bootstrap.css">
    <link rel="stylesheet" href="./assets/css/profile.css">
    <link rel="stylesheet" href="./assets/css/chat.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="./assets/css/like.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,700">
    <link rel="stylesheet" href="./assets/css/commentaire.css">
    <link rel="stylesheet" href="./assets/css/amis.css">
    <script src="./assets/js/like.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="./assets/js/commentaire.js"></script>
</head> 
<body>
        <main>
            <div class="d-flex">        
            <!-- Main Content -->
            <div class="flex-grow-1">
                <!-- Top Bar -->
                <div class="d-flex justify-content-between align-items-center bg-white px-4 py-2 border-bottom">
                    <div class="d-flex align-items-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" width="40" class="me-3">

                        <input id="searchInput" type="text" class="form-control" style="width: 250px;" placeholder="Search Facebook">

                        <div id="searchTooltip" class="search-tooltip" style="display: none;">
                            <div class="search-suggestion">John Doe</div>
                            <div class="search-suggestion">Jane Smith</div>
                            <div class="search-suggestion">Groups about Coding</div>
                        </div>
                    </div>
                    <div>

                        <a href="index.php?page=accueil"><i class="fa fa-home nav-icon mx-3"></i></a>   
                         <a href='index.php?page=amis'><i class="fa fa-users nav-icon mx-3"></i></a>
                        <a href='index.php?page=chat'> <i class="fa fa-comments nav-icon mx-3"></i> </a>
                    </div>
                    <div>
                        <button class="btn btn-primary me-2">Find friends</button>
                    </div>
                </div>
                
                <?php 

                if( isset($_REQUEST["page"]) && !empty( $_REQUEST["page"] )  ){

                    switch( $_REQUEST["page"] ){

                        case "acceuil" : include("api/acceuil.php");
                        break;

                        case "amis" : include("api/amis.php");
                        break;

                        case "profile" : include("api/profile.php");
                        break;

                        case "chat" : include("api/chat.php");
                        break;

                        default : include("api/acceuil.php");
                    }
                }else include("api/acceuil.php");
                ?>
            </div>
        </div>
<<<<<<< HEAD
    </main>        
=======
    </main>      
    <script src="./assets/js/script.js"></script>   
>>>>>>> amis
</body>
</html>