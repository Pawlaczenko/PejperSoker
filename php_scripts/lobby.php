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
    if((isset($_SESSION['is__logged']))&&($_SESSION['is__logged']==true))
    {
        echo  "zalogowano<br>";
        echo $_SESSION['login'];
        
        
    }
    else
    {
        header("Location:../multi.html");
    }
    
    
    ?>
<br><br><br>
    <a href="./join_to_game.php">dołacz do gry</a><br>
    <a href="./generate_link.php">stworz gre</a>

    <br><br><br>
    <a href="utilities_php/logout.php">[wyloguj sie]</a>
</body>
</html>