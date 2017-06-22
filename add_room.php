<?php

include("dbconnect.php");

$capacity= $_POST['capacity'];
$floor= $_POST['floor'];
$name = $_POST['name'];



$sql = "INSERT INTO rooms (name, floor, capacity)
	VALUES ('$name', '$floor', '$capacity')";
	if(mysqli_query($db_connect, $sql))
	{		
    echo "Records inserted successfully.";
	} 
	else
	{
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($db_connect);
	}
	
						
	
mysqli_close($db_connect);


?>