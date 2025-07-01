<?php
header("Access-Control-Allow-Origin:*");
try{
    $pdo = new
PDO('mysql:host=localhost;dbname=Instaconn;charset=utf8',
'root', '');

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

}
catch (PDOException $e) {
    echo $e->getMessage();
}
?>