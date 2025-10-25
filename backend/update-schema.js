const db = require('./db');

async function updateSchema() {
  try {
    // Drop the existing table
    await db.query('DROP TABLE IF EXISTS identity_info;');
    
    // Create new table with updated schema
    await db.query(`
      CREATE TABLE IF NOT EXISTS identity_info (
        id SERIAL PRIMARY KEY,
        document_type TEXT,
        fields JSONB,
        uploaded_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('Database schema updated successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error updating schema:', err);
    process.exit(1);
  }
}

updateSchema();