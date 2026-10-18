-- ============================================================
-- Add onsite_hotel_id FK to courses
-- Run in Supabase SQL Editor BEFORE running sync-onsite-hotels.ts
-- ============================================================

ALTER TABLE courses
ADD COLUMN IF NOT EXISTS onsite_hotel_id uuid REFERENCES hotels(id) ON DELETE SET NULL;

-- Index for join performance
CREATE INDEX IF NOT EXISTS courses_onsite_hotel_id_idx ON courses (onsite_hotel_id);
