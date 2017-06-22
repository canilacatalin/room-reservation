<?php

include("dbconnect.php");

	$myArray = [];
	$sql = "SELECT * FROM rooms";
	$result = $db_connect->query($sql);
			while($row = $result->fetch_assoc()){
				array_push($myArray, [ 'name' => $row['name'],
									   'floor' => $row['floor'],
									   'capacity' => $row['capacity'],
									   'id' => $row['id']
									  ]);
			}
		
		$myJSON = json_encode($myArray);
		echo $myJSON;

mysqli_close($db_connect);


?>