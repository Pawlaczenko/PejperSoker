<?php
    session_start();
    require_once "./utilities_php/connect.php";
    require_once "./utilities_php/usefull_function.php";
    if((isset($_SESSION['is__logged']))&&($_SESSION['is__logged']==true))
    {
        $connect = @new mysqli($host, $db_user , $db_password,$db_name);

            $session = $_SESSION['session_id'];
            $color = $_POST['color'];
            $player = $_SESSION['player'];

            if(!$player) {
                $query_set_color = "UPDATE session SET player1_color='$color' WHERE id_session = $session";
            } else{
                $query_set_color = "UPDATE session SET player2_color='$color' WHERE id_session = $session";
            }

            $connect->query($query_set_color);
            $connect->close();
    }
    else
    {
        header("Location:../multi.php");
    }
  
    ?>