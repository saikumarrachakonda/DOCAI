-- Run this in your Postgres database to create the required table
CREATE TABLE IF NOT EXISTS identity_info (
  id SERIAL PRIMARY KEY,
  document_type TEXT,
  fields JSONB,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
