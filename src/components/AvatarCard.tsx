import { useState, useEffect } from 'react'

export default function AvatarCard() {
  const [signature, setSignature] = useState("I'm Youyi, Nice to meet you!")
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'profile/个性签名.txt')
      .then(res => {
        if (res.ok) return res.text()
        return "I'm Youyi, Nice to meet you!"
      })
      .then(text => setSignature(text.trim()))
      .catch(() => setSignature("I'm Youyi, Nice to meet you!"))

    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setGreeting('Good Morning')
    else if (hour >= 12 && hour < 18) setGreeting('Good Afternoon')
    else if (hour >= 18 && hour < 22) setGreeting('Good Evening')
    else setGreeting('Good Night')
  }, [])

  return (
    <div className="glass-card flex flex-col items-center justify-center text-center h-full">
      {/* Cat avatar on yellow circle */}
      <div className="float-animation mb-5">
        <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #fff9c4, #ffe082)', boxShadow: '0 8px 24px rgba(255,224,130,0.4)' }}>
          <img
            src={import.meta.env.BASE_URL + 'profile/头像.png'}
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.innerHTML = '<div style="font-size:40px;line-height:1">🐱</div>'
              }
            }}
          />
        </div>
      </div>

      {/* Greeting text */}
      <p className="text-sm mb-1" style={{ color: 'var(--color-secondary)' }}>{greeting}</p>
      <p className="text-lg leading-relaxed" style={{ color: 'var(--color-primary)' }}>
        {signature.split(/(\bYouyi\b)/i).map((part, i) =>
          /youyi/i.test(part) ? (
            <span key={i} className="font-bold text-xl mx-1" style={{ color: 'var(--color-brand)' }}>{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    </div>
  )
}
