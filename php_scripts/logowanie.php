<?php

session_start();
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";

 $connect = new mysqli($host, $db_user , $db_password,$db_name);
 if ($connect->errno) {
     //echo "wystapil blad" . $connect->errno . "----" . $connect->error;
 }
 else
 {
     if((isset($_POST['login']))&&(isset($_POST['password'])))
     {
        
        $login = $_POST['login'];
        $haslo = $_POST['password'];
        $login = htmlentities($login, ENT_QUOTES, "UTF-8");
        $haslo = htmlentities($haslo, ENT_QUOTES, "UTF-8");

        if ($result = @$connect->query(sprintf("SELECT * FROM users WHERE login='%s'",
           mysqli_real_escape_string($connect, $login))))
           {
               $iluUzytkownikow = $result->num_rows;
               if ($iluUzytkownikow == 1) {
                   $row = $result->fetch_assoc();
                   $hash_z_bazy = $row['password'];
                   $user_id  = $row['id_user'];
                   

                   if (password_verify($haslo,$row['password']))
                   {
                       
                            //echo "logowanie ... ";
                            $_SESSION['is__logged'] = true;
                            $_SESSION['login'] = $login;
                            $_SESSION['id'] = $user_id;
                            echo delete_session_with_me($connect,$user_id);
                            $result->free_result();

                            ping($connect,$_SESSION['login']);

                            // update_logged_flag($connect,$_SESSION['login'],0);//! is logged is uncorrect
                            header('Location:../lobby.php');
                            // echo "logged";
                       
                       
                   }
                   else
                   {
                       $_SESSION['e_logowanie'] = '<div class="warning">Złe dane logowania</div>';
                        header("Location:../multi.php");
                   }
               }
               else
               {
                    $_SESSION['e_logowanie'] = '<div class="warning">Złe dane logowania</div>';
                    header("Location:../multi.php");
               }
           }
   }
     }

$connect->close();
?>
