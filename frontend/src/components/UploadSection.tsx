import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

type Props = {
  // onSuccess now receives the extracted record and optional previewUrl
  onSuccess: (record: any, previewUrl?: string | null) => void
  onError: (msg: string) => void
}

const FullScreenLoader = () => {
  return (
      <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
      }}>
          Loading..
      </div>
  );
};

export default function UploadSection({ onSuccess, onError }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function handleBrowse() {
    inputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  function handleDragOver(e: React.DragEvent) { e.preventDefault(); }

  async function uploadFile(file: File) {
        setFileName(file.name)
        // Reset previous extracted data
        onSuccess(null);
      // create a local preview for images
      // Use a local variable so we can pass the preview URL immediately to parent
      let localPreview: string | null = null;
      if (file.type && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(url)
        localPreview = url
      } else {
        if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null) }
        localPreview = null
      }
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
    // pass the local preview URL (not stale state) back to parent so App can display/highlight it
    onSuccess(res.data.record, localPreview)
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
      <div className="upload-top">
        <div className="upload-area" onDrop={handleDrop} onDragOver={handleDragOver}>
          <input ref={inputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          <div className="upload-inner">
            <button className="btn-primary" onClick={handleBrowse} aria-disabled={loading}>Browse Files</button>
            <p className="upload-hint">or drag & drop PDF / PNG / JPG here</p>
          </div>
        </div>
</div>
        
      

      {fileName && (
        <div className="file-row">
          <div className="file-name">{fileName}</div>
          <div className="progress-bar"><div className="bar" style={{ width: `${progress}%` }} /></div>
        </div>
      )}

    

      { loading && <div className="loading-indicator">Loading...</div> }
      {loading && <FullScreenLoader />}
    </div>
  )
}
