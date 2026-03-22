import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  articleCount: number;
  teacherCount: number;
  categoryCount: number;
}

export default function Hero({ articleCount, teacherCount, categoryCount }: HeroProps) {
  const { convert } = useLanguage();
  return (
    <section id="home" className="min-app-screen relative flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-orange-100/50 to-yellow-100/50" />

      <div className="absolute top-20 left-10 hidden h-72 w-72 rounded-full bg-amber-300/20 blur-3xl md:block" />
      <div className="absolute bottom-20 right-10 hidden h-96 w-96 rounded-full bg-orange-300/20 blur-3xl md:block" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 font-chinese leading-tight">
          <span className="text-amber-700 md:bg-clip-text md:text-transparent md:bg-gradient-to-r md:from-amber-600 md:to-orange-500">
            {convert('佛法如燈')}
          </span>
          <br />
          <span className="text-4xl md:text-5xl">{convert('照破千年暗')}</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 font-chinese leading-relaxed">
          {convert('精選歷代高僧大德珍貴開示')}
          <br className="hidden md:block" />
          {convert('願有緣者皆能得益，同登覺岸')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#articles"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-medium text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <span>{convert('開始探索')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">{articleCount}</div>
            <div className="text-gray-600">{convert('文章總數')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">{teacherCount}</div>
            <div className="text-gray-600">{convert('法師開示')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">{categoryCount}</div>
            <div className="text-gray-600">{convert('法門分類')}</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce md:block">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
