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
        <h1 className="mb-5 font-chinese text-6xl font-bold leading-tight text-gray-800 md:mb-6 md:text-7xl">
          <span className="text-amber-700 md:bg-clip-text md:text-transparent md:bg-gradient-to-r md:from-amber-600 md:to-orange-500">
            {convert('佛法如燈')}
          </span>
          <br />
          <span className="text-[2.8rem] md:text-5xl">{convert('照破千年暗')}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl font-chinese text-2xl leading-relaxed text-gray-600 md:mb-12 md:text-2xl">
          {convert('精選歷代高僧大德珍貴開示')}
          <br className="hidden md:block" />
          {convert('願有緣者皆能得益，同登覺岸')}
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a 
            href="#articles"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-9 py-5 text-xl font-medium text-white transition-all duration-300 shadow-xl hover:from-amber-600 hover:to-orange-600 hover:shadow-2xl hover:-translate-y-1 md:px-8 md:py-4 md:text-lg"
          >
            <span>{convert('開始探索')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 md:mt-16 md:gap-8">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-amber-600 md:text-5xl">{articleCount}</div>
            <div className="text-base text-gray-600 md:text-base">{convert('文章總數')}</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-amber-600 md:text-5xl">{teacherCount}</div>
            <div className="text-base text-gray-600 md:text-base">{convert('法師開示')}</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-amber-600 md:text-5xl">{categoryCount}</div>
            <div className="text-base text-gray-600 md:text-base">{convert('法門分類')}</div>
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
