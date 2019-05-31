<?php
 require_once "./connect.php";
 require_once "./usefull_function.php";
 session_start();
 $connect = @new mysqli($host, $db_user , $db_password,$db_name);
 if ($connect->errno) {
     echo "wystapil blad" . $connect->errno . "----" . $connect->error;
 } 
 else 
 {
     ping($connect,$_SESSION['login']);

 }
?>
<script >
console.log("ping_file");
</script>