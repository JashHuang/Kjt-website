import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ArticleCard from './components/ArticleCard';
import ArticleTable from './components/ArticleTable';
import CategoryFilter from './components/CategoryFilter';
import type { Article } from './types';
import './index.css';

const PAGE_SIZE = 20;
const ArticleModal = lazy(() => import('./components/ArticleModal'));

function shuffleArticles(items: Article[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

function App() {
  const { convert } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight * 0.01}px`);
    };

    syncAppHeight();
    window.addEventListener('resize', syncAppHeight);
    window.addEventListener('orientationchange', syncAppHeight);

    return () => {
      window.removeEventListener('resize', syncAppHeight);
      window.removeEventListener('orientationchange', syncAppHeight);
    };
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}articles.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json() as Promise<Article[]>;
      })
      .then((data) => {
        setArticles(data);
      })
      .catch((error) => {
        console.error('Failed to load article index:', error);
        setLoadFailed(true);
      });
  }, []);

  const categories = useMemo(
    () => ['全部', ...new Set(articles.map((article) => article.category))],
    [articles]
  );

  const keyword = normalizeKeyword(searchKeyword);

  const filteredArticles = useMemo(() => {
    const categoryFiltered = selectedCategory === '全部'
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

    if (!keyword) {
      return categoryFiltered;
    }

    return categoryFiltered.filter((article) =>
      [article.id, article.title, article.author, article.description, article.category]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }, [articles, keyword, selectedCategory]);

  const featuredArticles = useMemo(
    () => shuffleArticles(articles).slice(0, 5),
    [articles]
  );

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedArticles = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredArticles.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredArticles, safeCurrentPage]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, page)));
  };

  return (
    <div className="min-app-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Analytics />
      <Header />
      <Hero
        articleCount={articles.length}
        teacherCount={new Set(articles.map((article) => article.author)).size}
        categoryCount={Math.max(categories.length - 1, 0)}
      />

      <main className="container mx-auto px-4 py-10 md:py-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-800 font-chinese md:text-3xl">
            {convert('隨機精選')}
          </h2>
        </div>

        {loadFailed ? (
          <div className="glass-effect mx-auto max-w-2xl rounded-3xl p-8 text-center text-lg leading-relaxed text-gray-700">
            {convert('文章索引載入失敗，請稍後重新整理頁面再試。')}
          </div>
        ) : articles.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-5">
              {featuredArticles.map((article) => (
                <ArticleCard
                  key={`${article.sourceDir}-${article.id}`}
                  article={article}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </div>

            <section id="articles" className="mt-16 md:mt-20">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-gray-800 font-chinese md:text-3xl">
                    {convert('分類文章列表')}
                  </h2>
                  <p className="mt-3 max-w-2xl text-xl leading-relaxed text-gray-600 md:text-base">
                    {convert('以表格方式瀏覽目前典藏，切換分類或輸入關鍵字後，可快速找到想讀的文章。')}
                  </p>
                </div>
                <div className="rounded-3xl bg-amber-100/80 px-5 py-4 text-xl text-amber-800 shadow-sm md:rounded-2xl md:px-4 md:py-3 md:text-sm">
                  {convert(`共找到 ${filteredArticles.length} 篇，第 ${safeCurrentPage} / ${totalPages} 頁`)}
                </div>
              </div>

              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={(category) => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              />

              <div className="mt-6">
                <label className="block">
                  <span className="mb-3 block text-xl font-medium text-gray-700 md:mb-2 md:text-sm">{convert('關鍵字搜尋')}</span>
                  <input
                    type="search"
                    value={searchKeyword}
                    onChange={(event) => {
                      setSearchKeyword(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={convert('搜尋標題、作者、摘要或分類')}
                    className="w-full rounded-3xl border border-amber-200 bg-white/95 px-5 py-4 text-xl text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 md:rounded-2xl md:px-4 md:py-3 md:text-base"
                  />
                </label>
              </div>

              <ArticleTable
                articles={paginatedArticles}
                onArticleClick={handleArticleClick}
              />

              <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-white/80 px-5 py-5 shadow-sm md:rounded-2xl md:px-4 md:py-4 md:flex-row md:items-center md:justify-between">
                <p className="text-lg text-gray-600 md:text-sm">
                  {convert(`每頁顯示 ${PAGE_SIZE} 篇文章。`)}
                </p>
                <div className="flex flex-wrap items-center gap-3 md:gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="rounded-full border border-amber-200 px-5 py-3 text-lg font-medium text-gray-700 transition enabled:hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 md:px-4 md:py-2 md:text-sm"
                  >
                    {convert('上一頁')}
                  </button>
                  <span className="px-2 text-lg text-gray-600 md:text-sm">
                    {safeCurrentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    className="rounded-full border border-amber-200 px-5 py-3 text-lg font-medium text-gray-700 transition enabled:hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 md:px-4 md:py-2 md:text-sm"
                  >
                    {convert('下一頁')}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        <div className="mt-16 text-center">
          <div className="glass-effect mx-auto max-w-3xl rounded-3xl p-8 md:rounded-2xl">
            <h3 className="mb-4 text-3xl font-bold text-gray-800 font-chinese md:text-2xl">
              {convert('法寶流通')}
            </h3>
            <p className="mb-6 text-lg leading-relaxed text-gray-600 md:text-base">
              {convert(`目前已整理 ${articles.length} 篇文章，歡迎依分類持續翻閱更多佛學經典。`)}
            </p>
            <a
              href="#articles"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-lg font-medium text-white transition-all duration-300 shadow-lg hover:from-amber-600 hover:to-orange-600 hover:shadow-xl md:py-3 md:text-base"
            >
              <span>{convert('探索更多')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      <footer id="footer" className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-lg text-gray-400 md:text-base">
            {convert('南無阿彌陀佛')}
          </p>
          <p className="text-base text-gray-500 md:text-sm">
            {convert('願一切眾生離苦得樂，共證菩提')}
          </p>
        </div>
      </footer>

      <Suspense fallback={null}>
        <ArticleModal
          isOpen={isModalOpen}
          onClose={closeModal}
          article={selectedArticle}
        />
      </Suspense>
    </div>
  );
}

export default App;
