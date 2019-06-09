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
    $result = @$connect->query(sprintf("UPDATE users SET last_ping=%s WHERE login = '%s'",
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

function delete_old_session($connect )
{

    $max_time_for_session = 3600;

    $query_sesja = "SELECT * FROM session";
    echo $query_sesja;
    $result = $connect->query($query_sesja);
    // $row = $result->fetch_assoc();
    
    while($row = $result->fetch_assoc())
    {

        

        $curr_unix_time = strtotime("now");
        $unix_time_from_db = $row['ping_at_start'];
        $id_session = $row['id_session'];

        if($curr_unix_time-$unix_time_from_db>$max_time_for_session)
        {
            unset($_SESSION["session_id"]);
            $query1 ="DELETE FROM session WHERE id_session = $id_session";
            $connect->query($query1);
        }

        echo "<br>";
        echo $curr_unix_time;
        echo "<br>";
        
        echo $row['id_session'];
        echo "<br>";
        
        echo $row['ping_at_start']."<br>";
        echo "roznica czasu:";
        echo $curr_unix_time-$unix_time_from_db;
    }

    // if($result->num_rows)
    // {
    //     unset($_SESSION["session_id"]);
    //     $query1 ="DELETE FROM session WHERE id_session = $session_id";
    //     $connect->query($query1);
    // }
}

?>