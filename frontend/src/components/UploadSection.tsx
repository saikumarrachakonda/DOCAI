import React, { useRef, useState } from 'react'
import axios from 'axios'

type Props = {
  onSuccess: (record: any) => void
  onError: (msg: string) => void
}

export default function UploadSection({ onSuccess, onError }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  function handleBrowse() {
    inputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  function handleDragOver(e: React.DragEvent) { e.preventDefault(); }

  async function uploadFile(file: File) {
    setFileName(file.name)
    setLoading(true)
    setProgress(0)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await axios.post('/api/extract', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100))
        }
      })

      if (res.data && res.data.record) {
        onSuccess(res.data.record)
      } else {
        onError('No record returned')
      }
    } catch (err: any) {
      onError(err?.response?.data?.error || err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-card">
      <div className="upload-area" onDrop={handleDrop} onDragOver={handleDragOver}>
        <input ref={inputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
        <div className="upload-inner">
          <button className="btn-primary" onClick={handleBrowse} aria-disabled={loading}>Browse Files</button>
          <p>or drag & drop PDF / PNG / JPG here</p>
        </div>
      </div>

      {fileName && (
        <div className="file-row">
          <div className="file-name">{fileName}</div>
          <div className="progress-bar"><div className="bar" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
    </div>
  )
}
