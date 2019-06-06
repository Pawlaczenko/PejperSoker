<?php
session_start();
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";

$connect = new mysqli($host, $db_user , $db_password,$db_name);
if ($connect->errno) {
    // echo "wystapil blad" . $connect->errno . "----" . $connect->error;
} else {
    if ($_SESSION['action'] == "run"){
        echo 'abort';
    }else {
        echo 'stay';
    }
}

?>