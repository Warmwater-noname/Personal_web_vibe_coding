import { useMemo } from 'react'
import { FileText, BookOpen } from 'lucide-react'
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
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0 px-1">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(53,191,171,0.15)' }}>
          <BookOpen size={14} style={{ color: 'var(--color-brand)' }} />
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>笔记</span>
        <span className="text-[10px] ml-auto px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(53,191,171,0.15)', color: 'var(--color-brand)' }}>
          {notes.length}
        </span>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.4)', marginBottom: 8 }} className="flex-shrink-0" />

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
