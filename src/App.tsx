import { useState } from 'react'
import AvatarCard from './components/AvatarCard'
import ClockCard from './components/ClockCard'
import CalendarCard from './components/CalendarCard'
import MusicPlayer from './components/MusicPlayer'
import LikeButton from './components/LikeButton'
import NotesCard, { type NoteItem } from './components/NotesCard'
import NoteReader from './components/NoteReader'
import AlbumCard from './components/AlbumCard'
import ProjectsSection from './components/ProjectsSection'
import EmailModal from './components/EmailModal'

export default function App() {
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null)
  const [emailOpen, setEmailOpen] = useState(false)

  if (selectedNote) {
    return <NoteReader note={selectedNote} onBack={() => setSelectedNote(null)} />
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:py-10">
      <div className="bento-container">

        {/* Notes / sidebar */}
        <div className="bento-item bento-sidebar" style={{ '--delay': '0s' } as React.CSSProperties}>
          <NotesCard onSelect={setSelectedNote} />
        </div>

        {/* Album — photo collage */}
        <div className="bento-item bento-album" style={{ '--delay': '0.05s' } as React.CSSProperties}>
          <AlbumCard />
        </div>

        {/* Avatar + Greeting */}
        <div className="bento-item bento-avatar" style={{ '--delay': '0.1s' } as React.CSSProperties}>
          <AvatarCard />
        </div>

        {/* Social links bar */}
        <div className="bento-item bento-social" style={{ '--delay': '0.15s' } as React.CSSProperties}>
          <div className="glass-card h-full flex items-center justify-center gap-4" style={{ padding: '0 24px' }}>
            <a href="https://github.com/Warmwater-noname" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Github
            </a>
            <a href="https://space.bilibili.com/182782785/dynamic" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors" style={{ backgroundColor: '#00a1d6' }}>
              <span className="font-bold text-xs">B</span>
              Bilibili
            </a>
            <button type="button" onClick={() => setEmailOpen(true)} aria-label="邮箱" className="flex items-center justify-center w-9 h-9 rounded-xl text-white transition-colors hover:brightness-110" style={{ backgroundColor: 'var(--color-brand)' }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </button>
          </div>
        </div>

        {/* Clock */}
        <div className="bento-item bento-clock" style={{ '--delay': '0.08s' } as React.CSSProperties}>
          <ClockCard />
        </div>

        {/* Calendar */}
        <div className="bento-item bento-calendar" style={{ '--delay': '0.12s' } as React.CSSProperties}>
          <CalendarCard />
        </div>

        {/* Music Player */}
        <div className="bento-item bento-music" style={{ '--delay': '0.18s' } as React.CSSProperties}>
          <MusicPlayer />
        </div>

        {/* Like Button */}
        <div className="bento-item bento-like" style={{ '--delay': '0.2s' } as React.CSSProperties}>
          <LikeButton />
        </div>

      </div>

      <ProjectsSection />

      <EmailModal open={emailOpen} onClose={() => setEmailOpen(false)} />
    </div>
  )
}
