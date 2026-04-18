import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, VolumeX, Volume1 } from 'lucide-react'
import musicFiles from 'virtual:music-manifest'

interface Track {
  name: string
  src: string
}

// 默认音量，范围 0.0 ~ 1.0（修改此常量即可更改初始默认音量）
const DEFAULT_VOLUME = 0.3

function buildTracks(files: string[]): Track[] {
  return files.map(f => ({
    name: f.replace(/\.[^.]+$/, ''),
    src: `/music/${encodeURIComponent(f)}`,
  }))
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('music-volume') : null
    const v = saved != null ? parseFloat(saved) : DEFAULT_VOLUME
    return isNaN(v) ? DEFAULT_VOLUME : Math.max(0, Math.min(1, v))
  })
  const [muted, setMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const tracks = useMemo(() => buildTracks(musicFiles), [])

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
    if (!audio || !currentTrack) return
    audio.src = currentTrack.src
    audio.load()
    if (isPlaying) {
      audio.play().catch(() => {})
    }
  }, [currentIndex, currentTrack?.src])

  // Apply volume / mute to audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('music-volume', String(volume))
    }
  }, [volume, muted])

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

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (v > 0 && muted) setMuted(false)
  }

  const toggleMute = () => setMuted(m => !m)

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

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
        <div className="flex items-center gap-0.5 flex-shrink-0 relative">
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
          {/* Volume control */}
          <div
            className="relative"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button
              onClick={toggleMute}
              className="p-1 hover:bg-white/40 rounded-full transition-colors"
              aria-label="音量"
            >
              <VolumeIcon size={14} className="text-gray-500" />
            </button>
            {showVolume && (
              <div
                className="absolute right-0 bottom-full mb-2 px-3 py-2 rounded-xl shadow-lg z-20"
                style={{ backgroundColor: 'var(--color-article)', border: '1px solid #ffffff', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              >
                <div className="flex items-center gap-2" style={{ width: 120 }}>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={handleVolume}
                    className="music-slider flex-1 cursor-pointer"
                  />
                  <span className="text-[10px] w-7 text-right" style={{ color: 'var(--color-secondary)' }}>
                    {Math.round((muted ? 0 : volume) * 100)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Row 2: progress bar + time */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] w-7 flex-shrink-0" style={{ color: 'var(--color-secondary)' }}>{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step="any"
          value={progress}
          onChange={handleSeek}
          disabled={!duration}
          className="music-slider flex-1 cursor-pointer"
        />
        <span className="text-[10px] w-7 text-right flex-shrink-0" style={{ color: 'var(--color-secondary)' }}>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
