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
    $connect = new mysqli($db_location, $db_user , $db_password,$db_name); 
    if ($connect->errno) {
        echo "wystapil blad" . $connect->errno . "----" . $connect->error;
    } 
    else 
    {
        $login = $_POST['login'];
        $login = htmlentities($login, ENT_QUOTES, "UTF-8");
        $haslo1 = $_POST['haslo1'];
        $haslo2 = $_POST['haslo2'];

        
        $result = $connect->query("SELECT * FROM users WHERE login='$login'");
        $howManyLogins = $result->num_rows;
        if ($howManyLogins > 0) {
            
            echo "pof=dany nik juz istnieje";
        }
        else
        {
            if ($haslo1 == $haslo2)
            {
                $hash = password_hash($haslo1,PASSWORD_DEFAULT);
                echo $hash;
                $query_add = "INSERT INTO users(login,password,is_logged) VALUES('$login','$hash',0)";
                $connect->query($query_add);
            }
            else 
            {
                echo "haslo różnia sie od siebie";
            }
    
            
        }
        
    }


    ?>

</body>

</html>