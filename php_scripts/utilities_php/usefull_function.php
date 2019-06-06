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

function ping($connect,$user_login)
{
    $curr_unix_time = strtotime("now");
    $result = @$connect->query(sprintf("UPDATE users SET date_last_login=%s WHERE login = '%s'",
        mysqli_real_escape_string($connect,  $curr_unix_time),
        mysqli_real_escape_string($connect,$user_login)
    ));
   
}

function check_is_logged($connect,$login)
{
    $max_ping_time_answer = 5 ;// w sekundach
    $query_check_ping = "SELECT date_last_login FROM users WHERE login = '$login';";
    $result = $connect->query($query_check_ping);
    $row = $result->fetch_assoc();
    $unix_time_from_base = $row['date_last_login'];
    // echo $unix_time_from_base,"<-- czas z bazy";
    if(strtotime("now")-$unix_time_from_base>$max_ping_time_answer)
    {
        update_logged_flag($connect,$login,0);
        return false;
    }
    else
    {
        return true;
    }

}
function check_is_session($connect, $id)
{
    $query_check_session = "SELECT * FROM session WHERE user1=$id OR user2=$id";
    
    $result = $connect->query($query_check_session);
    
    if($result->num_rows==0)
    {
        return false; 
    }
    else
    {
        return true; //sesja trwa
    }
}

?>