import React from 'react'

export default function ExtractedInfo({ record }: { record: any | null }) {
  if (!record) return (
    <div className="extracted-card empty">
      <h3>Extracted Information</h3>
      <p className="muted">No data yet. Upload an ID to begin.</p>
    </div>
  )

  return (
    <div className="extracted-card">
      <h3>Extracted Information</h3>
      <div className="row"><strong>Name</strong><span>{record.name || '-'}</span></div>
      <div className="row"><strong>DOB</strong><span>{record.dob || '-'}</span></div>
      <div className="row"><strong>ID Number</strong><span>{record.id_number || '-'}</span></div>
      <div className="row"><strong>Expiry</strong><span>{record.expiry_date || '-'}</span></div>
    </div>
  )
}
