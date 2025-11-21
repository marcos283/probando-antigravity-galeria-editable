import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../utils/cropImage'
import { Check, X as XIcon, ZoomIn, Crop, Wand2, Type } from 'lucide-react'

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

const ImageEditor = ({ imageSrc, onSave, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(undefined)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    // New features state
    const [activeTab, setActiveTab] = useState('crop') // 'crop', 'filter', 'watermark'
    const [activeFilter, setActiveFilter] = useState(null)
    const [watermarkText, setWatermarkText] = useState('')
    const [watermarkFont, setWatermarkFont] = useState('Arial')
    const [isSmartCompression, setIsSmartCompression] = useState(true)
    const [originalAspect, setOriginalAspect] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const onMediaLoaded = useCallback((mediaSize) => {
        const { width, height } = mediaSize
        setOriginalAspect(width / height)
    }, [])

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                0, // rotation
                { horizontal: false, vertical: false }, // flip
                activeFilter,
                watermarkText || null,
                watermarkFont,
                isSmartCompression ? 0.8 : 1.0 // Quality based on toggle
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
            <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    onMediaLoaded={onMediaLoaded}
                    style={{
                        containerStyle: {
                            filter: activeFilter || 'none'
                        }
                    }}
                />
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
                padding: '1.5rem',
                background: 'var(--bg-primary)',
                borderTop: '1px solid var(--border-color)'
            }}>
                {/* Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => setActiveTab('crop')}
                        style={{
                            background: 'transparent',
                            color: activeTab === 'crop' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'crop' ? '2px solid var(--text-primary)' : '2px solid transparent',
                            paddingBottom: '0.5rem',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}
                    >
                        <Crop size={18} /> Crop
                    </button>
                    <button
                        onClick={() => setActiveTab('filter')}
                        style={{
                            background: 'transparent',
                            color: activeTab === 'filter' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'filter' ? '2px solid var(--text-primary)' : '2px solid transparent',
                            paddingBottom: '0.5rem',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}
                    >
                        <Wand2 size={18} /> Filters
                    </button>
                    <button
                        onClick={() => setActiveTab('watermark')}
                        style={{
                            background: 'transparent',
                            color: activeTab === 'watermark' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'watermark' ? '2px solid var(--text-primary)' : '2px solid transparent',
                            paddingBottom: '0.5rem',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}
                    >
                        <Type size={18} /> Watermark
                    </button>
                </div>

                {/* Tab Content */}
                <div style={{ minHeight: '80px', marginBottom: '1rem' }}>
                    {activeTab === 'crop' && (
                        <>
                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {ASPECT_RATIOS.map((ratio) => (
                                    <button
                                        key={ratio.label}
                                        onClick={() => setAspect(ratio.value === 'original' ? originalAspect : ratio.value)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'transparent',
                                            border: (aspect === ratio.value) || (ratio.value === 'original' && aspect === originalAspect) ? '1px solid var(--text-primary)' : '1px solid transparent',
                                            color: (aspect === ratio.value) || (ratio.value === 'original' && aspect === originalAspect) ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            fontSize: '0.8rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <ZoomIn size={18} color="var(--text-secondary)" />
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
                        </>
                    )}

                    {activeTab === 'filter' && (
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.label}
                                    onClick={() => setActiveFilter(filter.value)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: activeFilter === filter.value ? 'var(--text-primary)' : 'rgba(255,255,255,0.05)',
                                        color: activeFilter === filter.value ? 'var(--bg-primary)' : 'var(--text-primary)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        minWidth: '80px'
                                    }}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'watermark' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Enter watermark text..."
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    borderRadius: '4px',
                                    fontSize: '1rem'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {FONTS.map((font) => (
                                    <button
                                        key={font.label}
                                        onClick={() => setWatermarkFont(font.value)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: watermarkFont === font.value ? 'var(--text-primary)' : 'rgba(255,255,255,0.05)',
                                            color: watermarkFont === font.value ? 'var(--bg-primary)' : 'var(--text-primary)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem',
                                            fontFamily: font.value,
                                            minWidth: '90px'
                                        }}
                                    >
                                        {font.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <button
                        onClick={() => setIsSmartCompression(!isSmartCompression)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: isSmartCompression ? 'var(--text-primary)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                        title={isSmartCompression ? "Optimized for Social Media (Smaller size)" : "Maximum Quality (Larger size)"}
                    >
                        <span style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: isSmartCompression ? '#4ade80' : 'var(--text-secondary)',
                            display: 'inline-block'
                        }}></span>
                        ⚡ Smart Compression
                    </button>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={onCancel}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <XIcon size={16} /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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
