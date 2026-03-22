import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const projectRoot = path.resolve(__dirname, '..')
export const SOURCE_DIRS = [
  { name: 'bfnn_md', path: path.resolve(projectRoot, 'public/bfnn_md') },
  { name: 'bfnn_md2', path: path.resolve(projectRoot, 'public/bfnn_md2') },
  { name: 'bfnn_md3', path: path.resolve(projectRoot, 'public/bfnn_md3') },
]

const CATEGORY_RULES = [
  { category: '淨土法門', patterns: ['淨土', '念佛', '阿彌陀佛', '往生', '彌陀', '西方'] },
  { category: '地藏法門', patterns: ['地藏'] },
  { category: '護生善行', patterns: ['放生', '護生', '素食', '戒殺'] },
  { category: '禪修開示', patterns: ['禪', '止觀', '坐禪', '參禪', '禪修', '楞嚴'] },
  { category: '經典註釋', patterns: ['經', '疏', '鈔', '講記', '講義', '註解', '科註', '玄義'] },
]

export interface ArticleIndexItem {
  id: string
  sourceDir: string
  title: string
  author: string
  category: string
  description: string
  content: string
}

function cleanLine(line: string) {
  return line
    .replace(/\r/g, '')
    .replace(/^\s*[*#>-\d.[\]()]+\s*/, '')
    .replace(/\*\*/g, '')
    .trim()
}

function isTableOfContentsLine(line: string) {
  return /^\[.+\]\(#.+\)$/.test(line.trim())
}

function inferCategory(...inputs: string[]) {
  const corpus = inputs.join(' ')
  const match = CATEGORY_RULES.find(({ patterns }) =>
    patterns.some((pattern) => corpus.includes(pattern))
  )
  return match?.category ?? '修行指引'
}

function summarize(text: string) {
  return text.length > 72 ? `${text.slice(0, 72).trim()}...` : text
}

function isCorrupted(text: string) {
  return /[�嚙锟]/.test(text)
}

function decodeContent(buffer: Buffer) {
  const utf8 = new TextDecoder('utf-8').decode(buffer)
  if (!utf8.includes('\uFFFD')) {
    return utf8
  }
  return new TextDecoder('big5').decode(buffer)
}

function parseArticle(id: string, content: string): Omit<ArticleIndexItem, 'sourceDir'> | null {
  const rawLines = content.split('\n').map(cleanLine).filter(Boolean)
  const lines = rawLines.filter((line) => !isTableOfContentsLine(line))

  const title = lines[0] ?? `文章 ${id}`
  if (isCorrupted(title)) {
    return null
  }

  const subtitle = lines[1]?.startsWith('（') ? lines[1] : ''
  const authorIndex = subtitle ? 2 : 1
  const author = lines[authorIndex] ?? '寬覺堂整理'
  const bodyStartIndex = authorIndex + 1
  const descriptionSource =
    lines
      .slice(bodyStartIndex)
      .find((line) => line.length >= 18 && !line.startsWith('◎') && !line.startsWith('★')) ??
    `${title}${subtitle ? ` ${subtitle}` : ''}`

  return {
    id,
    title,
    author,
    category: inferCategory(title, subtitle, author, descriptionSource),
    description: summarize(descriptionSource),
    content: '',
  }
}

export async function buildArticleIndex(): Promise<ArticleIndexItem[]> {
  const articleGroups = await Promise.all(
    SOURCE_DIRS.map(async ({ name, path: sourcePath }) => {
      const entries = await readdir(sourcePath, { withFileTypes: true })
      const files = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
        .map((entry) => entry.name)
        .sort()

      const articles = await Promise.all(
        files.map(async (file) => {
          const id = path.basename(file, '.md')
          const buffer = await readFile(path.join(sourcePath, file))
          const content = decodeContent(buffer)
          const article = parseArticle(id, content)
          return article ? { ...article, sourceDir: name } : null
        })
      )

      return articles.filter(Boolean) as ArticleIndexItem[]
    })
  )

  return articleGroups.flat()
}

export async function buildArticleIndexToFile(outPath: string): Promise<ArticleIndexItem[]> {
  const articles = await buildArticleIndex()
  await writeFile(outPath, `${JSON.stringify(articles, null, 2)}\n`, 'utf8')
  return articles
}


