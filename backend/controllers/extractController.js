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
              text: `Extract all identifiable fields present in this ID document (e.g., name, date of birth, ID number, expiry date, address, nationality, etc.) along with the document type (e.g., passport, driver’s license, national ID, etc.). For each field, also provide the bounding box coordinates (left, top, width, height) as percentages of the image dimensions, representing where the field appears on the image.\n\nRespond strictly in JSON format as follows:\n\n{\n  \"document_type\": \"...\",\n  \"fields\": {\n    \"field_name_1\": { \"value\": \"...\", \"box\": { \"left\": 10, \"top\": 30, \"width\": 60, \"height\": 15 } },\n    \"field_name_2\": { \"value\": \"...\", \"box\": { \"left\": 20, \"top\": 40, \"width\": 30, \"height\": 10 } },\n    ...\n  }\n}\n\nThe file is provided as base64 content (not necessary to decode); use it as context to extract text and bounding boxes.`
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

  // Log raw Gemini response for debugging
  console.log('Gemini raw response:', JSON.stringify(res.data, null, 2));

  if (res.data && res.data.candidates && res.data.candidates[0]?.content?.parts) {
      try {
        const text = res.data.candidates[0].content.parts[0]?.text;
        if (text) {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            // Ensure document_type and fields are present
            if (parsed.document_type && parsed.fields && typeof parsed.fields === 'object') {
              // Validate/normalize fields: ensure each field has value and box
              Object.keys(parsed.fields).forEach(key => {
                const field = parsed.fields[key];
                if (typeof field === 'string') {
                  // If Gemini returns old format, convert to new
                  parsed.fields[key] = { value: field, box: null };
                }
              });
              return parsed;
            }
          }
        }
        console.warn('No valid JSON found in Gemini response');
      } catch (e) {
        console.warn('Failed to parse Gemini response:', e.message);
      }
    }

    // Fallback with empty values if parsing fails
    return {
      document_type: '',
      fields: {}
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
  console.log('Parsed extracted from Gemini:', JSON.stringify(extracted, null, 2));

  // Insert into DB (store document_type and all fields as JSON)
  const insertText = `INSERT INTO identity_info(document_type, fields)
            VALUES($1, $2) RETURNING *`;
  const values = [extracted.document_type || '', JSON.stringify(extracted.fields || {})];

  const result = await db.query(insertText, values);
  const saved = result.rows[0];
  console.log('Saved record to DB:', JSON.stringify(saved, null, 2));

  // Return saved record
  res.json({ ok: true, record: saved });
  } catch (err) {
    console.error('extractController error:', err);
    res.status(500).json({ error: 'Extraction failed', details: err.message });
  }
};
