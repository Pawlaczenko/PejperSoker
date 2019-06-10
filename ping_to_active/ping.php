<?php
 require_once "../php_scripts/utilities_php/connect.php";
 require_once "../php_scripts/utilities_php/usefull_function.php";
 session_start();
 $connect = @new mysqli($host, $db_user , $db_password,$db_name);
 if ($connect->errno) {
     echo "wystapil blad" . $connect->errno . "----" . $connect->error;
 } 
 else 
 {
     echo "update ping";
     ping($connect,$_SESSION['login']);
     $connect->close();

 }
?>
