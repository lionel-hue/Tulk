<?php
session_start();

include("../database.php");

header('Content-Type: application/json');

$req = null;

$input = file_get_contents("php://input");

$data = json_decode($input, true);

if( json_last_error() !== JSON_ERROR_NONE)
{
    echo json_encode(["status" => "error", "message" => "Invalid JSON received."]);
    exit();
}


$like_type = strip_tags($data["like_type"]);
$post_id =  strip_tags($data["post_id"]);


try{
    $req = $pdo->prepare("DELETE FROM Liker WHERE id_uti = :id_uti AND id_arti = :id_arti");
    $req->execute([
        "id_uti" => $_SESSION["id_uti"],
        "id_arti" => $post_id
    ]);

}catch(PDOException $e){
    echo json_encode($e->getMessage());
    exit;
}


try{
    $req = $pdo->prepare("INSERT INTO Liker(type, id_uti, id_arti) VALUES(:type, :id_uti, :id_arti)");
    $req->execute([
        "type"=>$like_type,
        "id_uti" => $_SESSION["id_uti"],
        "id_arti" => $post_id
    ]);

}catch(PDOException $e){
    echo json_encode($e->getMessage());
    exit;
}

try{
    $req = $pdo->query("SELECT type, COUNT(*) AS nmbr FROM Liker GROUP BY type");

}catch(PDOException $e){
    echo json_encode($e->getMessage());
    exit;
}
echo json_encode($req->fetchAll(PDO::FETCH_ASSOC));