import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FolderGit2, ChevronLeft, ArrowUpRight } from 'lucide-react'
import projectFiles from 'virtual:projects-manifest'

interface ProjectItem {
  name: string
  path: string
}

function buildProjects(files: string[]): ProjectItem[] {
  return files.map(f => ({
    name: f.replace(/\.md$/i, ''),
    path: `/projects/${encodeURIComponent(f)}`,
  }))
}

export default function ProjectsSection() {
  const projects = useMemo(() => buildProjects(projectFiles), [])
  const [selected, setSelected] = useState<ProjectItem | null>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selected) { setContent(''); return }
    let cancelled = false
    setLoading(true)
    fetch(selected.path)
      .then(res => {
        if (!res.ok) throw new Error('not found')
        return res.text()
      })
      .then(text => { if (!cancelled) { setContent(text); setLoading(false) } })
      .catch(() => { if (!cancelled) { setContent('> 项目文件未找到。'); setLoading(false) } })
    return () => { cancelled = true }
  }, [selected])

  return (
    <section className="max-w-[1200px] mx-auto mt-12 px-4 sm:px-6">
      <div className="flex items-center gap-2 mb-5">
        <FolderGit2 size={20} style={{ color: 'var(--color-brand)' }} />
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>项目展示</h2>
        <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(53,191,171,0.15)', color: 'var(--color-brand)' }}>
          {projects.length}
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card text-center py-8" style={{ padding: '32px 16px' }}>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
            暂无项目，请将 <code>.md</code> 文件放入 <code>public/projects/</code>
          </p>
        </div>
      ) : selected ? (
        // Expanded single-project view — replaces the grid while keeping page layout above unchanged
        <div className="glass-card project-expanded" style={{ padding: '28px 32px', borderRadius: 28 }}>
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setSelected(null)}
              className="p-2 rounded-xl transition-colors flex items-center gap-1.5"
              style={{ backgroundColor: 'rgba(53,191,171,0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(53,191,171,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(53,191,171,0.1)')}
            >
              <ChevronLeft size={16} style={{ color: 'var(--color-brand)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>返回</span>
            </button>
            <FolderGit2 size={18} style={{ color: 'var(--color-brand)' }} />
            <span className="text-lg font-semibold truncate" style={{ color: 'var(--color-primary)' }}>{selected.name}</span>
          </div>
          <div className="markdown-body">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-brand)', borderTopColor: 'transparent' }} />
              </div>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelected(p)}
              className="glass-card project-card text-left group"
              style={{ padding: '20px 22px', borderRadius: 24, animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(53,191,171,0.15)' }}>
                  <FolderGit2 size={18} style={{ color: 'var(--color-brand)' }} />
                </div>
                <ArrowUpRight size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-brand)' }} />
              </div>
              <h3 className="text-base font-semibold truncate" style={{ color: 'var(--color-primary)' }}>{p.name}</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--color-secondary)' }}>点击查看详情</p>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
