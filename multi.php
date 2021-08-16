<?php

session_start();

?>

<html lang="pl">
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap&subset=latin-ext" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <link rel="stylesheet" href="assets/styles/style.css">
    <link rel="icon" href="./assets/img/favicon.ico" />

    <title>PejperSoker</title>
</head>
<body>
    <header class="header_no">
        <div class="img--box">
            <a href="index.html"><img src="assets/img/Logo.png" alt="logo"></a>
        </div>
    </header>
    <div class="menu">
        <h1 class="paper_h1">Tryb Multiplayer</h1>
        <h2 class="info">Zaloguj sie, aby dołączyć do gry.</h2>
        <form action="./php_scripts/logowanie.php" method="POST" class="login_form" id="login_form">
            <label>LOGIN: <input name="login" type="text" required></label>
            <label>HASŁO: <input name="password"type="password" required></label>
            <?php if(ISSET($_SESSION['e_logowanie'])) echo "<div class='error'>".$_SESSION['e_logowanie']."</div>"; unset($_SESSION['e_logowanie'])?>
            <input type="submit" value="ZALOGUJ" class="button login_button">
        </form>
        <h3>Nie masz konta? Zarejstruj się <a href="./rejstracja.php">tutaj</a></h3>
    </div>
</body>
</html>