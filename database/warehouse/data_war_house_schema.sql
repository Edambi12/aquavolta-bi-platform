-- AQUAVOLTA - MySQL data warehouse (data_war_house)
-- SANITIZED STRUCTURE-ONLY SCRIPT: all INSERT statements (real company data) were removed.
-- Derived from a phpMyAdmin export (MariaDB 10.4). No business data is included.

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `data_war_house`
--

-- --------------------------------------------------------

--
-- Structure de la table `date_d`
--

CREATE TABLE `date_d` (
  `id` int(10) NOT NULL,
  `DATE` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `departement_d`
--

CREATE TABLE `departement_d` (
  `id` int(10) NOT NULL,
  `departement` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `depense_d`
--

CREATE TABLE `depense_d` (
  `id_depense` int(10) NOT NULL,
  `DATE` datetime DEFAULT NULL,
  `DEPARTEMENT` varchar(255) DEFAULT NULL,
  `TYPE_DE_DEPENSES` varchar(255) DEFAULT NULL,
  `FOURNISSEUR` varchar(255) DEFAULT NULL,
  `HT` varchar(255) DEFAULT NULL,
  `TVA` varchar(255) DEFAULT NULL,
  `TTC` varchar(255) DEFAULT NULL,
  `REGLEMENT` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `encaissement_d`
--

CREATE TABLE `encaissement_d` (
  `id_encais` int(10) NOT NULL,
  `DATE` datetime DEFAULT NULL,
  `NCG` int(10) DEFAULT NULL,
  `ICG` varchar(255) DEFAULT NULL,
  `NCT` varchar(255) DEFAULT NULL,
  `NCG_1` int(10) DEFAULT NULL,
  `ICG_1` varchar(255) DEFAULT NULL,
  `N__FCT` int(10) DEFAULT NULL,
  `AFFAIRE` varchar(255) DEFAULT NULL,
  `CA` varchar(255) DEFAULT NULL,
  `tx_conv` varchar(255) DEFAULT NULL,
  `CA_TND` varchar(255) DEFAULT NULL,
  `paiement_TND` varchar(255) DEFAULT NULL,
  `TCL` varchar(255) DEFAULT NULL,
  `RECU__frais_deduits` varchar(255) DEFAULT NULL,
  `DATE_ENC` varchar(255) DEFAULT NULL,
  `BANQUE` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `export_d`
--

CREATE TABLE `export_d` (
  `id_export` int(10) NOT NULL,
  `DATE` datetime DEFAULT NULL,
  `PAYS` varchar(255) DEFAULT NULL,
  `Type` varchar(255) DEFAULT NULL,
  `Nom_du_client` varchar(255) DEFAULT NULL,
  `departement` varchar(255) DEFAULT NULL,
  `CA` varchar(255) DEFAULT NULL,
  `tx_conv` varchar(255) DEFAULT NULL,
  `CA_TND` varchar(255) DEFAULT NULL,
  `Recouvrement` varchar(255) DEFAULT NULL,
  `Restant` varchar(255) DEFAULT NULL,
  `Perte_de_change` varchar(255) DEFAULT NULL,
  `Banque` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fact_tabel`
--

CREATE TABLE `fact_tabel` (
  `TYPE_DE_DEPENSES` varchar(255) DEFAULT NULL,
  `HT` varchar(255) DEFAULT NULL,
  `TVA` varchar(255) DEFAULT NULL,
  `TTC` varchar(255) DEFAULT NULL,
  `departement_fk` int(11) DEFAULT NULL,
  `reglement_fk` int(11) DEFAULT NULL,
  `date_fk` int(11) DEFAULT NULL,
  `encaissement_fk` int(11) DEFAULT NULL,
  `export_fk` int(11) DEFAULT NULL,
  `local_fk` int(11) DEFAULT NULL,
  `salaire_fk` int(11) DEFAULT NULL,
  `depense_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `local_d`
--

CREATE TABLE `local_d` (
  `id_local` int(10) NOT NULL,
  `Date` datetime DEFAULT NULL,
  `PAYS` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `NOM_DU_CLIENT` varchar(255) DEFAULT NULL,
  `departement` varchar(255) DEFAULT NULL,
  `CA_HT` varchar(255) DEFAULT NULL,
  `tva_19` varchar(255) DEFAULT NULL,
  `TTC` varchar(255) DEFAULT NULL,
  `RECOUVREMENT` varchar(255) DEFAULT NULL,
  `RESTANT` varchar(255) DEFAULT NULL,
  `Banque` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reglement_d`
--

CREATE TABLE `reglement_d` (
  `id` int(10) NOT NULL,
  `REGLEMENT` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `salaire_d`
--

CREATE TABLE `salaire_d` (
  `id_salaire` int(10) NOT NULL,
  `SALARIE` varchar(255) DEFAULT NULL,
  `MOIS` varchar(255) DEFAULT NULL,
  `DEPARTEMENT` varchar(255) DEFAULT NULL,
  `SALAIRE_NET` int(10) DEFAULT NULL,
  `CNSS` varchar(255) DEFAULT NULL,
  `FISCAL` varchar(255) DEFAULT NULL,
  `TICKET_RESTO` int(10) DEFAULT NULL,
  `COUT_TOTAL` varchar(255) DEFAULT NULL,
  `banque` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `date_d`
--
ALTER TABLE `date_d`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `departement_d`
--
ALTER TABLE `departement_d`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `depense_d`
--
ALTER TABLE `depense_d`
  ADD PRIMARY KEY (`id_depense`);

--
-- Index pour la table `encaissement_d`
--
ALTER TABLE `encaissement_d`
  ADD PRIMARY KEY (`id_encais`);

--
-- Index pour la table `export_d`
--
ALTER TABLE `export_d`
  ADD PRIMARY KEY (`id_export`);

--
-- Index pour la table `fact_tabel`
--
ALTER TABLE `fact_tabel`
  ADD KEY `date_fk` (`date_fk`),
  ADD KEY `departement_fk` (`departement_fk`),
  ADD KEY `reglement_fk` (`reglement_fk`),
  ADD KEY `salaire_fk` (`salaire_fk`),
  ADD KEY `encaissement_fk` (`encaissement_fk`),
  ADD KEY `export_fk` (`export_fk`),
  ADD KEY `local_fk` (`local_fk`),
  ADD KEY `depense_fk` (`depense_fk`);

--
-- Index pour la table `local_d`
--
ALTER TABLE `local_d`
  ADD PRIMARY KEY (`id_local`);

--
-- Index pour la table `reglement_d`
--
ALTER TABLE `reglement_d`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `salaire_d`
--
ALTER TABLE `salaire_d`
  ADD PRIMARY KEY (`id_salaire`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `fact_tabel`
--
ALTER TABLE `fact_tabel`
  ADD CONSTRAINT `fact_tabel_ibfk_1` FOREIGN KEY (`date_fk`) REFERENCES `date_d` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fact_tabel_ibfk_2` FOREIGN KEY (`departement_fk`) REFERENCES `departement_d` (`id`),
  ADD CONSTRAINT `fact_tabel_ibfk_3` FOREIGN KEY (`reglement_fk`) REFERENCES `reglement_d` (`id`),
  ADD CONSTRAINT `fact_tabel_ibfk_4` FOREIGN KEY (`salaire_fk`) REFERENCES `salaire_d` (`id_salaire`),
  ADD CONSTRAINT `fact_tabel_ibfk_5` FOREIGN KEY (`encaissement_fk`) REFERENCES `encaissement_d` (`id_encais`),
  ADD CONSTRAINT `fact_tabel_ibfk_6` FOREIGN KEY (`export_fk`) REFERENCES `export_d` (`id_export`),
  ADD CONSTRAINT `fact_tabel_ibfk_7` FOREIGN KEY (`local_fk`) REFERENCES `local_d` (`id_local`),
  ADD CONSTRAINT `fact_tabel_ibfk_8` FOREIGN KEY (`depense_fk`) REFERENCES `depense_d` (`id_depense`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
