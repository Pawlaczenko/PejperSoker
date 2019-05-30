<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <?php
    require_once "./utilities_php/connect.php";
    require_once "./utilities_php/usefull_function.php";
    session_start();
    
    $connect = @new mysqli($host, $db_user , $db_password,$db_name);
    if ($connect->errno) {
        echo "wystapil blad" . $connect->errno . "----" . $connect->error;
    } 
    else 
    {
        
        
            if((isset($_SESSION['is__logged']))&&($_SESSION['is__logged']==true))
            {
                echo  "zalogowano<br>";
                echo $_SESSION['login'];
                // echo convert_date_to_int();
                if(check_is_session($connect,$_SESSION['id']))
                {
                    echo " sessja trwa";
                }
                else
                {
                    echo " moze dołaczyc badz stworzyc sesje";
                    
                    echo <<< content
                    <a href="./join_to_game.html">dołacz do gry</a><br>
                    <a href="../index2.html">stworz gre</a>

content;
                }
                
        
            }
            else
            {
                
                header("Location:../multi.html");
            }
        
       
        
        
    }
    $connect->close();
    
    ?>
<br><br><br>
   

    <br><br><br>
    <a href="utilities_php/logout.php">[wyloguj sie]</a>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
  
</body>
</html>