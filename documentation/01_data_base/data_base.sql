CREATE TABLE `Roles` (
  `name` VARCHAR(50) PRIMARY KEY
);

CREATE TABLE `Search_history` (
  `PK_id` INT PRIMARY KEY AUTO_INCREMENT,
  `search_text` VARCHAR(150) NOT NULL
);

CREATE TABLE `Job_tags` (
  `name` VARCHAR(100) PRIMARY KEY
);

CREATE TABLE `User_` (
  `PK_id` INT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `hashed_password` VARCHAR(255) NOT NULL,
  `creation_date` DATE NOT NULL,
  `last_connection` DATE NOT NULL,
  `firstname` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(50) NOT NULL,
  `biography` TEXT,
  `profil_pic_link` VARCHAR(500),
  `FK_role_id` VARCHAR(50) NOT NULL
);

CREATE TABLE `Job_Offers` (
  `PK_id` int PRIMARY KEY AUTO_INCREMENT,
  `content_hash` TEXT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `contract_type` VARCHAR(50),
  `city` VARCHAR(150),
  `country` VARCHAR(150),
  `FK_user_id` INT,
  `is_remote_job` bool,
  `is_hybride_job` bool,
  `publish_date` date,
  `salary_max` int,
  `salary_min` int,
  `currency` char(3),
  `company` varchar(250)
);

CREATE TABLE `Applied` (
  `FK_user_id` INT,
  `FK_job_offer_id` int,
  PRIMARY KEY (`FK_user_id`, `FK_job_offer_id`)
);

CREATE TABLE `Searched` (
  `FK_user_id` INT,
  `FK_id_search_history` INT,
  PRIMARY KEY (`FK_user_id`, `FK_id_search_history`)
);

CREATE TABLE `defined` (
  `FK_job_offer_id` int,
  `FK_job_tag_name` VARCHAR(100),
  PRIMARY KEY (`FK_job_offer_id`, `FK_job_tag_name`)
);

CREATE TABLE `Banned` (
  `PK_banned_id` INT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `banned_at` date NOT NULL
);

CREATE TABLE `Blacklist` (
  `PK_blacklist_id` INT PRIMARY KEY AUTO_INCREMENT,
  `token` VARCHAR(2048) NOT NULL,
  `blacklisted_at` date NOT NULL
);

CREATE UNIQUE INDEX `User__index_0` ON `User_` (`email`);

ALTER TABLE `User_` ADD FOREIGN KEY (`FK_role_id`) REFERENCES `Roles` (`name`) ON DELETE CASCADE;

ALTER TABLE `Job_Offers` ADD FOREIGN KEY (`FK_user_id`) REFERENCES `User_` (`PK_id`) ON DELETE SET NULL;

ALTER TABLE `Applied` ADD FOREIGN KEY (`FK_user_id`) REFERENCES `User_` (`PK_id`) ON DELETE CASCADE;

ALTER TABLE `Applied` ADD FOREIGN KEY (`FK_job_offer_id`) REFERENCES `Job_Offers` (`PK_id`) ON DELETE CASCADE;

ALTER TABLE `Searched` ADD FOREIGN KEY (`FK_user_id`) REFERENCES `User_` (`PK_id`) ON DELETE CASCADE;

ALTER TABLE `Searched` ADD FOREIGN KEY (`FK_id_search_history`) REFERENCES `Search_history` (`PK_id`) ON DELETE CASCADE;

ALTER TABLE `defined` ADD FOREIGN KEY (`FK_job_offer_id`) REFERENCES `Job_Offers` (`PK_id`) ON DELETE CASCADE;

ALTER TABLE `defined` ADD FOREIGN KEY (`FK_job_tag_name`) REFERENCES `Job_tags` (`name`) ON DELETE CASCADE;

