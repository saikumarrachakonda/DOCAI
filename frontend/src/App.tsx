import React, { useState } from 'react'
import UploadSection from './components/UploadSection'
import ExtractedInfo from './components/ExtractedInfo'
import toast, { Toaster } from 'react-hot-toast'

export default function App() {
  const [record, setRecord] = useState<any | null>(null)

  return (
    <div className="app-root">
      <Toaster position="top-right" />
      <header className="header">
        <h1>DocVision AI</h1>
        <p className="subtitle">ID data extraction powered by Gemini-2.0-flash</p>
      </header>

      <main className="container">
        <UploadSection onSuccess={(r: any) => { setRecord(null); setRecord(r); toast.success('Extraction saved') }} onError={(e:string)=>{ toast.error(e) }} />

        <ExtractedInfo record={record} />
      </main>

      <footer className="footer">Powered by </footer>
    </div>
  )
}
