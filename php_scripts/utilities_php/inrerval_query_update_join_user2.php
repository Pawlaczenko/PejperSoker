<?php
session_start();

require_once "./connect.php";
require_once "./usefull_function.php";

 $connect = new mysqli($host, $db_user , $db_password,$db_name);
 if ($connect->errno) {
    //  echo "blad";
 } 
 else
 {
    // echo "connect";
    $current_user_id = $_SESSION['id'];
    $query_check = "SELECT * FROM session WHERE user1=$current_user_id";
    $result=$connect->query($query_check);
    $row = $result->fetch_assoc();
    $user2 = $row['user2'];
    if($user2!=-1)
    {
        echo "true";
        
    }
    else
    {
        echo "false";
    }
 }
?>