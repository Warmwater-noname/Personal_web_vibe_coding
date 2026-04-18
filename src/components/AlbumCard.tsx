import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import albumFiles from 'virtual:album-manifest'

// Stagger transforms for the "stacked postcards" look.
// Applied modulo the number of actual photos available.
const PHOTO_TRANSFORMS = [
  'rotate(-6deg) translate(-10%, 5%)',
  'rotate(3deg) translate(15%, -5%)',
  'rotate(-3deg) translate(40%, 8%)',
  'rotate(5deg) translate(60%, -3%)',
  'rotate(-2deg) translate(80%, 6%)',
  'rotate(4deg) translate(30%, 20%)',
]

// When a card is hovered, the others get a gentle "push-back" transform
// plus slight scale-down, creating the "spread to reveal" effect.
const PUSH_TRANSFORMS = [
  'rotate(-10deg) translate(-30%, 10%) scale(0.88)',
  'rotate(8deg) translate(35%, -12%) scale(0.88)',
  'rotate(-6deg) translate(55%, 18%) scale(0.88)',
  'rotate(10deg) translate(80%, -10%) scale(0.88)',
  'rotate(-5deg) translate(100%, 16%) scale(0.88)',
  'rotate(8deg) translate(40%, 38%) scale(0.88)',
]

export default function AlbumCard() {
  const images = useMemo(() => albumFiles.map(f => `/album/${encodeURIComponent(f)}`), [])
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  const visible = images.slice(0, 5) // show up to 5 postcards in the bento area

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
        {visible.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-center" style={{ color: 'var(--color-secondary)' }}>
              暂无照片<br />请将图片放入 <code>public/album/</code>
            </p>
          </div>
        ) : (
          <div className="relative w-full h-[160px]" onMouseLeave={() => setHovered(null)}>
            {visible.map((src, i) => {
              const isHovered = hovered === i
              const someoneHovered = hovered !== null
              const baseT = PHOTO_TRANSFORMS[i % PHOTO_TRANSFORMS.length]
              const pushT = PUSH_TRANSFORMS[i % PUSH_TRANSFORMS.length]
              const transform = isHovered
                ? `${baseT} scale(1.35)`
                : someoneHovered ? pushT : baseT
              return (
                <button
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onClick={() => setLightbox(i)}
                  className="absolute bg-white p-1.5 pb-6 rounded-md shadow-md cursor-pointer"
                  style={{
                    transform,
                    width: '100px',
                    top: '10px',
                    left: '0',
                    zIndex: isHovered ? 50 : i + 1,
                    transition: 'transform 0.35s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s ease, z-index 0s',
                    boxShadow: isHovered
                      ? '0 20px 40px -12px rgba(0,0,0,0.35)'
                      : '0 4px 10px rgba(0,0,0,0.12)',
                  }}
                >
                  <div className="w-full aspect-square rounded-sm overflow-hidden" style={{ backgroundColor: 'rgba(53,191,171,0.06)' }}>
                    <img
                      src={src}
                      alt={`photo ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
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
              )
            })}
          </div>
        )}
      </div>

      {lightbox !== null && createPortal(
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
        </div>,
        document.body
      )}
    </>
  )
}
