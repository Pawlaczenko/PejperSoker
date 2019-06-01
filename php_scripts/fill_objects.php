<?php
session_start();
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";

$connect = new mysqli($host, $db_user , $db_password,$db_name);
if ($connect->errno) {
    // echo "wystapil blad" . $connect->errno . "----" . $connect->error;
    echo false;
} 
else
{
    $session = $_SESSION['session_id'];
    $query = "SELECT * FROM session WHERE id_session = $session";
    $result = $connect->query($query)->fetch_assoc();

    $id1 = $result['user1'];
    $color1 = $result['player1_color'];
    $id2 = $result['user2'];
    $color2 = $result['player2_color'];

    $result1 = $connect->query("SELECT * FROM users WHERE id_user=$id1")->fetch_assoc();
    $result2 = $connect->query("SELECT * FROM users WHERE id_user=$id2")->fetch_assoc();

    $login1 = $result1['login'];
    $login2 = $result2['login'];

    // class Players
    // {
    //     protected $login1;
    //     protected $color1;
    //     protected $login2;
    //     protected $color2;

    //     public function __construct(array $data) 
    //     {
    //         $this->login1 = $data['login1'];
    //         $this->login2 = $data['login2'];
    //         $this->color1 = $data['color1'];
    //         $this->color2 = $data['color2'];
    //     }
    // }

    $dump_players = array('login1' => $login1, 'color1' => $color1, 'login2' => $login2, 'color2' => $color2);
    echo json_encode($dump_players);
}

?>