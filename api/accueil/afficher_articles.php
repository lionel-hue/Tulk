<?php
include("../database.php");

header('Content-Type: application/json');

$req = null;

try
{
    $req = $pdo->query("SELECT * FROM Article");

}catch(PDOException $e){
    //$response['success'] = false;
    //$response['error'] = $e->getMessage();
    echo json_encode($e->getMessage());
    exit;

}

echo json_encode($req->fetchAll(PDO::FETCH_ASSOC));