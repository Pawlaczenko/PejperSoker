<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="assets/styles/style.css">
    <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap&subset=latin-ext" rel="stylesheet">
    <!-- <meta http-equiv="refresh" content="0; url=php_scripts/lobby.php"> -->
</head>

<body>
    <?php

    require_once "./php_scripts/utilities_php/connect.php";
    require_once "./php_scripts/utilities_php/usefull_function.php";
    $connect = new mysqli($host, $db_user , $db_password,$db_name);

    session_start();

        if($_SESSION['protection_f5']){
            echo "test";
            header("Location: multi.php");
            exit;
        }
        if(check_is_session($connect,$_SESSION['id']))
        {
            echo "<div class='alert'<h1 style='text-align: center; font-size: 32px;'>Podany użytkownik jest już zalogowany i uczestniczy w grze.</h1>";
            echo "<img src='assets/img/spider_man.jpg'>";
            echo "<a href='multi.php' class='button alert' style='padding:10px;text-transform: uppercase;'>Go back</div>";
            exit;
        }

        if((isset($_SESSION['is__logged']))&&($_SESSION['is__logged']==true))
        {

            $_SESSION['protection_f5'] = false;

            $player = $_SESSION['player'];
            echo '
            <div class="loader alert">
        <img src="assets/img/loader.gif">
        <h1>Waiting for opponent</h1>
    </div>
    <div style="display: none;">
        <a href="index.html"><img src="assets/img/ball.png" alt="ball" id="ball"></a>ssss
    </div>
    <div class="endgame alert">
        <h1 class="message">
            FUCKING WINNER <!-- wiadomość z ajaxa -->
        </h1>
        <a href="join_to_game.php" class="endgame--button button">GO BACK</a>
    </div>
    <div class="creator--box alert">
        <div class="creator">
            <h1>Stwórz postać</h1>
            <form method="POST" id="creator">
                <h3>Wybierz kolor</h3>
                <div class="colors">

                </div>
                ';
                if(!$player) {
                    echo '
                    <label class="private_label">Sesja prywatna: <input type="checkbox" name="private_session"></label>
                    <label class="pass_label">Hasło: <input type="text" name="game_pass" class="game_pass" disabled></label>';
                } else {
                    $session = $_SESSION['wantedSession'];
                    $isPrivate = $connect->query("SELECT * FROM session WHERE id_session=$session")->fetch_assoc();
                    $test = $isPrivate['game_password'];
                    if($isPrivate['game_password']!=""){
                        echo '<label class="private_label">Hasło: <input type="text" name="game_pass_klient" placeholder="hasło" class="game_pass_klient" required></label>';
                    }
                }
                echo '
                <input class="button" type="submit" id="play" value="graj" name="graj">
            </form>
        </div>
    </div> <!-- kreator -->

    <header class="header">
        <div class="name active" data-id="0">
            Gracz
        </div>
        <div class="img--box">
            <img src="assets/img/Logo.png" alt="Logo">
        </div>
        <div class="name" data-id="1">
            BOT
        </div>
    </header>
    <div id="board"></div>

    <script src="js/global.js"></script>
    <script src="js/main.js"></script>
    <script src="js/ajax.js"></script>

';
        } else {
            header("Location:./multi.php");
        }
    ?>
<script>
    $('input[name=private_session]').change(function() {
        if (this.checked) {
            $('.game_pass').prop('disabled',false).prop('required',true).parent().css('display','block');
        } else {
            $('.game_pass').prop('disabled',true).prop('required',false).val('').parent().css('display','none');
        }
    });

    window.onbeforeunload = function(e) {
        return 'Czy napewno chcesz wyjść?';
    };
</script>
  <script src="./ping_to_active/ping.js"></script>

</body>
</html>