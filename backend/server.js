require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const extractRoute = require('./routes/extract');

const app = express();
const PORT = process.env.PORT || 5000;

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
