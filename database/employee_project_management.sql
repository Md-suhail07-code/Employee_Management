CREATE DATABASE  IF NOT EXISTS `employee_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `employee_management`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: employee_management
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employee_project`
--

DROP TABLE IF EXISTS `employee_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_project` (
  `project_id` bigint NOT NULL,
  `employee_id` bigint NOT NULL,
  KEY `FKc3ieuo3g8v3rwtaiehx1e5kdr` (`employee_id`),
  KEY `FK21riulocr3wn8p1gf1s211e7y` (`project_id`),
  CONSTRAINT `FK21riulocr3wn8p1gf1s211e7y` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `FKc3ieuo3g8v3rwtaiehx1e5kdr` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_project`
--

LOCK TABLES `employee_project` WRITE;
/*!40000 ALTER TABLE `employee_project` DISABLE KEYS */;
INSERT INTO `employee_project` VALUES (1,1),(1,2),(1,4),(2,3),(5,4);
/*!40000 ALTER TABLE `employee_project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `employee_code` varchar(255) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKetqhw9qqnad1kyjq3ks1glw8x` (`employee_code`),
  UNIQUE KEY `UKj2dmgsma6pont6kf7nic9elpd` (`user_id`),
  CONSTRAINT `FK69x3vjuy1t5p18a5llb8h2fjx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'IT','Software Engineer','EMP0001','2026-07-20','9876543210',6),(2,'IT','Product Manager','EMP0002','2026-07-18','9123456780',8),(3,'Finance','Financial Analyst','EMP0003','2026-07-15','9988776655',9),(4,'IT','Frontend Developer','EMP0004','2026-07-01','6301681293',12);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deadline` date DEFAULT NULL,
  `description` text,
  `priority` enum('HIGH','LOW','MEDIUM') DEFAULT NULL,
  `status` enum('COMPLETED','IN_PROGRESS','NOT_STARTED') DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `end_date` date NOT NULL,
  `project_code` varchar(255) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `progress` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK1batb7mq0elcfcs3d6maqo6sg` (`project_code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,NULL,'Develop a web application to manage employees, projects and tasks.','HIGH','COMPLETED',NULL,'2026-10-30','PRJ-001','Employee Management System','2026-07-01',100),(2,NULL,'Customer Relationship Management dashboard with analytics.','MEDIUM','IN_PROGRESS',NULL,'2026-09-15','PRJ-002','CRM Dashboard','2026-05-01',0),(3,NULL,'Human Resource Management Portal with leave, attendance and payroll.','MEDIUM','IN_PROGRESS',NULL,'2026-12-15','PRJ-003','HR Portal','2026-06-15',0),(4,NULL,'Track inventory, suppliers and warehouse operations.','LOW','NOT_STARTED',NULL,'2027-01-31','PRJ-004','Inventory Management','2026-08-01',0),(5,NULL,'Create a website to let users know about the study in Yemen','HIGH','COMPLETED',NULL,'2026-09-23','PRJ-005','Study in yemen','2026-07-23',100);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deadline` date DEFAULT NULL,
  `description` text,
  `progress` int DEFAULT NULL,
  `remarks` text,
  `status` enum('COMPLETED','IN_PROGRESS','TODO') DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `employee_id` bigint DEFAULT NULL,
  `project_id` bigint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `priority` enum('HIGH','LOW','MEDIUM') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjc3xiile6e5jbtmywxw5vfm7f` (`employee_id`),
  KEY `FKsfhn82y57i3k9uxww1s007acc` (`project_id`),
  CONSTRAINT `FKjc3xiile6e5jbtmywxw5vfm7f` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FKsfhn82y57i3k9uxww1s007acc` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'2026-07-30','Implement task module backend endpoints',100,'Start with auth flow','COMPLETED','Build API endpoints',2,1,'2026-07-24 06:40:59.414594','HIGH','2026-07-24 12:29:54.449553'),(2,'2026-07-24','Collect all the requirements to make that CRM dashboard',20,'','IN_PROGRESS','Requirements Collection',3,2,'2026-07-24 11:25:11.014009','MEDIUM','2026-07-24 12:18:40.655435'),(3,'2026-07-26','Create the folder for project with basic needs',100,'Start with creating frontend and backend folders','COMPLETED','Setup Git repo',4,5,'2026-07-24 12:21:00.457988','HIGH','2026-07-24 12:48:51.601239');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','EMPLOYEE') DEFAULT NULL,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test403@example.com','Test User','$2a$10$mSo/1b4P/wTMwDUVutt0KO7XjZl0pnsA0Ed6YfvcATjsUpVTs4AU2','EMPLOYEE',NULL),(2,'test403b@example.com','Test User','$2a$10$4Wg.co5ZevZjeXJJkGeFbuH1j2LK.EIE9Cwb6fGw9u1wEVhlwrZEm','EMPLOYEE',NULL),(3,'test403d@example.com','Test User','$2a$10$HDdlUdHHeip5ZeY0ZOa8b.VXrEwiDRlfwBaF6nZYnXNHzWGAm3Os6','EMPLOYEE',NULL),(4,'test403e@example.com','Test User','$2a$10$3mrBSBcmYf5JHTlKnl.2D./tnoo3ObJSMKs0M0mDUF/CufPxCg4H.','EMPLOYEE',NULL),(6,'rahul.sharma@company.com','Rahul Sharma','$2a$10$Ro.S19Kx9Htm3fjts0zcGurdGc8.d23TTIbkX9bRRqK97a7cWZbSW','EMPLOYEE',NULL),(7,'suhail@gmail.com','Mohammad Suhail','$2a$10$8/1UOzn6RX5bDL2W00x1pe92RK8kJ6yzmoSK3xXoDONuDC/0Gpofa','ADMIN','http://localhost:8080/uploads/avatars/user_7_bf8276cb.jpg'),(8,'priya.reddy@company.com','Priya Reddy','$2a$10$MiCyPrPxS8siFHooyM7nLeJMif4TwLGa0ipxt0pCNR21.nH0Q6EmK','EMPLOYEE','http://localhost:8080/uploads/avatars/user_8_933a9365.jpg'),(9,'arjun.verma@company.com','Arjun Verma','$2a$10$J61WQKEzRwSxmNpySF2//.a6Q/wxOKIG/VimVvsYf2WDSBx82bF0O','EMPLOYEE',NULL),(10,'admin.dashboard@test.com','Admin Dashboard','$2a$10$8G7za7DMRKJN8Tz./0O.aO8QAxb.Dr/p8sWy8OFM2vAGB3XOpulNi','ADMIN',NULL),(11,'admin.dashboard2@test.com','Admin Dashboard','$2a$10$89.paYk6wxK0g2lhYMvTI.bUsQE8KOmcSMKDshpT6bUtu7PdfFKrW','ADMIN',NULL),(12,'mujeeb@gmail.com','Shaik Mujeeb','$2a$10$NN0QShjc//NtpIrYW8DdZ.9B/IAEEKyKSJP2smhxMZsKMPAkjIYjS','EMPLOYEE',NULL),(13,'admintest@example.com','Admin Test','$2a$10$8WYFOSNJ16axsa5O0UIO0Oh/MtDIPYuTGnyZLiQ5Pfb8EU9pzuVUS','ADMIN',NULL),(14,'testadmin@example.com','Test Admin','$2a$10$4EfP4LKbtMOSTVclz2xY9.UDYxG7dWOwYoFQ8jtVRun4FkmTVIG5u','ADMIN',NULL),(15,'newadmin5@example.com','New Admin Updated','$2a$10$TD2BGq66LOa1qiE5wc9V6.Kl10fdTdLFrz0D4Z2CIUEiLbstrGSxm','ADMIN',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24 12:58:37
