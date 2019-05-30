<?php
    session_start();
    require_once "./utilities_php/connect.php";
    require_once "./utilities_php/usefull_function.php";
    if((isset($_SESSION['is__logged']))&&($_SESSION['is__logged']==true))
    {
        $connect = @new mysqli($db_location, $db_user , $db_password,$db_name);
  
            $logged_user_id = $_SESSION['id'];
            $color = $_POST['color'];

            $query_set_color1 = "UPDATE session SET player1_color='$color' WHERE user1=$logged_user_id";
            $query_set_color2 = "UPDATE session SET player2_color='$color' WHERE user2=$logged_user_id";

            $connect->query($query_set_color1);
            $connect->query($query_set_color2);
    }
    else
    {
        header("Location:../multi.html");
    }
    $connect->close();
    ?>