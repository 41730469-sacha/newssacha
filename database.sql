-- Make sure the database exists
-- CREATE DATABASE sacha_news;

-- Connect to the database
-- \c sacha_news;

-- --------------------------
-- Users Table
-- --------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    dob DATE,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(100),
    payment_status VARCHAR(50),
    payment_method VARCHAR(50),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to auto-update updated_at on user row changes
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at before any user row update
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- --------------------------
-- Summaries Table
-- --------------------------
CREATE TABLE IF NOT EXISTS public.summaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------
-- Translations Table
-- --------------------------
CREATE TABLE IF NOT EXISTS public.translations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_text TEXT,
    translated_text TEXT,
    language VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
