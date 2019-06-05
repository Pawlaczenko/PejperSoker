<?php
    session_start();
    require_once "./utilities_php/connect.php";
    require_once "./utilities_php/usefull_function.php";
    if((isset($_SESSION['is__logged']))&&($_SESSION['is__logged']==true))
    {
        // echo  "zalogowano ",$_SESSION['login'],"<br> - generownaie linku<br>";
        $connect = @new mysqli($db_location, $db_user , $db_password,$db_name);
        if ($connect->errno) {
            // echo "wystapil blad" . $connect->errno . "----" . $connect->error;
        } else {
            $player = $_SESSION['player'];
            $color = $_POST['color'];
            $logged_user_id = $_SESSION['id'];
            if(!$player) {
                $query_create_session = "INSERT INTO session(user1,user2,game_data,game_id,player1_color,player2_color,whose_move) VALUES ('$logged_user_id',-1,'json_string_data',-1,$color,-1,0)";
                $connect->query($query_create_session);

                // pozyskiwanie id sesji po to aby wygenerowac id gry 
                $query_get_session_id = "SELECT * FROM session WHERE user1='$logged_user_id'";
                $result = $connect->query($query_get_session_id);
                $row = $result->fetch_assoc();
                $session_id = $row['id_session'];
                $_SESSION['session_id'] = $session_id;

                //generownie id gry i aktualizacja recordu w bazie 
                $game_id = password_hash($session_id,PASSWORD_DEFAULT);
                $query_set_game_id = "UPDATE session SET game_id='$game_id' WHERE id_session=$session_id";
                
                $connect->query($query_set_game_id);
                echo $game_id;
            } else { //guest
                $session = $_SESSION['session_id'];
                $join = "UPDATE session SET user2=$logged_user_id, player2_color=$color WHERE id_session = $session";
                $connect->query($join);
                echo false;
                // $result = $connect->query(sprintf("UPDATE session SET user2=$logged_user_id, player2_color=$color WHERE id_session = $session",
                // mysqli_real_escape_string($connect,  $logged_user_id),
                // mysqli_real_escape_string($connect,$session);
            // ));
            }
        }
    } else {
        header("Location:../multi.html");
    }
    $connect->close();
    ?>