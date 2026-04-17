import { useState, useEffect } from 'react'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday-based
}

export default function CalendarCard() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()
  const dayOfWeek = now.getDay()

  const weekdayNames = ['日', '一', '二', '三', '四', '五', '六']
  const dateStr = `${year}/${month + 1}/${today} 周${weekdayNames[dayOfWeek]}`

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <p className="text-sm mb-3 font-medium" style={{ color: 'var(--color-secondary)' }}>{dateStr}</p>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs flex-1 content-start">
        {WEEKDAYS.map(w => (
          <div key={w} className="font-semibold py-1.5" style={{ color: 'var(--color-secondary)', opacity: 0.7 }}>{w}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            style={d === today ? { backgroundColor: 'var(--color-brand)' } : undefined}
            className={`py-1.5 rounded-full transition-colors text-[13px] ${
              d === today
                ? 'text-white font-bold shadow-sm'
                : d
                ? 'hover:bg-white/40'
                : ''
            }`}
          >
            {d || ''}
          </div>
        ))}
      </div>
    </div>
  )
}
