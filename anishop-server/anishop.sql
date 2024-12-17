-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           8.0.30 - MySQL Community Server - GPL
-- SO do servidor:               Win64
-- HeidiSQL Versão:              12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- A despejar estrutura para tabela anishop.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `expiry_date` varchar(5) NOT NULL,
  `cvv` varchar(3) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela anishop.orders: ~9 rows (aproximadamente)
INSERT INTO `orders` (`id`, `user_id`, `first_name`, `last_name`, `address`, `city`, `postal_code`, `phone`, `card_number`, `expiry_date`, `cvv`, `total_price`, `order_date`, `updated_at`) VALUES
	(1, 1, 'Gonçalo', 'Moreira', 'Rua do Pinhal', 'Miranda do Corvo', '3220-316', '913541426', '2400240024002400', '12/32', '123', 110.00, '2024-12-05 22:47:02', '2024-12-05 22:47:02'),
	(2, 1, 'Gonçalo', 'Moreira', 'Rua do Pinhal', 'Miranda do Corvo', '3220-316', '913541426', '2400240024002400', '12/26', '123', 82.00, '2024-12-06 14:45:18', '2024-12-06 14:45:18'),
	(3, 3, 'joao', 'neves', 'rua da cunha silva ', 'porto', '3221-413', '913756254', '8008800880088008', '1235', '998', 59.00, '2024-12-08 18:35:17', '2024-12-08 18:35:17'),
	(4, 3, 'henrique', 'silva', 'rua do assobio ', 'pereira', '3110-789', '918765432', '3000300030003000', '12/45', '246', 81.00, '2024-12-08 20:47:10', '2024-12-08 20:47:10'),
	(5, 3, 'henrique', 'silva', 'rua do assobio ', 'pereira', '3110-789', '918765432', '3000300030003000', '12/45', '246', 81.00, '2024-12-08 20:48:44', '2024-12-08 20:48:44'),
	(6, 3, 'henrique', 'silva', 'rua do assobio ', 'pereira', '3110-789', '918765432', '3000300030003000', '12/45', '246', 81.00, '2024-12-08 20:48:51', '2024-12-08 20:48:51'),
	(7, 3, 'henrique', 'silva', 'rua do assobio ', 'pereira', '3110-789', '918765432', '3000300030003000', '12/45', '246', 81.00, '2024-12-08 20:54:09', '2024-12-08 20:54:09'),
	(8, 3, 'Gonçalo', 'Moreira', 'Rua do Pinhal', 'Miranda do Corvo', '3220-316', '913541426', '2900920092002900', '12/34', '178', 32.00, '2024-12-09 15:51:06', '2024-12-09 15:51:06'),
	(9, 4, 'Luis', 'Lopes', 'Rua do anilhamentto', 'verasd', '3220-290', '910367496', '8000800080008000', '12/25', '123', 124.00, '2024-12-09 16:16:39', '2024-12-09 16:16:39'),
	(10, 5, 'Fufu', 'Turbo', 'Rua Eislich', 'Berlim', '1990-890', '890876543', '7800780078007800', '12/32', '789', 91.00, '2024-12-10 12:07:20', '2024-12-10 12:07:20'),
	(11, 5, 'Turbo', 'Fufu', 'Rua Esichl', 'Berlim', '3990-390', '987654312', '7800780078007800', '12/37', '123', 70.00, '2024-12-10 12:25:33', '2024-12-10 12:25:33'),
	(12, 6, 'jin wo', 'sung', 'dfgghm', 'coimbra', '3554-789', '123456789', '1200120012001200', '12/42', '123', 117.00, '2024-12-13 01:05:51', '2024-12-13 01:05:51'),
	(13, 2, 'Test', 'TEst', 'TEST STREET', 'TS', '2223-633', '987654321', '2000200020002000', '12/32', '123', 74.00, '2024-12-14 12:13:16', '2024-12-14 12:13:16'),
	(14, 2, 'lukytuerdst', 'çlkiuygtfd', 'ºçlkjhgfcx', 'ljhlihjb', '3211-232', '987654321', '2000200020002000', '12/23', '123', 90.00, '2024-12-14 17:30:19', '2024-12-14 17:30:19');

-- A despejar estrutura para tabela anishop.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela anishop.order_items: ~19 rows (aproximadamente)
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `name`) VALUES
	(1, 1, 7, 1, 20.00, 'Jellal POP Figure'),
	(2, 1, 1, 1, 30.00, 'Attack On Titan Volume 1'),
	(3, 1, 10, 1, 50.00, 'Gojo Figure'),
	(4, 2, 6, 1, 22.00, 'Solo Leveling Volume 8'),
	(5, 2, 9, 1, 50.00, 'Itachi Figure'),
	(6, 3, 4, 1, 27.00, 'Frieren Volume 1'),
	(7, 3, 5, 1, 22.00, 'My Hero Academy Volume 1'),
	(8, 4, 4, 1, 27.00, 'Frieren Volume 1'),
	(9, 4, 5, 2, 22.00, 'My Hero Academy Volume 1'),
	(10, 5, 4, 1, 27.00, 'Frieren Volume 1'),
	(11, 5, 5, 2, 22.00, 'My Hero Academy Volume 1'),
	(12, 6, 4, 1, 27.00, 'Frieren Volume 1'),
	(13, 6, 5, 2, 22.00, 'My Hero Academy Volume 1'),
	(14, 7, 4, 1, 27.00, 'Frieren Volume 1'),
	(15, 7, 5, 2, 22.00, 'My Hero Academy Volume 1'),
	(16, 8, 6, 1, 22.00, 'Solo Leveling Volume 8'),
	(17, 9, 6, 2, 22.00, 'Solo Leveling Volume 8'),
	(18, 9, 9, 1, 50.00, 'Itachi Figure'),
	(19, 9, 7, 1, 20.00, 'Jellal POP Figure'),
	(20, 10, 4, 3, 27.00, 'Frieren Volume 1'),
	(21, 11, 15, 4, 15.00, 'Solo Leveling Volume 1'),
	(22, 12, 9, 1, 50.00, 'Itachi Figure'),
	(23, 12, 4, 1, 27.00, 'Frieren Volume 1'),
	(24, 12, 15, 2, 15.00, 'Solo Leveling Volume 1'),
	(25, 13, 4, 1, 27.00, 'Frieren Volume 1'),
	(26, 13, 6, 1, 22.00, 'Solo Leveling Volume 8'),
	(27, 13, 15, 1, 15.00, 'Solo Leveling Volume 1'),
	(28, 14, 1, 1, 30.00, 'Attack On Titan Volume 1'),
	(29, 14, 9, 1, 50.00, 'Itachi Figure');

-- A despejar estrutura para tabela anishop.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela anishop.products: ~19 rows (aproximadamente)
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `stock`, `image_url`, `created_at`) VALUES
	(1, 'Attack On Titan Volume 1', 'Volume 1 of the Attack on Titan', 30.00, 'Manga', 19, 'AoT1.jpg', '2024-12-02 20:53:33'),
	(3, 'Attack on Titan Volume 2', '22', 22.00, 'Manga', 22, 'Aot2.jpg', '2024-12-03 16:23:06'),
	(4, 'Frieren Volume 1', 'First volume of the famous manga Frieren', 27.00, 'Manga', 14, 'Frieren1.jpg', '2024-12-04 17:16:04'),
	(5, 'My Hero Academy Volume 1', 'First Volume of the manga My Hero Academia', 22.00, 'Manga', 20, 'MyHeroA1.jpg', '2024-12-04 17:16:59'),
	(6, 'Solo Leveling Volume 8', 'Volume 8 of the famous korean manhwa Solo Leveling', 22.00, 'Manga', 18, 'SoloL8.jpg', '2024-12-04 17:18:32'),
	(7, 'Jellal POP Figure', 'POP Figure of Fairy Tail ', 20.00, 'Figures', 9, 'JellalPoP1.jpg', '2024-12-04 17:26:26'),
	(8, 'Xiao Stuffed ', 'Little Stuffed Xiao from Genshin Impact', 10.00, 'Accessories', 10, 'Xiao1.jpg', '2024-12-04 17:28:32'),
	(9, 'Itachi Figure', 'Itachi Figure of Naruto Series ', 50.00, 'Figures', 7, 'Itachi1.jpg', '2024-12-04 17:29:26'),
	(10, 'Gojo Figure', 'Gojo Figure from Jujutsu Kaisen Series', 50.00, 'Figures', 10, 'Gojo1.jpg', '2024-12-04 17:30:21'),
	(11, 'Zoro Figure', 'Zoro Figure from One Piece Series', 50.00, 'Figures', 20, 'Zoro1.jpg', '2024-12-04 17:31:03'),
	(13, 'Estojo Xiao', 'Estojo do Xiao personagem do jogo Genshin Impact', 15.00, 'Accessories', 20, 'EstojoXiao1.jpg', '2024-12-04 17:32:17'),
	(14, 'Howls Moving Castle', 'Movie from Studio Ghibli', 15.00, 'Anime', 25, 'Howl-s-Moving-Castle.jpg', '2024-12-04 17:35:02'),
	(15, 'Solo Leveling Volume 1', 'First Volume of the famous korean manhwa Solo Leveling', 15.00, 'Manga', 13, 'SoloL1.jpg', '2024-12-10 12:24:03'),
	(16, 'Kimi no Nawa ', 'Filme Kimi no Nawa ou Your Name realizado por Makoto Shinkai.', 12.00, 'Anime', 20, 'Yourname.jpg', '2024-12-12 15:01:33'),
	(17, 'Ponyo', 'Filme Ponyo, The Studio Ghibli Collection', 12.00, 'Anime', 20, 'Ponyo.jpg', '2024-12-12 15:03:03'),
	(18, 'One Piece Volume 1 ', 'One Piece Volume 1 ', 22.00, 'Manga', 20, 'OneP1.jpg', '2024-12-13 01:10:44'),
	(20, 'Samurai X Volume 1', 'Primeiro Volume de Samurai X', 20.00, 'Manga', 20, 'SamuraiX1.jpg', '2024-12-14 12:17:25'),
	(21, 'Tokyo Revengers Volume 1', 'Volume 1 do Manga Tokyo Revengers', 20.00, 'Manga', 20, 'TokyoR1.jpg', '2024-12-14 12:22:35'),
	(22, 'Naruto Manga Pack', 'Pack de Manga Naruto do Volume 1 ao 3', 40.00, 'Manga', 10, 'Naruto123.jpg', '2024-12-14 12:23:42'),
	(23, 'Jujustu Kaisen Volume 1  ', 'Volume 1 do Manga Jujustsu Kaisen', 20.00, 'Manga', 20, 'JujuK1.jpg', '2024-12-14 12:24:52'),
	(24, 'Pack Genshin Impact ', 'Pack de 6 porta chaves de Genshin Impact', 30.00, 'Accessories', 20, 'GenshinPack.jpg', '2024-12-14 12:35:13'),
	(26, 'slayer', '1221', 12.00, 'Manga', 12, '12', '2024-12-17 15:35:45');

-- A despejar estrutura para tabela anishop.product_genres
CREATE TABLE IF NOT EXISTS `product_genres` (
  `product_id` int NOT NULL,
  `genre` varchar(50) NOT NULL,
  PRIMARY KEY (`product_id`,`genre`),
  CONSTRAINT `product_genres_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela anishop.product_genres: ~0 rows (aproximadamente)

-- A despejar estrutura para tabela anishop.product_images
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela anishop.product_images: ~3 rows (aproximadamente)
INSERT INTO `product_images` (`id`, `product_id`, `image_url`) VALUES
	(1, 10, 'Gojo2.jpg'),
	(2, 10, 'Gojo3.jpg'),
	(3, 10, 'Gojo4.jpg'),
	(6, 9, 'Itachi2.jpg'),
	(7, 9, 'Itachi3.jpg'),
	(8, 1, 'Frieren1.jpg');

-- A despejar estrutura para tabela anishop.ratings
CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `review` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela anishop.ratings: ~0 rows (aproximadamente)

-- A despejar estrutura para tabela anishop.reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_reviews_product` (`product_id`),
  KEY `fk_reviews_user` (`user_id`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela anishop.reviews: ~5 rows (aproximadamente)
INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
	(1, 6, 1, 5, 'Incrivel, bom estado, entrega rápida', '2024-12-08 22:19:36', '2024-12-08 22:19:36'),
	(2, 4, 1, 3, 'asasasasa', '2024-12-12 12:18:46', '2024-12-12 12:18:46'),
	(3, 9, 1, 5, 'Muito Bom, ofereci ao meu irmao agora acho que tenho que comprar um para mim :D', '2024-12-12 12:24:11', '2024-12-12 12:24:11'),
	(4, 9, 1, 3, 'Meh prefiro madara', '2024-12-12 12:24:33', '2024-12-12 12:24:33'),
	(5, 5, 1, 4, 'Como diz o maico de xiquexique bahia, good good', '2024-12-12 12:46:17', '2024-12-12 12:46:17'),
	(6, 9, 6, 2, '2 seddddd', '2024-12-13 01:03:17', '2024-12-13 01:03:17');

-- A despejar estrutura para tabela anishop.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela anishop.users: ~2 rows (aproximadamente)
INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
	(1, 'slayer', 'goncalomoreira373@gmail.com', '$2b$10$RUj45bIwnUYS99.w2u5fx.iOIc80fazxlVmeRfJ3hBdKqVdi9UHTy'),
	(3, 'kinghicas99', 'kinghicas99@gmail.com', '$2b$10$4LINu.DRi7RqorG0Xaed9uCms/W3Onov9QMf/b4ZYC.WGQzoV13em'),
	(5, 'TurboFufu', 'turbofufu@gmail.com', '$2b$10$.oRhm0PJoaGddvpGw6BepugZ/ow3MEj4/95swg.9cMtS6u70xQNTK'),
	(6, 'sung jin wo', 'sungjinwo123@gmail.com', '$2b$10$RuzV3/wcIEPUersTXP4e1.fgV./GnLSX18pLrGnHuSNXpmAcaS93m');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
