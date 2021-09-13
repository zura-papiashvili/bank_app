-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: lvl_bank
-- ------------------------------------------------------
-- Server version	8.0.23

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(50) NOT NULL,
  `email` varchar(60) NOT NULL,
  `idNumber` varchar(11) NOT NULL,
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  `role` enum('Operator','Customer','Company') NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `hash` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_d25cbe1884c60e838e814b2707` (`email`,`idNumber`,`phoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'cost gura','operator1@bank.com','00000000001',0,'Operator','555111111','$2b$10$0RQGy31S0uE2FLOFeAo25.PWM.iF5iObQKIcU6EohSykMTWusNbwe'),(12,'cost cost','customer1@bank.com','00000000002',0,'Customer','25252525','$2b$10$EfX8d.cfeJG5N5h0sb9Fq.FRt5mIje1PlFCAYed/Ze25oB0BuR6Oi'),(13,'comp any','company1@bank.com','00000000003',0,'Company','555111113','$2b$10$19tsF6AshpJgLodSmqv0H.GLNipGqD8cxi9bXCDPdTj7b8.8y6jNC'),(14,'socar','socar@bank.com','00000000004',0,'Company','555111000','$2b$10$FS1VXbkgmohmUWsCJ1Jltekca8I1XEyikp6l4vv87EIwdeizh7/Vu');
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

-- Dump completed on 2021-07-31 11:06:51
