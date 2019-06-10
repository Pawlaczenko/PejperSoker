<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap&subset=latin-ext" rel="stylesheet">
    <link rel="stylesheet" href="./assets/styles/style.css">
    <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
    <title>Document</title>
</head>
<body>
    <?php

        require_once "./php_scripts/utilities_php/connect.php";
        require_once "./php_scripts/utilities_php/usefull_function.php";
        session_start();

        $connect = @new mysqli($host, $db_user , $db_password,$db_name);

        if ($connect->errno) {
            echo "wystapil blad" . $connect->errno . "----" . $connect->error;
        }
        else
        {
            if((isset($_SESSION['is__logged']))&&($_SESSION['is__logged']==true)){

                $_SESSION['protection_f5'] = false;

                $name = $_SESSION['login'];
                echo <<< EOT

                <div class="logged_user">
                    <span class="user_login">$name</span>
                    <a href="./php_scripts/utilities_php/logout.php" class="logout">Wyloguj się</a>
                </div>

EOT;

            $connect->close();
            } else {
                header("Location:../multi.php");
            }
        }
        
    ?>

    <header class="header_no">
        <div class="img--box">
            <a href="index.html"><img src="./assets/img/Logo.png" alt="logo"></a>
        </div>
    </header>
    <div class="menu">
        <h1 class="paper_h1">Tyb multiplayer</h1>
        <div class="buttons--box">
            <a href="./index2.php" class="type button" id="createGame">Stwórz grę</a>
            <a href="./join_to_game.php" class="type button">Dołącz do gry</a><br>
        </div>
    </div>


    <script src="./js/ajax.js"></script>


</body>
</html>