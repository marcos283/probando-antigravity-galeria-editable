import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import Cropper from 'react-easy-crop'
import 'react-image-crop/dist/ReactCrop.css'
import getCroppedImg from '../utils/cropImage'
import { Check, X as XIcon, Crop, Wand2, Type, ZoomIn } from 'lucide-react'

const ASPECT_RATIOS = [
    { label: 'Free', value: undefined },
    { label: 'Original', value: 'original' },
    { label: 'Square', value: 1 },
    { label: 'Portrait', value: 4 / 5 },
    { label: 'Landscape', value: 16 / 9 },
    { label: 'Story', value: 9 / 16 },
]

const FILTERS = [
    { label: 'Normal', value: null },
    { label: 'B&W', value: 'grayscale(100%)' },
    { label: 'Sepia', value: 'sepia(100%)' },
    { label: 'Vivid', value: 'saturate(200%)' },
    { label: 'Dark', value: 'brightness(70%)' },
    { label: 'Warm', value: 'sepia(30%) saturate(140%)' },
]

const FONTS = [
    { label: 'Standard', value: 'Arial' },
    { label: 'Philosopher', value: 'Philosopher' },
    { label: 'Script', value: 'Great Vibes' },
    { label: 'Modern', value: 'Montserrat' },
]

// Helper for ReactCrop initial state
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

const ImageEditor = ({ imageSrc, onSave, onCancel }) => {
    // Shared State
    const [aspect, setAspect] = useState(undefined) // undefined = Free
    const [activeTab, setActiveTab] = useState('crop')
    const [activeFilter, setActiveFilter] = useState(null)
    const [watermarkText, setWatermarkText] = useState('')
    const [watermarkFont, setWatermarkFont] = useState('Arial')
    const [isSmartCompression, setIsSmartCompression] = useState(true)
    const [originalAspect, setOriginalAspect] = useState(null)

    // ReactCrop State (Free Mode)
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState(null)
    const imgRef = useRef(null)

    // EasyCrop State (Preset Mode)
    const [easyCrop, setEasyCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [easyCropPixels, setEasyCropPixels] = useState(null)

    // Handlers
    const onEasyCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setEasyCropPixels(croppedAreaPixels)
    }, [])

    const onMediaLoaded = useCallback((mediaSize) => {
        const { width, height } = mediaSize
        setOriginalAspect(width / height)
    }, [])

    // ReactCrop Image Load
    function onImageLoad(e) {
        const { width, height } = e.currentTarget
        setOriginalAspect(width / height)
        const initialCrop = centerAspectCrop(width, height, width / height)
        setCrop(initialCrop)
        setCompletedCrop(initialCrop)
    }

    const handleAspectChange = (newAspect) => {
        setAspect(newAspect)
        // Reset zoom when switching to presets to avoid confusion
        if (newAspect !== undefined) {
            setZoom(1)
        }
    }

    const handleSave = async () => {
        try {
            let pixelCrop;

            if (aspect === undefined) {
                // Free Mode (ReactCrop)
                if (!completedCrop || !imgRef.current) return
                const image = imgRef.current
                const scaleX = image.naturalWidth / image.width
                const scaleY = image.naturalHeight / image.height
                pixelCrop = {
                    x: completedCrop.x * scaleX,
                    y: completedCrop.y * scaleY,
                    width: completedCrop.width * scaleX,
                    height: completedCrop.height * scaleY,
                }
            } else {
                // Preset Mode (EasyCrop)
                if (!easyCropPixels) return
                pixelCrop = easyCropPixels
            }

            const croppedImage = await getCroppedImg(
                imageSrc,
                pixelCrop,
                0, // rotation
                { horizontal: false, vertical: false }, // flip
                activeFilter,
                watermarkText || null,
                watermarkFont,
                isSmartCompression ? 0.8 : 1.0
            )
            onSave(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            background: '#000'
        }}>
            <div style={{
                position: 'relative',
                flex: 1,
                minHeight: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#000',
                padding: '20px'
            }}>
                {aspect === undefined ? (
                    // FREE MODE: ReactCrop
                    // We remove width: 100% so the container shrinks to the image width
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={undefined}
                            style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                // Remove display: flex here to allow ReactCrop to wrap the image tightly
                            }}
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop me"
                                onLoad={onImageLoad}
                                style={{
                                    display: 'block', // Important to remove bottom space
                                    maxHeight: 'calc(100vh - 350px)', // Ensure it fits with panel
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    filter: activeFilter || 'none'
                                }}
                            />
                        </ReactCrop>
                    </div>
                ) : (
                    // PRESET MODE: EasyCrop
                    <Cropper
                        image={imageSrc}
                        crop={easyCrop}
                        zoom={zoom}
                        aspect={aspect === 'original' ? originalAspect : aspect}
                        onCropChange={setEasyCrop}
                        onCropComplete={onEasyCropComplete}
                        onZoomChange={setZoom}
                        onMediaLoaded={onMediaLoaded}
                        style={{
                            containerStyle: { background: '#000' },
                            mediaStyle: { filter: activeFilter || 'none' }
                        }}
                    />
                )}

                {watermarkText && (
                    <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '10%',
                        color: 'rgba(255,255,255,0.8)',
                        fontFamily: watermarkFont,
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}>
                        {watermarkText}
                    </div>
                )}
            </div>

            <div style={{
                padding: '1rem', // Reduced padding
                background: 'var(--bg-primary)',
                borderTop: '1px solid var(--border-color)'
            }}>
                {/* Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('crop')}
                        style={{
                            background: 'transparent',
                            color: activeTab === 'crop' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'crop' ? '2px solid var(--text-primary)' : '2px solid transparent',
                            paddingBottom: '0.25rem',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            fontSize: '0.9rem'
                        }}
                    >
                        <Crop size={16} /> Crop
                    </button>
                    <button
                        onClick={() => setActiveTab('filter')}
                        style={{
                            background: 'transparent',
                            color: activeTab === 'filter' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'filter' ? '2px solid var(--text-primary)' : '2px solid transparent',
                            paddingBottom: '0.25rem',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            fontSize: '0.9rem'
                        }}
                    >
                        <Wand2 size={16} /> Filters
                    </button>
                    <button
                        onClick={() => setActiveTab('watermark')}
                        style={{
                            background: 'transparent',
                            color: activeTab === 'watermark' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'watermark' ? '2px solid var(--text-primary)' : '2px solid transparent',
                            paddingBottom: '0.25rem',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            fontSize: '0.9rem'
                        }}
                    >
                        <Type size={16} /> Watermark
                    </button>
                </div>

                {/* Tab Content */}
                <div style={{ minHeight: '60px', marginBottom: '0.5rem' }}>
                    {activeTab === 'crop' && (
                        <>
                            <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                                {ASPECT_RATIOS.map((ratio) => (
                                    <button
                                        key={ratio.label}
                                        onClick={() => handleAspectChange(ratio.value)}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            background: 'transparent',
                                            border: (aspect === ratio.value)
                                                ? '1px solid var(--text-primary)' : '1px solid transparent',
                                            color: (aspect === ratio.value)
                                                ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>

                            {/* Only show Zoom slider in Preset Mode (EasyCrop) */}
                            {aspect !== undefined && (
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <ZoomIn size={16} color="var(--text-secondary)" />
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(e.target.value)}
                                        style={{
                                            flex: 1,
                                            accentColor: 'var(--text-primary)',
                                            height: '2px',
                                            background: 'var(--border-color)'
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'filter' && (
                        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.label}
                                    onClick={() => setActiveFilter(filter.value)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        background: activeFilter === filter.value ? 'var(--text-primary)' : 'rgba(255,255,255,0.05)',
                                        color: activeFilter === filter.value ? 'var(--bg-primary)' : 'var(--text-primary)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        minWidth: '70px'
                                    }}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'watermark' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <input
                                type="text"
                                placeholder="Enter watermark text..."
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                                {FONTS.map((font) => (
                                    <button
                                        key={font.label}
                                        onClick={() => setWatermarkFont(font.value)}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            background: watermarkFont === font.value ? 'var(--text-primary)' : 'rgba(255,255,255,0.05)',
                                            color: watermarkFont === font.value ? 'var(--bg-primary)' : 'var(--text-primary)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontFamily: font.value,
                                            minWidth: '80px'
                                        }}
                                    >
                                        {font.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    <button
                        onClick={() => setIsSmartCompression(!isSmartCompression)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: isSmartCompression ? 'var(--text-primary)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                        }}
                        title={isSmartCompression ? "Optimized for Social Media (Smaller size)" : "Maximum Quality (Larger size)"}
                    >
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: isSmartCompression ? '#4ade80' : 'var(--text-secondary)',
                            display: 'inline-block'
                        }}></span>
                        ⚡ Smart Compression
                    </button>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={onCancel}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                            <XIcon size={16} /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                            <Check size={16} /> Save & Export
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageEditor
