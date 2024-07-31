-- Members: Christian Feliciano-Camacho & Connor Baskin
-- Group 80 Teachers and Tables, An Education Database for Student and Instructor Management
-- cs340
-- Updated 7/27/2024

-- phpMyAdmin SQL Dump
-- version 5.2.1-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 21, 2024 at 09:31 AM
-- Server version: 10.6.17-MariaDB-log
-- PHP Version: 8.2.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_feliciac`
--

-- --------------------------------------------------------

--
-- Table structure for table `AcademicAdvisors`
--

CREATE TABLE `AcademicAdvisors` (
  `advisorID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `salary` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `AcademicAdvisors`
--

INSERT INTO `AcademicAdvisors` (`advisorID`, `name`, `salary`) VALUES
(1, 'Herr Schneider', 25000.00),
(2, 'Alan Turing', 100000.00),
(3, 'Jack Welsh', 200000.00);



-- --------------------------------------------------------

--
-- Table structure for table `Courses`
--

CREATE TABLE `Courses` (
  `courseID` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `credits` int(11) NOT NULL,
  `departmentID` int(11) NOT NULL,
  `facultyID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Courses`
--

INSERT INTO `Courses` (`courseID`, `title`, `credits`, `departmentID`, `facultyID`) VALUES
(1, 'German for Germs', 3, 1, 1),
(2, 'Computer Science for Computers', 3, 2, NULL),
(3, 'Business for Bees', 3, 3, 3);


-- --------------------------------------------------------

--
-- Table structure for table `Departments`
--

CREATE TABLE `Departments` (
  `departmentID` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `budget` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Departments`
--

INSERT INTO `Departments` (`departmentID`, `name`, `budget`) VALUES
(1, 'Language Studies', 500000.00),
(2, 'Computer Science', 900000.00),
(3, 'Business', 1000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `Faculty`
--

CREATE TABLE `Faculty` (
  `facultyID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `departmentID` int(11) NOT NULL,
  `advisorID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Faculty`
--

INSERT INTO `Faculty` (`facultyID`, `name`, `salary`, `departmentID`, `advisorID`) VALUES
(1, 'John Alexander', 25000.00, 1, 1),
(2, 'Bjarne Stroustrup', 90000.00, 2, 2),
(3, 'Adam Grant', 150000.00, 3, 3);


-- --------------------------------------------------------

--
-- Table structure for table `StudentHasCourses`
--

CREATE TABLE `StudentHasCourses` (
  `studentID` int(11) NOT NULL,
  `courseID` int(11) NOT NULL,
  `enrollmentID` int(11) NOT NULL,
  `grade` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `StudentHasCourses`
--

INSERT INTO `StudentHasCourses` (`studentID`, `courseID`, `enrollmentID`, `grade`) VALUES
(1, 1, 1, '4.0'),
(2, 2, 2, '3.0'),
(3, 3, 3, '2.5');


-- --------------------------------------------------------

--
-- Table structure for table `Students`
--

CREATE TABLE `Students` (
  `studentID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `gpa` decimal(3,2) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `departmentID` int(11) Default NULL, -- Changed to default NUll to allow a Nullable relationship
  `advisorID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Students`
--

INSERT INTO `Students` (`departmentID`, `name`, `dateOfBirth`, `studentID`, `gpa`, `isActive`, `advisorID`) VALUES
(1, 'Ben Swayman', '2000-07-17', 1, 4.00, 1, 1),
(2, 'Adam Smith', '2001-06-16', 2, 3.00, 1, 2),
(3, 'Adam Smith', '2002-01-16', 3, 1.00, 0, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AcademicAdvisors`
--
ALTER TABLE `AcademicAdvisors`
  ADD PRIMARY KEY (`advisorID`);

--
-- Indexes for table `Courses`
--
ALTER TABLE `Courses`
  ADD PRIMARY KEY (`courseID`),
  ADD KEY `fk_Courses_Departments1_idx` (`departmentID`),
  ADD KEY `fk_Courses_Faculty1_idx` (`facultyID`);

--
-- Indexes for table `Departments`
--
ALTER TABLE `Departments`
  ADD PRIMARY KEY (`departmentID`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indexes for table `Faculty`
--
ALTER TABLE `Faculty`
  ADD PRIMARY KEY (`facultyID`),
  ADD KEY `fk_Faculty_Departments1_idx` (`departmentID`),
  ADD KEY `fk_Faculty_AcademicAdvisors1_idx` (`advisorID`);

--
-- Indexes for table `StudentHasCourses`
--
ALTER TABLE `StudentHasCourses`
  ADD PRIMARY KEY (`enrollmentID`),
  ADD KEY `fk_Students_has_Courses_Courses1_idx` (`courseID`),
  ADD KEY `fk_Students_has_Courses_Students1_idx` (`studentID`);

--
-- Indexes for table `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`studentID`),
  ADD KEY `fk_Students_Departments_idx` (`departmentID`),
  ADD KEY `fk_Students_AcademicAdvisors1_idx` (`advisorID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AcademicAdvisors`
--
ALTER TABLE `AcademicAdvisors`
  MODIFY `advisorID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Courses`
--
ALTER TABLE `Courses`
  MODIFY `courseID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Departments`
--
ALTER TABLE `Departments`
  MODIFY `departmentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Faculty`
--
ALTER TABLE `Faculty`
  MODIFY `facultyID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Students`
--
ALTER TABLE `Students`
  MODIFY `studentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Courses`
--
ALTER TABLE `Courses`
  ADD CONSTRAINT `fk_Courses_Departments1` FOREIGN KEY (`departmentID`) REFERENCES `Departments` (`departmentID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Courses_Faculty1` FOREIGN KEY (`facultyID`) REFERENCES `Faculty` (`facultyID`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `Faculty`
--
ALTER TABLE `Faculty`
  ADD CONSTRAINT `fk_Faculty_AcademicAdvisors1` FOREIGN KEY (`advisorID`) REFERENCES `AcademicAdvisors` (`advisorID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Faculty_Departments1` FOREIGN KEY (`departmentID`) REFERENCES `Departments` (`departmentID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `StudentHasCourses`
--
ALTER TABLE `StudentHasCourses`
  ADD CONSTRAINT `fk_Students_has_Courses_Courses1` FOREIGN KEY (`courseID`) REFERENCES `Courses` (`courseID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Students_has_Courses_Students1` FOREIGN KEY (`studentID`) REFERENCES `Students` (`studentID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `Students`
--
ALTER TABLE `Students`
  ADD CONSTRAINT `fk_Students_AcademicAdvisors1` FOREIGN KEY (`advisorID`) REFERENCES `AcademicAdvisors` (`advisorID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Students_Departments` FOREIGN KEY (`departmentID`) REFERENCES `Departments` (`departmentID`) ON DELETE SET NULL ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
