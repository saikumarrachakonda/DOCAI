const fs = require('fs');
const path = require('path');
const axios = require('axios');
const db = require('../db');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyBV3f9QBWk04KOFChCk0_J9JpN7zFJGC74';

async function callClaude(base64Content) {
  try {
    const res = await axios({
      method: 'post',
      url: GEMINI_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      data: {
        contents: [{
          parts: [
            {
              text: "Extract the following fields from this ID document:\n- Full Name\n- Date of Birth\n- ID Number\n- Expiry Date\n\nRespond in JSON format:\n{\n  \"name\": \"...\",\n  \"dob\": \"...\",\n  \"id_number\": \"...\",\n  \"expiry_date\": \"...\"\n}\n\nThe file is provided as base64 content (not necessary to decode); use it as context to extract text."
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Content
              }
            }
          ]
        }]
      },
      timeout: 120000
    });

    if (res.data && res.data.candidates && res.data.candidates[0]?.content?.parts) {
      try {
        const text = res.data.candidates[0].content.parts[0]?.text;
        if (text) {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        }
        console.warn('No valid JSON found in Gemini response');
      } catch (e) {
        console.warn('Failed to parse Claude response:', e.message);
      }
    }

    // Fallback with empty values if parsing fails
    return {
      name: '',
      dob: '',
      id_number: '',
      expiry_date: ''
    };
  } catch (err) {
    console.error('Error calling Claude:', err.message || err);
    throw err;
  }
}

exports.handleExtract = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = path.join(req.file.destination, req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');

    // Call Claude with the base64 content
    const extracted = await callClaude(base64);

    // Insert into DB
    const insertText = `INSERT INTO identity_info(name, dob, id_number, expiry_date)
                        VALUES($1,$2,$3,$4) RETURNING *`;
    const values = [extracted.name || '', extracted.dob || '', extracted.id_number || '', extracted.expiry_date || ''];

    const result = await db.query(insertText, values);
    const saved = result.rows[0];

    // Return saved record
    res.json({ ok: true, record: saved });
  } catch (err) {
    console.error('extractController error:', err);
    res.status(500).json({ error: 'Extraction failed', details: err.message });
  }
};
