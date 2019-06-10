<?php
session_start();
require_once "./utilities_php/connect.php";
require_once "./utilities_php/usefull_function.php";

$connect = new mysqli($host, $db_user , $db_password,$db_name);
if ($connect->errno) {
    echo false;
} 
else
{
    Class Room{
        public $session_id;
        public $host;
        public $guest;
        public $isPrivate;

        function __construct($id,$host,$guest,$private) {
            $this->session_id = $id;
            $this->host = $host;
            $this->guest = $guest;
            $this->isPrivate = $private;
        }
    }

    $result = $connect->query("SELECT * FROM session");
    $dump = array();
    while($row = $result->fetch_assoc()){
        $isPrivate = false;
        $id1 = $row['user1'];
        $id2 = $row['user2'];
        $user1 = $connect->query("SELECT * FROM users WHERE id_user=$id1")->fetch_assoc();
        $user2 = $connect->query("SELECT * FROM users WHERE id_user=$id2")->fetch_assoc();
        if($row['game_password']!=""){
            $isPrivate = true;
        }
        $room = new Room($row['id_session'],$user1['login'],$user2['login'],$isPrivate);
        array_push($dump, $room);
    };

    echo json_encode($dump);
}

?>