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
    $query_data = "SELECT whose_move FROM session WHERE id_session =$session";

    $result = $connect->query($query_data);
    $row = $result->fetch_assoc();
    $whose_move = ($row['whose_move']);
    if ($whose_move == 1) {
        $whose_move = 0;
    } else {
        $whose_move = 1;
    }

    // $whose_move = !(boolval($row['whose_move']));

    $connect->query("UPDATE session SET game_data='$game_data' WHERE id_session = $session");
<<<<<<< HEAD
    // $connect->query("UPDATE session SET whose_move=$whose_move WHERE id_session = $session");
=======
    $connect->query("UPDATE session SET whose_move=$whose_move WHERE id_session = $session"); //!ZMIENIĆ ŻEBY DOPIERO PO WYSŁANIU DANYCH ZMIENIAŁ SIĘ GRACZ
>>>>>>> 5605e89414627aadc0038790ee24f06d3e67f127
    echo "UPDATE session SET game_data='$game_data' WHERE id_session = $session";
}
