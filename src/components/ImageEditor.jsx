import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../utils/cropImage'
import { Check, X as XIcon, ZoomIn } from 'lucide-react'

const ASPECT_RATIOS = [
    { label: 'Original', value: null },
    { label: 'Square', value: 1 },
    { label: 'Portrait', value: 4 / 5 },
    { label: 'Landscape', value: 16 / 9 },
    { label: 'Story', value: 9 / 16 },
]

const ImageEditor = ({ imageSrc, onSave, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
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
                />
            </div>

            <div style={{
                padding: '1.5rem',
                background: 'var(--bg-primary)',
                borderTop: '1px solid var(--border-color)'
            }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {ASPECT_RATIOS.map((ratio) => (
                        <button
                            key={ratio.label}
                            onClick={() => setAspect(ratio.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                border: aspect === ratio.value ? '1px solid var(--text-primary)' : '1px solid transparent',
                                color: aspect === ratio.value ? 'var(--text-primary)' : 'var(--text-secondary)',
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

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
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

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
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
                        <Check size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageEditor
