import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, existsSync, Dirent } from 'fs'
import { join } from 'path'

function scanDir(dir: string, matcher: (f: string) => boolean): string[] {
  const full = join(process.cwd(), dir)
  if (!existsSync(full)) return []
  try {
    return readdirSync(full, { withFileTypes: true })
      .filter((e: Dirent) => e.isFile() && matcher(e.name))
      .map((e: Dirent) => e.name)
      .sort()
  } catch {
    return []
  }
}

function publicManifestPlugin(): Plugin {
  const virtualPrefix = '\0'
  const map: Record<string, () => string[]> = {
    'virtual:notes-manifest': () =>
      scanDir('public/notes', f => f.toLowerCase().endsWith('.md')),
    'virtual:music-manifest': () =>
      scanDir('public/music', f => /\.(mp3|flac|wav|ogg|m4a)$/i.test(f)),
    'virtual:projects-manifest': () =>
      scanDir('public/projects', f => f.toLowerCase().endsWith('.md')),
    'virtual:album-manifest': () =>
      scanDir('public/album', f => /\.(jpe?g|png|gif|webp|avif|bmp)$/i.test(f)),
  }

  return {
    name: 'public-manifest-virtual',
    resolveId(id) {
      if (id in map) return virtualPrefix + id
      return null
    },
    load(id) {
      if (!id.startsWith(virtualPrefix)) return null
      const key = id.slice(virtualPrefix.length)
      if (key in map) {
        const files = map[key]()
        return `export default ${JSON.stringify(files)}`
      }
      return null
    },
    configureServer(server) {
      // Invalidate virtual modules and trigger full reload when files change
      const watched = ['public/notes', 'public/music', 'public/projects', 'public/album']
      watched.forEach(d => server.watcher.add(join(process.cwd(), d)))
      const handler = (file: string) => {
        const norm = file.replace(/\\/g, '/')
        if (watched.some(d => norm.includes('/' + d + '/') || norm.endsWith('/' + d))) {
          for (const key of Object.keys(map)) {
            const mod = server.moduleGraph.getModuleById(virtualPrefix + key)
            if (mod) server.moduleGraph.invalidateModule(mod)
          }
          server.ws.send({ type: 'full-reload' })
        }
      }
      server.watcher.on('add', handler)
      server.watcher.on('unlink', handler)
    },
  }
}

export default defineConfig({
  plugins: [react(), publicManifestPlugin()],
  assetsInclude: ['**/*.mp3', '**/*.flac', '**/*.wav', '**/*.ogg'],
})
