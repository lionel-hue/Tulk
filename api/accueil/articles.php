<?php
require_once "../envloader.php";
loadEnvFile(__DIR__.'/../.env');

session_start();

include("../database.php");

header('Content-Type: application/json');

$req = null;

if ($_SERVER["REQUEST_METHOD"] === "GET" ) 
{
    try
    {
        $req = $pdo->prepare("
-- Your posts
SELECT 
    U.id AS id_uti,
    U.nom,
    U.prenom,
    U.role,
    U.image AS profile_pic,
    A.image AS image_article,
    A.description,
    A.date,
    A.id AS id_article,
    'your_post' AS post_type,
    NULL AS statut
FROM 
    Article A
INNER JOIN 
    Utilisateur U ON A.id_uti = U.id
WHERE 
    A.id_uti = :id_uti

UNION ALL

-- Friends' posts
SELECT 
    U.id AS id_uti,
    U.nom,
    U.prenom,
    U.role,
    U.image AS profile_pic,
    A.image AS image_article,
    A.description,
    A.date,
    A.id AS id_article,
    'friend_post' AS type_arti,
    Am.statut AS statut
FROM 
    Article A
INNER JOIN 
    Utilisateur U ON A.id_uti = U.id
INNER JOIN 
    Amitie Am ON (Am.id_1 = :id_uti AND Am.id_2 = U.id) 
              OR (Am.id_1 = U.id AND Am.id_2 = :id_uti)
WHERE 
    A.id_uti != :id_uti
    AND Am.statut = 'ami'
ORDER BY 
    date DESC;");

        $req->execute([
            "id_uti" => $_SESSION["id_uti"]
        ]);

    }catch(PDOException $e){
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;

    }
    echo json_encode($req->fetchAll(PDO::FETCH_ASSOC));

}else if($_SERVER["REQUEST_METHOD"] === "POST")
{
    if( isset( $_POST["search"] ) && isset( $_FILES["send_img"]) ){

        $titre = strip_tags($_POST["search"]);

        $filename = include("../code_de_gestion_d_image.php");

        try{
            $req = $pdo->prepare("INSERT INTO Article(image, description, id_uti) VALUES(:image, :description, :id_uti)");
            $req->execute([ 
                "image"=>$filename,
                "description" => $titre,
                "id_uti" => $_SESSION["id_uti"]
            ]);

            //$response['success'] = true;
        }catch(PDOException $e){
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        }

        echo json_encode( $pdo->query("SELECT nom, prenom, role, U.image as profile_pic, role, A.image as image_article, description, date, A.id as id_article FROM Article A INNER JOIN Utilisateur U ON A.id_uti = U.id")->fetchAll(PDO::FETCH_ASSOC) );
    }   
}
else echo json_encode(['success' => false, 'error' => 'Requête non supportée']);