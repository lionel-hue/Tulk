<?php
include("../database.php");

header('Content-Type: application/json');

//$response = [];

if( isset( $_POST["search"] ) && isset( $_FILES["send_img"]) ){

    $titre = strip_tags($_POST["search"]);

    // Use output buffering to catch any accidental output
    ob_start();
    include("./code_de_gestion_d_image.php");
    ob_end_clean();

    try{
        $req = $pdo->prepare("INSERT INTO Article(image, description, id_uti) VALUES(:image, :description, :id_uti)");
        $req->execute([
            "image"=>$filename,
            "description" => $titre,
            "id_uti" => 1//$id_uti
        ]);
        //$response['success'] = true;
    }catch(PDOException $e){
        //$response['success'] = false;
        //$response['error'] = $e->getMessage();
        echo json_encode($e->getMessage());
        exit;
    }
}

$articles = $pdo->query("SELECT * FROM Article")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($articles);