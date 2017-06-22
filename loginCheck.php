<?php

include("dbconnect.php");

$password = mysqli_real_escape_string($db_connect, $_POST['password']);
$username = mysqli_real_escape_string($db_connect, $_POST['username']);

$select_user = "SELECT * FROM admins WHERE username = '$username' AND password = '$password'";
$result = $db_connect->query($select_user);
while($row = $result->fetch_assoc()){
	if($row['username'] == $username && $row['password'] == $password){
		echo "success";
	}
	else
	{
		echo "failure";
	}
}
?>