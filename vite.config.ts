import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import { buildArticleIndex, buildArticleIndexToFile } from './scripts/article-data'

type NextFunction = (err?: unknown) => void

function markdownDataPlugin(): Plugin {
  return {
    name: 'markdown-data-plugin',
    async configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next: NextFunction) => {
        const requestUrl = req.url ?? '/'

        if (requestUrl === '/articles.json') {
          const articles = await buildArticleIndex()
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(articles))
          return
        }
        next()
      })
    },
    async closeBundle() {
      if (process.env.NODE_ENV === 'development') {
        return
      }

      const outDir = path.resolve(process.cwd(), 'dist')
      const articles = await buildArticleIndexToFile(path.join(outDir, 'articles.json'))
      console.log(`Generated articles index with ${articles.length} markdown articles in dist`)
    },
  }
}

export default defineConfig({
  plugins: [react(), markdownDataPlugin()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    target: 'es2019',
    cssTarget: 'safari13',
  },
  publicDir: 'public'
})
