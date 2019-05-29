<?php
require_once "./connect.php";
require_once "./usefull_function.php";
session_start();
$connect = @new mysqli($db_location, $db_user , $db_password,$db_name);
update_logged_flag($connect,$_SESSION['login'],0);
session_unset();
$connect->close();
header('Location: ../../multi.html');
?>