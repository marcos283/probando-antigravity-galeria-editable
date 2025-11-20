import React from 'react';

const GalleryGrid = ({ images, onImageClick }) => {
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
                    className="glass-panel animate-fade-in"
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
                </div>
            ))}
        </div>
    );
};

export default GalleryGrid;
