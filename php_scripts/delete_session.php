<?php
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";
session_start();

$connect = new mysqli($host, $db_user , $db_password,$db_name);
if ($connect->errno) {
    echo "wystapil blad" . $connect->errno . "----" . $connect->error;
} 
else 
{
    session_start();
    
    $user_id = $_SESSION['id'];

    $query_sesja = "SELECT * FROM session WHERE user1=$user_id OR user2=$user_id";
    $result = $connect->query($query_sesja);
    $row = $result->fetch_assoc();
    $session_id = $row['id_session'];
    
    if (isset($_SESSION['session_id'])){  
        unset($_SESSION["player"]);
        unset($_SESSION["session_id"]);
    }

    $query1 ="DELETE FROM session WHERE id_session = $session_id";
    $connect->query($query1);

    
    // $connect->query("UPDATE session SET game_data=$session_id WHERE id_session=39 ");
}
?>