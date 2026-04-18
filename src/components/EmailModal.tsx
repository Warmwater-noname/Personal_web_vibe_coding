import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Copy, Check, Mail } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const EMAILS = [
  { label: 'QQ 邮箱', value: '3156896114@qq.com' },
  { label: '谷歌邮箱', value: 'a3156896114@gmail.com' },
]

export default function EmailModal({ open, onClose }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const copy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      setToast('已复制到剪贴板')
      setTimeout(() => setCopiedIdx(null), 1500)
      setTimeout(() => setToast(null), 1800)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
      setCopiedIdx(idx)
      setToast('已复制')
      setTimeout(() => setCopiedIdx(null), 1500)
      setTimeout(() => setToast(null), 1800)
    }
  }

  const node = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 album-lightbox"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm"
        style={{ backgroundColor: 'var(--color-article)', borderRadius: 28, padding: '24px 24px 20px', boxShadow: '0 40px 50px -32px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(53,191,171,0.15)' }}>
              <Mail size={16} style={{ color: 'var(--color-brand)' }} />
            </div>
            <span className="text-base font-semibold" style={{ color: 'var(--color-primary)' }}>联系邮箱</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
            aria-label="关闭"
          >
            <X size={16} style={{ color: 'var(--color-secondary)' }} />
          </button>
        </div>

        <div className="space-y-2.5">
          {EMAILS.map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ backgroundColor: 'rgba(53,191,171,0.08)', border: '1px solid rgba(53,191,171,0.15)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] mb-0.5" style={{ color: 'var(--color-secondary)' }}>{e.label}</p>
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-primary)' }}>{e.value}</p>
              </div>
              <button
                onClick={() => copy(e.value, i)}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all flex-shrink-0"
                style={{ backgroundColor: copiedIdx === i ? 'var(--color-brand)' : 'rgba(53,191,171,0.15)' }}
                aria-label="复制"
              >
                {copiedIdx === i
                  ? <Check size={15} className="text-white" />
                  : <Copy size={15} style={{ color: 'var(--color-brand)' }} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg toast-enter"
          style={{ backgroundColor: 'var(--color-brand)' }}
        >
          {toast}
        </div>
      )}
    </div>
  )

  return createPortal(node, document.body)
}
