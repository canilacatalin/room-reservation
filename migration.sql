

CREATE TABLE reservations (
	`id` int(8) NOT NULL AUTO_INCREMENT,
	`startTime` varchar(55) NOT NULL,
	`endTime` varchar(55) NOT NULL,
	`date` varchar(55) NOT NULL,
	`personName` varchar(55) NOT NULL,
	`roomId` int(8) NOT NULL,
	`comment` varchar(55) NOT NULL,
	PRIMARY KEY (`id`)
);
	
CREATE TABLE rooms (
	`id` int(8) NOT NULL AUTO_INCREMENT,
	`name` varchar(55) NOT NULL,
	`floor` varchar(55) NOT NULL,
	`capacity` varchar(55) NOT NULL,
	PRIMARY KEY (`id`)
);

--
-- Dumping data for table `rooms and reservations`
--

INSERT INTO rooms (`name`, `floor`, `capacity`) VALUES
('Prague', '3', '10' ),
('Viena', '2', '12'),
('Bucharest', '4', '20'),
('Sofia', '3', '6'),
('Madrid', '4', '3');

INSERT INTO reservations (`startTime`, `endTime`, `date`, `personName`, `comment`) VALUES
('11:30', '12:00', '22.03.2017', 'Joel', 'for my mather'),
('12:30', '13:00', '22.03.2017', 'Noel', 'for my father'),
('14:30', '15:00', '22.03.2017', 'Boel', 'for my daughter'),
('15:30', '16:00', '22.03.2017', 'Coiel', 'for my niece'),
('16:30', '17:00', '22.03.2017', 'Barbel','for my pleasure');

