<?php

include("dbconnect.php");

$startTime= $_POST['startTime'];
$endTime= $_POST['endTime'];
$date = $_POST['date'];
$personName = $_POST['personName'];
$roomId = $_POST['roomId'];
$comment = $_POST['comment'];


$sql = "INSERT INTO reservations (startTime, endTime, date, personName, roomId, comment)
	VALUES ('$startTime', '$endTime', '$date', '$personName', '$roomId', '$comment')";
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