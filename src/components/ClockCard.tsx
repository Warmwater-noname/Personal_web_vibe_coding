import { useState, useEffect } from 'react'

export default function ClockCard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')

  return (
    <div className="glass-card flex items-center justify-center h-full">
      <div className="flex items-center gap-3">
        <span className="clock-digit text-5xl font-bold font-digital tracking-wider" style={{ color: 'var(--color-primary)' }}>
          {hours}
        </span>
        <span className="text-4xl font-bold animate-pulse" style={{ color: 'var(--color-brand)', opacity: 0.6 }}>:</span>
        <span className="clock-digit text-5xl font-bold font-digital tracking-wider" style={{ color: 'var(--color-primary)' }}>
          {minutes}
        </span>
      </div>
    </div>
  )
}
