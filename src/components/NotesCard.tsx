import { useMemo } from 'react'
import { FileText } from 'lucide-react'
import noteFiles from 'virtual:notes-manifest'

export interface NoteItem {
  name: string
  path: string
}

interface Props {
  onSelect: (note: NoteItem) => void
}

function buildNotes(files: string[]): NoteItem[] {
  return files.map(f => ({
    name: f.replace(/\.md$/i, ''),
    path: `/notes/${encodeURIComponent(f)}`,
  }))
}

export default function NotesCard({ onSelect }: Props) {
  const notes = useMemo(() => buildNotes(noteFiles), [])

  return (
    <div className="glass-card flex flex-col h-full" style={{ padding: '20px 16px' }}>
      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-3 flex-shrink-0">
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

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.4)', margin: '8px 0' }} className="flex-shrink-0" />

      {/* Nav links — scrollable list */}
      <div className="flex-1 overflow-y-auto space-y-1 notes-scroll" style={{ minHeight: 0 }}>
        {notes.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--color-secondary)' }}>
            暂无笔记<br />请放入 <code>public/notes/</code>
          </p>
        ) : notes.map((note, i) => (
          <button
            key={i}
            onClick={() => onSelect(note)}
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
