import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export default function LikeButton() {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('like_count')
    const savedLiked = localStorage.getItem('liked')
    if (saved) setCount(parseInt(saved, 10))
    if (savedLiked === 'true') setLiked(true)
  }, [])

  const handleLike = () => {
    const newLiked = !liked
    const newCount = newLiked ? count + 1 : Math.max(0, count - 1)
    setLiked(newLiked)
    setCount(newCount)
    localStorage.setItem('like_count', newCount.toString())
    localStorage.setItem('liked', newLiked.toString())

    if (newLiked) {
      setAnimate(true)
      setTimeout(() => setAnimate(false), 600)
    }
  }

  return (
    <div className="glass-card flex flex-col items-center justify-center gap-2 h-full heartbeat-container" style={{ padding: 16 }}>
      <div className="relative">
        {animate && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold animate-bounce" style={{ color: 'var(--color-brand)' }}>
            +1
          </span>
        )}
        <button
          onClick={handleLike}
          className="group relative p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Heart
            size={32}
            className={`transition-all duration-300 ${
              liked
                ? 'fill-pink-400 text-pink-400 drop-shadow-lg'
                : 'text-gray-400 group-hover:text-pink-300'
            }`}
          />
        </button>
      </div>
      <span className="text-sm font-medium px-3 py-0.5 rounded-full" style={{ color: 'var(--color-brand)', backgroundColor: 'rgba(53,191,171,0.1)' }}>
        {count.toLocaleString()}
      </span>
    </div>
  )
}
