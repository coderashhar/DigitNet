import React, { useRef, useState } from 'react';

export default function ImageUpload({ onImageReady, onClear }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitImage = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      onImageReady(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onClear) onClear();
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
      <div 
        style={{
          border: '2px dashed var(--surface-border)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '1.5rem',
          background: 'rgba(255,255,255,0.02)'
        }}
      >
        {!preview ? (
          <div>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              Select an image of a handwritten digit (0-9)
            </p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn btn-secondary">
              Browse Files
            </label>
          </div>
        ) : (
          <div>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '280px', 
                maxHeight: '280px', 
                borderRadius: '8px',
                marginBottom: '1rem'
              }} 
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={clearImage}>
                Change Image
              </button>
            </div>
          </div>
        )}
      </div>

      <button 
        className="btn" 
        onClick={submitImage}
        disabled={!preview}
        style={{ opacity: !preview ? 0.5 : 1, cursor: !preview ? 'not-allowed' : 'pointer' }}
      >
        Predict Digit
      </button>
    </div>
  );
}
