import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem('theme') as Theme | null
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
      title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
      className="fixed bottom-4 left-4 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid rgba(255,255,255,0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {theme === 'dark'
        ? <Sun size={18} style={{ color: '#ffd166' }} />
        : <Moon size={18} style={{ color: 'var(--color-brand)' }} />}
    </button>
  )
}
