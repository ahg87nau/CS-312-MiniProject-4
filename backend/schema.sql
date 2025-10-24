-- =================================================================
--  blogdb Schema Data Script
--  Author: Ahmed Gasim
--  Purpose: define and set up the structure of the DB for the blog
-- =================================================================

BEGIN;


-- =============================
-- pgcrypto extension
-- =============================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================
-- Drops old tables if they exist
-- ================================
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==========================
-- Create Users Table MD5 
-- ==========================
CREATE TABLE users (
  user_id       VARCHAR(255) PRIMARY KEY,
  password      VARCHAR(255) NOT NULL,   
  name          VARCHAR(255) NOT NULL,
  age           INT,
  occupation    VARCHAR(255),
  city          VARCHAR(255),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ========================
-- Create Blogs Table
-- ========================
CREATE TABLE blogs (
  blog_id          SERIAL PRIMARY KEY,
  creator_name     VARCHAR(255) NOT NULL,
  creator_user_id  VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE,
  title            VARCHAR(255) NOT NULL,
  body             TEXT NOT NULL,
  category         VARCHAR(64),
  date_created     TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- Create an index for faster queries
-- ====================================
CREATE INDEX idx_blogs_creator ON blogs(creator_user_id);

COMMIT;

-- =============================
-- VERIFY TABLE STRUCTURE
-- =============================
-- This ensures the schema built correctly

-- Verify users table
SELECT 'Users Table Structure:' AS section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';

-- Verify blogs table
SELECT 'Blogs Table Structure:' AS section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blogs';

-- Verify foreign key link
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM
  information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='blogs';

-- End of file
