-- ============================================================================
-- AQUAVOLTA - Data quality controls for the CURRENT warehouse (data_war_house)
-- ============================================================================
-- Read-only SELECT statements. Nothing is modified.
-- Run after each load:   mysql data_war_house < database/checks/data_quality_checks.sql
-- Every query should return ZERO rows on a healthy load (C7 returns counts).
-- Amount columns are VARCHAR in the current schema; CAST(REPLACE(x, ',', '.') ...)
-- tolerates a decimal comma.
-- ============================================================================

-- C1. Export invoices where the collected amount exceeds the invoiced amount.
--     Detects the percentage/ratio imputation error (audit finding F1).
SELECT 'C1 export collection > revenue' AS control, id_export, `DATE`,
       CAST(REPLACE(CA, ',', '.') AS DECIMAL(18,3))           AS ca,
       CAST(REPLACE(Recouvrement, ',', '.') AS DECIMAL(18,3)) AS recouvrement
FROM export_d
WHERE CAST(REPLACE(Recouvrement, ',', '.') AS DECIMAL(18,3))
    > CAST(REPLACE(CA, ',', '.') AS DECIMAL(18,3)) * 1.0001;

-- C2. Export invoices where CA <> Recouvrement + Restant.
SELECT 'C2 export identity' AS control, id_export, `DATE`,
       CAST(REPLACE(CA, ',', '.') AS DECIMAL(18,3))
     - CAST(REPLACE(Recouvrement, ',', '.') AS DECIMAL(18,3))
     - CAST(REPLACE(Restant, ',', '.') AS DECIMAL(18,3)) AS ecart
FROM export_d
WHERE ABS(CAST(REPLACE(CA, ',', '.') AS DECIMAL(18,3))
        - CAST(REPLACE(Recouvrement, ',', '.') AS DECIMAL(18,3))
        - CAST(REPLACE(Restant, ',', '.') AS DECIMAL(18,3))) > 0.01;

-- C3. Local invoices where TTC <> RECOUVREMENT + RESTANT.
SELECT 'C3 local identity' AS control, id_local, `Date`,
       CAST(REPLACE(TTC, ',', '.') AS DECIMAL(18,3))
     - CAST(REPLACE(RECOUVREMENT, ',', '.') AS DECIMAL(18,3))
     - CAST(REPLACE(RESTANT, ',', '.') AS DECIMAL(18,3)) AS ecart
FROM local_d
WHERE ABS(CAST(REPLACE(TTC, ',', '.') AS DECIMAL(18,3))
        - CAST(REPLACE(RECOUVREMENT, ',', '.') AS DECIMAL(18,3))
        - CAST(REPLACE(RESTANT, ',', '.') AS DECIMAL(18,3))) > 0.01;

-- C4. Export invoices recorded as fully outstanding but carrying an FX loss.
SELECT 'C4 FX loss on uncollected invoice' AS control, id_export, `DATE`, Perte_de_change
FROM export_d
WHERE ABS(CAST(REPLACE(Restant, ',', '.') AS DECIMAL(18,3))
        - CAST(REPLACE(CA, ',', '.') AS DECIMAL(18,3))) <= 0.01
  AND CAST(REPLACE(Perte_de_change, ',', '.') AS DECIMAL(18,3)) <> 0;

-- C5. Expense lines where TTC <> HT + TVA.
SELECT 'C5 expense identity' AS control, id_depense, `DATE`,
       CAST(REPLACE(TTC, ',', '.') AS DECIMAL(18,3))
     - CAST(REPLACE(HT, ',', '.') AS DECIMAL(18,3))
     - CAST(REPLACE(TVA, ',', '.') AS DECIMAL(18,3)) AS ecart
FROM depense_d
WHERE ABS(CAST(REPLACE(TTC, ',', '.') AS DECIMAL(18,3))
        - CAST(REPLACE(HT, ',', '.') AS DECIMAL(18,3))
        - CAST(REPLACE(TVA, ',', '.') AS DECIMAL(18,3))) > 0.01;

-- C6. Country labels that differ only by letter case (e.g. 'France' / 'france').
SELECT 'C6 inconsistent country label' AS control, UPPER(TRIM(PAYS)) AS pays_normalise,
       COUNT(DISTINCT BINARY PAYS) AS variantes
FROM export_d
GROUP BY UPPER(TRIM(PAYS))
HAVING COUNT(DISTINCT BINARY PAYS) > 1;

-- C7. Row counts: the fact table against the tables it references (informational).
SELECT 'C7 row counts' AS control,
       (SELECT COUNT(*) FROM fact_tabel)     AS fact_tabel,
       (SELECT COUNT(*) FROM depense_d)      AS depense_d,
       (SELECT COUNT(*) FROM export_d)       AS export_d,
       (SELECT COUNT(*) FROM local_d)        AS local_d,
       (SELECT COUNT(*) FROM salaire_d)      AS salaire_d,
       (SELECT COUNT(*) FROM encaissement_d) AS encaissement_d;
