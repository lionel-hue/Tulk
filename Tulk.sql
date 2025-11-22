-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 13, 2025 at 10:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Tulk`
--

-- --------------------------------------------------------

--
-- Table structure for table `Amitie`
--

CREATE TABLE `Amitie` (
  `id_1` int(255) NOT NULL,
  `id_2` int(255) NOT NULL,
  `statut` enum('en attente','ami') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Article`
--

CREATE TABLE `Article` (
  `id` int(255) NOT NULL,
  `image` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_uti` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Commentaire`
--

CREATE TABLE `Commentaire` (
  `id` int(255) NOT NULL,
  `texte` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_arti` int(255) NOT NULL,
  `id_uti` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Liker`
--

CREATE TABLE `Liker` (
  `id` int(255) UNSIGNED NOT NULL,
  `type` text DEFAULT NULL,
  `id_uti` int(255) NOT NULL,
  `id_arti` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Message`
--

CREATE TABLE `Message` (
  `id` int(255) NOT NULL,
  `date` date NOT NULL,
  `image` text NOT NULL,
  `texte` text NOT NULL,
  `id_uti_1` int(255) NOT NULL,
  `id_uti_2` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Utilisateur`
--

CREATE TABLE `Utilisateur` (
  `id` int(255) NOT NULL,
  `nom` text NOT NULL,
  `prenom` text DEFAULT NULL,
  `role` enum('admin','mod','user') DEFAULT NULL,
  `image` text DEFAULT NULL,
  `sexe` enum('M','F') DEFAULT NULL,
  `mdp` text NOT NULL,
  `email` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Amitie`
--
ALTER TABLE `Amitie`
  ADD PRIMARY KEY (`id_1`,`id_2`),
  ADD KEY `id_1` (`id_1`,`id_2`),
  ADD KEY `id_2` (`id_2`);

--
-- Indexes for table `Article`
--
ALTER TABLE `Article`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_uti` (`id_uti`);

--
-- Indexes for table `Commentaire`
--
ALTER TABLE `Commentaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_arti` (`id_arti`),
  ADD KEY `id_uti` (`id_uti`);

--
-- Indexes for table `Liker`
--
ALTER TABLE `Liker`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_uti` (`id_uti`),
  ADD KEY `id_arti` (`id_arti`);

--
-- Indexes for table `Message`
--
ALTER TABLE `Message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_uti_1` (`id_uti_1`,`id_uti_2`),
  ADD KEY `id_uti_2` (`id_uti_2`);

--
-- Indexes for table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Article`
--
ALTER TABLE `Article`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `Commentaire`
--
ALTER TABLE `Commentaire`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Liker`
--
ALTER TABLE `Liker`
  MODIFY `id` int(255) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Message`
--
ALTER TABLE `Message`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Amitie`
--
ALTER TABLE `Amitie`
  ADD CONSTRAINT `Amitie_ibfk_1` FOREIGN KEY (`id_1`) REFERENCES `Utilisateur` (`id`),
  ADD CONSTRAINT `Amitie_ibfk_2` FOREIGN KEY (`id_2`) REFERENCES `Utilisateur` (`id`);

--
-- Constraints for table `Article`
--
ALTER TABLE `Article`
  ADD CONSTRAINT `Article_ibfk_1` FOREIGN KEY (`id_uti`) REFERENCES `Utilisateur` (`id`);

--
-- Constraints for table `Commentaire`
--
ALTER TABLE `Commentaire`
  ADD CONSTRAINT `Commentaire_ibfk_1` FOREIGN KEY (`id_arti`) REFERENCES `Article` (`id`),
  ADD CONSTRAINT `Commentaire_ibfk_2` FOREIGN KEY (`id_uti`) REFERENCES `Utilisateur` (`id`);

--
-- Constraints for table `Liker`
--
ALTER TABLE `Liker`
  ADD CONSTRAINT `Liker_ibfk_1` FOREIGN KEY (`id_uti`) REFERENCES `Utilisateur` (`id`),
  ADD CONSTRAINT `Liker_ibfk_2` FOREIGN KEY (`id_arti`) REFERENCES `Article` (`id`);

--
-- Constraints for table `Message`
--
ALTER TABLE `Message`
  ADD CONSTRAINT `Message_ibfk_1` FOREIGN KEY (`id_uti_1`) REFERENCES `Uotilisateur` (`id`),
  ADD CONSTRAINT `Message_ibfk_2` FOREIGN KEY (`id_uti_2`) REFERENCES `Utilisateur` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
