import React, { useState } from 'react';
import { X, Edit2, Download } from 'lucide-react';
import ImageEditor from './ImageEditor';

const ImageModal = ({ image, onClose, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);

    if (!image) return null;

    const handleSaveEdit = (newImageUrl) => {
        onSave(image, newImageUrl);
        setIsEditing(false);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '2rem'
            }}
            onClick={onClose}
        >
            <div
                className="glass-panel"
                style={{
                    width: '90vw',
                    maxWidth: '1200px',
                    height: '90vh',
                    padding: isEditing ? 0 : '2rem',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
                onClick={e => e.stopPropagation()}
            >
                {!isEditing && (
                    <div style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        zIndex: 10,
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center'
                    }}>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-secondary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        >
                            <Edit2 size={16} /> Edit
                        </button>
                        <a
                            href={image.url}
                            download={`photo-${Date.now()}.jpg`}
                            className="btn-secondary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                textDecoration: 'none'
                            }}
                        >
                            <Download size={16} /> Download
                        </a>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                color: 'var(--text-primary)',
                                width: '2.5rem',
                                height: '2.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} strokeWidth={1} />
                        </button>
                    </div>
                )}

                {isEditing ? (
                    <ImageEditor
                        imageSrc={image.url}
                        onSave={handleSaveEdit}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img
                            src={image.url}
                            alt="Full screen view"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageModal;
