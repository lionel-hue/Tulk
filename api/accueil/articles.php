<?php
include("../database.php");

header('Content-Type: application/json');

$req = null;

if ($_SERVER["REQUEST_METHOD"] === "GET" ) 
{
    try
    {
        $req = $pdo->query("SELECT nom, prenom, role, U.image as profile_pic, role, A.image as image_article, description, date, A.id as id_article FROM Article A INNER JOIN Utilisateur U ON A.id_uti = U.id");

    }catch(PDOException $e){
        //$response['success'] = false;
        //$response['error'] = $e->getMessage();
        echo json_encode($e->getMessage());
        exit;

    }
    echo json_encode($req->fetchAll(PDO::FETCH_ASSOC));

}else if($_SERVER["REQUEST_METHOD"] === "POST")
{
    if( isset( $_POST["search"] ) && isset( $_FILES["send_img"]) ){

        $titre = strip_tags($_POST["search"]);
code_de_gestion_d_image.php
        // Use output buffering to catch any accidental output
        ob_start();
        include("./code_de_gestion_d_image.php");
        ob_end_clean();

        try{
            $req = $pdo->prepare("INSERT INTO Article(image, description, id_uti) VALUES(:image, :description, :id_uti)");
            $req->execute([ 
                "image"=>$filename,
                "description" => $titre,
                "id_uti" => 1 //$id_uti
            ]);

            //$response['success'] = true;
        }catch(PDOException $e){
            //$response['success'] = false;
            //$response['error'] = $e->getMessage();
            echo json_encode($e->getMessage());
            exit;
        }

        echo json_encode( $pdo->query("SELECT nom, prenom, role, U.image as profile_pic, role, A.image as image_article, description, date, A.id as id_article FROM Article A INNER JOIN Utilisateur U ON A.id_uti = U.id")->fetchAll(PDO::FETCH_ASSOC) );
    }   
}
else echo json_encode("error");