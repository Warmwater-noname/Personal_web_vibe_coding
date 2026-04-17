import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileText, ChevronLeft, BookOpen } from 'lucide-react'

interface NoteFile {
  name: string
  path: string
  date?: string
  desc?: string
}

const NOTE_FILES: NoteFile[] = [
  { name: '欢迎笔记', path: '/notes/welcome.md', date: '2026/4/18', desc: '个人网站使用指南和功能介绍' },
  { name: '学习笔记', path: '/notes/study.md', date: '2026/4/1', desc: 'Linux基础、编程语言学习记录' },
]

export default function NotesCard() {
  const [notes] = useState<NoteFile[]>(NOTE_FILES)
  const [selectedNote, setSelectedNote] = useState<NoteFile | null>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedNote) return
    setLoading(true)
    fetch(selectedNote.path)
      .then(res => {
        if (res.ok) return res.text()
        throw new Error('Not found')
      })
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(() => {
        setContent('> 笔记文件未找到，请将 .md 文件放入 `public/notes/` 目录。')
        setLoading(false)
      })
  }, [selectedNote])

  if (selectedNote) {
    const overlay = (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={() => { setSelectedNote(null); setContent('') }}>
        <div
          className="w-full max-w-3xl flex flex-col album-lightbox"
          style={{ backgroundColor: 'var(--color-article)', borderRadius: 32, padding: '32px 36px', boxShadow: '0 40px 50px -32px rgba(0,0,0,0.15)', maxHeight: '85vh' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-5 flex-shrink-0">
            <button
              onClick={() => { setSelectedNote(null); setContent('') }}
              className="p-2 rounded-xl transition-colors"
              style={{ backgroundColor: 'rgba(53,191,171,0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(53,191,171,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(53,191,171,0.1)')}
            >
              <ChevronLeft size={18} style={{ color: 'var(--color-brand)' }} />
            </button>
            <FileText size={16} style={{ color: 'var(--color-brand)' }} />
            <span className="text-base font-semibold truncate" style={{ color: 'var(--color-primary)' }}>{selectedNote.name}</span>
            {selectedNote.date && <span className="text-xs ml-auto" style={{ color: 'var(--color-secondary)' }}>{selectedNote.date}</span>}
          </div>
          <div className="overflow-y-auto pr-2 markdown-body" style={{ minHeight: 0 }}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-brand)', borderTopColor: 'transparent' }} />
              </div>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    )

    return (
      <>
        {createPortal(overlay, document.body)}
        {/* Keep sidebar card visible underneath */}
        <div className="glass-card flex flex-col h-full" style={{ padding: '20px 16px', opacity: 0.5 }}>
          <div className="flex flex-col items-center mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm mb-2" style={{ background: 'linear-gradient(135deg, #e8f5e9, #fff9c4)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>Youyi</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="glass-card flex flex-col h-full" style={{ padding: '20px 16px' }}>
      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm mb-2" style={{ background: 'linear-gradient(135deg, #e8f5e9, #fff9c4)' }}>
          <img
            src="/profile/头像.png"
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.innerHTML = '<span class="text-xl">😺</span>'
              }
            }}
          />
        </div>
        <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>Youyi</span>
        <span className="text-[10px] mt-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(53,191,171,0.15)', color: 'var(--color-brand)' }}>开发中</span>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.4)', margin: '8px 0' }} />

      {/* Nav links like reference sidebar */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {notes.map((note, i) => (
          <button
            key={i}
            onClick={() => setSelectedNote(note)}
            className="w-full text-left px-3 py-2 rounded-xl transition-all flex items-center gap-2 group"
            style={{ fontSize: 13 }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(53,191,171,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <FileText size={14} style={{ color: 'var(--color-brand)' }} className="flex-shrink-0" />
            <span style={{ color: 'var(--color-secondary)' }} className="truncate group-hover:text-gray-800">{note.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
