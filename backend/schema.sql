-- =================================================================
--  BlogDB Schema Data Script
--  Author: Ahmed Gasim
--  Purpose: define and set up the structure of the DB for the blog
-- =================================================================


BEGIN;

-- =============================
--pgcrypto extension
-- =============================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =============================
--Drops old tables if they exist
-- =============================

DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================
-- Create Users Table MD5 
-- ========================

CREATE TABLE users (
  user_id       VARCHAR(255) PRIMARY KEY,
  password      VARCHAR(255) NOT NULL,   
  name          VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ==================
--Create Blogs Table
-- ==================

CREATE TABLE blogs (
  blog_id          SERIAL PRIMARY KEY,
  creator_name     VARCHAR(255) NOT NULL,
  creator_user_id  VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE,
  title            VARCHAR(255) NOT NULL,
  body             TEXT NOT NULL,
  category         VARCHAR(64),
  date_created     TIMESTAMP DEFAULT NOW()
);

-- =================================
--Create an index for faster queries
-- =================================

CREATE INDEX idx_blogs_creator ON blogs(creator_user_id);

COMMIT;

-- End of file