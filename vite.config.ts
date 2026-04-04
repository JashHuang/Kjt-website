import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import { buildArticleIndex, buildArticleIndexToFile } from './scripts/article-data'

type NextFunction = (err?: unknown) => void

function generateSitemap(articles: { id: string }[], baseUrl: string): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`
  for (const article of articles) {
    xml += `  <url>\n    <loc>${baseUrl}/?id=${article.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`
  }
  xml += '</urlset>'
  return xml
}

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

      const baseUrl = process.env.SITE_URL || 'https://kjt-website.vercel.app/'
      const sitemap = generateSitemap(articles, baseUrl)
      await writeFile(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8')
      console.log(`Generated sitemap.xml with ${articles.length + 1} URLs`)
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
