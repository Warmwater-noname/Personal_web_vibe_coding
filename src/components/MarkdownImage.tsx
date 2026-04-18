import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface Props {
  src?: string
  alt?: string
}

export default function MarkdownImage({ src, alt }: Props) {
  const [open, setOpen] = useState(false)
  if (!src) return null

  // Extract ?w=XXX width hint
  let width: number | undefined
  try {
    const u = new URL(src, window.location.origin)
    const w = u.searchParams.get('w')
    if (w && /^\d+$/.test(w)) width = parseInt(w, 10)
  } catch { /* ignore */ }

  const style: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    cursor: 'zoom-in',
    margin: '12px 0',
  }
  if (width) style.width = Math.min(width, 800)

  return (
    <>
      <img
        src={src}
        alt={alt || ''}
        style={style}
        loading="lazy"
        onClick={() => setOpen(true)}
        onError={(e) => {
          const t = e.currentTarget
          t.style.display = 'none'
          const holder = document.createElement('span')
          holder.textContent = `🖼️ 图片加载失败：${decodeURIComponent(src)}`
          holder.style.cssText = 'display:inline-block;padding:8px 12px;border-radius:8px;background:rgba(53,191,171,0.08);color:var(--color-secondary);font-size:12px;'
          t.parentElement?.appendChild(holder)
        }}
      />
      {open && createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center album-lightbox"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt || ''}
            className="max-w-[92vw] max-h-[92vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="关闭"
          >
            <X size={22} className="text-white" />
          </button>
        </div>,
        document.body
      )}
    </>
  )
}
