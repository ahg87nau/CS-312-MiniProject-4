-- =========================================================
--  blogdb Seed Data Script
--  Author: Ahmed Gasim
--  Purpose: Populate initial users and blog posts
-- =========================================================

BEGIN;

-- Clear any old data before inserting
TRUNCATE TABLE blogs RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- ======================
-- USERS
-- ======================
INSERT INTO users (user_id, password, name, age, occupation, city)
VALUES
  ('demo', md5('demoPwd'), 'Demo User', 25, 'Student', 'Flagstaff'),
  ('ahmed', md5('password123'), 'Ahmed', 28, 'IT Engineer', 'Santa Clara'),
  ('sara', md5('letmein456'), 'Sara', 32, 'Software Developer', 'Phoenix'),
  ('eric', md5('charlie789'), 'Eric', 29, 'UI/UX Designer', 'Tempe');

-- ======================
-- BLOGS
-- ======================
INSERT INTO blogs (creator_name, creator_user_id, title, body, category)
VALUES
  ('Ahmed', 'ahmed', 'NAU', 'TEST', 'Education'),
  ('Sara', 'sara', 'Technology Today', 'Exploring AI and data trends.', 'Technology'),
  ('Eric', 'eric', 'Healthy Habits', 'Tips for everyday wellness.', 'Lifestyle'),
  ('Ahmed', 'ahmed', 'My Travel Experience', 'Reflections from Arizona.', 'Lifestyle'),
  ('Ahmed', 'ahmed', 'Cybersecurity Basics', 'Keeping systems secure.', 'Education');

COMMIT;

-- ======================
-- VERIFY TABLE CONTENTS
-- ======================
SELECT 'Users:' AS section;
SELECT * FROM users;

SELECT 'Blogs:' AS section;
SELECT * FROM blogs;

-- End of file
