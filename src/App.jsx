import { useState } from 'react'
import UploadZone from './components/UploadZone'
import GalleryGrid from './components/GalleryGrid'
import ImageModal from './components/ImageModal'
import AnimatedHeader from './components/AnimatedHeader'
import './App.css'

function App() {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  const handleUpload = (files) => {
    // Create object URLs for preview
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const handleSaveImage = (originalImage, newImageUrl) => {
    const newImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: newImageUrl,
      file: originalImage.file // Keep reference to original file if needed, or null
    }

    setImages(prev => [...prev, newImage])

    // Update selected image to the new version so user sees their edit
    setSelectedImage(newImage)
  }

  return (
    <div className="app-container">
      <header style={{ marginBottom: '4rem', textAlign: 'center', paddingTop: '2rem' }}>
        <AnimatedHeader />
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontWeight: '300'
        }}>
          Curated Collection
        </p>
      </header>

      <main>
        <UploadZone onUpload={handleUpload} />

        {images.length > 0 ? (
          <GalleryGrid
            images={images}
            onImageClick={setSelectedImage}
          />
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--text-secondary)',
            fontStyle: 'italic'
          }}>
            No hay fotos todavía. ¡Sube algunas para empezar!
          </div>
        )}
      </main>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onSave={handleSaveImage}
      />
    </div>
  )
}

export default App
