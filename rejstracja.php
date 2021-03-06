<?php

 session_start();

?>

<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap&subset=latin-ext" rel="stylesheet">
    <link rel="stylesheet" href="assets/styles/style.css">
    <title>Document</title>
</head>
<body>
    <header class="header_no">
        <div class="img--box">
            <a href="index.html"><img src="assets/img/Logo.png" alt="logo"></a>
        </div>
    </header>
    <div class="menu">
        <h1 class="paper_h1">Tryb Multiplayer</h1>
        <h2 class="info">Zarejestruj się w PejperSoker</h2>
        <form action="./php_scripts/rejstracja.php" method="POST" class="login_form">
            <label>LOGIN:           <input name="login" type="text" required></label>
            <?php if(ISSET($_SESSION['e_login'])) echo "<div class='error'>".$_SESSION['e_login']."</div>"; unset($_SESSION['e_login'])?>
            <label>HASŁO:           <input name="haslo1" type="password" required></label>
            <label>POWTÓRZ HASŁO:   <input name="haslo2" type="password" required></label>
            <?php if(ISSET($_SESSION['e_haslo'])) echo "<div class='error'>".$_SESSION['e_haslo']."</div>"; unset($_SESSION['e_haslo'])?>
            <input type="submit" value="ZAREJESTRUJ" class="button login_button">
        </form>
    </div>
</body>
</html>