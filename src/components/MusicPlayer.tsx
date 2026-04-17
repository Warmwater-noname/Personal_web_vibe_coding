import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react'

interface Track {
  name: string
  src: string
}

const MUSIC_FILES: Track[] = [
  { name: 'Close To You', src: '/music/Close To You.mp3' },
  { name: '示例音乐', src: '/music/sample.mp3' },
]

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [tracks, setTracks] = useState<Track[]>(MUSIC_FILES)

  const currentTrack = tracks[currentIndex] || tracks[0]

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {})
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = () => {
    if (isPlaying) pause()
    else play()
  }

  const prev = () => {
    const newIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setIsPlaying(true)
  }

  const next = () => {
    const newIndex = currentIndex === tracks.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setIsPlaying(true)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = currentTrack.src
    audio.load()
    if (isPlaying) {
      audio.play().catch(() => {})
    }
  }, [currentIndex, currentTrack.src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress(audio.currentTime)
      setDuration(audio.duration || 0)
    }

    const onEnded = () => next()

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', updateProgress)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', updateProgress)
      audio.removeEventListener('ended', onEnded)
    }
  }, [currentIndex, tracks.length])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = val
    }
    setProgress(val)
  }

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (tracks.length === 0) {
    return (
      <div className="glass-card flex items-center gap-3 h-full" style={{ padding: '12px 16px' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(53,191,171,0.15)' }}>
          <Music size={16} style={{ color: 'var(--color-brand)' }} />
        </div>
        <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>暂无音乐，请将 .mp3 文件放入 public/music/</p>
      </div>
    )
  }

  return (
    <div className="glass-card flex flex-col justify-center h-full" style={{ padding: '8px 16px', gap: 4 }}>
      <audio ref={audioRef} preload="metadata" />
      {/* Row 1: icon + song name + controls */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(53,191,171,0.15)' }}>
          <Music size={14} style={{ color: 'var(--color-brand)' }} />
        </div>
        <p className="flex-1 min-w-0 text-sm font-medium truncate" style={{ color: 'var(--color-primary)' }}>{currentTrack.name}</p>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button onClick={prev} className="p-1 hover:bg-white/40 rounded-full transition-colors">
            <SkipBack size={14} className="text-gray-500" />
          </button>
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-full transition-colors shadow-sm"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            {isPlaying
              ? <Pause size={14} className="text-white" />
              : <Play size={14} className="text-white ml-0.5" />
            }
          </button>
          <button onClick={next} className="p-1 hover:bg-white/40 rounded-full transition-colors">
            <SkipForward size={14} className="text-gray-500" />
          </button>
        </div>
      </div>
      {/* Row 2: progress bar + time */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] w-7 flex-shrink-0" style={{ color: 'var(--color-secondary)' }}>{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="music-slider flex-1 cursor-pointer"
        />
        <span className="text-[10px] w-7 text-right flex-shrink-0" style={{ color: 'var(--color-secondary)' }}>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
