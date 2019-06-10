<?php
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";
session_start();

$connect = @new mysqli($host, $db_user , $db_password,$db_name);
if ($connect->errno) {
    echo "wystapil blad" . $connect->errno . "----" . $connect->error;
} 
else 
{
    session_start();
    // unset($_SESSION["session_id"]);
    // $connect->query("UPDATE session SET game_data=$session_id WHERE id_session=39 ");
    $connect->close();
}
?>