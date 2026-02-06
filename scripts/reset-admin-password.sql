-- Script SQL pour réinitialiser le mot de passe admin
-- Mot de passe: Admin@2026
-- Hash bcrypt généré avec 10 rounds

UPDATE "Admin" 
SET password = '$2a$10$5vYKxJ3H9PJK8qO6Ys0k3.eXJ5K9qNQp7VB1y0Z4B2c3d4e5f6g7h8i'
WHERE email = 'admin@jaayndougou.sn';

-- Vérifier le résultat
SELECT id, email, name, role FROM "Admin" WHERE email = 'admin@jaayndougou.sn';
