import React from 'react';
import { Trash2 } from 'lucide-react';

const GalleryGrid = ({ images, onImageClick, onDelete }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
            padding: '1rem 0'
        }}>
            {images.map((image, index) => (
                <div
                    key={index}
                    className="glass-panel animate-fade-in group"
                    style={{
                        overflow: 'hidden',
                        cursor: 'pointer',
                        aspectRatio: '1',
                        position: 'relative',
                        animationDelay: `${index * 0.05}s`
                    }}
                    onClick={() => onImageClick(image)}
                >
                    <img
                        src={image.url}
                        alt={`Gallery item ${index}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(image.id);
                        }}
                        style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            opacity: 0,
                            transition: 'opacity 0.2s ease, background 0.2s ease',
                            zIndex: 10
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.8)';
                            e.currentTarget.style.opacity = '1';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        }}
                        className="delete-btn"
                    >
                        <Trash2 size={16} />
                    </button>
                    <style>{`
                        .group:hover .delete-btn {
                            opacity: 1;
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
};

export default GalleryGrid;
