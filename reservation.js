
$(document).ready(function() {	
	$.when(getReservationsAndRooms()).done(function(){
	});
	
	$("#searchButton").click(function(){
		showResults();
	});
	
	$("#addReservation").click(function(){
		var toDatabase = JSON.parse(localStorage.getItem('addReservationInfo'));
		addReservationToDb(
						   toDatabase[0].startTime,
						   toDatabase[0].endTime, 
						   toDatabase[0].date, 
						   document.getElementById("personName").value,
						   toDatabase[0].roomNumber,
						   document.getElementById("comment").value
						   );
		localStorage.removeItem("addReservationInfo");
		document.getElementById('myModal').style.display = "none";		 
	});

	$("#cancelModal").click(function(){
		document.getElementById('myModal').style.display = "none";	
	});
	
	$(".close").click(function(){
		document.getElementById('myModal').style.display = "none";
	});
	
	$(function(){
		  $.datepicker.setDefaults($.extend( $.datepicker.regional[ '' ] ));
		  $( '#startDate' ).datepicker({dateFormat: 'dd/mm/yy' });
		  $( '#endDate' ).datepicker({ dateFormat: 'dd/mm/yy' });
	});
  // --------------------------            jquery for admin_home.html -----------------------------------------
  
	$("#loginButton").click(function(){
		document.getElementById("loginPopup").style.display = "block";
	});
	
	$("#submitButton").click(function(){
		LoginCheck();
	});
	
	$("#cancelPopup").click(function(){
		document.getElementById("loginPopup").style.display = "none";
	});
	
});

$("admin_home.html").ready(function(){
	$("#showRooms").click(function()
	{
		$.when(getReservationsAndRooms()).done(function()
	   {	
		 showRooms();
	   });
	});
	slideShow();
	$('#addRoom').click(function(){
		newRoom();
	});
});

var reservations = [];
var rooms = [];


function getReservationsAndRooms()
{
	$.ajax({
		url: 'reservations.php',
		type: "GET",
		dataType: "json",
		success: function(data){
				reservations = data;
				}
		});		

	$.ajax({
		url: 'rooms.php',
		type: "GET",
		dataType: "json",
		success: function(data){
				rooms = data;
				}
		});					
}
	
function showResults()
{
	var result = addFiveResults(reservations);
	var table = document.getElementById("tableBody");
		table.innerHTML = "";
	var tableHead = document.getElementById("tableHead");
	    tableHead.innerHTML = "";
	
		$("#tableHead").append('<tr><td> Room number </td> <td> Room name  </td><td> Start time </td><td>  End time  </td><td> Date </td><td>  Capacity </td> </tr>');
	
	for(var i = 0; i<5; i++)
	{
	$("#tableBody").append('<tr><td id="roomId'+i+'">' 
							+ result[i].roomId + 
							'</td><td id="roomName'+i+'">'
							+ result[i].name + 
							'</td><td id="stime'+i+'">'
							+ result[i].startTime + 
							'</td><td id="etime'+i+'">'
							+ result[i].endTime + 
							'</td><td id="date'+i+'">'
							+ result[i].date + 
							'</td><td>' 
							+ result[i].capacity + 
							'</td><td><button onclick="makeReservation(this)">Make reservation</button></td></tr>');
	}
	
}

function getBetweenDates(start,end)
{
	var currentDate = new Date(start);
	var between = [];
	
	while(currentDate <= end){
		var wantedFormat = $.datepicker.formatDate("dd.mm.yy", currentDate);
		between.push({date: wantedFormat});
		currentDate.setDate(currentDate.getDate() + 1);
	}
	return between;
}

function returnOneTime(number)
{
	var time;
	var startTime = 600; 
		startTime = startTime + number * 15;
	var hours = Math.floor(startTime/60); 
	var minutes = (startTime%60); 
		time = ("0" + (hours % 24)).slice(-2) + ':' + ("0" + minutes).slice(-2); 
	return time;
}

function returnRoomsByCapacity(roomsArray, capacityWanted)
{
	var hasCapacityRequired = [];
	for(var i = 0; i < roomsArray.length; i++)
	{
		if(roomsArray[i].capacity >= capacityWanted && capacityWanted <=  roomsArray[i].capacity)	
		{
			hasCapacityRequired.push(rooms[i]);
		}
	}
	return hasCapacityRequired;
}


function addFiveResults(array)
{
	var final_reservations = [];
	var capacity = document.getElementById("capacity").value;
	var duration = document.getElementById("duration").value;
	var startDate = $("#startDate").datepicker("getDate");
	var endDate = $("#endDate").datepicker("getDate");
	var roomsThatMetCapacityRequirement = returnRoomsByCapacity(rooms, Number(capacity));
	var betweenDates = convertArrayToSingleDimensional(getBetweenDates(startDate,endDate));
	for(var i = 0; i< roomsThatMetCapacityRequirement.length; i++)
	{
		var currentRoom = roomsThatMetCapacityRequirement[i];
		
			for(var day = 0; day < betweenDates.length; day++)
			{
				var reservations = convertArrayToSingleDimensional(getReservationsForRoom(array, currentRoom, betweenDates[day].date));
				var match = getFirstFit(reservations, Number(duration));
				if(match!= null)
				{
					final_reservations.push({
											roomId: currentRoom.id,
											name: currentRoom.name,
											startTime: match,
											endTime: addMinutes(match, duration),
											date: betweenDates[day].date,
											capacity: currentRoom.capacity
											});
				}
				else
				{
					final_reservations.push({
											roomId: currentRoom.id,
											name: currentRoom.name,
											startTime: returnOneTime(0),
											endTime: addMinutes(returnOneTime(0), duration),
											date: betweenDates[day].date,
											capacity: currentRoom.capacity
											});
				}
			}
	}
	return final_reservations;
}

function getReservationsForRoom(array, room, date)
{
	var result = [];
	var filterByRoomAndDate = _.filter(array, function(item){
	return item.roomId == room.id && item.date == date;})
	result.push(filterByRoomAndDate);
	return result;
}

function getFirstFit(reservations, duration)
{
	
	reservationSort = _.sortBy(reservations, function(item){
	return item.startTime; })
	for( var i = 0; i< 50 ; i++)
	{
		var results = 0;
		var sTime = returnOneTime(i);
		for( var j = 0; j < reservationSort.length; j++)
		{
			if(timeRangeOverlaps(reservationSort[j].startTime, reservationSort[j].endTime, sTime, addMinutes(sTime, duration)))
			{
				results = 0;
			}
			else
			{
				results++;
			}
			if(results == reservationSort.length)
			{
			 return sTime;
			}
		}
		
	}
}

function timeRangeOverlaps(a_start, a_end, b_start, b_end)
{	
	if((a_start <= b_start && b_start < a_end) 
						|| 
	   (a_start < b_end && b_end <= a_end) 
						|| 
	   (b_start < a_start && a_end < b_end))
	  {
	  return true;
	  }
	return false;
}

function convertArrayToSingleDimensional(array)
{
	var singleDimensionalArray = [];
	for(var i = 0; i < array.length; i++)
	{
		singleDimensionalArray = singleDimensionalArray.concat(array[i]);
	}
	return singleDimensionalArray;
}

function addMinutes(time, minsToAdd)
{
	function z(n){
		return (n<10? '0':'') + n;
	}
	var split = time.split(':');
	var minutes = split[0]*60 + (+split[1]) + (+minsToAdd);
	
	return z(minutes%(24*60)/60 | 0) + ':' + z(minutes%60);  

}

function addReservationToDb(startTime, endTime, date, personName, roomId, comment)
{
	var dataString ='startTime=' + startTime +
					'&endTime=' + endTime + 
					'&date=' + date +
					'&personName=' + personName +
					'&roomId=' + roomId +
					'&comment=' + comment;
	$.ajax({
	type: "POST",
	url: "add_reservation.php",
	data: dataString,
	cache: false,
	success: function(){
			 alert(dataString);
			}
	});	
}



function makeReservation(e)
{
	var result = [];
	var index = $(e).closest("tr").index();
	var roomNumber = $("#roomId"+index).html();
	var roomName = $("#roomName"+index).html();
	var startTime = $("#stime"+index).html();
	var endTime = $("#etime"+index).html();
	var date = $("#date"+index).html();
	document.getElementById("time").innerHTML = startTime + " - " + endTime;
	document.getElementById("roomName").innerHTML = roomName;
	document.getElementById("date").innerHTML = date;
	if(document.getElementById('personName') == null)
	{
		$(".modal-body").append( '<label for="personName"> Add your name: </label><input type="text" id="personName" > <br> <label for="comment"> Add a comment: </label> <input type="text" id="comment">');
	}
	document.getElementById('myModal').style.display = "block";

	$("#addReservation").click(function(){
		
		result.push({startTime : startTime,
					 endTime: endTime,
					 date: date,
					 roomNumber: roomNumber});
					 
		localStorage.setItem("addReservationInfo", JSON.stringify(result));
	});
}

function LoginCheck()
{
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var dataString ='password=' + password + '&username=' + username;
	
	$.ajax({
		type: "POST",
		url: 'login.php',
		data: dataString,
		success: function(response){
			if(response == 'success')
			{
				 window.location='admin_home.html'
			}
			else
			{
				alert("Try again !");
			}
		}
	});
}

function addNewRoomToDb(name, floor, capacity)
{
	var dataString ='name=' + name +
					'&floor=' + floor + 
					'&capacity=' + capacity;
	$.ajax({
	type: "POST",
	url: "add_room.php",
	data: dataString,
	cache: false,
	success: function(){
			 alert(dataString);
			}
	});	
}

function newRoom()
{
	var capacity = document.getElementById("newRoomCapacity").value;
	var floor = document.getElementById("newRoomFloor").value;
	var name = document.getElementById("newRoomName").value;
	
	addNewRoomToDb(name, floor, capacity);
}

function showRooms()
{
	var table = document.getElementById("tBody");
		table.innerHTML = "";
	var tableHead = document.getElementById("tHead");
		tableHead.innerHTML = "";
	$("#tHead").append('<tr><td id="roomsHeader"> Number </td> <td id="roomsHeader"> Name  </td><td id="roomsHeader"> Floor </td><td id="roomsHeader">  Capacity  </td> </tr>');
	
	
	for(var i = 0; i < rooms.length; i++)
	{                                                                 
		$("#tBody").append('<tr><td id="roomsCells"> ' 
							+ rooms[i].id + 
							' </td> <td id="roomsCells"> '
							+ rooms[i].name + 
							' </td> <td id="roomsCells">'
							+ rooms[i].floor + 
							' </td> <td id="roomsCells"> ' 
							+ rooms[i].capacity + 
							' </td id="roomsCells"></tr>');
	}
}

function slideShow()
{
		var slides = document.querySelectorAll('#slides .slide');
		var currentSlide = 0;
		var slideInterval = setInterval(nextSlide,4000);

		function nextSlide() {
			slides[currentSlide].className = 'slide';
			currentSlide = (currentSlide+1)%slides.length;
			slides[currentSlide].className = 'slide showing';
		}
}
