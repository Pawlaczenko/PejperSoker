<?php

    session_start();
    require_once "./utilities_php/connect.php";
    require_once "./utilities_php/usefull_function.php";
    if((isset($_SESSION['is__logged']))&&($_SESSION['is__logged']==true))
    // if(1)
    {
        // echo  "zalogowano ",$_SESSION['login'],"<br> - generownaie linku<br>";
        $connect = new mysqli($host, $db_user , $db_password,$db_name);
        if ($connect->errno) {
            // echo "wystapil blad" . $connect->errno . "----" . $connect->error;
        } else {
            $player = $_SESSION['player'];
            $color = $_POST['color'];
            $logged_user_id = $_SESSION['id'];
            if(!$player) {
                $query_create_session = "INSERT INTO session(user1,user2,game_data,player1_color,player2_color,whose_move) VALUES ('$logged_user_id',-1,'',$color,-1,0)";
                $connect->query($query_create_session);

                // pozyskiwanie id sesji po to aby wygenerowac id gry
                $query_get_session_id = "SELECT * FROM session WHERE user1='$logged_user_id'";
                $result = $connect->query($query_get_session_id);
                $row = $result->fetch_assoc();
                $session_id = $row['id_session'];
                $_SESSION['session_id'] = $session_id;

                if(isset($_POST['pass'])){
                    $pass = $_POST['pass'];
                    $pass = htmlentities($pass);
                    $connect->query("UPDATE session SET game_password='$pass' WHERE id_session=$session_id");
                }
                echo "-";
                //generownie id gry i aktualizacja recordu w bazie
            } else {
                $session = $_SESSION['wantedSession'];
                $wantedPassword = $connect->query("SELECT * FROM session WHERE id_session=$session")->fetch_assoc();
                if(empty($wantedPassword['game_password'])){
                    $join = "UPDATE session SET user2=$logged_user_id, player2_color=$color WHERE id_session = $session";
                } else {
                    $pass = $_POST['client_pass'];
                    if($wantedPassword['game_password']==$pass) {
                        $join = "UPDATE session SET user2=$logged_user_id, player2_color=$color WHERE id_session = $session";
                    } else {
                        echo 'wrong';
                        exit;
                    }
                }
                $connect->query($join);
                $_SESSION['session_id'] = $session;
                unset($_SESSION["wantedSession"]);
                echo false;
                // $result = $connect->query(sprintf("UPDATE session SET user2=$logged_user_id, player2_color=$color WHERE id_session = $session",
                // mysqli_real_escape_string($connect,  $logged_user_id),
                // mysqli_real_escape_string($connect,$session);
            // ));
            }
            $_SESSION['protection_f5'] = true;

        }

        $connect->close();
    } else {
        echo 'kick';
        //header("Location:../multi.html");
    }








    ?>