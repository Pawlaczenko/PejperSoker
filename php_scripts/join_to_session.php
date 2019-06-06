<?php
session_start();
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";

$connect = new mysqli($host, $db_user , $db_password,$db_name);
if ($connect->errno) {
    // echo "wystapil blad" . $connect->errno . "----" . $connect->error;
    echo false;
} 
else
{
    $game_id = $_POST['game_id'];
    
    $game_id = htmlentities($game_id, ENT_QUOTES, "UTF-8");

    $query_check ="SELECT * FROM session WHERE id_session='$game_id';";

    $result = $connect->query($query_check);
    if($result->num_rows==0)
    {
        echo false;
    }
    else
    {
        $current_user_id = $_SESSION['id'];
        $session = $result->fetch_assoc();
        $_SESSION['wantedSession'] = $session['id_session'];

        $_SESSION['player'] = 1; //klient
        $_SESSION['action'] = "stay";
        echo true;
    }
}

?>