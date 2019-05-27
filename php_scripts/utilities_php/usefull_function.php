<?php
function update_logged_flag($connect,$user_login,$flag)
{
    $user_login = htmlentities($user_login, ENT_QUOTES, "UTF-8");
    $flag = htmlentities($flag, ENT_QUOTES, "UTF-8");
    $result = @$connect->query(sprintf("UPDATE users SET is_logged='%s' WHERE login = '%s'",
        mysqli_real_escape_string($connect,  $flag),
        mysqli_real_escape_string($connect,$user_login)
    ));
}
?>