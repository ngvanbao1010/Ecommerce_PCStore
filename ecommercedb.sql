CREATE DATABASE  IF NOT EXISTS `ecommercedb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ecommercedb`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommercedb
-- ------------------------------------------------------
-- Server version	8.4.5

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
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add Token',6,'add_token'),(22,'Can change Token',6,'change_token'),(23,'Can delete Token',6,'delete_token'),(24,'Can view Token',6,'view_token'),(25,'Can add Token',7,'add_tokenproxy'),(26,'Can change Token',7,'change_tokenproxy'),(27,'Can delete Token',7,'delete_tokenproxy'),(28,'Can view Token',7,'view_tokenproxy'),(29,'Can add category',8,'add_category'),(30,'Can change category',8,'change_category'),(31,'Can delete category',8,'delete_category'),(32,'Can view category',8,'view_category'),(33,'Can add user',9,'add_user'),(34,'Can change user',9,'change_user'),(35,'Can delete user',9,'delete_user'),(36,'Can view user',9,'view_user'),(37,'Can add order',10,'add_order'),(38,'Can change order',10,'change_order'),(39,'Can delete order',10,'delete_order'),(40,'Can view order',10,'view_order'),(41,'Can add payment',11,'add_payment'),(42,'Can change payment',11,'change_payment'),(43,'Can delete payment',11,'delete_payment'),(44,'Can view payment',11,'view_payment'),(45,'Can add pc configuration',12,'add_pcconfiguration'),(46,'Can change pc configuration',12,'change_pcconfiguration'),(47,'Can delete pc configuration',12,'delete_pcconfiguration'),(48,'Can view pc configuration',12,'view_pcconfiguration'),(49,'Can add product',13,'add_product'),(50,'Can change product',13,'change_product'),(51,'Can delete product',13,'delete_product'),(52,'Can view product',13,'view_product'),(53,'Can add order detail',14,'add_orderdetail'),(54,'Can change order detail',14,'change_orderdetail'),(55,'Can delete order detail',14,'delete_orderdetail'),(56,'Can view order detail',14,'view_orderdetail'),(57,'Can add comment',15,'add_comment'),(58,'Can change comment',15,'change_comment'),(59,'Can delete comment',15,'delete_comment'),(60,'Can view comment',15,'view_comment'),(61,'Can add cart',16,'add_cart'),(62,'Can change cart',16,'change_cart'),(63,'Can delete cart',16,'delete_cart'),(64,'Can view cart',16,'view_cart'),(65,'Can add review',17,'add_review'),(66,'Can change review',17,'change_review'),(67,'Can delete review',17,'delete_review'),(68,'Can view review',17,'view_review');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_ecommerce_user_id` FOREIGN KEY (`user_id`) REFERENCES `ecommerce_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('3907d2c40c7d908d084f2656cef7f62e3e49a7cd','2025-09-18 18:56:30.727749',1),('55d81a84f7a4cc7ee83f23fda658c483cbc13526','2025-09-11 17:09:33.945573',6),('98b842e79dea03f1bd9118287e13d190bb012180','2025-09-11 17:16:20.012430',7),('9f6cabc1014ee8df7941312324c9c71b8e91070c','2025-09-11 17:21:45.369597',9),('dc1aeaba705a505e04915ca71a4e2c99f9071755','2025-09-11 17:16:33.177646',8);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_user_id_product_id_ba270cfe_uniq` (`user_id`,`product_id`),
  KEY `carts_product_id_02913eac_fk_products_id` (`product_id`),
  CONSTRAINT `carts_product_id_02913eac_fk_products_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `carts_user_id_3a9d1785_fk_ecommerce_user_id` FOREIGN KEY (`user_id`) REFERENCES `ecommerce_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (111,1,'2025-09-18 14:27:49.945984',16,15),(115,3,'2025-09-18 17:37:33.801362',15,11),(118,1,'2025-09-20 01:41:43.910411',1,99),(119,1,'2025-09-20 01:52:41.657763',1,98);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (2,'CPU','','2025-09-11 12:22:28.261135'),(3,'RAM','','2025-09-11 12:22:34.143622'),(4,'GPU','','2025-09-11 12:22:37.677177'),(6,'Storage','','2025-09-11 12:44:31.489199'),(7,'PSU','','2025-09-11 12:44:36.834450'),(8,'Case','','2025-09-11 12:48:50.819686'),(9,'Cooling','','2025-09-11 12:48:50.825686'),(12,'PC','','2025-09-19 14:25:42.225506'),(13,'Mainboard','','2025-09-19 14:37:30.545553');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_text` longtext COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `is_staff_comment` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `parent_comment_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_product_325c4a_idx` (`product_id`,`parent_comment_id`),
  KEY `comments_parent_comment_id_fb2ef48d_fk_comments_id` (`parent_comment_id`),
  KEY `comments_user_id_b8fd0b64_fk_ecommerce_user_id` (`user_id`),
  CONSTRAINT `comments_parent_comment_id_fb2ef48d_fk_comments_id` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`),
  CONSTRAINT `comments_product_id_b3e3dc63_fk_products_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `comments_user_id_b8fd0b64_fk_ecommerce_user_id` FOREIGN KEY (`user_id`) REFERENCES `ecommerce_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'Great CPU! Perfect for gaming and streaming. Highly recommended!',0,'2025-09-11 12:48:50.930703',NULL,1,1),(2,'Good performance but runs a bit hot under load. Make sure you have good cooling.',0,'2025-09-11 12:48:50.936703',NULL,3,1),(3,'Excellent graphics card for 4K gaming. Worth the price!',0,'2025-09-11 12:48:50.944704',NULL,4,3),(4,'Toio',0,'2025-09-12 08:51:16.577913',NULL,10,15),(5,'A',0,'2025-09-12 08:53:29.240981',NULL,10,15),(6,'Ổ cứng nhanh dung lượng cao',0,'2025-09-12 09:16:12.205729',NULL,10,13),(7,'Cảm ơn quý khách',1,'2025-09-12 09:45:44.955796',6,2,13),(8,'Thank you',0,'2025-09-16 01:55:41.917630',6,1,13),(9,'B',1,'2025-09-16 01:56:19.680633',5,1,15);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_vi_0900_ai_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_ecommerce_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_ecommerce_user_id` FOREIGN KEY (`user_id`) REFERENCES `ecommerce_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-09-11 12:19:18.492811','1','Mainboard',1,'[{\"added\": {}}]',8,1),(2,'2025-09-11 12:22:28.261135','2','CPU',1,'[{\"added\": {}}]',8,1),(3,'2025-09-11 12:22:34.144622','3','RAM',1,'[{\"added\": {}}]',8,1),(4,'2025-09-11 12:22:37.677177','4','VGA',1,'[{\"added\": {}}]',8,1),(5,'2025-09-11 12:43:58.010958','1','Mainboard',3,'',8,1),(6,'2025-09-11 12:44:15.101820','4','GPU',2,'[{\"changed\": {\"fields\": [\"Name\"]}}]',8,1),(7,'2025-09-11 12:44:23.255434','5','Motherboard',1,'[{\"added\": {}}]',8,1),(8,'2025-09-11 12:44:31.489199','6','Storage',1,'[{\"added\": {}}]',8,1),(9,'2025-09-11 12:44:36.834450','7','PSU',1,'[{\"added\": {}}]',8,1),(10,'2025-09-11 13:24:09.526238','11','NVIDIA GeForce RTX 4090',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(11,'2025-09-11 15:55:58.712527','4','AMD Radeon RX 7800 XT',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(12,'2025-09-11 15:56:50.673082','17','be quiet! Dark Power Pro 12 1000W',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(13,'2025-09-11 15:57:17.416913','16','Cooler Master MasterBox TD500 Mesh',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(14,'2025-09-11 15:57:57.430939','15','Corsair Dominator Platinum RGB 32GB DDR5',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(15,'2025-09-11 15:58:16.221797','14','WD Blue 1TB SATA SSD',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(16,'2025-09-11 15:59:13.409517','13','Crucial P5 Plus 2TB NVMe SSD',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(17,'2025-09-11 16:01:46.498844','12','AMD Radeon RX 7900 XTX',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(18,'2025-09-11 16:03:42.664559','10','AMD Ryzen 9 7900X',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(19,'2025-09-11 16:04:05.542116','9','Intel Core i9-13900K',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(20,'2025-09-11 16:05:09.851115','8','MSI MAG B650 TOMAHAWK',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(21,'2025-09-11 16:05:26.613595','7','ASUS ROG STRIX Z790-E',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(22,'2025-09-11 16:05:47.355682','6','G.Skill Trident Z5 32GB DDR5-5600',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(23,'2025-09-11 16:06:05.206931','5','Corsair Vengeance LPX 32GB DDR4-3200',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(24,'2025-09-11 16:06:10.777066','4','AMD Radeon RX 7800 XT',2,'[]',13,1),(25,'2025-09-11 16:06:32.947163','3','NVIDIA GeForce RTX 4070 Ti',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(26,'2025-09-11 16:06:56.256585','2','AMD Ryzen 7 7700X',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(27,'2025-09-11 16:07:35.080512','1','Intel Core i7-13700K',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(28,'2025-09-11 16:47:40.916347','17','be quiet! Dark Power Pro 12 1000W',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(29,'2025-09-11 16:48:14.749993','16','Cooler Master MasterBox TD500 Mesh',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(30,'2025-09-11 16:48:23.394483','15','Corsair Dominator Platinum RGB 32GB DDR5',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(31,'2025-09-11 16:48:29.188988','14','WD Blue 1TB SATA SSD',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(32,'2025-09-11 16:48:46.619146','13','Crucial P5 Plus 2TB NVMe SSD',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(33,'2025-09-11 16:48:54.312588','12','AMD Radeon RX 7900 XTX',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(34,'2025-09-11 16:49:01.876022','11','NVIDIA GeForce RTX 4090',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(35,'2025-09-11 16:49:10.959130','10','AMD Ryzen 9 7900X',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(36,'2025-09-11 16:49:16.607961','9','Intel Core i9-13900K',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(37,'2025-09-11 16:49:25.451083','8','MSI MAG B650 TOMAHAWK',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(38,'2025-09-11 16:49:43.204631','7','ASUS ROG STRIX Z790-E',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(39,'2025-09-11 16:49:50.782194','6','G.Skill Trident Z5 32GB DDR5-5600',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(40,'2025-09-11 16:49:56.020982','5','Corsair Vengeance LPX 32GB DDR4-3200',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(41,'2025-09-11 16:50:02.707176','4','AMD Radeon RX 7800 XT',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(42,'2025-09-11 16:50:07.967945','3','NVIDIA GeForce RTX 4070 Ti',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(43,'2025-09-11 16:50:16.279942','2','AMD Ryzen 7 7700X',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(44,'2025-09-11 16:50:27.683437','1','Intel Core i7-13700K',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(45,'2025-09-12 07:09:31.479732','17','be quiet! Dark Power Pro 12 1000W',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(46,'2025-09-12 07:09:49.857846','16','Cooler Master MasterBox TD500 Mesh',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(47,'2025-09-12 07:10:07.755915','15','Corsair Dominator Platinum RGB 32GB DDR5',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(48,'2025-09-12 07:10:23.445334','14','WD Blue 1TB SATA SSD',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(49,'2025-09-12 07:10:43.618151','13','Crucial P5 Plus 2TB NVMe SSD',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(50,'2025-09-12 07:11:38.848212','12','AMD Radeon RX 7900 XTX',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(51,'2025-09-12 07:11:49.379954','11','NVIDIA GeForce RTX 4090',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(52,'2025-09-12 07:21:13.919157','10','AMD Ryzen 9 7900X',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(53,'2025-09-12 07:21:33.245269','9','Intel Core i9-13900K',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(54,'2025-09-12 07:22:01.290946','8','MSI MAG B650 TOMAHAWK',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(55,'2025-09-12 07:22:14.753009','7','ASUS ROG STRIX Z790-E',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(56,'2025-09-12 07:22:35.630670','6','G.Skill Trident Z5 32GB DDR5-5600',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(57,'2025-09-12 07:22:49.794173','5','Corsair Vengeance LPX 32GB DDR4-3200',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(58,'2025-09-12 07:23:10.549915','4','AMD Radeon RX 7800 XT',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(59,'2025-09-12 07:23:25.288578','3','NVIDIA GeForce RTX 4070 Ti',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(60,'2025-09-12 07:23:46.858089','2','AMD Ryzen 7 7700X',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(61,'2025-09-12 07:24:00.797138','1','Intel Core i7-13700K',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',13,1),(62,'2025-09-12 09:21:39.942228','13','admintest',1,'[{\"added\": {}}]',9,1),(63,'2025-09-16 01:55:56.847648','1','admin',2,'[{\"changed\": {\"fields\": [\"Role\"]}}]',9,1),(64,'2025-09-16 05:27:55.261186','7','Order ORD-04150748',2,'[{\"changed\": {\"fields\": [\"Status\", \"Payment status\"]}}]',10,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(6,'authtoken','token'),(7,'authtoken','tokenproxy'),(4,'contenttypes','contenttype'),(16,'ecommerce','cart'),(8,'ecommerce','category'),(15,'ecommerce','comment'),(10,'ecommerce','order'),(14,'ecommerce','orderdetail'),(11,'ecommerce','payment'),(12,'ecommerce','pcconfiguration'),(13,'ecommerce','product'),(17,'ecommerce','review'),(9,'ecommerce','user'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-09-11 12:14:25.571153'),(2,'contenttypes','0002_remove_content_type_name','2025-09-11 12:14:25.617936'),(3,'auth','0001_initial','2025-09-11 12:14:25.748947'),(4,'auth','0002_alter_permission_name_max_length','2025-09-11 12:14:25.779458'),(5,'auth','0003_alter_user_email_max_length','2025-09-11 12:14:25.783458'),(6,'auth','0004_alter_user_username_opts','2025-09-11 12:14:25.786463'),(7,'auth','0005_alter_user_last_login_null','2025-09-11 12:14:25.788960'),(8,'auth','0006_require_contenttypes_0002','2025-09-11 12:14:25.790965'),(9,'auth','0007_alter_validators_add_error_messages','2025-09-11 12:14:25.792961'),(10,'auth','0008_alter_user_username_max_length','2025-09-11 12:14:25.795961'),(11,'auth','0009_alter_user_last_name_max_length','2025-09-11 12:14:25.799961'),(12,'auth','0010_alter_group_name_max_length','2025-09-11 12:14:25.807465'),(13,'auth','0011_update_proxy_permissions','2025-09-11 12:14:25.810465'),(14,'auth','0012_alter_user_first_name_max_length','2025-09-11 12:14:25.813465'),(15,'ecommerce','0001_initial','2025-09-11 12:14:26.555069'),(16,'admin','0001_initial','2025-09-11 12:14:26.644605'),(17,'admin','0002_logentry_remove_auto_add','2025-09-11 12:14:26.649605'),(18,'admin','0003_logentry_add_action_flag_choices','2025-09-11 12:14:26.655605'),(19,'authtoken','0001_initial','2025-09-11 12:14:26.706614'),(20,'authtoken','0002_auto_20160226_1747','2025-09-11 12:14:26.725613'),(21,'authtoken','0003_tokenproxy','2025-09-11 12:14:26.726613'),(22,'authtoken','0004_alter_tokenproxy_options','2025-09-11 12:14:26.730121'),(23,'ecommerce','0002_remove_product_image_url_product_image','2025-09-11 12:14:26.793946'),(24,'ecommerce','0003_remove_review_review_text_alter_order_payment_method_and_more','2025-09-11 12:14:26.843449'),(25,'ecommerce','0004_order_orders_user_id_4e08b8_idx_and_more','2025-09-11 12:14:26.887457'),(26,'sessions','0001_initial','2025-09-11 12:14:26.905765'),(27,'ecommerce','0005_user_avatar','2025-09-12 13:55:08.269859'),(28,'ecommerce','0006_remove_user_avatar_url','2025-09-12 14:36:24.072006');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('1783bczjg3qp2pkspkc2mzjjm1w7dqsh','.eJxVjEsOAiEQBe_C2hAaRMCle88waZpuGTWQzGdlvLtOMgvdvqp6LzXgutRhnXkaxqLOCow6_I4Z6cFtI-WO7dY19bZMY9abonc662sv_Lzs7t9Bxbl-6xyAbUqICcV4X0DEgj1SIeTEpyBAnsmwcdnHSM4Fh5HBZEE2IqDeHya4ORQ:1uwzK2:kI-ygxoBX_etWPLIGJCd71i7jh1ysqTIAss79p7ysic','2025-09-26 08:39:58.283778'),('2ax31zwbwy38w5dp243w7dch05bg3sog','.eJxVjMsOwiAQRf-FtSEw5enSvd9ABhikaiAp7cr479qkC93ec859sYDbWsM2aAlzZmfm2Ol3i5ge1HaQ79hunafe1mWOfFf4QQe_9kzPy-H-HVQc9VuTjEmoIkEbmQENeWWApJAmF2FRgJhAo7WTKo6MF1GXDMq4qGPxU1Ls_QHM-Dc5:1uwkub:bu4oFKbf1qNnLzgfM-zmVaFP7In9hEYmEZF5AJHwuUg','2025-09-25 17:16:45.005828'),('3lylddv7e6cldz6b0m7381d7o7cgt42u','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uyKvP:ohPgAslkOTCeQ4lBYeZWpgswRofnBBIEaVS_2EtUiYs','2025-09-30 01:56:07.544992'),('3nolyh184x5kap9cse1q3xwwi2kypbxt','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uzIMs:Ech6weBG8d3n4NaGw8ZEsioy9bPa2ZgMIN6tyBXMpS0','2025-10-02 17:24:26.704910'),('4p892qocqg0yy5bc7x1ci5zkwzk3s9k8','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uyOL8:oaP4BsxhFGl2FE-QnQgHHug3HO-ELWgq0L-2x78Hro0','2025-09-30 05:34:54.884450'),('53suunk17pnddtvqmz0kwex7og3dierz','.eJxVjEsOAiEQBe_C2hAaRMCle88waZpuGTWQzGdlvLtOMgvdvqp6LzXgutRhnXkaxqLOCow6_I4Z6cFtI-WO7dY19bZMY9abonc662sv_Lzs7t9Bxbl-6xyAbUqICcV4X0DEgj1SIeTEpyBAnsmwcdnHSM4Fh5HBZEE2IqDeHya4ORQ:1uyWAz:J3TLhimRCM_-3YwJ0OR-tRSAlA2dbhK7SQ97OhO8F5A','2025-09-30 13:56:57.773744'),('5v22l6o82hhz6372atumefgdrepv2id6','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uzFd9:VJxQPPo3YnZ_sYzVAOXXO9gNIjWV3xZajvMXUiqdBTg','2025-10-02 14:29:03.332898'),('64qoho2pkufx0jpdrba3uc1ooeb88xhn','.eJxVjEsOAiEQBe_C2hAaRMCle88waZpuGTWQzGdlvLtOMgvdvqp6LzXgutRhnXkaxqLOCow6_I4Z6cFtI-WO7dY19bZMY9abonc662sv_Lzs7t9Bxbl-6xyAbUqICcV4X0DEgj1SIeTEpyBAnsmwcdnHSM4Fh5HBZEE2IqDeHya4ORQ:1uwzLp:KJTkKWwMxU6fIP092nYH5ETH2GdRrOhPvqj96dT9xWY','2025-09-26 08:41:49.235376'),('6b84zf91ekhb8texrv7kzr7pzjhy2oqo','.eJxVjEEOwiAQRe_C2hAsHSgu3fcMZIYZpGpoUtqV8e7apAvd_vfef6mI21ri1mSJE6uLOoM6_Y6E6SF1J3zHept1muu6TKR3RR-06XFmeV4P9--gYCvfOgkCigUkZuskGzIDMGDHph8yOwkhg-0Te8fJBAKTnRcMXjofCFm9P0HrOWM:1uzIXz:51R-uIEXU5MpJRxFfYj768bkiVdE3KWKhFeHguvJ_0U','2025-10-02 17:35:55.746076'),('6spqpitfc2qcni9luna884vio48gp2hk','.eJxVjEsOAiEQBe_C2hAaRMCle88waZpuGTWQzGdlvLtOMgvdvqp6LzXgutRhnXkaxqLOCow6_I4Z6cFtI-WO7dY19bZMY9abonc662sv_Lzs7t9Bxbl-6xyAbUqICcV4X0DEgj1SIeTEpyBAnsmwcdnHSM4Fh5HBZEE2IqDeHya4ORQ:1uyuCD:Kt-Jm311R6js-zgyPoROLixj0WT1SZCYMYH0OONzW3w','2025-10-01 15:35:49.756625'),('71ug81dmbiij9wmlnsb0nfe4xkr9qlml','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uz9ON:NErMOFzlz_AiucYFXy8VS0ZGFPuzuVXGhXcZpYB3Nr4','2025-10-02 07:49:23.610672'),('9gk68kbe2iwbbzhlhjvb5atk0xcawhf2','.eJxVjEEOwiAQRe_C2hAsHSgu3fcMZIYZpGpoUtqV8e7apAvd_vfef6mI21ri1mSJE6uLOoM6_Y6E6SF1J3zHept1muu6TKR3RR-06XFmeV4P9--gYCvfOgkCigUkZuskGzIDMGDHph8yOwkhg-0Te8fJBAKTnRcMXjofCFm9P0HrOWM:1uz3zc:S1oqGlGkeT5EnS10nZdNn-43TrW1DfNB_ZKMT9ukvqQ','2025-10-02 02:03:28.683124'),('9smpesv4r3gf3rvixb0bq473y53jqmyf','.eJxVjEsOAiEQBe_C2hAaRMCle88waZpuGTWQzGdlvLtOMgvdvqp6LzXgutRhnXkaxqLOCow6_I4Z6cFtI-WO7dY19bZMY9abonc662sv_Lzs7t9Bxbl-6xyAbUqICcV4X0DEgj1SIeTEpyBAnsmwcdnHSM4Fh5HBZEE2IqDeHya4ORQ:1ux09y:2c_NiWSpr7MeU3ggNjdvXwhzruEmcdauje33jt-Rkh8','2025-09-26 09:33:38.675745'),('azuvqz748is5pvcpfzs6qhdnkoanvml1','.eJxVjEEOwiAQRe_C2hAsHSgu3fcMZIYZpGpoUtqV8e7apAvd_vfef6mI21ri1mSJE6uLOoM6_Y6E6SF1J3zHept1muu6TKR3RR-06XFmeV4P9--gYCvfOgkCigUkZuskGzIDMGDHph8yOwkhg-0Te8fJBAKTnRcMXjofCFm9P0HrOWM:1uzIEj:ZoQAchGyFFeg1me9wuIunGsgvl0sH1Rr8JIGvxjno7o','2025-10-02 17:16:01.999798'),('gkw6sjbbjb2de74ktjcx1livi7bndsgp','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uzJny:1fZ5r_HN_yXkZuj2dLJqGAlnZOJbvO1uRNaYpY_2JEs','2025-10-02 18:56:30.729749'),('go4ve9634i0bcz15vbgt7ikezgbs51i8','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uzAPS:qZT9gyOAOlZFVB2qNTsRycPtbffe4Gf6J8rcspZ4AFI','2025-10-02 08:54:34.865476'),('ixvr4h6nmv4abfoco3deb9v51eyj6z5z','.eJxVjEsOAiEQBe_C2hAaRMCle88waZpuGTWQzGdlvLtOMgvdvqp6LzXgutRhnXkaxqLOCow6_I4Z6cFtI-WO7dY19bZMY9abonc662sv_Lzs7t9Bxbl-6xyAbUqICcV4X0DEgj1SIeTEpyBAnsmwcdnHSM4Fh5HBZEE2IqDeHya4ORQ:1uyCZ0:c0Hm3HPi0rGVzP5Im9mO5CMquO5tAZ0De-yLQmJt6OY','2025-09-29 17:00:26.383304'),('jfstycyjonban49eikjsfxckajlloo9n','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uyWHk:LOvX_pKu3fmsz2vEP9RvOsQOjLoiLWvFFKUq-XT6K2s','2025-09-30 14:03:56.529277'),('l4psod0sdai7b9p8sgr5ld00ga7l4g46','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uzIa1:wKb5ZiOHh5HQe75Z7Xx3tF7QIs_px5T2Aux7eE1N9ZY','2025-10-02 17:38:01.132719'),('m0rp614wwmv8qllpc1cqkoreeg2975dx','.eJxVjEEOwiAQRe_C2hAYhrTj0r1nIANMpWogKe3KeHdt0oVu_3vvv1TgbS1h67KEOauzAnX63SKnh9Qd5DvXW9Op1XWZo94VfdCury3L83K4fweFe_nWImCIohXj0uSNBxrM5L0jss7BiBHADUBgOVrLyHZERmFM5CATgnp_ALJRNm8:1ux0L0:QZ_M-6IxrlcM_ZpuJUGP1vI1B3EneRdUk580BNg_dMo','2025-09-26 09:45:02.974874'),('mhg2qqk5t6hpf3uu8q6r0g3n0uzxftig','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uyWAb:hH9kjdwNPm5Lad7BtQSO956PhcJeq56PGFxC8PtZxqY','2025-09-30 13:56:33.752436'),('mk0empb2wbbyk8n4avucb8o74gke4hyb','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uzHCO:cHszKcR0o_WME8ZFd4ASh5lAxekv0g36idWx8P-I6xs','2025-10-02 16:09:32.418472'),('p03la0xxq1w7tj07qebvxdwyjzfilgcq','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uyuGJ:EbO50ncM7EMfRe5GrsrAOTAkLGgOZA8SODfMY53fPt0','2025-10-01 15:40:03.421636'),('s8tsazasjy4rlldrid1gqfy3lp8wrdce','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uyNPN:8yFkq-AXKFtVhUL4KvRoShyeXsFSsxSNjstsyUcmNZg','2025-09-30 04:35:13.030050'),('tjhzm1gq8oeqcu5c6ox8l92l7t9cl1mc','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uwgDN:kc9MwQnvOU_LDG1dmxYy2jN6wlpLseIDVU541IAltME','2025-09-25 12:15:49.328198'),('tjmdi63b33fzuxdi1c27sa17wtb70ov9','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uyKuN:94rnxDkb7LRA-YhBJxz-ZujN_7fHsjP21Tqq5azQaqc','2025-09-30 01:55:03.117640'),('tngenotfnq2l1rpxgbiwkv1aa2ku320l','.eJxVjEEOwiAQRe_C2hAsHSgu3fcMZIYZpGpoUtqV8e7apAvd_vfef6mI21ri1mSJE6uLOoM6_Y6E6SF1J3zHept1muu6TKR3RR-06XFmeV4P9--gYCvfOgkCigUkZuskGzIDMGDHph8yOwkhg-0Te8fJBAKTnRcMXjofCFm9P0HrOWM:1uz52m:DxWO-pJ-YgqXJFD4n3uZGr-Sf0NfDd-rncIckh777qs','2025-10-02 03:10:48.018553'),('vziedut4nuwao928komf7e4ae21zxvyj','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uyONx:aTEWYTf4zZ2lwtgYgFcfpMi7S2geKRbtVGGDAHhkzaU','2025-09-30 05:37:49.907891'),('ybpr0qonb5kq4n9hokhnblmr7ganur9m','.eJxVjMEOwiAQRP-FsyFggQWP3v0GsrCLVA1NSnsy_rtt0oMe5jLvzbxFxHWpce08x5HERWhx-u0S5ie3HdAD232SeWrLPCa5K_KgXd4m4tf1cP8OKva6rZPSsMWcc2GrvUcK2irnYCgOXAnFOAJFkCwnJLA2K2OKAQ9hwKBZfL7NVDdX:1uyNza:s6V_2sugTf-wHofo1roNGhve5TcMtCXF_8tYkHVdADg','2025-09-30 05:12:38.837461'),('z15clbiy1bi5jmld67z4j3su4zu3vek5','.eJxVjEsOAiEQBe_C2hAaRMCle88waZpuGTWQzGdlvLtOMgvdvqp6LzXgutRhnXkaxqLOCow6_I4Z6cFtI-WO7dY19bZMY9abonc662sv_Lzs7t9Bxbl-6xyAbUqICcV4X0DEgj1SIeTEpyBAnsmwcdnHSM4Fh5HBZEE2IqDeHya4ORQ:1ux4Fq:I84pTtcqxBqAD_hK1_xteRDezBw0jin8bes2d9aBhSI','2025-09-26 13:55:58.529627');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ecommerce_user`
--

DROP TABLE IF EXISTS `ecommerce_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ecommerce_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `address` longtext COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `avatar` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ecommerce_user`
--

LOCK TABLES `ecommerce_user` WRITE;
/*!40000 ALTER TABLE `ecommerce_user` DISABLE KEYS */;
INSERT INTO `ecommerce_user` VALUES (1,'pbkdf2_sha256$1000000$aLD09tCTGXCkqIpNE3r9fp$mxwl6ySXSBuN9vRHLktRc4oBSKWGJECdlFzg25nbC7M=','2025-09-18 18:56:30.725749',1,'admin','','','admin@gmail.com',1,1,'2025-09-11 12:15:42.000000','admin','Test','430838493','','2025-09-11 12:15:43.076921',''),(2,'pbkdf2_sha256$1000000$DrJajEuYpG3iakIlGX9Cd4$NCFMhOatmc5dM0EbYSQiuMFY+5kBhoMkd8jTTIVk9ko=','2025-09-12 09:45:02.959627',0,'staff','','','staff@example.com',0,1,'2025-09-11 12:48:49.912661','staff','Staff User','','','2025-09-11 12:48:50.134986',NULL),(3,'pbkdf2_sha256$1000000$KVY2BI0AoMXv35jcwF36Zz$0nr/DELihhO0pflrCk5Vd8/wZza/lDzUJlZ6jKpeTZo=',NULL,0,'customer1','','','customer1@example.com',0,1,'2025-09-11 12:48:50.141986','customer','John Doe','','','2025-09-11 12:48:50.360604',NULL),(4,'pbkdf2_sha256$1000000$DVNmTPVulP20ZDTIhfpkAL$NNsfEdBC91wharUFrWPMvQ1bNYGLnGDMwv/SLLuOdrE=',NULL,0,'customer2','','','customer2@example.com',0,1,'2025-09-11 12:48:50.366604','customer','Jane Smith','','','2025-09-11 12:48:50.587207',NULL),(5,'pbkdf2_sha256$1000000$oe0mEJM5bCdgYuxIHMAD3B$9hcH8VEMlKutqicIKY9CVAYNhZB9r0I9spggziugynU=',NULL,0,'customer3','','','customer3@example.com',0,1,'2025-09-11 12:48:50.593208','customer','Mike Johnson','','','2025-09-11 12:48:50.811261',NULL),(6,'pbkdf2_sha256$1000000$Y8QkjlQDai5kKBun9SfJXl$8+QaVwihI1sCtBNZ2k5uqCnTqgee+5Q549joCUdhCqs=',NULL,0,'testuser123','','','test@example.com',0,1,'2025-09-11 17:09:33.701972','customer','Test User','0123456789','123 Test Street','2025-09-11 17:09:33.701972',NULL),(7,'pbkdf2_sha256$1000000$sioOTFUft1OgFGARhOUcsb$3i77IX/qVB6QeivBniHo3MddkdWHUDSXX9VHIFrVjTY=',NULL,0,'testuser','','','test@example.com',0,1,'2025-09-11 17:16:19.782951','customer','Test User','0123456789','123 Test Street','2025-09-11 17:16:19.782951',NULL),(8,'pbkdf2_sha256$1000000$JoCDkiJRhXM7irpPK4l09d$VlqHpopsuurA5XA0ucTydwipzl0ZjKKXurmzLstYbRs=','2025-09-11 17:16:45.002827',0,'testuser2','','','test2@example.com',0,1,'2025-09-11 17:16:32.950523','customer','Test User 2','0123456789','123 Test Street','2025-09-11 17:16:32.951523',NULL),(9,'pbkdf2_sha256$1000000$6D7ONMSUoskgqTh0LGoF0V$XVMulogpzBTcpPJK0Dxj+/8cqfxVtLda3/6rq2PUVz8=',NULL,0,'testuser4@example.com','','','testuser4@example.com',0,1,'2025-09-11 17:21:45.142551','customer','Test User 4','0123456789','123 Test Street','2025-09-11 17:21:45.142551',NULL),(10,'pbkdf2_sha256$1000000$9HSQUbfxLm5qFzdkJfwKVK$khBEXbPBaVbogmbywlvRusxBCXXSZOMi/v7YcJ+xIOQ=','2025-09-17 15:35:49.741472',0,'baolovemami1@gmail.com','','','baolovemami1@gmail.com',0,1,'2025-09-11 17:24:37.115227','customer','Bao Nguyen','0833201161','Nhà Bè2','2025-09-11 17:24:37.116226','avatars/2025/09/ScreenShot-2025-7-9_23-41-39_nzwZKmC.png'),(11,'pbkdf2_sha256$1000000$NqS3XdPYGANTI5jENZB65t$l6no9Ht4RUPFhs+mNUHC99HOmdMjpdQdsD1dDlNhUQs=',NULL,0,'thcsthg.vanbao.9a6','','','thcsthg.vanbao.9a6@gmail.com',0,1,'2025-09-12 08:29:57.850920','customer','Nguyen Bao','01232001123','1545/20','2025-09-12 08:29:57.850920',NULL),(12,'pbkdf2_sha256$1000000$eMUK3GyWh4AF3fq1l94eSD$77YyO1iAnBBfNYF6PcKa30KsOur9m5syHMz9BYRXhgU=',NULL,0,'122322','','','122322@gmail.com',0,1,'2025-09-12 08:39:38.965712','customer','Hao Nguyen','1338358358','','2025-09-12 08:39:38.965712',NULL),(13,'0833201161bao',NULL,0,'admintest','','','admintest@gmail.com',0,1,'2025-09-12 09:20:20.000000','admin','','','','2025-09-12 09:21:39.938547',NULL),(14,'pbkdf2_sha256$1000000$NyQbxUim5LEuDiRp285Fa1$138WWf/b3HSrqGxuM6Mm1WRmLrH10MVkbbreUuqLDhc=',NULL,0,'vanbao524892','','','vanbao524892@gmail.com',0,1,'2025-09-16 14:02:56.133276','customer','Hào Nguyễn','01234939394','432/3A Bình Thạnh, Hồ Chí Minh','2025-09-16 14:02:56.133276',''),(15,'pbkdf2_sha256$1000000$7aJpzxbfjOwQLJ3qssKAIQ$HbaVCn7qaHTWt4xKlRNFzxuCWBqCmkvt/zdMJJCyr/I=','2025-09-18 17:35:55.741076',0,'solarkunwb1','','','solarkunwb1@gmail.com',0,1,'2025-09-17 15:37:28.079794','customer','Hào Nguyễn','01234939394','Bình Dương','2025-09-17 15:37:28.079794',''),(16,'pbkdf2_sha256$1000000$BbwXOoEWG6AgoVkb0cNu4L$uP3/wSsrRbSWNaX+nt93nKS3vGGcFFSPm3f3x4cb7MU=',NULL,0,'solarkunwb2','','','solarkunwb2@gmail.com',0,1,'2025-09-18 14:27:34.056616','customer','Ngân Nguyễn','03293238282','','2025-09-18 14:27:34.057617',''),(17,'pbkdf2_sha256$1000000$v6jdJsnvaWaMLJiQkP9Jps$4mfHvaQEPzItBS2txxmkgyc9CsXN97hp/ruAyuVBJ+I=',NULL,0,'solarkunwb3','','','solarkunwb3@gmail.com',0,1,'2025-09-18 18:55:02.800595','customer','Bảo Nguyễn Văn','01232001123','Bình Thạnh, HCM','2025-09-18 18:55:02.800595','avatars/2025/09/daihoi3.jpg');
/*!40000 ALTER TABLE `ecommerce_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ecommerce_user_groups`
--

DROP TABLE IF EXISTS `ecommerce_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ecommerce_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ecommerce_user_groups_user_id_group_id_2a9a583d_uniq` (`user_id`,`group_id`),
  KEY `ecommerce_user_groups_group_id_a8fd9cb8_fk_auth_group_id` (`group_id`),
  CONSTRAINT `ecommerce_user_groups_group_id_a8fd9cb8_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `ecommerce_user_groups_user_id_60d58887_fk_ecommerce_user_id` FOREIGN KEY (`user_id`) REFERENCES `ecommerce_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ecommerce_user_groups`
--

LOCK TABLES `ecommerce_user_groups` WRITE;
/*!40000 ALTER TABLE `ecommerce_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `ecommerce_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ecommerce_user_user_permissions`
--

DROP TABLE IF EXISTS `ecommerce_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ecommerce_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ecommerce_user_user_perm_user_id_permission_id_6d807de6_uniq` (`user_id`,`permission_id`),
  KEY `ecommerce_user_user__permission_id_4dc38e40_fk_auth_perm` (`permission_id`),
  CONSTRAINT `ecommerce_user_user__permission_id_4dc38e40_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `ecommerce_user_user__user_id_0ceec4a8_fk_ecommerce` FOREIGN KEY (`user_id`) REFERENCES `ecommerce_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ecommerce_user_user_permissions`
--

LOCK TABLES `ecommerce_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `ecommerce_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `ecommerce_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_details_order_id_9401d97b_fk_orders_id` (`order_id`),
  KEY `order_details_product_id_a3b1bac1_fk_products_id` (`product_id`),
  CONSTRAINT `order_details_order_id_9401d97b_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_details_product_id_a3b1bac1_fk_products_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,3,3590000.00,10770000.00,1,5),(2,2,8990000.00,17980000.00,2,15),(3,1,24990000.00,24990000.00,3,3),(4,2,12990000.00,25980000.00,3,7),(5,2,16990000.00,33980000.00,3,10),(6,1,49990000.00,49990000.00,3,11),(7,1,5490000.00,5490000.00,3,13),(8,1,8990000.00,8990000.00,3,15),(9,1,5990000.00,5990000.00,3,17),(10,2,2290000.00,4580000.00,4,14),(11,2,8990000.00,17980000.00,4,15),(12,1,5990000.00,5990000.00,4,17),(13,1,2290000.00,2290000.00,4,16),(14,1,5490000.00,5490000.00,4,13),(15,1,6990000.00,6990000.00,4,8),(16,1,19990000.00,19990000.00,4,9),(17,1,16990000.00,16990000.00,4,10),(18,1,49990000.00,49990000.00,4,11),(19,1,35990000.00,35990000.00,4,12),(20,1,12990000.00,12990000.00,4,7),(21,1,4990000.00,4990000.00,4,6),(22,1,8990000.00,8990000.00,5,15),(23,1,8990000.00,8990000.00,6,15),(24,1,8990000.00,8990000.00,7,15),(25,1,8990000.00,8990000.00,8,15),(26,1,2290000.00,2290000.00,9,14),(27,1,2290000.00,2290000.00,10,14),(28,1,2290000.00,2290000.00,11,16),(29,1,2290000.00,2290000.00,12,16),(30,1,8990000.00,8990000.00,13,15),(31,1,12990000.00,12990000.00,14,7),(32,1,35990000.00,35990000.00,14,12),(33,1,5490000.00,5490000.00,14,13),(34,1,49990000.00,49990000.00,15,11),(35,1,35990000.00,35990000.00,15,12),(36,1,5490000.00,5490000.00,16,13),(37,1,8990000.00,8990000.00,16,15),(38,1,3590000.00,3590000.00,17,5),(39,1,3590000.00,3590000.00,18,5),(40,1,3590000.00,3590000.00,19,5),(41,2,3590000.00,7180000.00,20,5),(42,2,3590000.00,7180000.00,21,5),(43,1,24990000.00,24990000.00,22,3),(44,2,3590000.00,7180000.00,22,5),(45,1,19990000.00,19990000.00,23,9),(46,1,16990000.00,16990000.00,23,10),(47,1,8990000.00,8990000.00,24,15),(48,1,2290000.00,2290000.00,24,16),(49,2,8990000.00,17980000.00,25,15);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `shipping_address` longtext COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `payment_method` varchar(20) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `payment_status` varchar(20) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `notes` longtext COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `orders_status_762191_idx` (`status`),
  KEY `orders_payment_050188_idx` (`payment_status`),
  KEY `orders_user_id_4e08b8_idx` (`user_id`),
  KEY `orders_created_77e2b9_idx` (`created_at`),
  CONSTRAINT `orders_user_id_7e2523fb_fk_ecommerce_user_id` FOREIGN KEY (`user_id`) REFERENCES `ecommerce_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD-BF58C73F','completed',10770000.00,'Nhà Bè2','cod','completed','','2025-09-12 15:17:05.963937','2025-09-18 08:08:50.231402',10),(2,'ORD-6F8AA871','pending',17980000.00,'Nhà Bè2','cod','completed','','2025-09-12 15:19:50.900932','2025-09-18 07:59:16.507529',10),(3,'ORD-D6F19452','completed',155410000.00,'Quận 8','cod','completed','','2025-09-12 15:21:53.817422','2025-08-13 07:00:00.335713',10),(4,'ORD-402BA92B','completed',184260000.00,'Nhà Bè2','cod','completed','','2025-09-12 15:35:17.930129','2025-09-13 07:00:00.335713',10),(5,'ORD-07A4C415','cancelled',8990000.00,'Nhà Bè2','cod','cancelled','','2025-09-12 15:36:35.945608','2025-09-12 16:14:52.457583',10),(6,'ORD-B2B6D2E6','cancelled',8990000.00,'Nhà Bè2','cod','cancelled','','2025-09-12 15:46:16.842403','2025-09-12 16:13:15.509629',10),(7,'ORD-04150748','completed',8990000.00,'Nhà Bè2','cod','completed','','2025-09-12 15:48:41.280702','2025-09-16 05:27:55.260122',10),(8,'ORD-12100E44','completed',8990000.00,'Nhà Bè2','cod','pending','','2025-09-12 15:55:28.577475','2025-09-16 03:20:53.095144',10),(9,'ORD-A7C37F15','completed',2290000.00,'Nhà Bè2','cod','completed','','2025-09-12 16:00:10.947819','2025-09-16 03:31:54.921611',10),(10,'ORD-3CFD6687','completed',2290000.00,'Nhà Bè2','cod','completed','','2025-09-12 16:13:11.553437','2025-02-11 08:00:00.335713',10),(11,'ORD-CCEFC5BF','pending',2290000.00,'Nhà Bè2','cod','pending','','2025-09-12 16:33:51.883742','2025-09-12 16:33:51.883742',10),(12,'ORD-B743DA84','pending',2290000.00,'Nhà Bè2','cod','pending','','2025-09-12 17:28:31.998609','2025-09-12 17:28:31.998609',10),(13,'ORD-E5D635B3','pending',8990000.00,'Bình Dương','cod','pending','','2025-09-17 15:36:09.054672','2025-09-17 15:36:09.054672',10),(14,'ORD-0346A7B4','completed',54470000.00,'Bình Dương','cod','completed','','2025-09-17 15:38:03.050664','2025-09-17 15:41:03.955574',15),(15,'ORD-0EF42CB0','pending',85980000.00,'Bình Dương','momo','pending','','2025-09-18 02:42:55.580946','2025-09-18 02:42:55.580946',15),(16,'ORD-8493BCB0','pending',14480000.00,'Bình Dương','cod','pending','','2025-09-18 03:11:01.098796','2025-09-18 03:11:01.098796',15),(17,'ORD-7C53A668','completed',3590000.00,'Bình Dương','momo','completed','','2025-09-18 03:11:16.880622','2025-09-18 07:59:28.958233',15),(18,'ORD-639E7C30','completed',3590000.00,'Bình Dương','momo','completed','','2025-09-18 03:12:15.094089','2025-09-18 18:40:04.588517',15),(19,'ORD-19CA74BD','pending',3590000.00,'Bình Dương','momo','pending','','2025-09-18 03:15:33.625116','2025-09-18 03:15:33.625116',15),(20,'ORD-EC188634','completed',7180000.00,'Bình Dương','momo','completed','','2025-09-18 03:22:20.672470','2025-09-18 07:59:35.753321',15),(21,'ORD-A6976447','pending',7180000.00,'Bình Dương','momo','pending','','2025-09-18 03:30:02.798705','2025-09-18 03:30:02.798705',15),(22,'ORD-EF73561F','pending',32170000.00,'Bình Dương','cod','pending','Muốn giao vào chủ nhật','2025-09-18 17:36:38.946772','2025-09-18 17:36:38.947772',15),(23,'ORD-A7A4A97D','pending',36980000.00,'Sài Gòn','cod','pending','Giao hàng vào ngày 30/10','2025-09-18 17:37:25.896834','2025-09-18 17:37:25.896834',15),(24,'ORD-10DE7AFF','pending',11280000.00,'Bình Thạnh, HCM','cod','pending','Không có','2025-09-18 18:56:02.278954','2025-09-18 18:56:02.278954',17),(25,'ORD-99204021','pending',17980000.00,'test','cod','pending','','2025-09-18 18:57:56.156265','2025-09-18 18:57:56.156265',1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `payment_method` varchar(20) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `payment_gateway_transaction_id` varchar(255) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `gateway_response` json NOT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_status_d621e5_idx` (`status`),
  KEY `payments_payment_25c5f5_idx` (`payment_gateway_transaction_id`),
  KEY `payments_order_id_6086ad70_fk_orders_id` (`order_id`),
  CONSTRAINT `payments_order_id_6086ad70_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,'momo','',10000.00,'VND','pending','{\"amount\": 10000, \"payUrl\": \"https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3xPUkQtMTlDQTc0QkQ&s=72cf76838b708bad329ecbfaca9e2ec1ce2b8c39e9e9af0e543d0ff5f97adc1e\", \"message\": \"Thành công.\", \"orderId\": \"ORD-19CA74BD\", \"deeplink\": \"momo://app?action=payWithApp&isScanQR=false&serviceType=app&sid=TU9NT3xPUkQtMTlDQTc0QkQ&v=3.0\", \"qrCodeUrl\": \"momo://app?action=payWithApp&isScanQR=true&serviceType=qr&sid=TU9NT3xPUkQtMTlDQTc0QkQ&v=3.0\", \"requestId\": \"ORD-19CA74BD-1758165333\", \"resultCode\": 0, \"partnerCode\": \"MOMO\", \"responseTime\": 1758165333171, \"deeplinkMiniApp\": \"momo://app?action=payWithApp&isScanQR=false&serviceType=miniapp&sid=TU9NT3xPUkQtMTlDQTc0QkQ&v=3.0\"}',NULL,'2025-09-18 03:15:33.735741','2025-09-18 03:15:33.736741',19),(2,'momo','',10000.00,'VND','pending','{\"amount\": 10000, \"payUrl\": \"https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3xPUkQtRUMxODg2MzQ&s=041296864bea1cab8170e385cbc686fedaa9d9de39ec2fc375438f2729c909e7\", \"message\": \"Thành công.\", \"orderId\": \"ORD-EC188634\", \"deeplink\": \"momo://app?action=payWithApp&isScanQR=false&serviceType=app&sid=TU9NT3xPUkQtRUMxODg2MzQ&v=3.0\", \"qrCodeUrl\": \"momo://app?action=payWithApp&isScanQR=true&serviceType=qr&sid=TU9NT3xPUkQtRUMxODg2MzQ&v=3.0\", \"requestId\": \"ORD-EC188634-1758165740\", \"resultCode\": 0, \"partnerCode\": \"MOMO\", \"responseTime\": 1758165740196, \"deeplinkMiniApp\": \"momo://app?action=payWithApp&isScanQR=false&serviceType=miniapp&sid=TU9NT3xPUkQtRUMxODg2MzQ&v=3.0\"}',NULL,'2025-09-18 03:22:20.761341','2025-09-18 03:22:20.761341',20),(3,'momo','',10000.00,'VND','pending','{\"amount\": 10000, \"payUrl\": \"https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3xPUkQtQTY5NzY0NDc&s=2a5473b1c0dbae9aa30e949e1697c58d1bdb10a05cb7df07c295b22db3911105\", \"message\": \"Thành công.\", \"orderId\": \"ORD-A6976447\", \"deeplink\": \"momo://app?action=payWithApp&isScanQR=false&serviceType=app&sid=TU9NT3xPUkQtQTY5NzY0NDc&v=3.0\", \"qrCodeUrl\": \"momo://app?action=payWithApp&isScanQR=true&serviceType=qr&sid=TU9NT3xPUkQtQTY5NzY0NDc&v=3.0\", \"requestId\": \"ORD-A6976447-1758166202\", \"resultCode\": 0, \"partnerCode\": \"MOMO\", \"responseTime\": 1758166202304, \"deeplinkMiniApp\": \"momo://app?action=payWithApp&isScanQR=false&serviceType=miniapp&sid=TU9NT3xPUkQtQTY5NzY0NDc&v=3.0\"}',NULL,'2025-09-18 03:30:02.869723','2025-09-18 03:30:02.869723',21);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pc_configurations`
--

DROP TABLE IF EXISTS `pc_configurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pc_configurations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `components` json NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `is_compatible` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pc_configurations_user_id_88b014a4_fk_ecommerce_user_id` (`user_id`),
  CONSTRAINT `pc_configurations_user_id_88b014a4_fk_ecommerce_user_id` FOREIGN KEY (`user_id`) REFERENCES `ecommerce_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pc_configurations`
--

LOCK TABLES `pc_configurations` WRITE;
/*!40000 ALTER TABLE `pc_configurations` DISABLE KEYS */;
INSERT INTO `pc_configurations` VALUES (1,'My PC - 9/16/2025, 12:00:44 AM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"gpu\": {\"id\": 3, \"qty\": 1}, \"psu\": {\"id\": 17, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}, \"ssd1\": {\"id\": 13, \"qty\": 1}, \"ssd2\": {\"id\": 13, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',77430000.00,0,'2025-09-15 17:00:44.234801',10),(2,'My PC - 9/16/2025, 12:01:24 AM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"gpu\": {\"id\": 3, \"qty\": 1}, \"hdd\": {\"id\": 14, \"qty\": 1}, \"psu\": {\"id\": 17, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}, \"ssd1\": {\"id\": 13, \"qty\": 1}, \"ssd2\": {\"id\": 13, \"qty\": 1}, \"mainboard\": {\"id\": 8, \"qty\": 1}}',73720000.00,0,'2025-09-15 17:01:24.466712',10),(3,'My PC - 9/16/2025, 12:01:32 AM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"gpu\": {\"id\": 3, \"qty\": 1}, \"hdd\": {\"id\": 14, \"qty\": 1}, \"psu\": {\"id\": 17, \"qty\": 1}, \"ram\": {\"id\": 5, \"qty\": 1}, \"ssd1\": {\"id\": 13, \"qty\": 1}, \"ssd2\": {\"id\": 13, \"qty\": 1}, \"mainboard\": {\"id\": 8, \"qty\": 1}}',68320000.00,0,'2025-09-15 17:01:33.037607',10),(4,'My PC - 9/16/2025, 9:04:58 PM','{\"cpu\": {\"id\": 10, \"qty\": 1}}',16990000.00,1,'2025-09-16 14:04:58.970377',1),(5,'My PC - 9/16/2025, 9:05:16 PM','{\"cpu\": {\"id\": 10, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',29980000.00,0,'2025-09-16 14:05:16.291560',1),(6,'My PC - 9/16/2025, 9:44:07 PM','{\"ram\": {\"id\": 15, \"qty\": 1}}',8990000.00,1,'2025-09-16 14:44:07.728725',1),(7,'My PC - 9/16/2025, 9:44:13 PM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}}',22480000.00,1,'2025-09-16 14:44:13.323687',1),(8,'My PC - 9/16/2025, 9:44:34 PM','{\"ram\": {\"id\": 15, \"qty\": 1}}',8990000.00,1,'2025-09-16 14:44:34.977676',1),(9,'My PC - 9/16/2025, 9:48:39 PM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',26480000.00,0,'2025-09-16 14:48:39.344127',1),(10,'My PC - 9/16/2025, 10:00:36 PM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"gpu\": {\"id\": 11, \"qty\": 1}, \"psu\": {\"id\": 17, \"qty\": 1}, \"ram\": {\"id\": 5, \"qty\": 1}, \"ssd1\": {\"id\": 13, \"qty\": 1}, \"ssd2\": {\"id\": 13, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',97030000.00,0,'2025-09-16 15:00:36.284441',1),(11,'My PC - 9/17/2025, 3:31:47 PM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"gpu\": {\"id\": 4, \"qty\": 1}, \"psu\": {\"id\": 17, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}, \"mainboard\": {\"id\": 8, \"qty\": 1}}',53450000.00,1,'2025-09-17 08:31:47.418691',1),(12,'My PC - 9/17/2025, 3:32:02 PM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"gpu\": {\"id\": 4, \"qty\": 1}, \"psu\": {\"id\": 17, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}, \"case\": {\"id\": 16, \"qty\": 1}, \"ssd1\": {\"id\": 13, \"qty\": 1}, \"mainboard\": {\"id\": 8, \"qty\": 1}}',61230000.00,1,'2025-09-17 08:32:02.387011',1),(13,'My PC - 9/17/2025, 3:36:57 PM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',26480000.00,0,'2025-09-17 08:36:57.221586',1),(14,'My PC - 9/17/2025, 3:37:04 PM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',35470000.00,0,'2025-09-17 08:37:05.022162',1),(15,'My PC - 9/17/2025, 3:37:13 PM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"ram\": {\"id\": 5, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',30070000.00,0,'2025-09-17 08:37:13.487696',1),(16,'My PC - 9/17/2025, 3:37:59 PM','{\"cpu\": {\"id\": 9, \"qty\": 1}, \"gpu\": {\"id\": 11, \"qty\": 1}, \"psu\": {\"id\": 17, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}, \"case\": {\"id\": 16, \"qty\": 1}, \"ssd1\": {\"id\": 13, \"qty\": 1}, \"ssd2\": {\"id\": 14, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',108020000.00,1,'2025-09-17 08:37:59.496951',1),(17,'My PC - 9/17/2025, 3:38:51 PM','{\"cpu\": {\"id\": 9, \"qty\": 1}, \"gpu\": {\"id\": 11, \"qty\": 1}, \"psu\": {\"id\": 17, \"qty\": 1}, \"ram\": {\"id\": 5, \"qty\": 1}, \"case\": {\"id\": 16, \"qty\": 1}, \"ssd1\": {\"id\": 13, \"qty\": 1}, \"ssd2\": {\"id\": 14, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',102620000.00,0,'2025-09-17 08:38:51.751649',1),(18,'My PC - 9/17/2025, 4:43:52 PM','{\"cpu\": {\"id\": 9, \"qty\": 1}, \"gpu\": {\"id\": 11, \"qty\": 1}, \"ram\": {\"id\": 5, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',86560000.00,0,'2025-09-17 09:43:52.574385',1),(19,'My PC - 9/17/2025, 5:20:09 PM','{\"cpu\": {\"id\": 2, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',35470000.00,0,'2025-09-17 10:20:10.075367',1),(20,'My PC - 9/17/2025, 7:10:41 PM','{\"cpu\": {\"id\": 1, \"qty\": 1}, \"gpu\": {\"id\": 11, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',87960000.00,1,'2025-09-17 12:10:41.145730',1),(21,'My PC - 9/17/2025, 7:11:55 PM','{\"cpu\": {\"id\": 9, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',32980000.00,1,'2025-09-17 12:11:55.270873',1),(22,'My PC - 9/17/2025, 7:11:59 PM','{\"cpu\": {\"id\": 9, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',32980000.00,1,'2025-09-17 12:11:59.646446',1),(23,'My PC - 9/17/2025, 7:12:34 PM','{\"cpu\": {\"id\": 9, \"qty\": 1}, \"mainboard\": {\"id\": 8, \"qty\": 1}}',26980000.00,0,'2025-09-17 12:12:34.864210',1),(24,'My PC - 9/17/2025, 7:17:22 PM','{\"cpu\": {\"id\": 9, \"qty\": 1}, \"gpu\": {\"id\": 12, \"qty\": 1}, \"psu\": {\"id\": 17, \"qty\": 1}, \"ram\": {\"id\": 15, \"qty\": 1}, \"case\": {\"id\": 16, \"qty\": 1}, \"ssd1\": {\"id\": 13, \"qty\": 1}, \"mainboard\": {\"id\": 7, \"qty\": 1}}',91730000.00,1,'2025-09-17 12:17:22.927367',1);
/*!40000 ALTER TABLE `pc_configurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `stock_quantity` int NOT NULL,
  `brand` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `specifications` json NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `category_id` bigint NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_categor_4083ff_idx` (`category_id`),
  KEY `products_price_fe467e_idx` (`price`),
  KEY `products_is_acti_cb485f_idx` (`is_active`),
  KEY `products_brand_b2547a_idx` (`brand`),
  CONSTRAINT `products_category_id_a7a3a156_fk_categories_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Intel Core i7-13700K','High-performance 13th Gen Intel Core processor with 16 cores and 24 threads. Perfect for gaming and content creation.',15990000.00,25,'Intel','{\"tdp\": \"125\", \"cache\": \"30\", \"cores\": \"16 (8P + 8E)\", \"socket\": \"LGA1700\", \"threads\": \"24\", \"base_clock\": \"3.4 GHz\", \"boost_clock\": \"5.4 GHz\"}',1,'2025-09-11 12:48:50.833686',2,'products/2025/09/250-23426-13700k.jpg'),(2,'AMD Ryzen 7 7700X','Powerful AMD Ryzen 7000 series processor with excellent gaming and multitasking performance.',13490000.00,30,'AMD','{\"tdp\": \"105\", \"cache\": \"32\", \"cores\": \"8\", \"socket\": \"AM5\", \"threads\": \"16\", \"base_clock\": \"4.5 GHz\", \"boost_clock\": \"5.4 GHz\"}',1,'2025-09-11 12:48:50.843190',2,'products/2025/09/250-23317-77.jpg'),(3,'NVIDIA GeForce RTX 4070 Ti','High-end graphics card for 4K gaming and ray tracing. Features 12GB GDDR6X memory.',24990000.00,13,'NVIDIA','{\"tdp\": \"285\", \"vram\": \"12GB GDDR6X\", \"chipset\": \"RTX 4070 Ti\", \"base_clock\": \"2310 MHz\", \"cuda_cores\": \"7680\", \"memory_bus\": \"192-bit\", \"boost_clock\": \"2610 MHz\"}',1,'2025-09-11 12:48:50.849189',4,'products/2025/09/4070tituf.webp'),(4,'AMD Radeon RX 7800 XT','Excellent 1440p gaming graphics card with 16GB GDDR6 memory for future-proof gaming.',17990000.00,20,'AMD','{\"tdp\": \"263\", \"vram\": \"16GB GDDR6\", \"chipset\": \"RX 7800 XT\", \"base_clock\": \"1295 MHz\", \"cuda_cores\": \"3840\", \"memory_bus\": \"256-bit\", \"boost_clock\": \"2430 MHz\"}',1,'2025-09-11 12:48:50.857189',4,'products/2025/09/250-27724-vga-gigabyte-radeon-rx-7800-xt-gaming-oc-16g-1.jpg'),(5,'Corsair Vengeance LPX 32GB DDR4-3200','32GB (2x16GB) DDR4 memory kit optimized for performance and compatibility.',3590000.00,45,'Corsair','{\"type\": \"DDR4\", \"speed\": \"3200 MHz\", \"modules\": \"2x16GB\", \"timings\": \"CL16-18-18-36\", \"capacity\": \"32GB\"}',1,'2025-09-11 12:48:50.863190',3,'products/2025/09/250-27996-ram-corsair-vengeance-lpx-32gb-02.jpg'),(6,'G.Skill Trident Z5 32GB DDR5-5600','High-speed DDR5 memory for next-gen platforms with RGB lighting.',4990000.00,34,'G.Skill','{\"type\": \"DDR5\", \"speed\": \"5600 MHz\", \"modules\": \"2x16GB\", \"timings\": \"CL36-36-36-96\", \"voltage\": \"1.25V\", \"capacity\": \"32GB\", \"features\": \"RGB Lighting\"}',1,'2025-09-11 12:48:50.869694',3,'products/2025/09/250-27329-ram-gskill-trident-z5-rgb-32gb-2x32gb-ddr5-6000mhz-black-2.jpg'),(7,'ASUS ROG STRIX Z790-E','Premium Intel Z790 motherboard with WiFi 6E, DDR5 support, and extensive connectivity.',12990000.00,8,'ASUS','{\"socket\": \"LGA1700\", \"chipset\": \"Intel Z790\", \"storage\": \"4x M.2 NVMe\", \"max_memory\": \"128GB\", \"networking\": \"WiFi 6E, 2.5Gb Ethernet\", \"pcie_slots\": \"3x PCIe 5.0 x16\", \"form_factor\": \"ATX\", \"memory_slots\": \"4x M.2 NVMe\", \"supported_ram\": \"DDR5\", \"memory_support\": \"DDR5-5600+\"}',1,'2025-09-11 12:48:50.875694',13,'products/2025/09/250-23594-rog-strix-z790-e-gaming-wifi-01.jpg'),(8,'MSI MAG B650 TOMAHAWK','Feature-rich AMD B650 motherboard for Ryzen 7000 series processors.',6990000.00,17,'MSI','{\"socket\": \"AM5\", \"chipset\": \"AMD B650\", \"storage\": \"2x M.2 NVMe\", \"max_memory\": \"128GB\", \"networking\": \"WiFi 6, Gigabit Ethernet\", \"pcie_slots\": \"2x PCIe 4.0 x16\", \"form_factor\": \"ATX\", \"memory_slots\": \"2x M.2 NVMe\", \"supported_ram\": \"DDR5\"}',1,'2025-09-11 12:48:50.881694',13,'products/2025/09/250-27447-mainboard-msi-mag-z790-tomahawk-max-wifi-ddr5-1.jpg'),(9,'Intel Core i9-13900K','Flagship Intel processor with 24 cores and 32 threads.',19990000.00,13,'Intel','{\"tdp\": \"190\", \"cache\": \"40\", \"cores\": \"24 (8P + 16E)\", \"socket\": \"LGA1700\", \"threads\": \"32\", \"base_clock\": \"3.0 GHz\", \"boost_clock\": \"5.8 GHz\"}',1,'2025-09-11 13:01:33.639366',2,'products/2025/09/13900k.png'),(10,'AMD Ryzen 9 7900X','High-end 12-core processor for content creation.',16990000.00,16,'AMD','{\"tdp\": \"180\", \"cache\": \"40\", \"cores\": \"12\", \"socket\": \"AM5\", \"threads\": \"24\", \"base_clock\": \"4.7 GHz\", \"boost_clock\": \"5.6 GHz\"}',1,'2025-09-11 13:01:33.646377',2,'products/2025/09/7900x.jpg'),(11,'NVIDIA GeForce RTX 4090','Ultimate gaming and professional graphics card.',49990000.00,5,'NVIDIA','{\"tdp\": \"350\", \"vram\": \"24GB GDDR6x\", \"chipset\": \"RTX 4090\", \"base_clock\": \"2230 MHz\", \"cuda_cores\": \"16384\", \"boost_clock\": \"2520 MHz\"}',1,'2025-09-11 13:01:33.652379',4,'products/2025/09/4090.jpg'),(12,'AMD Radeon RX 7900 XTX','High-end AMD graphics card for 4K gaming.',35990000.00,9,'AMD','{\"tdp\": \"280\", \"vram\": \"24GB GDDR6\", \"chipset\": \"RX 7900 XTX\", \"base_clock\": \"1855 MHz\", \"cuda_cores\": \"6144\", \"boost_clock\": \"2500 MHz\"}',1,'2025-09-11 13:01:33.661378',4,'products/2025/09/7900xtx.jpg'),(13,'Crucial P5 Plus 2TB NVMe SSD','High-performance PCIe 4.0 SSD for gaming and productivity.',5490000.00,26,'Crucial','{\"type\": \"SSD\", \"capacity\": \"2TB\", \"interface\": \"NVMe\", \"read_speed\": \"6600 MB/s\", \"form_factor\": \"M.2 2280\", \"write_speed\": \"5000 MB/s\"}',1,'2025-09-11 13:01:33.667378',6,'products/2025/09/curi1tb.jpg'),(14,'WD Blue 1TB SATA SSD','Reliable 2.5-inch SATA SSD for everyday computing.',2290000.00,46,'Western Digital','{\"type\": \"SSD\", \"capacity\": \"1TB\", \"interface\": \"SATA\", \"read_speed\": \"560 MB/s\", \"form_factor\": \"2.5\\\"\"}',1,'2025-09-11 13:01:33.673879',6,'products/2025/09/wdblue1tb.webp'),(15,'Corsair Dominator Platinum RGB 32GB DDR5','Premium DDR5 memory with advanced cooling and RGB.',8990000.00,6,'Corsair','{\"type\": \"DDR5\", \"speed\": \"6000 MHz\", \"modules\": \"2x16gb\", \"capacity\": \"32gb\"}',1,'2025-09-11 13:01:33.679882',3,'products/2025/09/corsairdomi.webp'),(16,'Cooler Master MasterBox TD500 Mesh','Mid-tower case with mesh front panel for optimal airflow.',2290000.00,21,'Cooler Master','{\"form_factor\": \"ATX\", \"max_gpu_length\": \"360\", \"max_cooler_height\": \"360\"}',1,'2025-09-11 13:01:33.685881',8,'products/2025/09/coolermaste.webp'),(17,'be quiet! Dark Power Pro 12 1000W','Silent and efficient high-wattage power supply.',5990000.00,13,'be quiet!','{\"modular\": \"Full\", \"wattage\": \"1000\", \"certification\": \"Platinum\"}',1,'2025-09-11 13:01:33.693881',7,'products/2025/09/250-25828-avatar_65a3f68bd3ef4ba6b5fccc574.png'),(18,'VGA Colorful iGame GeForce RTX 4060 Ti Ultra W OC 16GB-V','',15900000.00,20,'Colorful','{\"tdp\": \"180\", \"vram\": \"16GB GDDR6\", \"chipset\": \"Rtx 4060 ti\", \"base_clock\": \"2310 Mhz\", \"cuda_cores\": \"4352\", \"boost_clock\": \"2535 Mhz\"}',1,'2025-09-16 02:01:00.983259',4,'products/2025/09/4060ti16gbcoloful.jpg'),(22,'CPU AMD Ryzen 9 7950X3D','CPU AMD Ryzen 9 7950X3D',3010000.00,25,'AMD','{\"tdp\": 95, \"cache\": 16, \"cores\": 16, \"socket\": \"AM4\", \"threads\": 32, \"base_clock\": 3.41, \"boost_clock\": 4.22}',1,'2025-09-19 14:37:30.549055',2,'products/2025/09/cpu8.png'),(23,'CPU Intel Core i7-12700','CPU Intel Core i7-12700',10040000.00,44,'INTEL','{\"tdp\": 95, \"cache\": 32, \"cores\": 6, \"socket\": \"LGA1700\", \"threads\": 12, \"base_clock\": 2.74, \"boost_clock\": 5.55}',1,'2025-09-19 14:37:30.549055',2,'products/2025/09/cpu9.jpg'),(24,'CPU AMD Ryzen 5 5500GT','CPU AMD Ryzen 5 5500GT',4160000.00,25,'AMD','{\"tdp\": 95, \"cache\": 16, \"cores\": 6, \"socket\": \"AM5\", \"threads\": 16, \"base_clock\": 3.32, \"boost_clock\": 5.48}',1,'2025-09-19 14:37:30.549055',2,'products/2025/09/cpu4_DYkC7Qz.jpg'),(25,'CPU Intel Core i9-12900KF','CPU Intel Core i9-12900KF',9280000.00,24,'INTEL','{\"tdp\": 95, \"cache\": 32, \"cores\": 16, \"socket\": \"LGA1700\", \"threads\": 24, \"base_clock\": 3.86, \"boost_clock\": 5.7}',1,'2025-09-19 14:37:30.550055',2,'products/2025/09/cpu7.jpg'),(26,'CPU AMD Ryzen Threadripper 9960X','CPU AMD Ryzen Threadripper 9960X',11840000.00,49,'AMD','{\"tdp\": 65, \"cache\": 32, \"cores\": 12, \"socket\": \"AM4\", \"threads\": 32, \"base_clock\": 3.82, \"boost_clock\": 4.27}',1,'2025-09-19 14:37:30.550055',2,'products/2025/09/cpu6.jpg'),(27,'CPU Intel Core i5 14600KF','CPU Intel Core i5 14600KF',8990000.00,29,'INTEL','{\"tdp\": 65, \"cache\": 24, \"cores\": 12, \"socket\": \"LGA1700\", \"threads\": 16, \"base_clock\": 3.5, \"boost_clock\": 5.47}',1,'2025-09-19 14:37:30.551055',2,'products/2025/09/cpu2.jpg'),(28,'CPU AMD Ryzen 9 9950X3D','CPU AMD Ryzen 9 9950X3D',5690000.00,44,'AMD','{\"tdp\": 95, \"cache\": 24, \"cores\": 16, \"socket\": \"AM5\", \"threads\": 24, \"base_clock\": 3.27, \"boost_clock\": 4.56}',1,'2025-09-19 14:37:30.551055',2,'products/2025/09/cpu4.jpg'),(29,'CPU Intel Core i7-12700KF','CPU Intel Core i7-12700KF',8380000.00,23,'INTEL','{\"tdp\": 105, \"cache\": 24, \"cores\": 8, \"socket\": \"LGA1700\", \"threads\": 12, \"base_clock\": 3.41, \"boost_clock\": 4.9}',1,'2025-09-19 14:37:30.551055',2,'products/2025/09/cpu5.jpg'),(30,'CPU AMD Ryzen 5 3400G','CPU AMD Ryzen 5 3400G',7820000.00,43,'AMD','{\"tdp\": 105, \"cache\": 24, \"cores\": 6, \"socket\": \"AM5\", \"threads\": 12, \"base_clock\": 3.62, \"boost_clock\": 4.79}',1,'2025-09-19 14:37:30.552055',2,'products/2025/09/cpu1_VrtWBS2.jpg'),(31,'CPU AMD Ryzen 5 5500GT','CPU AMD Ryzen 5 5500GT',7120000.00,32,'AMD','{\"tdp\": 95, \"cache\": 32, \"cores\": 12, \"socket\": \"AM5\", \"threads\": 12, \"base_clock\": 3.59, \"boost_clock\": 5.55}',1,'2025-09-19 14:37:30.552055',2,'products/2025/09/cpu3.jpg'),(32,'Mainboard ASRock Z790 PG Lightning D5','Mainboard ASRock Z790 PG Lightning D5',2890000.00,46,'ASRock','{\"socket\": \"LGA1700\", \"chipset\": \"Z790\", \"max_memory\": 64, \"form_factor\": \"Micro-ATX\", \"memory_slots\": 2, \"supported_ram\": \"DDR5\"}',1,'2025-09-19 14:37:30.553056',13,'products/2025/09/250-26303-main-asrock-z790-pg-lightning-d5-1.jpg'),(33,'Mainboard Gigabyte B650M AORUS ELITE AX ICE DDR5','Mainboard Gigabyte B650M AORUS ELITE AX ICE DDR5',3690000.00,47,'','{\"socket\": \"AM5\", \"chipset\": \"B650\", \"max_memory\": 64, \"form_factor\": \"Micro-ATX\", \"memory_slots\": 4, \"supported_ram\": \"DDR5\"}',1,'2025-09-19 14:37:30.553056',13,'products/2025/09/250-28082-b650m-aorus-elite-ax-ice-01.jpg'),(34,'Mainboard MSI PRO X870-P WIFI','Mainboard MSI PRO X870-P WIFI',6510000.00,39,'MSI','{\"socket\": \"AM5\", \"chipset\": \"X870\", \"max_memory\": 64, \"form_factor\": \"Micro-ATX\", \"memory_slots\": 4, \"supported_ram\": \"DDR5\"}',1,'2025-09-19 14:37:30.554055',13,'products/2025/09/250-26995-pd-pro-x870-p-wifi-lg.jpg'),(35,'Mainboard MSI B760M GAMING WIFI DDR5','Mainboard MSI B760M GAMING WIFI DDR5',1940000.00,25,'','{\"socket\": \"LGA1700\", \"chipset\": \"B760\", \"max_memory\": 64, \"form_factor\": \"Micro-ATX\", \"memory_slots\": 4, \"supported_ram\": \"DDR5\"}',1,'2025-09-19 14:37:30.554055',13,'products/2025/09/250-27886-mainboard-msi-b760m-gaming-wifi-ddr5-5.jpg'),(36,'Mainboard MSI MPG B550 GAMING PLUS','Mainboard MSI MPG B550 GAMING PLUS',2820000.00,36,'MSI','{\"socket\": \"AM4\", \"chipset\": \"B550\", \"max_memory\": 128, \"form_factor\": \"Micro-ATX\", \"memory_slots\": 4, \"supported_ram\": \"DDR4\"}',1,'2025-09-19 14:37:30.554055',13,'products/2025/09/250-27912-mainboard-msi-mpg-b550-gaming-plus-5.jpg'),(37,'Mainboard ASRock B760M Pro RS/D4','Mainboard ASRock B760M Pro RS/D4',4300000.00,30,'ASRock','{\"socket\": \"LGA1700\", \"chipset\": \"B760\", \"max_memory\": 128, \"form_factor\": \"Micro-ATX\", \"memory_slots\": 4, \"supported_ram\": \"DDR4\"}',1,'2025-09-19 14:37:30.555056',13,'products/2025/09/250-24327-mb0000075mb0000075.jpg'),(38,'Mainboard Gigabyte Z890M AORUS ELITE WIFI7','Gigabyte MAINBOARD 7 - Sản phẩm demo cho danh mục Mainboard.',4940000.00,36,'Gigabyte','{\"socket\": \"LGA1700\", \"chipset\": \"Z890\", \"max_memory\": 128, \"form_factor\": \"ATX\", \"memory_slots\": 4, \"supported_ram\": \"DDR5\"}',1,'2025-09-19 14:37:30.555056',13,'products/2025/09/250-27142-mainboard-gigabyte-z890m-aorus-elite-wifi7-01.jpg'),(39,'Mainboard BIOSTAR Z690MX2-E D4','Mainboard BIOSTAR Z690MX2-E D4',5220000.00,18,'BIOSTAR','{\"socket\": \"LGA1700\", \"chipset\": \"Z690\", \"max_memory\": 64, \"form_factor\": \"Mini-ITX\", \"memory_slots\": 4, \"supported_ram\": \"DDR4\"}',1,'2025-09-19 14:37:30.555056',13,'products/2025/09/250-27915-biostar-z690mx2-e-d4-4.jpg'),(40,'Mainboard Asus B650M-AYW WIFI-CSM','Mainboard Asus B650M-AYW WIFI-CSM',7770000.00,7,'ASUS','{\"socket\": \"AM5\", \"chipset\": \"B650\", \"max_memory\": 64, \"form_factor\": \"ATX\", \"memory_slots\": 2, \"supported_ram\": \"DDR5\"}',1,'2025-09-19 14:37:30.555056',13,'products/2025/09/250-28063-mainboard-asus-b650m-ayw-wifi-csm-06.jpg'),(41,'Mainboard Asus TUF Gaming B760M-PLUS Wifi DDR5 II','Mainboard Asus TUF Gaming B760M-PLUS Wifi DDR5 II',5000000.00,49,'Asus','{\"socket\": \"LGA1700\", \"chipset\": \"B760\", \"max_memory\": 128, \"form_factor\": \"Micro-ATX\", \"memory_slots\": 2, \"supported_ram\": \"DDR5\"}',1,'2025-09-19 14:37:30.556055',13,'products/2025/09/250-26676-asus-tuf-gaming-b760m-plus-wifi-ii-1.jpg'),(42,'Ram Adata XPG GAMMIX D10 16GB (1x16) Bus 3200Mhz','Ram Adata XPG GAMMIX D10 16GB (1x16) Bus 3200Mhz',3260000.00,33,'ADATA','{\"type\": \"DDR4\", \"speed\": \"3200\", \"modules\": \"1x16GB\", \"capacity\": 16}',1,'2025-09-19 14:37:30.556055',3,'products/2025/09/17416-sp014254.png'),(43,'RAM HIKSEMI ARMOR DDR4 16GB 3200MHZ','RAM HIKSEMI ARMOR DDR4 16GB 3200MHZ',920000.00,13,'HIKSEMI','{\"type\": \"DDR4\", \"speed\": \"3200\", \"modules\": \"1x16GB\", \"capacity\": \"16\"}',1,'2025-09-19 14:37:30.556055',3,'products/2025/09/250-26718-ram-hiksemi-armor-ddr4-16gb-3200mhz-1.jpg'),(44,'Ram Adata LANCER BLADE RGB Black 32GB (2x 16GB) DDR5 6000Mhz','Ram Adata LANCER BLADE RGB Black 32GB (2x 16GB) DDR5 6000Mhz',1680000.00,13,'Adata','{\"type\": \"DDR5\", \"speed\": \"6000\", \"modules\": \"2x16GB\", \"capacity\": \"32\"}',1,'2025-09-19 14:37:30.557056',3,'products/2025/09/250-27583-89855_ram_desktop_adata_lancer_blade_rgb_black__1_.jpg'),(45,'RAM ADATA XPG D35G DDR4 16GB 3200 BLACK RGB','RAM ADATA XPG D35G DDR4 16GB 3200 BLACK RGB',1670000.00,42,'ADATA','{\"type\": \"DDR4\", \"speed\": \"3200\", \"modules\": \"1x16GB\", \"capacity\": \"16\"}',1,'2025-09-19 14:37:30.557056',3,'products/2025/09/250-25217-ram-adata.jpg'),(46,'RAM Lexar ARES RGB 32GB (2x16GB) DDR5 6000Mhz','RAM Lexar ARES RGB 32GB (2x16GB) DDR5 6000Mhz',2090000.00,23,'Lexar','{\"type\": \"DDR5\", \"speed\": \"6000\", \"modules\": \"2x16GB\", \"capacity\": 32}',1,'2025-09-19 14:37:30.558056',3,'products/2025/09/27096-ram-lexar-ares-rgb-32gb-2-16gb-ddr5-6000mhz-3.jpg'),(47,'RAM ADATA XPG Lancer Kit 32GB (2x16GB) DDR5 RGB 6000MHz','RAM ADATA XPG Lancer Kit 32GB (2x16GB) DDR5 RGB 6000MHz',2070000.00,20,'ADATA','{\"type\": \"DDR5\", \"speed\": \"6000\", \"modules\": \"2x16GB\", \"capacity\": 32}',1,'2025-09-19 14:37:30.558056',3,'products/2025/09/250-27219-5.jpg'),(48,'RAM Gskill Trident Z RGB 32GB (2x16GB) Bus 3600MHz','RAM Gskill Trident Z RGB 32GB (2x16GB) Bus 3600MHz',1700000.00,46,'Gskill','{\"type\": \"DDR4\", \"speed\": 3600, \"modules\": \"2x16GB\", \"capacity\": \"32\"}',1,'2025-09-19 14:37:30.558056',3,'products/2025/09/250-17445-gskill-trident-z-rgb-32gb-bus-3600-2.jpg'),(49,'Ram Kingston FURY Beast RGB 32GB (2x16GB) DDR5 bus 5600Mhz','Ram Kingston FURY Beast RGB 32GB (2x16GB) DDR5 bus 5600Mhz',3470000.00,50,'Kingston','{\"type\": \"DDR5\", \"speed\": \"5600\", \"modules\": \"2x16GB\", \"capacity\": \"32\"}',1,'2025-09-19 14:37:30.558056',3,'products/2025/09/250-23157-ram-kingston-fury-beast-rgb-32gb-2.jpeg'),(50,'RAM Kingston FURY Beast RGB 32GB','RAM Kingston FURY Beast RGB 32GB',2540000.00,6,'Kingston','{\"type\": \"DDR5\", \"speed\": \"6000\", \"modules\": \"2x16GB\", \"capacity\": \"32\"}',1,'2025-09-19 14:37:30.559558',3,'products/2025/09/250-27812-ram-kingston-fury-beast-rgb-64gb-1.jpg'),(51,'RAM Kingston Fury Beast 32GB (2x16GB) DDR5 6000MHz','RAM Kingston Fury Beast 32GB (2x16GB) DDR5 6000MHz',1300000.00,42,'Kingston','{\"type\": \"DDR5\", \"speed\": \"6000\", \"modules\": \"2x16GB\", \"capacity\": \"32\"}',1,'2025-09-19 14:37:30.559558',3,'products/2025/09/250-26802-kingston_fury_beast_32gb_2_16gb_ddr5_6000mhz.jpg'),(52,'COLORFUL RTX 5070 Battle NB AX','NVIDIA GPU 1 - Sản phẩm demo cho danh mục GPU.',24060000.00,46,'NVIDIA','{\"tdp\": 285, \"vram\": 16, \"chipset\": \"RX 7600\", \"cuda_cores\": 3072}',1,'2025-09-19 14:37:30.559558',4,'products/2025/09/250-27464-card-man-hinh-colorful-geforce-rtx-5070-nb-ex-12gb-v-019.jpg'),(53,'INNO3D RTX 5070 TWIN X2 OC WHITE','AMD GPU 2 - Sản phẩm demo cho danh mục GPU.',4380000.00,25,'INNO3D','{\"tdp\": 120, \"vram\": 16, \"chipset\": \"RX 7600\", \"cuda_cores\": 5888}',1,'2025-09-19 14:37:30.560561',4,'products/2025/09/250-27366-inno3d-rtx-5070-twin-x2-oc-white-1.jpg'),(54,'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER BTF White OC','NVIDIA GPU 3 - Sản phẩm demo cho danh mục GPU.',21950000.00,8,'Asus','{\"tdp\": 120, \"vram\": 16, \"chipset\": \"RTX 4070\", \"cuda_cores\": 7168}',1,'2025-09-19 14:37:30.561561',4,'products/2025/09/121212.jpg'),(55,'EVGA RTX 3080Ti XC3 Ultra','AMD GPU 4 - Sản phẩm demo cho danh mục GPU.',24850000.00,47,'EVGA','{\"tdp\": 160, \"vram\": 8, \"chipset\": \"RX 7600\", \"cuda_cores\": 5888}',1,'2025-09-19 14:37:30.561561',4,'products/2025/09/250-26610-817hk0zaftl.jpg'),(56,'MSI GeForce RTX 5060 Ti 16GB VANGUARD SOC','NVIDIA GPU 5 - Sản phẩm demo cho danh mục GPU.',16850000.00,36,'Msi','{\"tdp\": 160, \"vram\": \"16\", \"chipset\": \"RTX 4070\", \"cuda_cores\": 7168}',1,'2025-09-19 14:37:30.561561',4,'products/2025/09/250-27615-msi-rtx-5060-ti-16gb-vanguard-soc-1.jpeg'),(57,'ASUS ProArt RTX 4070 Ti OC Edition 12GB','AMD GPU 6 - Sản phẩm demo cho danh mục GPU.',8640000.00,14,'Asus','{\"tdp\": 285, \"vram\": 8, \"chipset\": \"RTX 4070\", \"cuda_cores\": 9728}',1,'2025-09-19 14:37:30.562561',4,'products/2025/09/26433-fwebp--15-_11zon.jpg'),(58,'Asus Dual RTX 3050 6GB','NVIDIA GPU 7 - Sản phẩm demo cho danh mục GPU.',10490000.00,12,'Asus','{\"tdp\": 285, \"vram\": 12, \"chipset\": \"RTX 4060\", \"cuda_cores\": 5888}',1,'2025-09-19 14:37:30.563560',4,'products/2025/09/250-27384-asus-dual-rtx-3050-6gb-gddr6-1.jpg'),(59,'Colorful iGame GeForce RTX 5070 Ti Ultra W OC 16GB-V','AMD GPU 8 - Sản phẩm demo cho danh mục GPU.',6590000.00,12,'Colorful','{\"tdp\": 160, \"vram\": 12, \"chipset\": \"RX 7700 XT\", \"cuda_cores\": 5888}',1,'2025-09-19 14:37:30.563560',4,'products/2025/09/27402-colorful-igame-geforce-rtx-5070-ti-ultra-w-oc-16gb-v-1.jpg'),(60,'Colorful GeForce RTX 3060 NB DUO 12GB L-V','NVIDIA GPU 9 - Sản phẩm demo cho danh mục GPU.',9970000.00,36,'Colorful','{\"tdp\": 285, \"vram\": 8, \"chipset\": \"RX 7600\", \"cuda_cores\": 5888}',1,'2025-09-19 14:37:30.564560',4,'products/2025/09/20338-colorful-geforce-rtx-3060-nb-duo-12g-v2-l-vcolorful-geforce-rtx-3_8IqcHHM.jpg'),(61,'Gigabyte GeForce RTX 3050 WINDFORCE OC V2 8GB','AMD GPU 10 - Sản phẩm demo cho danh mục GPU.',9700000.00,9,'Gigabyte','{\"tdp\": 285, \"vram\": 8, \"chipset\": \"RX 7700 XT\", \"cuda_cores\": 7168}',1,'2025-09-19 14:37:30.564560',4,'products/2025/09/250-27795-vga-gigabyte-geforce-rtx-3050-windforce-oc-v2-8gb-2.jpg'),(62,'Nguồn Xigmatek Z-Power II Z650 EN41495','Nguồn Xigmatek Z-Power II Z650 EN41495',1740000.00,36,'Xigmatek','{\"modular\": \"Semi\", \"wattage\": \"500\", \"certification\": \"Bronze\"}',1,'2025-09-19 14:37:30.564560',7,'products/2025/09/250-26234-ngu---n-xigmatek-z-power-ii-z650-en41495.png'),(63,'Nguồn MIK SPOWER 500W','Corsair PSU 2 - Sản phẩm demo cho danh mục PSU.',1210000.00,11,'MIK','{\"modular\": \"No\", \"wattage\": \"500\", \"certification\": \"Bronze\"}',1,'2025-09-19 14:37:30.566561',7,'products/2025/09/250-25630-screenshot_1693973263.png'),(64,'Nguồn máy tính Corsair CX650','Nguồn máy tính Corsair CX650',3960000.00,45,'Corsair','{\"modular\": \"No\", \"wattage\": 650, \"certification\": \"Bronze\"}',1,'2025-09-19 14:37:30.567560',7,'products/2025/09/250-26189-thegioigear_nguon_corsair_cx650--3-.jpg'),(65,'Nguồn Máy Tính GIGABYTE P650SS 650W','Nguồn Máy Tính GIGABYTE P650SS 650W',1430000.00,35,'Gigabyte','{\"modular\": \"No\", \"wattage\": \"650\", \"certification\": \"Silver\"}',1,'2025-09-19 14:37:30.567560',7,'products/2025/09/250-27495-nguon-gigabyte-p650ss-650w-4.jpg'),(66,'Nguồn máy tính Segotep U6+ SG-D750A (650W, Màu Đen)','Nguồn máy tính Segotep U6+ SG-D750A (650W, Màu Đen)',3050000.00,16,'Sagotep','{\"modular\": \"Semi\", \"wattage\": 650, \"certification\": \"Silver\"}',1,'2025-09-19 14:37:30.567560',7,'products/2025/09/250-27988-segotep-u6-sg-d750a-2.jpg'),(67,'Nguồn máy tính ANTEC GOLD Plus G750 750W','Cooler Master PSU 6 - Sản phẩm demo cho danh mục PSU.',860000.00,18,'ANTEC','{\"modular\": \"Semi\", \"wattage\": \"750\", \"certification\": \"Gold\"}',1,'2025-09-19 14:37:30.568560',7,'products/2025/09/250-26687-f5960bdd54aaf6f4afbb_TAkqB3y.jpg'),(68,'Nguồn máy tính MSI MAG A750BN 750W','Nguồn máy tính MSI MAG A750BN 750W',1150000.00,18,'MSI','{\"modular\": \"Full\", \"wattage\": 750, \"certification\": \"Bronze\"}',1,'2025-09-19 14:37:30.568560',7,'products/2025/09/250-25988-468295cf2cd594cc57b1ceb5ab5d63_2.png'),(69,'Nguồn Gaming ASUS TUF 1200W GOLD ATX 3.0','Nguồn Gaming ASUS TUF 1200W GOLD ATX 3.0',1850000.00,44,'ASUS','{\"modular\": \"Full\", \"wattage\": \"1200\", \"certification\": \"Gold\"}',1,'2025-09-19 14:37:30.568560',7,'products/2025/09/asustuf.jpg'),(70,'Nguồn Máy Tính ASUS TUF Gaming 1000W White - Gold','Cooler Master PSU 9 - Sản phẩm demo cho danh mục PSU.',2640000.00,49,'ASUS','{\"modular\": \"Full\", \"wattage\": \"1000\", \"certification\": \"Gold\"}',1,'2025-09-19 14:37:30.568560',7,'products/2025/09/250-27195-nguon-may-tinh-asus-tuf-gaming-1000w-white-gold-1.jpg'),(71,'Nguồn Super Flower Leadex VII XG 850W ATX 3.1 White 80 Plus Gold','Nguồn Super Flower Leadex VII XG 850W ATX 3.1 White 80 Plus Gold',2120000.00,36,'Super Flower','{\"modular\": \"Full\", \"wattage\": \"850\", \"certification\": \"Gold\"}',1,'2025-09-19 14:37:30.569560',7,'products/2025/09/250-27193-nguon-super-flower-leadex-vii-xg-850w-atx-31-white-80-plus-gold-1.jpg'),(72,'Ổ cứng HDD Seagate Barracuda 2TB 7200Rpm','Ổ cứng HDD Seagate Barracuda 2TB 7200Rpm',4640000.00,50,'Seagate','{\"type\": \"HDD\", \"capacity\": \"2048\", \"interface\": \"SATA\", \"form_factor\": \"3.5\\\"\"}',1,'2025-09-19 14:37:30.569560',6,'products/2025/09/250-4332-sp000043.jpg'),(73,'Ổ Cứng HDD Western Caviar Blue 4TB','Ổ Cứng HDD Western Caviar Blue 4TB',1290000.00,34,'WD','{\"type\": \"HDD\", \"capacity\": \"4096\", \"interface\": \"SATA\", \"form_factor\": \"3.5\\\"\"}',1,'2025-09-19 14:37:30.569560',6,'products/2025/09/250-18448-hdd-western-caviar-blue-4tb-1.jpg'),(74,'Ổ cứng HDD Seagate IRONWOLF NAS','Ổ cứng HDD Seagate IRONWOLF NAS',880000.00,12,'Seagate','{\"type\": \"HDD\", \"capacity\": \"4096\", \"interface\": \"SATA\", \"form_factor\": \"3.5\\\"\"}',1,'2025-09-19 14:37:30.570560',6,'products/2025/09/Screenshot_2025-09-20_003824.png'),(75,'SSD NVMe Kioxia Exceria Plus G3 Gen 4x4 1TB','SSD NVMe Kioxia Exceria Plus G3 Gen 4x4 1TB',4880000.00,47,'Kioxia','{\"type\": \"SSD\", \"capacity\": \"1024\", \"interface\": \"NVMe\", \"form_factor\": \"M.2 2280\"}',1,'2025-09-19 14:37:30.570560',6,'products/2025/09/250-25913-lsd10z001tg8.jpg'),(76,'Ổ cứng SSD Kingston NV2 4TB PCIe 4.0 x4 NVMe M.2','Ổ cứng SSD Kingston NV2 4TB PCIe 4.0 x4 NVMe M.2',4850000.00,15,'Kingston','{\"type\": \"SSD\", \"capacity\": \"4096\", \"interface\": \"NVMe\", \"form_factor\": \"M.2 2280\"}',1,'2025-09-19 14:37:30.570560',6,'products/2025/09/250-26808-kingston-nv2-4tb-pcie-gen-4-x4-nvme-m2-1.jpg'),(77,'Ổ cứng SSD Samsung 970 Evo Plus 500GB M.2 NVMe','Ổ cứng SSD Samsung 970 Evo Plus 500GB M.2 NVMe',3320000.00,46,'Samsung','{\"type\": \"SSD\", \"capacity\": \"500\", \"interface\": \"NVMe\", \"form_factor\": \"M.2 2280\"}',1,'2025-09-19 14:37:30.571561',6,'products/2025/09/250-16040-ssd.jpg'),(78,'Ổ cứng SSD Kingston KC3000 512GB NVMe M.2 2280','Ổ cứng SSD Kingston KC3000 512GB NVMe M.2 2280',3060000.00,26,'Kingston','{\"type\": \"SSD\", \"capacity\": \"512\", \"interface\": \"NVMe\", \"form_factor\": \"M.2 2280\"}',1,'2025-09-19 14:37:30.571561',6,'products/2025/09/250-22473-sp181247.jpg'),(79,'Ổ cứng SSD NVMe KIOXIA 2TB EXCERIA PLUS G3 NVMe Gen 4','Ổ cứng SSD NVMe KIOXIA 2TB EXCERIA PLUS G3 NVMe Gen 4',4190000.00,22,'KIOXIA','{\"type\": \"SSD\", \"capacity\": \"2048\", \"interface\": \"NVMe\", \"form_factor\": \"M.2 2280\"}',1,'2025-09-19 14:37:30.572560',6,'products/2025/09/250-25901-khung--ssd-------c---ng-hdd.jpg'),(80,'Ổ cứng SSD Lexar NS100 1TB','Ổ cứng SSD Lexar NS100 1TB',4020000.00,12,'Lexar','{\"type\": \"SSD\", \"capacity\": \"1024\", \"interface\": \"SATA\", \"form_factor\": \"2.5\\\"\"}',1,'2025-09-19 14:37:30.572560',6,'products/2025/09/250-20486-lexar-ns100-03.jpg'),(81,'Ổ cứng SSD Samsung 980 PRO 1TB PCIe 4.0 M.2 NVMe','Ổ cứng SSD Samsung 980 PRO 1TB PCIe 4.0 M.2 NVMe',1140000.00,18,'Samsung','{\"type\": \"SSD\", \"capacity\": \"1024\", \"interface\": \"NVMe\", \"form_factor\": \"M.2 2280\"}',1,'2025-09-19 14:37:30.573561',6,'products/2025/09/250-17066-samsung-980-pro-1tb-6.jpg'),(82,'Vỏ Case Sharkoon MS-Y1000','Vỏ Case Sharkoon MS-Y1000',1350000.00,41,'NZXT','{\"form_factor\": \"Mini-ITX\", \"max_gpu_length\": 360, \"max_cooler_height\": 155}',1,'2025-09-19 14:37:30.573561',8,'products/2025/09/case1.jpg'),(83,'Vỏ Case Xigmatek Pura ML Arctic EN48470','Vỏ Case Xigmatek Pura ML Arctic EN48470',950000.00,6,'Phanteks','{\"form_factor\": \"Mini-ITX\", \"max_gpu_length\": 320, \"max_cooler_height\": 170}',1,'2025-09-19 14:37:30.574560',8,'products/2025/09/case2.jpg'),(84,'Vỏ Case MIK Focalors M','Vỏ Case MIK Focalors M',1920000.00,46,'Cooler Master','{\"form_factor\": \"ATX\", \"max_gpu_length\": 300, \"max_cooler_height\": 180}',1,'2025-09-19 14:37:30.574560',8,'products/2025/09/case3.jpg'),(85,'Vỏ Case Xigmatek Cubi M Arctic EN42782','Vỏ Case Xigmatek Cubi M Arctic EN42782',2680000.00,42,'NZXT','{\"form_factor\": \"ATX\", \"max_gpu_length\": 320, \"max_cooler_height\": 155}',1,'2025-09-19 14:37:30.574560',8,'products/2025/09/case4.jpg'),(86,'VỎ CASE MIK MORAX 3FA BLACK','VỎ CASE MIK MORAX 3FA BLACK',1020000.00,9,'Phanteks','{\"form_factor\": \"ATX\", \"max_gpu_length\": 360, \"max_cooler_height\": 155}',1,'2025-09-19 14:37:30.575560',8,'products/2025/09/case5.jpg'),(87,'Vỏ Case MIK Focalors M','Vỏ Case MIK Focalors M',800000.00,5,'Cooler Master','{\"form_factor\": \"Mini-ITX\", \"max_gpu_length\": 320, \"max_cooler_height\": 180}',1,'2025-09-19 14:37:30.575560',8,'products/2025/09/case6.jpg'),(88,'Vỏ Case DarkFlash DY470','NZXT CASE 7 - Sản phẩm demo cho danh mục Case.',1720000.00,47,'NZXT','{\"form_factor\": \"E-ATX\", \"max_gpu_length\": 320, \"max_cooler_height\": 155}',1,'2025-09-19 14:37:30.576560',8,'products/2025/09/case7.jpg'),(89,'Vỏ Case COOLER MASTER Elite 502 Lite','Vỏ Case COOLER MASTER Elite 502 Lite',710000.00,10,'Phanteks','{\"form_factor\": \"E-ATX\", \"max_gpu_length\": 400, \"max_cooler_height\": 180}',1,'2025-09-19 14:37:30.576560',8,'products/2025/09/case8.jpg'),(90,'Vỏ case Xigmatek Osiris','Vỏ case Xigmatek Osiris',990000.00,48,'Cooler Master','{\"form_factor\": \"Micro-ATX\", \"max_gpu_length\": 360, \"max_cooler_height\": 165}',1,'2025-09-19 14:37:30.577561',8,'products/2025/09/case9.jpg'),(91,'Vỏ Case VITRA ATLANTIS X6 LITE BLACK','Vỏ Case VITRA ATLANTIS X6 LITE BLACK',750000.00,10,'NZXT','{\"form_factor\": \"E-ATX\", \"max_gpu_length\": 320, \"max_cooler_height\": 180}',1,'2025-09-19 14:37:30.577561',8,'products/2025/09/case10.png'),(92,'Tản Nhiệt Khí JONSBO CR-1000 EVO BLACK (Color RGB)','Noctua COOLING 1 - Sản phẩm demo cho danh mục Cooling.',590000.00,12,'Noctua','{\"type\": \"Air\", \"height\": 160, \"max_tdp\": 250, \"fan_size\": \"140\", \"fan_count\": 3, \"radiator_size\": \"120\", \"socket_support\": \"LGA1700, AM5\"}',1,'2025-09-19 14:37:30.578561',9,'products/2025/09/250-27414-tan-nhiet-khi-jonsbo-cr-1000-evo-black-color-rgb-1.jpg'),(93,'Tản nhiệt khí CPU ID-Cooling SE-55 ARGB Snow','Deepcool COOLING 2 - Sản phẩm demo cho danh mục Cooling.',1360000.00,26,'Deepcool','{\"type\": \"Air\", \"height\": 150, \"max_tdp\": 250, \"fan_size\": \"140\", \"fan_count\": 1, \"radiator_size\": \"360\", \"socket_support\": \"AM5, LGA1700, AM4\"}',1,'2025-09-19 14:37:30.578561',9,'products/2025/09/250-27887-id-cooling-se-55-argb-white-5.jpg'),(94,'Tản nhiệt nước AIO Thermalright Frozen Warframe 360 BLack ARGB','Corsair COOLING 3 - Sản phẩm demo cho danh mục Cooling.',2100000.00,11,'Corsair','{\"type\": \"AIO Liquid\", \"height\": 170, \"max_tdp\": 150, \"fan_size\": \"140\", \"fan_count\": 3, \"radiator_size\": \"240\", \"socket_support\": \"LGA1700, AM5\"}',1,'2025-09-19 14:37:30.578561',9,'products/2025/09/250-26034-1-8-600x600.png'),(95,'Tản nhiệt nước AIO ASUS PRIME LC 360 LCD ARGB','NZXT COOLING 4 - Sản phẩm demo cho danh mục Cooling.',2970000.00,48,'NZXT','{\"type\": \"AIO Liquid\", \"height\": 160, \"max_tdp\": 250, \"fan_size\": \"120\", \"fan_count\": 3, \"radiator_size\": \"240\", \"socket_support\": \"AM5, AM4\"}',1,'2025-09-19 14:37:30.579560',9,'products/2025/09/250-28041-aio-asus-prime-lc-360-lcd-argb.jpg'),(96,'Tản Nhiệt Nước ID-COOLING FX360 INF ARGB','Noctua COOLING 5 - Sản phẩm demo cho danh mục Cooling.',2230000.00,43,'Noctua','{\"type\": \"AIO Liquid\", \"height\": 150, \"max_tdp\": 200, \"fan_size\": \"140\", \"fan_count\": 3, \"radiator_size\": \"360\", \"socket_support\": \"LGA1700, AM4, AM5\"}',1,'2025-09-19 14:37:30.579560',9,'products/2025/09/250-27480-id-cooling-fx360-inf-argb-1.jpg'),(97,'Tản Nhiệt Khí ID-COOLING SE-214-XT RGB','Deepcool COOLING 6 - Sản phẩm demo cho danh mục Cooling.',2130000.00,13,'Deepcool','{\"type\": \"Air\", \"height\": 170, \"max_tdp\": 200, \"fan_size\": \"140\", \"fan_count\": 1, \"radiator_size\": \"360\", \"socket_support\": \"LGA1700, AM5\"}',1,'2025-09-19 14:37:30.580561',9,'products/2025/09/250-26900-tan-nhiet-cpu-id-cooling-se-214-xt-3.jpg'),(98,'Tản nhiệt khí ID-Cooling FROZN A620 Pro SE','Corsair COOLING 7 - Sản phẩm demo cho danh mục Cooling.',430000.00,16,'Corsair','{\"type\": \"Air\", \"height\": 170, \"max_tdp\": 200, \"fan_size\": \"120\", \"fan_count\": 3, \"radiator_size\": \"120\", \"socket_support\": \"LGA1700, AM4\"}',1,'2025-09-19 14:37:30.581560',9,'products/2025/09/250-26885-tan-nhiet-khi-id-cooling-frozn-a620-pro-se-1.jpg'),(99,'Tản nhiệt khí ID-Cooling FROZN A720 Black','NZXT COOLING 8 - Sản phẩm demo cho danh mục Cooling.',2740000.00,36,'NZXT','{\"type\": \"Air\", \"height\": 160, \"max_tdp\": 150, \"fan_size\": \"140\", \"fan_count\": 2, \"radiator_size\": \"120\", \"socket_support\": \"AM5, AM4, LGA1700\"}',1,'2025-09-19 14:37:30.581560',9,'products/2025/09/250-26973-tan-nhiet-khi-id-cooling-frozn-a720-black.jpg'),(100,'Tản Nhiệt Nước CPU Thermalright Aqua Elite 240 BLACK ARGB V3','Noctua COOLING 9 - Sản phẩm demo cho danh mục Cooling.',1460000.00,37,'Noctua','{\"type\": \"AIO Liquid\", \"height\": 150, \"max_tdp\": 200, \"fan_size\": \"140\", \"fan_count\": 1, \"radiator_size\": \"120\", \"socket_support\": \"LGA1700, AM4\"}',1,'2025-09-19 14:37:30.582560',9,'products/2025/09/250-26021-1-3--1-.png'),(101,'Tản nhiệt nước Segotep BeAced 360 ARGB Black','Deepcool COOLING 10 - Sản phẩm demo cho danh mục Cooling.',2880000.00,9,'Deepcool','{\"type\": \"AIO Liquid\", \"height\": 170, \"max_tdp\": 200, \"fan_size\": \"120\", \"fan_count\": 3, \"radiator_size\": \"120\", \"socket_support\": \"AM4, AM5\"}',1,'2025-09-19 14:37:30.583561',9,'products/2025/09/250-27962-segotep-beaced-360-a-rgb-0-9.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_user_id_product_id_67b58403_uniq` (`user_id`,`product_id`),
  KEY `reviews_rating_17e8a4_idx` (`rating`),
  KEY `reviews_product_id_d4b78cfe_fk_products_id` (`product_id`),
  CONSTRAINT `reviews_product_id_d4b78cfe_fk_products_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `reviews_user_id_c23b0903_fk_ecommerce_user_id` FOREIGN KEY (`user_id`) REFERENCES `ecommerce_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,5,'2025-09-11 12:48:50.893694',1,1),(2,4,'2025-09-11 12:48:50.899696',1,3),(3,5,'2025-09-11 12:48:50.904696',2,1),(4,4,'2025-09-11 12:48:50.911200',2,4),(5,5,'2025-09-11 12:48:50.916703',3,3),(6,3,'2025-09-11 12:48:50.922703',3,4),(7,3,'2025-09-12 08:50:45.074790',15,10),(12,5,'2025-09-12 09:46:08.341143',13,2);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-20  9:29:40
