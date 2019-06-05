<?php

session_start();
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";

$connect = new mysqli($host, $db_user, $db_password, $db_name);
if ($connect->errno) {
    // echo "wystapil blad" . $connect->errno . "----" . $connect->error;
    echo false;
} else {
    $session = $_SESSION['session_id'];
    $game_data = $_POST['json'];

    $connect->query("UPDATE session SET game_data='$game_data' WHERE id_session = $session");
    echo "UPDATE session SET game_data='$game_data' WHERE id_session = $session";
}
