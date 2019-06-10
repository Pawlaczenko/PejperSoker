<?php
require_once "connect.php";
require_once "usefull_function.php";
session_start();

$connect = @new mysqli($host, $db_user , $db_password,$db_name);
if ($connect->errno) {
   
} 
else 
{
   echo check_is_session($connect,$_SESSION['id']);
   $connect->close();
}
?>