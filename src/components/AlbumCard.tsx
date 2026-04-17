import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const ALBUM_IMAGES = [
  '/album/photo1.jpg',
  '/album/photo2.jpg',
  '/album/photo3.jpg',
  '/album/photo4.jpg',
  '/album/photo5.jpg',
  '/album/photo6.jpg',
]

const PHOTO_TRANSFORMS = [
  'rotate(-6deg) translate(-10%, 5%)',
  'rotate(3deg) translate(15%, -5%)',
  'rotate(-3deg) translate(40%, 8%)',
  'rotate(5deg) translate(60%, -3%)',
  'rotate(-2deg) translate(80%, 6%)',
  'rotate(4deg) translate(30%, 20%)',
]

export default function AlbumCard() {
  const [images] = useState(ALBUM_IMAGES)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const closeLightbox = () => setLightbox(null)

  const prevImage = () => {
    if (lightbox === null) return
    setLightbox(lightbox === 0 ? images.length - 1 : lightbox - 1)
  }

  const nextImage = () => {
    if (lightbox === null) return
    setLightbox(lightbox === images.length - 1 ? 0 : lightbox + 1)
  }

  return (
    <>
      <div className="glass-card p-4 h-full overflow-hidden relative">
        {images.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>暂无照片，请将图片放入 public/album/</p>
          </div>
        ) : (
        <div className="relative w-full h-[160px]">
          {images.slice(0, 5).map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className="absolute bg-white p-1.5 pb-6 rounded-md shadow-md hover:z-30 hover:scale-110 transition-all duration-300 cursor-pointer"
              style={{
                transform: PHOTO_TRANSFORMS[i],
                width: '100px',
                zIndex: i + 1,
                top: '10px',
                left: '0',
              }}
            >
              <div className="w-full aspect-square rounded-sm overflow-hidden" style={{ backgroundColor: 'rgba(53,191,171,0.06)' }}>
                <img
                  src={src}
                  alt={`photo ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-lg" style="background:rgba(53,191,171,0.06);color:var(--color-brand)">🖼️</div>`
                    }
                  }}
                />
              </div>
            </button>
          ))}
        </div>
        )}
      </div>

      {lightbox !== null && (
        <div
          className="album-lightbox fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            className="absolute left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <img
            src={images[lightbox]}
            alt=""
            className="max-w-[85vw] max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            className="absolute right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
      )}
    </>
  )
}
