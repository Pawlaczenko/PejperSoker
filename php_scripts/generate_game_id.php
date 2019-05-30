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
        } 
        else 
        {   
            $logged_user_id = $_SESSION['id'];
            // $color = $_POST['color'];

            // $query_set_color1 = "UPDATE session SET player1_color='$game_id' WHERE id_session=$session_id";

            //sprawdz czy taka sesia juz istnieje (to jest zabezpiecznie eprzed f5 - obrona przed retundancja)
            $query_check_session = "SELECT * FROM session WHERE user1=$logged_user_id";
            $result_check = $connect->query($query_check_session);

            $query_check_session2 = "SELECT * FROM session WHERE user2=$logged_user_id";
            $result_check2 = $connect->query($query_check_session2);

            if($result_check->num_rows==0 && $result_check2->num_rows==0)
            // if(1)
            {
                // echo "sesja stworzona<br>";

                // tworzenie sesji
                $query_create_session = "INSERT INTO session(user1,user2,game_data,game_id) VALUES ('$logged_user_id',-1,'json_string_data',-1)";
                $connect->query($query_create_session);

                // pozyskiwanie id sesji po to aby wygenerowac id gry 
                $query_get_session_id = "SELECT * FROM session WHERE user1='$logged_user_id'";
                $result = $connect->query($query_get_session_id);
                $row = $result->fetch_assoc();
                $session_id = $row['id_session'];
                
                //generownie id gry i aktualizacja recordu w bazie 
                $game_id = password_hash($session_id,PASSWORD_DEFAULT);
                $query_set_game_id = "UPDATE session SET game_id='$game_id' WHERE id_session=$session_id";
                
                $connect->query($query_set_game_id);
                echo $game_id;

//                 echo <<< script
//                 <script>
//                 $('.game_id').html($game_id);
//                 function refresh_div() {
//                     jQuery.ajax({
//                         url:'./utilities_php/inrerval_query_update_join_user2.php',
//                         type:'POST',
//                         success:function(results) {
//                             console.log(results);
//                            if(results == "true")
//                            {
//                             window.location.href = "./play_field.php";
//                            }
//                         }
//                     });
//                 }
            
//                 t = setInterval(refresh_div,1000);
//                 </script>
// script;
            }else{ //!Ten else sprawdza, czy zalogowany jest host czy klient. Jeżeli klient to nie tworzy znowu game_id. Sesja po wyjściu któregoś gracza z gry powinna być natychmiastowo usuwana.
                echo FALSE;
                // echo "sesja nie zostanie stworzona poniewaz seja juz istneje";
                // $user_id = $_SESSION['id'];
                // $query_get_game_id = "SELECT * FROM session WHERE user1=$user_id;";
                // $result = $connect->query($query_get_game_id);
                // $row = $result->fetch_assoc();
                // $game_id = $row['game_id'];
                // // echo "<br>";
                // echo $game_id;
            }
        }
    }
    else
    {
        header("Location:../multi.html");
    }
    $connect->close();
    ?>