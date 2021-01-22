-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Hôte : maria_db:3306
-- Généré le : ven. 22 jan. 2021 à 11:12
-- Version du serveur :  10.5.8-MariaDB-1:10.5.8+maria~focal
-- Version de PHP : 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `combatgentil_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `player`
--

CREATE TABLE `player` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `life` int(2) NOT NULL DEFAULT 0,
  `xp` int(2) NOT NULL DEFAULT 0,
  `str` int(2) NOT NULL DEFAULT 0,
  `sta` int(2) NOT NULL DEFAULT 0,
  `gold` int(5) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `player`
--
ALTER TABLE `player`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
