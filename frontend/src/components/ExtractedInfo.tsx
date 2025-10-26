import React from 'react';

interface ExtractedInfoProps {
  record: any | null;
  onFieldClick?: (field: string) => void;
  selectedField?: string | null;
}

export default function ExtractedInfo({ record, onFieldClick, selectedField }: ExtractedInfoProps) {
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
        Object.entries(fields).map(([key, fieldObj]) => {
          const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const isSelected = selectedField === key;
          // If fieldObj is string (old format), fallback to string.
          // Use a safe type check to avoid TS errors when accessing 'value'.
          let value: any = null;
          if (fieldObj && typeof fieldObj === 'object' && 'value' in (fieldObj as any)) {
            value = (fieldObj as any).value;
          } else {
            value = fieldObj;
          }
          return (
            <div
              className={`row extracted-field${isSelected ? ' selected' : ''}`}
              key={key}
              style={{ cursor: onFieldClick ? 'pointer' : 'default', background: isSelected ? '#ffe0b2' : undefined }}
              onClick={() => onFieldClick && onFieldClick(key)}
            >
              <strong>{displayKey}</strong>
              <span>{String(value || '-')}</span>
            </div>
          );
        })
      )}
    </div>
  );
}
