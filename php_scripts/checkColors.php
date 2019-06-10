<?php
    session_start();
    require_once "./utilities_php/connect.php";
    require_once "./utilities_php/usefull_function.php";
    if((isset($_SESSION['is__logged']))&&($_SESSION['is__logged']==true))
    {
        $connect = @new mysqli($host, $db_user , $db_password,$db_name);

            $logged_user_id = $_SESSION['id'];
            if(!(isset($_SESSION['wantedSession'])))
            {
                echo "-";
                exit;
            }

            $session_id = $_SESSION['wantedSession'];

            $query_set_color1 = "SELECT player1_color FROM session WHERE id_session=$session_id";

            $row = $connect->query($query_set_color1);
            if($row->num_rows>0){
                $clr = $row->fetch_assoc();
                $color1 = $clr['player1_color'];
                echo $color1;
            } else {
                echo "none";
            }
    }
    else
    {
        $connect->close();
        header("Location:../multi.php");
    }
    $connect->close();
   
?>