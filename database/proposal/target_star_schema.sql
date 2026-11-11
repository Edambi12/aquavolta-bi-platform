-- ============================================================================
-- AQUAVOLTA - PROPOSED target dimensional model  (STATUS: PROPOSAL, NOT DEPLOYED)
-- ============================================================================
-- This script is a design proposal. It is NOT the schema used by the current
-- Talend Jobs or by the published Power BI report, and it must be created in a
-- SEPARATE database so that the existing `data_war_house` schema and the
-- Power BI relationships remain untouched:
--
--     CREATE DATABASE aquavolta_dwh_v2 CHARACTER SET utf8mb4;
--     mysql aquavolta_dwh_v2 < database/proposal/target_star_schema.sql
--
-- It contains structure and technical reference rows only (the "unknown"
-- member of each dimension). It contains no business data.
-- See docs/dwh-target-model.md for the rationale and the migration roadmap.
--
-- Conventions
--   * Surrogate keys: INT UNSIGNED AUTO_INCREMENT; key 1 = unknown member.
--   * Date key: INT in YYYYMMDD form (smart key, stable across reloads).
--   * Amounts: DECIMAL(15,3) (the Tunisian dinar has three decimals).
--   * Rates:   DECIMAL(12,6).
--   * Every fact row carries its source business key for lineage.
-- ============================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------- Dimensions
CREATE TABLE dim_date (
  date_key        INT UNSIGNED NOT NULL,           -- YYYYMMDD
  full_date       DATE         NOT NULL,
  annee           SMALLINT     NOT NULL,
  trimestre       TINYINT      NOT NULL,           -- 1..4
  mois            TINYINT      NOT NULL,           -- 1..12
  nom_mois        VARCHAR(12)  NOT NULL,
  jour            TINYINT      NOT NULL,
  annee_mois      CHAR(7)      NOT NULL,           -- YYYY-MM
  PRIMARY KEY (date_key),
  UNIQUE KEY uq_dim_date_full_date (full_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dim_pays (
  pays_key        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pays            VARCHAR(80)  NOT NULL,           -- normalised label (case, accents)
  zone            VARCHAR(20)  NOT NULL DEFAULT 'NON DEFINI',  -- LOCAL / EXPORT
  PRIMARY KEY (pays_key),
  UNIQUE KEY uq_dim_pays (pays)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dim_client (
  client_key      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom_client      VARCHAR(150) NOT NULL,
  type_client     VARCHAR(40)  NOT NULL DEFAULT 'NON DEFINI',  -- LOCAL / ETRANGER
  pays_key        INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (client_key),
  UNIQUE KEY uq_dim_client (nom_client, type_client),
  CONSTRAINT fk_client_pays FOREIGN KEY (pays_key) REFERENCES dim_pays (pays_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dim_fournisseur (
  fournisseur_key INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom_fournisseur VARCHAR(150) NOT NULL,
  PRIMARY KEY (fournisseur_key),
  UNIQUE KEY uq_dim_fournisseur (nom_fournisseur)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dim_departement (
  departement_key INT UNSIGNED NOT NULL AUTO_INCREMENT,
  departement     VARCHAR(60)  NOT NULL,
  PRIMARY KEY (departement_key),
  UNIQUE KEY uq_dim_departement (departement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dim_banque (
  banque_key      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  banque          VARCHAR(80)  NOT NULL,
  PRIMARY KEY (banque_key),
  UNIQUE KEY uq_dim_banque (banque)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dim_mode_reglement (
  reglement_key   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mode_reglement  VARCHAR(60)  NOT NULL,
  PRIMARY KEY (reglement_key),
  UNIQUE KEY uq_dim_mode_reglement (mode_reglement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dim_type_depense (
  type_depense_key INT UNSIGNED NOT NULL AUTO_INCREMENT,
  type_depense     VARCHAR(120) NOT NULL,
  PRIMARY KEY (type_depense_key),
  UNIQUE KEY uq_dim_type_depense (type_depense)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Employee dimension: personal data. Restrict SELECT on this table and expose
-- payroll to non-HR roles through aggregated views only.
CREATE TABLE dim_salarie (
  salarie_key     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code_salarie    VARCHAR(40)  NOT NULL,           -- pseudonymous business key
  nom_salarie     VARCHAR(150) NULL,               -- restricted column
  PRIMARY KEY (salarie_key),
  UNIQUE KEY uq_dim_salarie (code_salarie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Project dimension: required by the specification, but the current sources
-- carry no project identifier outside the collections sheet (AFFAIRE).
-- Facts point to the unknown member until the business supplies one.
CREATE TABLE dim_projet (
  projet_key      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code_projet     VARCHAR(60)  NOT NULL,
  libelle_projet  VARCHAR(200) NULL,
  client_key      INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (projet_key),
  UNIQUE KEY uq_dim_projet (code_projet),
  CONSTRAINT fk_projet_client FOREIGN KEY (client_key) REFERENCES dim_client (client_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------- Facts
-- F_CA - grain: ONE SALES INVOICE (local or export).
CREATE TABLE f_ca (
  ca_key             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  date_key           INT UNSIGNED NOT NULL,
  client_key         INT UNSIGNED NOT NULL DEFAULT 1,
  pays_key           INT UNSIGNED NOT NULL DEFAULT 1,
  departement_key    INT UNSIGNED NOT NULL DEFAULT 1,
  banque_key         INT UNSIGNED NOT NULL DEFAULT 1,
  projet_key         INT UNSIGNED NOT NULL DEFAULT 1,
  type_vente         ENUM('LOCAL','EXPORT') NOT NULL,
  numero_facture     VARCHAR(40)  NULL,            -- degenerate dimension
  devise             CHAR(3)      NOT NULL,        -- EUR / TND
  ca_devise          DECIMAL(15,3) NULL,           -- export: amount in foreign currency
  taux_conversion    DECIMAL(12,6) NULL,
  ca_ht_tnd          DECIMAL(15,3) NOT NULL,
  tva_tnd            DECIMAL(15,3) NOT NULL DEFAULT 0,
  ca_ttc_tnd         DECIMAL(15,3) NOT NULL,
  recouvrement_devise DECIMAL(15,3) NULL,
  recouvrement_tnd   DECIMAL(15,3) NULL,
  restant_devise     DECIMAL(15,3) NULL,
  restant_tnd        DECIMAL(15,3) NULL,
  perte_change_tnd   DECIMAL(15,3) NOT NULL DEFAULT 0,
  recouvrement_impute TINYINT(1)  NOT NULL DEFAULT 0,  -- 1 = estimated during cleaning
  client_impute      TINYINT(1)   NOT NULL DEFAULT 0,  -- 1 = client name was missing in source
  source_table       VARCHAR(40)  NOT NULL,
  source_id          INT          NOT NULL,
  PRIMARY KEY (ca_key),
  UNIQUE KEY uq_f_ca_source (source_table, source_id),
  CONSTRAINT fk_ca_date        FOREIGN KEY (date_key)        REFERENCES dim_date (date_key),
  CONSTRAINT fk_ca_client      FOREIGN KEY (client_key)      REFERENCES dim_client (client_key),
  CONSTRAINT fk_ca_pays        FOREIGN KEY (pays_key)        REFERENCES dim_pays (pays_key),
  CONSTRAINT fk_ca_departement FOREIGN KEY (departement_key) REFERENCES dim_departement (departement_key),
  CONSTRAINT fk_ca_banque      FOREIGN KEY (banque_key)      REFERENCES dim_banque (banque_key),
  CONSTRAINT fk_ca_projet      FOREIGN KEY (projet_key)      REFERENCES dim_projet (projet_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- F_ENCAISSEMENTS - grain: ONE COLLECTION EVENT on an invoice.
-- Two date roles (invoice date, collection date) enable the collection-delay KPI.
CREATE TABLE f_encaissements (
  encaissement_key   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  date_facture_key   INT UNSIGNED NOT NULL,
  date_encaissement_key INT UNSIGNED NULL,          -- NULL = not collected yet
  client_key         INT UNSIGNED NOT NULL DEFAULT 1,
  banque_key         INT UNSIGNED NOT NULL DEFAULT 1,
  projet_key         INT UNSIGNED NOT NULL DEFAULT 1,
  numero_facture     VARCHAR(40)  NULL,
  ca_devise          DECIMAL(15,3) NULL,
  taux_conversion    DECIMAL(12,6) NULL,
  ca_tnd             DECIMAL(15,3) NOT NULL,
  paiement_tnd       DECIMAL(15,3) NULL,
  frais_bancaires_tnd DECIMAL(15,3) NULL,
  statut             VARCHAR(20)  NOT NULL DEFAULT 'NON DEFINI',
  paiement_impute    TINYINT(1)   NOT NULL DEFAULT 0,
  source_id          INT          NOT NULL,
  PRIMARY KEY (encaissement_key),
  UNIQUE KEY uq_f_enc_source (source_id),
  CONSTRAINT fk_enc_date_fact FOREIGN KEY (date_facture_key)      REFERENCES dim_date (date_key),
  CONSTRAINT fk_enc_date_enc  FOREIGN KEY (date_encaissement_key) REFERENCES dim_date (date_key),
  CONSTRAINT fk_enc_client    FOREIGN KEY (client_key)            REFERENCES dim_client (client_key),
  CONSTRAINT fk_enc_banque    FOREIGN KEY (banque_key)            REFERENCES dim_banque (banque_key),
  CONSTRAINT fk_enc_projet    FOREIGN KEY (projet_key)            REFERENCES dim_projet (projet_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- F_DEPENSES - grain: ONE EXPENSE LINE.
CREATE TABLE f_depenses (
  depense_key        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  date_key           INT UNSIGNED NOT NULL,
  fournisseur_key    INT UNSIGNED NOT NULL DEFAULT 1,
  departement_key    INT UNSIGNED NOT NULL DEFAULT 1,
  type_depense_key   INT UNSIGNED NOT NULL DEFAULT 1,
  reglement_key      INT UNSIGNED NOT NULL DEFAULT 1,
  projet_key         INT UNSIGNED NOT NULL DEFAULT 1,
  montant_ht         DECIMAL(15,3) NOT NULL,
  montant_tva        DECIMAL(15,3) NOT NULL DEFAULT 0,
  montant_ttc        DECIMAL(15,3) NOT NULL,
  source_id          INT          NOT NULL,
  PRIMARY KEY (depense_key),
  UNIQUE KEY uq_f_dep_source (source_id),
  CONSTRAINT fk_dep_date        FOREIGN KEY (date_key)         REFERENCES dim_date (date_key),
  CONSTRAINT fk_dep_fournisseur FOREIGN KEY (fournisseur_key)  REFERENCES dim_fournisseur (fournisseur_key),
  CONSTRAINT fk_dep_departement FOREIGN KEY (departement_key)  REFERENCES dim_departement (departement_key),
  CONSTRAINT fk_dep_type        FOREIGN KEY (type_depense_key) REFERENCES dim_type_depense (type_depense_key),
  CONSTRAINT fk_dep_reglement   FOREIGN KEY (reglement_key)    REFERENCES dim_mode_reglement (reglement_key),
  CONSTRAINT fk_dep_projet      FOREIGN KEY (projet_key)       REFERENCES dim_projet (projet_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- F_SALAIRES - grain: ONE EMPLOYEE x ONE PAY MONTH.
CREATE TABLE f_salaires (
  salaire_key        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  date_key           INT UNSIGNED NOT NULL,         -- first day of the pay month
  salarie_key        INT UNSIGNED NOT NULL,
  departement_key    INT UNSIGNED NOT NULL DEFAULT 1,
  banque_key         INT UNSIGNED NOT NULL DEFAULT 1,
  salaire_net        DECIMAL(15,3) NOT NULL,
  cnss               DECIMAL(15,3) NOT NULL DEFAULT 0,
  fiscal             DECIMAL(15,3) NOT NULL DEFAULT 0,
  ticket_resto       DECIMAL(15,3) NOT NULL DEFAULT 0,
  cout_total         DECIMAL(15,3) NOT NULL,
  source_id          INT          NOT NULL,
  PRIMARY KEY (salaire_key),
  UNIQUE KEY uq_f_sal_grain (salarie_key, date_key),
  UNIQUE KEY uq_f_sal_source (source_id),
  CONSTRAINT fk_sal_date        FOREIGN KEY (date_key)        REFERENCES dim_date (date_key),
  CONSTRAINT fk_sal_salarie     FOREIGN KEY (salarie_key)     REFERENCES dim_salarie (salarie_key),
  CONSTRAINT fk_sal_departement FOREIGN KEY (departement_key) REFERENCES dim_departement (departement_key),
  CONSTRAINT fk_sal_banque      FOREIGN KEY (banque_key)      REFERENCES dim_banque (banque_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------- Technical "unknown" members (key 1)
INSERT INTO dim_pays           (pays_key, pays, zone)              VALUES (1, 'NON IDENTIFIE', 'NON DEFINI');
INSERT INTO dim_client         (client_key, nom_client, type_client, pays_key) VALUES (1, 'NON IDENTIFIE', 'NON DEFINI', 1);
INSERT INTO dim_fournisseur    (fournisseur_key, nom_fournisseur)  VALUES (1, 'NON IDENTIFIE');
INSERT INTO dim_departement    (departement_key, departement)      VALUES (1, 'NON IDENTIFIE');
INSERT INTO dim_banque         (banque_key, banque)                VALUES (1, 'NON IDENTIFIE');
INSERT INTO dim_mode_reglement (reglement_key, mode_reglement)     VALUES (1, 'NON IDENTIFIE');
INSERT INTO dim_type_depense   (type_depense_key, type_depense)    VALUES (1, 'NON IDENTIFIE');
INSERT INTO dim_projet         (projet_key, code_projet, libelle_projet, client_key) VALUES (1, 'NON IDENTIFIE', 'Projet non renseigne dans la source', 1);

-- ----------------------------------------------- Privacy-preserving payroll view
-- Payroll by department and month, without any employee-level row.
CREATE VIEW v_salaires_par_departement AS
SELECT d.annee, d.mois, dep.departement,
       COUNT(*)            AS nb_bulletins,
       SUM(f.salaire_net)  AS salaire_net,
       SUM(f.cnss)         AS cnss,
       SUM(f.fiscal)       AS fiscal,
       SUM(f.cout_total)   AS cout_total
FROM f_salaires f
JOIN dim_date d          ON d.date_key = f.date_key
JOIN dim_departement dep ON dep.departement_key = f.departement_key
GROUP BY d.annee, d.mois, dep.departement;
