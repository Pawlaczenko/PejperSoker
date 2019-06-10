<?php
session_start();
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";

$connect = @new mysqli($host, $db_user , $db_password,$db_name);
if ($connect->errno) {
  
} else {
    $_SESSION['player'] = FALSE;
    $connect->close();
}

?>