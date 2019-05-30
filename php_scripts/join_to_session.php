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

    $query_check ="SELECT * FROM session WHERE game_id='$game_id';";

    $result = $connect->query($query_check);
    if($result->num_rows==0)
    {
        // echo "nie ma takiej sesji";
        echo false;
    }
    else
    {
        $current_user_id = $_SESSION['id'];
        $result = $connect->query(sprintf("UPDATE session SET user2='%s' WHERE game_id = '%s'",
            mysqli_real_escape_string($connect,  $current_user_id),
            mysqli_real_escape_string($connect,$game_id)
        ));
        // echo "<br>";
        // echo "UPDATE session SET user2=$current_user_id WHERE game_id = '$game_id'";
        //header("Location: ../index2.html");
        //echo $connect->error_get_last;
        echo true;
    }
}

?>