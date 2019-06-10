<?php
session_start();

require_once "./connect.php";
require_once "./usefull_function.php";

 $connect = @new mysqli($host, $db_user , $db_password,$db_name);
 if ($connect->errno) {
 } 
 else
 {
    $session = $_SESSION['session_id'];
    $move = $connect->query("SELECT * FROM session WHERE id_session=$session")->fetch_assoc();
    $whose_move = $move['whose_move'];
    echo $whose_move;
    $connect->close();
 }
?>