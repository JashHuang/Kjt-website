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
            className="grid w-full grid-cols-1 gap-3 px-5 py-5 text-left transition-colors duration-200 hover:bg-amber-50/70 md:grid-cols-[100px_minmax(0,1.8fr)_220px] md:items-center md:gap-4 md:px-6"
          >
            <div className="flex items-center justify-between md:block">
              <span className="text-xs font-semibold tracking-[0.2em] text-amber-600 md:hidden">{convert('編號')}</span>
              <span className="text-sm text-gray-500">#{article.id}</span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold leading-relaxed text-gray-800 md:text-lg">
                  {convert(article.title)}
                </h3>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                  {convert(article.category)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                {convert(article.description)}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 md:block">
              <span className="text-xs font-semibold tracking-[0.2em] text-amber-600 md:hidden">{convert('作者')}</span>
              <span>{convert(article.author)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
