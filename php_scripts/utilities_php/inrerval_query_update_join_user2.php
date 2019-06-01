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
    $check_color = "SELECT * FROM session WHERE player2_color=-1";
    $result=$connect->query($query_check);
    $result2=$connect->query($check_color);
    $colorNum = $result2->num_rows;
    $row = $result->fetch_assoc();
    $user2 = $row['user2'];
    if($user2!=-1 && $colorNum == 0){
        echo TRUE;
    }
    else{
        echo FALSE;
    }
 }
?>