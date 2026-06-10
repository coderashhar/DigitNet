import React, { useState } from 'react';
import axios from 'axios';
import DrawingCanvas from './components/DrawingCanvas';
import ImageUpload from './components/ImageUpload';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('draw'); // 'draw' or 'upload'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (fileOrBlob) => {
    if (!fileOrBlob) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    const formData = new FormData();
    formData.append('file', fileOrBlob, 'digit.png');

    try {
      // Assuming FastAPI runs on default port 8000 locally
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResult(response.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the backend server. Make sure FastAPI is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h1 className="title">NeuralVision</h1>
      <p className="subtitle">AI-Powered Handwritten Digit Recognition</p>

      <div className="glass-panel">
        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'draw' ? 'active' : ''}`}
            onClick={() => setActiveTab('draw')}
          >
            Draw Digit
          </div>
          <div 
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Image
          </div>
        </div>

        {activeTab === 'draw' ? (
          <DrawingCanvas onImageReady={handlePredict} />
        ) : (
          <ImageUpload onImageReady={handlePredict} />
        )}

        {loading && (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--primary)' }}>
            <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '0.5rem' }}>Analyzing...</p>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

        {error && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="prediction-card animate-fade-in">
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 600 }}>Prediction Result</h3>
            <div className="prediction-digit">{result.prediction}</div>
            <div className="prediction-confidence">
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
