<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
<?php

session_start();
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";

 $connect = new mysqli($host, $db_user , $db_password,$db_name);
 if ($connect->errno) {
     echo "wystapil blad" . $connect->errno . "----" . $connect->error;
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
                        echo "logowanie ... ";
                        $_SESSION['is__logged'] = true;
                        $_SESSION['login'] = $login;
                        $_SESSION['id'] = $user_id;
                        $result->free_result();
                        
                        ping($connect,$_SESSION['login']);
                        
                        // update_logged_flag($connect,$_SESSION['login'],0);//! is logged is uncorrect
                        header('Location:lobby.php');
   
                   }
                   else
                   {
                       echo "podano złe haslo";
                   }
                       
               
              
   
               }
               else
               {
                   echo "nie ma takiego usera w bazie";
               }
           }
   }
     }

$connect->close();
?>
    
</body>
</html>