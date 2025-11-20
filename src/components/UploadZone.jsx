import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

const UploadZone = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onUpload) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && onUpload) {
      onUpload(files);
    }
  }, [onUpload]);

  return (
    <div
      className={`glass-panel upload-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        border: isDragging ? '1px solid var(--text-primary)' : '1px dashed var(--border-color)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        marginBottom: '3rem',
        backgroundColor: isDragging ? 'rgba(255,255,255,0.03)' : 'transparent'
      }}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'block' }}>
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          <UploadCloud size={48} strokeWidth={1} />
        </div>
        <h3 style={{
          marginBottom: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: '400',
          fontFamily: 'var(--font-heading)'
        }}>
          Upload Photos
        </h3>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          letterSpacing: '0.02em'
        }}>
          Drag and drop or click to select
        </p>
      </label>
    </div>
  );
};

export default UploadZone;
