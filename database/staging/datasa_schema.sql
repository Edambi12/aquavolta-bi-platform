-- AQUAVOLTA - MySQL staging database (datasa)
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
-- Base de données : `datasa`
--

-- --------------------------------------------------------

--
-- Structure de la table `date__sa`
--

CREATE TABLE `date__sa` (
  `id` int(11) NOT NULL,
  `DATE` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `departement_sa`
--

CREATE TABLE `departement_sa` (
  `id` int(11) NOT NULL,
  `departement` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `depense2022`
--

CREATE TABLE `depense2022` (
  `N` int(3) NOT NULL,
  `DATE` varchar(255) DEFAULT NULL,
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
-- Structure de la table `depense2023`
--

CREATE TABLE `depense2023` (
  `N` int(4) NOT NULL,
  `DATE` datetime DEFAULT NULL,
  `DEPARTEMENT` varchar(255) DEFAULT NULL,
  `TYPE_DE_DEPENSES` varchar(255) DEFAULT NULL,
  `FOURNISSEUR` varchar(255) DEFAULT NULL,
  `HT` int(255) DEFAULT NULL,
  `TVA` varchar(255) DEFAULT NULL,
  `TTC` varchar(255) DEFAULT NULL,
  `REGLEMENT` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `depense_sa`
--

CREATE TABLE `depense_sa` (
  `id_depense` int(11) NOT NULL,
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
-- Structure de la table `encaissement`
--

CREATE TABLE `encaissement` (
  `id_encais` int(11) NOT NULL,
  `DATE` datetime DEFAULT NULL,
  `NCG` int(255) DEFAULT NULL,
  `ICG` varchar(255) DEFAULT NULL,
  `NCT` varchar(255) DEFAULT NULL,
  `NCG_1` int(255) DEFAULT NULL,
  `ICG_1` varchar(255) DEFAULT NULL,
  `N__FCT` int(255) DEFAULT NULL,
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
-- Structure de la table `export2022`
--

CREATE TABLE `export2022` (
  `N` int(2) NOT NULL,
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
-- Structure de la table `export2023`
--

CREATE TABLE `export2023` (
  `N` int(2) NOT NULL,
  `DATE` varchar(255) DEFAULT NULL,
  `PAYS` varchar(255) DEFAULT NULL,
  `Type` varchar(255) DEFAULT NULL,
  `Nom_du_client` varchar(255) DEFAULT NULL,
  `departement` varchar(255) DEFAULT NULL,
  `N__FCT` int(255) DEFAULT NULL,
  `CA` varchar(255) DEFAULT NULL,
  `tx_conv` varchar(255) DEFAULT NULL,
  `CA_TND` varchar(255) DEFAULT NULL,
  `Recouvrement` varchar(255) DEFAULT NULL,
  `Restant` varchar(255) DEFAULT NULL,
  `Perte_de_change` int(255) DEFAULT NULL,
  `Banque` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `export__sa`
--

CREATE TABLE `export__sa` (
  `id_export` int(11) NOT NULL,
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
-- Structure de la table `local2022`
--

CREATE TABLE `local2022` (
  `N` int(3) NOT NULL,
  `Date` varchar(255) DEFAULT NULL,
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
-- Structure de la table `local2023`
--

CREATE TABLE `local2023` (
  `N` int(3) NOT NULL,
  `Date` varchar(255) DEFAULT NULL,
  `PAYS` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `NOM_DU_CLIENT` varchar(255) DEFAULT NULL,
  `departement` varchar(255) DEFAULT NULL,
  `N__FCT` int(255) DEFAULT NULL,
  `HT` int(255) DEFAULT NULL,
  `tva_19` varchar(255) DEFAULT NULL,
  `TTC` varchar(255) DEFAULT NULL,
  `RECOUVREMENT` varchar(255) DEFAULT NULL,
  `RESTANT` varchar(255) DEFAULT NULL,
  `Banque` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `local_sa`
--

CREATE TABLE `local_sa` (
  `id_local` int(11) NOT NULL,
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
-- Structure de la table `reglement_sa`
--

CREATE TABLE `reglement_sa` (
  `id` int(11) NOT NULL,
  `REGLEMENT` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `salaires__2022`
--

CREATE TABLE `salaires__2022` (
  `id` int(11) NOT NULL,
  `SALARIE` varchar(255) DEFAULT NULL,
  `MOIS` varchar(255) DEFAULT NULL,
  `DEPARTEMENT` varchar(255) DEFAULT NULL,
  `SALAIRE_NET` int(255) DEFAULT NULL,
  `CNSS` varchar(255) DEFAULT NULL,
  `FISCAL` varchar(255) DEFAULT NULL,
  `TICKET_RESTO` int(255) DEFAULT NULL,
  `COUT_TOTAL` varchar(255) DEFAULT NULL,
  `banque` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `salaires__2023`
--

CREATE TABLE `salaires__2023` (
  `id` int(11) NOT NULL,
  `SALARIE` varchar(255) DEFAULT NULL,
  `MOIS` varchar(255) DEFAULT NULL,
  `DEPARTEMENT` varchar(255) DEFAULT NULL,
  `SALAIRE_NET` int(255) DEFAULT NULL,
  `CNSS` varchar(255) DEFAULT NULL,
  `FISCAL` varchar(255) DEFAULT NULL,
  `TICKET_RESTO` int(255) DEFAULT NULL,
  `COUT_TOTAL` varchar(255) DEFAULT NULL,
  `banque` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `salaire_sa`
--

CREATE TABLE `salaire_sa` (
  `id_salaire` int(11) NOT NULL,
  `SALARIE` varchar(255) DEFAULT NULL,
  `MOIS` varchar(255) DEFAULT NULL,
  `DEPARTEMENT` varchar(255) DEFAULT NULL,
  `SALAIRE_NET` int(255) DEFAULT NULL,
  `CNSS` varchar(255) DEFAULT NULL,
  `FISCAL` varchar(255) DEFAULT NULL,
  `TICKET_RESTO` int(255) DEFAULT NULL,
  `COUT_TOTAL` varchar(255) DEFAULT NULL,
  `banque` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `date__sa`
--
ALTER TABLE `date__sa`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `departement_sa`
--
ALTER TABLE `departement_sa`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `depense2022`
--
ALTER TABLE `depense2022`
  ADD PRIMARY KEY (`N`);

--
-- Index pour la table `depense2023`
--
ALTER TABLE `depense2023`
  ADD PRIMARY KEY (`N`);

--
-- Index pour la table `depense_sa`
--
ALTER TABLE `depense_sa`
  ADD PRIMARY KEY (`id_depense`);

--
-- Index pour la table `encaissement`
--
ALTER TABLE `encaissement`
  ADD PRIMARY KEY (`id_encais`);

--
-- Index pour la table `export2022`
--
ALTER TABLE `export2022`
  ADD PRIMARY KEY (`N`);

--
-- Index pour la table `export2023`
--
ALTER TABLE `export2023`
  ADD PRIMARY KEY (`N`);

--
-- Index pour la table `export__sa`
--
ALTER TABLE `export__sa`
  ADD PRIMARY KEY (`id_export`);

--
-- Index pour la table `local2022`
--
ALTER TABLE `local2022`
  ADD PRIMARY KEY (`N`);

--
-- Index pour la table `local2023`
--
ALTER TABLE `local2023`
  ADD PRIMARY KEY (`N`);

--
-- Index pour la table `local_sa`
--
ALTER TABLE `local_sa`
  ADD PRIMARY KEY (`id_local`);

--
-- Index pour la table `reglement_sa`
--
ALTER TABLE `reglement_sa`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `salaires__2022`
--
ALTER TABLE `salaires__2022`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `salaires__2023`
--
ALTER TABLE `salaires__2023`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `salaire_sa`
--
ALTER TABLE `salaire_sa`
  ADD PRIMARY KEY (`id_salaire`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
