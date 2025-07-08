<?php
function image_error($msg) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

$f_info = new finfo(FILEINFO_MIME_TYPE);
$mime_type = $f_info->file($_FILES["send_img"]["tmp_name"]);

if ($_SERVER["REQUEST_METHOD"] !== "POST" || 
    empty($_FILES["send_img"]) ||
    !in_array($_FILES["send_img"]["type"], ["image/gif", "image/png", "image/jpeg", "image/jpg"])) {
    image_error("Invalid image upload");
}

if ($_FILES["send_img"]["error"] !== UPLOAD_ERR_OK) {
    switch($_FILES["send_img"]["error"]) {
        case UPLOAD_ERR_PARTIAL:
            image_error("File only partially uploaded");
        case UPLOAD_ERR_EXTENSION:
            image_error("File upload stopped by a PHP extension");
        default:
            image_error("Unknown upload error");
    }
}

$pathinfo = pathinfo($_FILES["send_img"]["name"]);
$base = $pathinfo["filename"];
$base = preg_replace("/[^\w-]/", "_", $base);

$filename = $base . "." . $pathinfo["extension"];
$destination = __DIR__ . "/../assets/images/" . $filename;

$i = 1;
while (file_exists($destination)) {
    $filename = $base . "($i)." . $pathinfo["extension"];
    $destination = __DIR__ . "/../assets/images/" . $filename;
    $i++;
}

if (!move_uploaded_file($_FILES["send_img"]["tmp_name"], $destination)) {
    image_error("Failed to move uploaded file");
}

return $filename;