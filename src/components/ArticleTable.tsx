import { useLanguage } from '../contexts/LanguageContext';
import type { Article } from '../types';

interface ArticleTableProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export default function ArticleTable({ articles, onArticleClick }: ArticleTableProps) {
  const { convert } = useLanguage();
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-amber-100 bg-white/95 shadow-xl shadow-amber-100/40 md:bg-white/85 md:backdrop-blur-sm">
      <div className="hidden md:grid grid-cols-[100px_minmax(0,1.8fr)_220px] gap-4 border-b border-amber-100 bg-gradient-to-r from-amber-100/80 via-orange-50 to-yellow-50 px-6 py-4 text-sm font-semibold text-gray-700">
        <span>{convert('編號')}</span>
        <span>{convert('文章標題')}</span>
        <span>{convert('作者')}</span>
      </div>

      <div className="divide-y divide-amber-100/80">
        {articles.map((article) => (
          <button
            key={`${article.sourceDir}-${article.id}`}
            type="button"
            onClick={() => onArticleClick(article)}
            className="grid w-full grid-cols-1 gap-4 px-6 py-6 text-left transition-colors duration-200 hover:bg-amber-50/70 md:grid-cols-[100px_minmax(0,1.8fr)_220px] md:items-center md:gap-4 md:px-6 md:py-5"
          >
            <div className="flex items-center justify-between md:block">
              <span className="text-sm font-semibold tracking-[0.2em] text-amber-600 md:hidden">{convert('編號')}</span>
              <span className="text-lg text-gray-500 md:text-sm">#{article.id}</span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 md:gap-2">
                <h3 className="text-2xl font-semibold leading-relaxed text-gray-800 md:text-lg">
                  {convert(article.title)}
                </h3>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 md:px-2.5 md:py-1 md:text-xs">
                  {convert(article.category)}
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-lg leading-relaxed text-gray-600 md:mt-2 md:line-clamp-2 md:text-sm">
                {convert(article.description)}
              </p>
            </div>

            <div className="flex items-center justify-between text-base text-gray-600 md:block md:text-sm">
              <span className="text-sm font-semibold tracking-[0.2em] text-amber-600 md:hidden">{convert('作者')}</span>
              <span>{convert(article.author)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
