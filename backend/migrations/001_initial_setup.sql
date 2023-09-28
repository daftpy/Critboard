-- 001_initial_setup.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Check if the submission_type already exists. If not, create it.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_type') THEN
        CREATE TYPE submission_type AS ENUM ('LINK', 'FILE');
    END IF;
END
$$;

-- Create user table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    twitch_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create commentable table if it doesn't exist
CREATE TABLE IF NOT EXISTS commentables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Create submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS submissions (
    commentable_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL CHECK (title <> ''),
    description VARCHAR(500),
    type submission_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (commentable_id) REFERENCES commentables(id)
);

-- Create link_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS link_submissions (
    id UUID PRIMARY KEY,
    link VARCHAR(2038) NOT NULL CHECK (link ~* '^https?://'),
    FOREIGN KEY (id) REFERENCES submissions(commentable_id)
);

-- Create file_uploads table if it doesn't exist
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_path VARCHAR(2048) NOT NULL,
    file_name VARCHAR(2048) NOT NULL,
    file_extension VARCHAR(6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create file_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS file_submissions (
    id UUID PRIMARY KEY,
    data UUID NOT NULL,
    FOREIGN KEY (id) REFERENCES submissions(commentable_id),
    FOREIGN KEY (data) REFERENCES file_uploads(id)
);

-- Create feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedback (
    commentable_id UUID PRIMARY KEY,
    parent_commentable_id UUID NOT NULL,
    feedback_text VARCHAR(1000) NOT NULL CHECK (feedback_text <> ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (commentable_id) REFERENCES commentables(id),
    FOREIGN KEY (parent_commentable_id) REFERENCES commentables(id)
);

-- Create or replace the update_timestamp function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists, then recreate
DROP TRIGGER IF EXISTS trigger_update_timestamp ON submissions;
CREATE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON submissions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Drop the trigger if it exists, then recreate for feedback
DROP TRIGGER IF EXISTS trigger_update_feedback_timestamp ON feedback;
CREATE TRIGGER trigger_update_feedback_timestamp
BEFORE UPDATE ON feedback
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
