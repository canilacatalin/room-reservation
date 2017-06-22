<?php

include("dbconnect.php");

	$myArray = [];
	$sql = "SELECT * FROM reservations";
	$result = $db_connect->query($sql);
			while($row = $result->fetch_assoc()){
				array_push($myArray, [ 'startTime' => $row['startTime'],
									   'endTime' => $row['endTime'],
									   'date' => $row['date'],
									   'personName' => $row['personName'],
									   'roomId' => $row['roomId'],
									   'comment' => $row['comment']
									  ]);
			}
		
		$myJSON = json_encode($myArray);
		echo $myJSON;

mysqli_close($db_connect);


?>