import { useLanguage } from '../contexts/LanguageContext';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  '禪修開示': 'from-emerald-500 to-teal-500',
  '淨土法門': 'from-purple-500 to-indigo-500',
  '經典註釋': 'from-blue-500 to-cyan-500',
  '修行指引': 'from-rose-500 to-pink-500',
  '地藏法門': 'from-amber-500 to-yellow-500',
  '護生善行': 'from-green-500 to-emerald-500',
};

export default function ArticleCard({ article, onClick }: ArticleCardProps) {
  const { convert } = useLanguage();
  const gradientColor = categoryColors[article.category] || 'from-gray-500 to-gray-600';

  return (
    <article 
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border border-white/50 bg-white/92 shadow-lg transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl md:bg-white/80 md:backdrop-blur-sm"
    >
      <div className={`h-2 bg-gradient-to-r ${gradientColor}`} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r ${gradientColor}`}>
            {convert(article.category)}
          </span>
          <span className="text-sm text-gray-400">#{article.id}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 font-chinese leading-relaxed group-hover:text-amber-600 transition-colors">
          {convert(article.title)}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {convert(article.description)}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {article.author.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-gray-600 font-medium">{convert(article.author)}</span>
          </div>
          
          <div className="flex items-center gap-1 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-medium">{convert('閱讀全文')}</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="h-0 group-hover:h-16 transition-all duration-500 bg-gradient-to-t from-amber-50/50 to-transparent" />
    </article>
  );
}
