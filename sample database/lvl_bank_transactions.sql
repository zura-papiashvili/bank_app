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
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `amount` decimal(20,2) unsigned NOT NULL DEFAULT '0.00',
  `type` enum('Private','Service','Transfer','Deposit','Withdraw') NOT NULL,
  `status` enum('Pending','Sent','Rejected') NOT NULL,
  `receiverAccountId` int DEFAULT NULL,
  `senderAccountId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_0709f08a810a1865bba92aca11b` (`receiverAccountId`),
  KEY `FK_bf06b2bb716b23227f4fe178feb` (`senderAccountId`),
  CONSTRAINT `FK_0709f08a810a1865bba92aca11b` FOREIGN KEY (`receiverAccountId`) REFERENCES `accounts` (`id`),
  CONSTRAINT `FK_bf06b2bb716b23227f4fe178feb` FOREIGN KEY (`senderAccountId`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'2021-07-30 18:24:48',10.00,'Private','Sent',7,8),(2,'2021-07-31 10:34:16',19.00,'Service','Sent',7,8),(3,'2021-07-31 10:35:40',19.00,'Service','Sent',7,8),(4,'2021-07-31 10:39:22',19.00,'Service','Sent',7,8),(5,'2021-07-31 10:41:57',19.00,'Service','Sent',7,8),(6,'2021-07-31 10:43:01',19.00,'Service','Sent',7,8),(7,'2021-07-31 10:44:13',19.00,'Service','Sent',7,8),(8,'2021-07-31 10:45:24',19.00,'Service','Sent',7,8),(9,'2021-07-31 10:47:39',195.00,'Service','Sent',7,8),(10,'2021-07-31 10:48:29',195.00,'Service','Sent',7,8),(11,'2021-07-31 10:48:46',195.00,'Service','Sent',7,8),(12,'2021-07-31 10:49:33',195.00,'Service','Sent',7,8);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
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
