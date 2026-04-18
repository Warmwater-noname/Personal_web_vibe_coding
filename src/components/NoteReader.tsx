import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronLeft } from 'lucide-react'
import type { NoteItem } from './NotesCard'

interface Props {
  note: NoteItem
  onBack: () => void
}

export default function NoteReader({ note, onBack }: Props) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(note.path)
      .then(res => {
        if (!res.ok) throw new Error('not found')
        return res.text()
      })
      .then(text => {
        if (!cancelled) {
          setContent(text)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContent('> 笔记文件未找到。')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [note.path])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onBack() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBack])

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto note-reader-enter" style={{ backgroundColor: 'var(--color-bg)' }}>
      <button
        onClick={onBack}
        aria-label="返回"
        className="fixed top-4 left-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-md transition-all"
        style={{ backgroundColor: 'var(--color-card)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid #ffffff' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(53,191,171,0.15)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-card)')}
      >
        <ChevronLeft size={18} style={{ color: 'var(--color-brand)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>返回</span>
      </button>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-20 pb-16">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>{note.name}</h1>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-brand)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
