<?php
session_start();
require_once "./connect.php";
require_once "./usefull_function.php";

$connect = @new mysqli($host, $db_user , $db_password,$db_name);
if ($connect->errno) {
    echo false;
} 
else
{
    echo print_r($_SESSION, TRUE);
    $connect->close();
}

?>