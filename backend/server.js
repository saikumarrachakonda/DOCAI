require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const extractRoute = require('./routes/extract');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database schema
async function initDatabase() {
  try {
    // Drop the existing table and create new one with updated schema
    await db.query('DROP TABLE IF EXISTS identity_info;');
    await db.query(`
      CREATE TABLE IF NOT EXISTS identity_info (
        id SERIAL PRIMARY KEY,
        document_type TEXT,
        fields JSONB,
        uploaded_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Error initializing database schema:', err);
    process.exit(1);
  }
}

// Run database initialization
initDatabase();

app.use(cors());
app.use(express.json());

// Serve uploads statically (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/extract', extractRoute);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'IDVision AI backend running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
