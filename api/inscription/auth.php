<?php
require 'PHPMailerAutoload.php';

// Récupère l'email de l'utilisateur (ex : via POST)
$destinataire = isset($_POST['email']) ? $_POST['email'] : null;
if (!$destinataire) {
    echo "Aucune adresse email fournie.";
    exit;
}

// Génère un code d’activation unique
$activation_code = bin2hex(random_bytes(16));

// À FAIRE : Enregistre $activation_code en base de données avec l'utilisateur

$mail = new PHPMailer;
//$mail->SMTPDebug = 3; // Active le debug si besoin

$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'frenchcode.contact@gmail.com'; // Ton adresse Gmail
$mail->Password = 'VOTRE_MOT_DE_PASSE_ICI'; // Mot de passe d'application Gmail
$mail->SMTPSecure = 'ssl';
$mail->Port = 465;

// Expéditeur
$mail->setFrom('frenchcode.contact@gmail.com', 'Instaconn');

// Destinataire
$mail->addAddress($destinataire);

// Sujet et contenu
$mail->isHTML(true);
$mail->Subject = 'Confirmation de votre inscription';

$lien_activation = "http://localhost:8080/Instaconn/api/inscription/activate.php?code=$activation_code&email=" . urlencode($destinataire);

$mail->Body = "
    <h2>Bienvenue sur Instaconn !</h2>
    <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour activer votre compte :</p>
    <a href='$lien_activation'>Activer mon compte</a>
    <p>Ou copiez ce lien dans votre navigateur :<br>$lien_activation</p>
";
$mail->AltBody = "Merci de vous être inscrit. Pour activer votre compte, rendez-vous sur : $lien_activation";

// Envoi
if(!$mail->send()) {
    echo 'Erreur lors de l\'envoi du message : ' . $mail->ErrorInfo;
} else {
    echo 'Un email de confirmation a été envoyé à votre adresse.';
    // À FAIRE : Enregistre $activation_code dans la base de données associé à l'utilisateur ici si ce n'est pas déjà fait
}