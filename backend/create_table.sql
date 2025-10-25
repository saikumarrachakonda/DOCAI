-- Run this in your Postgres database to create the required table
CREATE TABLE IF NOT EXISTS identity_info (
  id SERIAL PRIMARY KEY,
  name TEXT,
  dob TEXT,
  id_number TEXT,
  expiry_date TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
