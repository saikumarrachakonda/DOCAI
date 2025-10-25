import React from 'react'

export default function ExtractedInfo({ record }: { record: any | null }) {
  if (!record) return (
    <div className="extracted-card empty">
      <h3>Extracted Information</h3>
      <p className="muted">No data yet. Upload an ID to begin.</p>
    </div>
  )

  // Support new format: { document_type, fields }
  const documentType = record.document_type || '-';
  const fields = record.fields && typeof record.fields === 'object' ? record.fields : {};

  return (
    <div className="extracted-card">
      <h3>{documentType} Information</h3>
      <div className="row"><strong>Document Name</strong><span>{documentType}</span></div>
      {Object.keys(fields).length === 0 ? (
        <div className="row"><span className="muted">No fields extracted</span></div>
      ) : (
        Object.entries(fields).map(([key, value]) => (
          <div className="row" key={key}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong><span>{value || '-'}</span></div>
        ))
      )}
    </div>
  )
}
