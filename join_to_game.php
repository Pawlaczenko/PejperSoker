<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap&subset=latin-ext" rel="stylesheet"> 
    <link rel="stylesheet" href="./assets/styles/style.css">
    <title>Document</title>
</head>
<body>
    <header class="header_no">
        <div class="img--box">
             <a href="index.html"><img src="./assets/img/Logo.png" alt="logo"></a>
        </div>
    </header>
    <?php
        session_start();
        $name = $_SESSION['login'];
echo <<< EOT
    
    <div class="logged_user">
        <span class="user_login">$name</span>
        <a href="php_scripts/utilities_php/logout.php" class="logout">Wyloguj się</a>
    </div>
    
EOT;

    ?>
    <div class="menu">
        <h1 class="paper_h1">Dołącz do gry</h1>
        <table id="rooms">
            <tr><td>-</td><td>ID Sesji</td><td>Player 1</td><td>Player 2</td><td>-</td></tr>
            <!-- <tr>
                <td class="session_id">
                    24
                </td>
                <td>
                   Admin 
                </td>
                <td>
                    Magda
                </td>
                <td>
                    <form method="POST" id="join_form">
                        <input name="session_id" type="hidden" value="24">
                        <input type="submit" value="DOŁĄCZ" class="button login_button">
                    </form>
                </td>
            </tr> -->
        </table>
        <!-- <form method="POST" id="join_form" class="login_form">
            <label>ID Gry: <input name="game_id" type="text" id="id_input"></label>
            <input type="submit" value="DOŁĄCZ" class="button login_button">
        </form> -->
        <h3>Brak odpowiedniego partnera? Stwórz grę <a href="lobby.php">tutaj</a> albo <a href="join_to_game.php">odśwież</a></h3>
    </div>
<script src="./js/ajax.js"></script>
<script src="./js/rooms.js"></script>

</body>
</html>