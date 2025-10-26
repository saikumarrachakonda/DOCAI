import React, { useState, useEffect } from 'react'
import UploadSection from './components/UploadSection'
import ImageHighlight from './components/ImageHighlight';
import ExtractedInfo from './components/ExtractedInfo'
import toast, { Toaster } from 'react-hot-toast'

export default function App() {
  const [record, setRecord] = useState<any | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Use bounding box from extracted record
  const getFieldBox = (field: string) => {
    if (!record || !record.fields || !record.fields[field]) return undefined;
    return record.fields[field].box || undefined;
  };

  // Compute highlight box for logging and pass-through
  const highlightBox = selectedField ? getFieldBox(selectedField) : undefined;

  // Receive previewUrl from UploadSection on success
  const handleUploadSuccess = (r: any, url?: string | null) => {
    setRecord(null);
    setRecord(r);
    if (url) setPreviewUrl(url);
    toast.success('Extraction saved');
  };

  // Debug log to inspect record and boxes returned from backend and highlight box
  useEffect(() => {
    console.log('Extraction record:', record);
    console.log('Preview URL:', previewUrl);
    console.log('Selected field:', selectedField);
    console.log('Highlight box:', highlightBox);
  }, [record, previewUrl, selectedField, highlightBox]);

  return (
    <div className="app-root">
      <Toaster position="top-right" />
      <header className="header">
        <h1>DocVision AI</h1>
        <p className="subtitle">ID data extraction powered by Gemini-2.0-flash</p>
      </header>

      <main className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
          <UploadSection
            onSuccess={(r: any, url?: string | null) => handleUploadSuccess(r, url)}
            onError={(e: string) => { toast.error(e); }}
          />

          {previewUrl && (
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 50%' }}>
                <h3 style={{ marginBottom: '12px' }}>Document Preview</h3>
                <ImageHighlight
                  imageUrl={previewUrl}
                  highlightBox={selectedField ? getFieldBox(selectedField) : undefined}
                />
              </div>
              <div style={{ flex: '1 1 50%' }}>
                <ExtractedInfo
                  record={record}
                  onFieldClick={setSelectedField}
                  selectedField={selectedField}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">Powered by </footer>
    </div>
  );
}


