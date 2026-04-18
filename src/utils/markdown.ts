/**
 * Convert Obsidian-style image embeds `![[filename|width]]` to standard markdown
 * `![](basePath/_附件_/filename?w=width)` so that react-markdown can render them.
 *
 * Rules:
 *  - `![[abc.png]]`            -> `![](/<base>/_附件_/abc.png)`
 *  - `![[abc.png|320]]`        -> `![](/<base>/_附件_/abc.png?w=320)`
 *  - `![[folder/x.png|200]]`   -> `![](/<base>/folder/x.png?w=200)` (explicit path kept)
 *  - Non-image wiki links `[[xxx]]` are left untouched.
 */
export function preprocessObsidianImages(markdown: string, base: string): string {
  return markdown.replace(/!\[\[([^\]]+?)\]\]/g, (_m, inner: string) => {
    const [rawPath, size] = inner.split('|').map(s => s.trim())
    const hasSlash = rawPath.includes('/')
    const relPath = hasSlash ? rawPath : `_附件_/${rawPath}`
    const url = `${base.replace(/\/$/, '')}/${relPath.split('/').map(encodeURIComponent).join('/')}`
    const widthQuery = size && /^\d+$/.test(size) ? `?w=${size}` : ''
    return `![](${url}${widthQuery})`
  })
}
