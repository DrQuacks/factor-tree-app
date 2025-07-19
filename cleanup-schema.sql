-- Cleanup script to drop old tables and views
-- Run this BEFORE running the new database-schema.sql

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS difficulty_stats CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_number_history(UUID, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS upsert_user_stats(UUID) CASCADE;

-- Drop tables
DROP TABLE IF EXISTS game_records CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;

-- Drop triggers (if they exist)
DROP TRIGGER IF EXISTS update_user_stats_trigger ON game_records;
DROP TRIGGER IF EXISTS update_user_stats_timestamp ON user_stats;

-- Drop functions used by triggers
DROP FUNCTION IF EXISTS update_user_stats() CASCADE;
DROP FUNCTION IF EXISTS update_user_stats_timestamp() CASCADE;

-- Now you can run the new database-schema.sql 