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
    $connect = new mysqli($host, $db_user , $db_password,$db_name);
    if ($connect->errno) {
        echo "wystapil blad" . $connect->errno . "----" . $connect->error;
    }
    else
    {
        $login = $_POST['login'];
        // $login = htmlentities($login, ENT_QUOTES, "UTF-8");
        $haslo1 = $_POST['haslo1'];
        $haslo2 = $_POST['haslo2'];


        $result = $connect->query("SELECT * FROM users WHERE login='$login'");
        $howManyLogins = $result->num_rows;

        $allOK = true;

        if ((strlen($login) < 3) || (strlen($login) > 20)) {
            $allOK = false;
            $_SESSION['e_login'] = "Login musi posiadać od 3 do 20 znaków!";
        }

        if (ctype_alnum($login) == false) {

            $allOK = false;
            $_SESSION['e_login'] = "Nick może składać się tylko z liter i cyfr(bez polskich znaków)";
        }

        if ($howManyLogins > 0) {
            $allOK = false;
            $_SESSION['e_login'] = "Istnieje już konto przypisane do tego loginu";
        }

        if ((strlen($haslo1) < 3) || (strlen($haslo1) > 20)) {
            $allOK = false;
            $_SESSION['e_haslo'] = "Hasło musi posiadać od 3 do 20 znaków";
        }

        if (ctype_alnum($haslo1) == false) {

            $allOK = false;
            $_SESSION['e_haslo'] = "Hasło może składać się tylko z liter i cyfr(bez polskich znaków)";
        }

        if ($haslo1 != $haslo2) {
            $allOK = false;
            $_SESSION['e_haslo'] = "Podane hasła nie są jednakowe";
        }

        if($allOK == true)
        {
            $hash = password_hash($haslo1,PASSWORD_DEFAULT);
            $query_add = "INSERT INTO users(login,password,is_logged) VALUES('$login','$hash',0)";
            $connect->query($query_add);
            header('Location: ../multi.php');
        }
        else{
            header("Location:../rejstracja.php");

        }

    }


    ?>

</body>

</html>