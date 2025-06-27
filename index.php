<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Accueil Facebook Clone</title>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
    <link rel = "stylesheet" href="../assets/css/style.css" />
    <link rel="stylesheet" href="../assets/css/bootstrap.css">
    <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/css/profile.css">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="../assets/js/script.js"></script>
</head>
<body>
    <main>
        <div class="d-flex">
            <!-- Sidebar -->
            <div class="sidebar p-3 vh-100 border-end">
                <div class="d-flex align-items-center mb-4 bg-white p-2">
                    <img src="../assets/images/lionel.PNG" class="rounded-circle me-2" alt="." style="width:10%;" />
                    <b> Lionel Sisso </b>
                </div>
                
                <!-- Chat section -->
                <div class="d-flex align-items-center justify-content-center mb-4 bg-white p-2 rounded">
                    <span> Conversations </span>
                </div>

                <div class="chat-container bg-white rounded" style="height:72.5%; overflow-y:scroll; overflow-x:hidden; scrollbar-width:none;">

                    <div class="mt-5 d-flex justify-content-start align-items-center"> 
                        <img src="../assets/images/yokomo.png" alt="yokomo" style="width:10%;" class="rounded-circle me-4 ms-1"> 
                        <b class="my-auto w-auto text-nowrap me-2">Yokomo </b>
                        <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" style="scrollbar-width:none;">Ca va mon gars!, tu es la ?</p>
                    </div>

                    <div class="mt-5 d-flex justify-content-start align-items-center"> 
                        <img src="../assets/images/lionel.PNG" alt="yokomo" style="width:10%;" class="rounded-circle me-4 ms-1"> 
                        <b class="my-auto w-auto text-nowrap me-2">Lionel </b>
                        <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" style="scrollbar-width:none;">pq il me fait ca umm?</p>
                    </div>

                    <div class="mt-5 d-flex justify-content-start align-items-center"> 
                        <img src="../assets/images/yokomo.png" alt="yokomo" style="width:10%;" class="rounded-circle me-4 ms-1"> 
                        <b class="my-auto w-auto text-nowrap me-2">Gingin </b>
                        <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" style="scrollbar-width:none;">Je ne viens plus a l'ecole</p>
                    </div>

                    <div class="mt-5 d-flex justify-content-start align-items-center"> 
                        <img src="../assets/images/lionel.PNG" alt="yokomo" style="width:10%;" class="rounded-circle me-4 ms-1"> 
                        <b class="my-auto w-auto text-nowrap me-2">Garuda </b>
                        <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" style="scrollbar-width:none;">Appelez-moi maman svp</p>
                    </div>

                    <div class="mt-5 d-flex justify-content-start align-items-center"> 
                        <img src="../assets/images/lionel.PNG" alt="yokomo" style="width:10%;" class="rounded-circle me-4 ms-1"> 
                        <b class="my-auto w-auto text-nowrap me-2">Ombre </b>
                        <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" style="scrollbar-width:none;">JAMAIS!</p>
                    </div>

                    <div class="mt-5 d-flex justify-content-start align-items-center"> 
                        <img src="../assets/images/lionel.PNG" alt="yokomo" style="width:10%;" class="rounded-circle me-4 ms-1"> 
                        <b class="my-auto w-auto text-nowrap me-2">Sidney Lightman </b>
                        <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" style="scrollbar-width:none;">Allons-y</p>
                    </div>

                    <div class="mt-5 d-flex justify-content-start align-items-center"> 
                        <img src="../assets/images/yokomo.png" alt="yokomo" style="width:10%;" class="rounded-circle me-4 ms-1"> 
                        <b class="my-auto w-auto text-nowrap me-2">Chouchou</b>
                        <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" style="scrollbar-width:none;">c'est fini entre nous stp, laisse</p>
                    </div>

                    <div class="mt-5 d-flex justify-content-start align-items-center"> 
                        <img src="../assets/images/lionel.PNG" alt="yokomo" style="width:10%;" class="rounded-circle ms-1 me-4"> 
                        <b class="my-auto w-auto text-nowrap me-2">Kyle-xy</b>
                        <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" style="scrollbar-width:none;">ohh yeahh</p>
                    </div>

                    <div class="mt-5 d-flex justify-content-start align-items-center"> 
                        <img src="../assets/images/lionel.PNG" alt="yokomo" style="width:10%;" class="rounded-circle ms-1 me-4"> 
                        <b class="my-auto w-auto text-nowrap me-2">Phantom-z </b>
                        <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" style="scrollbar-width:none;">Don't even think of it...</p>
                    </div>
                </div>

                <div class="mt-5 small text-muted text-center bg-white" style="position:fixed; left:0; top:87.25%; width:360px; border-top-left-radius:1em; border-top-right-radius:1em; box-shadow:0 -3px 3px rgba(0,0,0,0.1);">
                    Privacy · Terms · Advertising · Ad Choices
                </div>
            </div>
        
            <!-- Main Content -->
            <div class="flex-grow-1">
                <!-- Top Bar -->
                <div class="d-flex justify-content-between align-items-center bg-white px-4 py-2 border-bottom">
                    <div class="d-flex align-items-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" width="40" class="me-3">
                        <input type="text" class="form-control" style="width: 250px;" placeholder="Search Facebook">
                    </div>
                    <div>

                        <a href="index.php?page=accueil"><i class="fa fa-home nav-icon mx-3"></i></a>   
                        <i class="fa fa-users nav-icon mx-3"></i>
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

                        default : include("api/acceuil.php");
                    }
                }else include("api/acceuil.php");
                ?>
            </div>
        </div>
    </main>
</body>
</html>