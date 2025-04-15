import { Viewer } from '@react-pdf-viewer/core';
import * as pdfjsLib from 'pdfjs-dist';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useState } from 'react';

// Initialize PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const IsoManual = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <div style={{ 
            width: '100%', 
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>PDF Manual Viewer</h3>
            
            <div style={{ 
                width: '100%', 
                height: '100vh',
                border: '2px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: 'gray'
            }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.8)'
                    }}>
                        <div className="spinner"></div>
                    </div>
                )}

                {error && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'red',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        Failed to load PDF: {error.message}
                    </div>
                )}

                <Viewer 
                    fileUrl="/manual.pdf"
                    onLoad={() => setIsLoading(false)}
                    onError={(error) => {
                        setIsLoading(false);
                        setError(error);
                    }}
                />
            </div>
            
            <div style={{ marginTop: '15px', color: '#666', fontSize: '0.9em' }}>
                Use the toolbar to navigate, zoom, or print the document
            </div>
        </div>
    );
};

export default IsoManual;