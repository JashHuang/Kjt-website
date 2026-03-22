import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Article } from '../types';
import ReactMarkdown from 'react-markdown';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

type ReaderTheme = 'warm' | 'paper' | 'night';
type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LineHeight = 'tight' | 'relaxed' | 'airy';

const STORAGE_KEYS = {
  theme: 'bfnn-reader-theme',
  fontSize: 'bfnn-reader-font-size',
  lineHeight: 'bfnn-reader-line-height',
} as const;

const READING_POSITION_PREFIX = 'bfnn-reading-position';

const THEME_OPTIONS: Array<{
  id: ReaderTheme;
  label: string;
  shell: string;
  header: string;
  content: string;
  title: string;
  subtitle: string;
  closeButton: string;
  footer: string;
  footerText: string;
  prose: string;
  paragraph: string;
  heading: string;
  strong: string;
  quote: string;
  link: string;
  controlIdle: string;
  controlActive: string;
}> = [
  {
    id: 'warm',
    label: '暖金',
    shell: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
    header: 'bg-white/95 border-amber-200',
    content: 'bg-transparent',
    title: 'text-gray-800',
    subtitle: 'text-amber-600',
    closeButton: 'hover:bg-amber-100 text-gray-600',
    footer: 'bg-white/95 border-amber-200',
    footerText: 'text-gray-500',
    prose: 'prose-amber',
    paragraph: 'text-gray-700',
    heading: 'text-gray-800',
    strong: 'text-amber-700',
    quote: 'border-amber-400 bg-amber-50/70 text-gray-600',
    link: 'text-amber-600 hover:text-amber-700',
    controlIdle: 'bg-white/80 text-gray-700 hover:bg-white',
    controlActive: 'bg-amber-500 text-white shadow-lg shadow-amber-500/25',
  },
  {
    id: 'paper',
    label: '紙本',
    shell: 'reader-paper-shell',
    header: 'bg-[#f3ecdf]/95 border-stone-300',
    content: 'reader-paper-surface',
    title: 'text-stone-800',
    subtitle: 'text-stone-600',
    closeButton: 'hover:bg-stone-200 text-stone-600',
    footer: 'bg-[#f3ecdf]/95 border-stone-300',
    footerText: 'text-stone-500',
    prose: 'prose-stone',
    paragraph: 'text-stone-700',
    heading: 'text-stone-800',
    strong: 'text-stone-900',
    quote: 'border-stone-400 bg-stone-100/80 text-stone-600',
    link: 'text-stone-700 hover:text-stone-900',
    controlIdle: 'bg-[#faf5ea] text-stone-700 hover:bg-[#fffaf0]',
    controlActive: 'bg-stone-700 text-[#f7f1e5] shadow-lg shadow-stone-400/20',
  },
  {
    id: 'night',
    label: '夜讀',
    shell: 'bg-slate-900',
    header: 'bg-slate-900/95 border-slate-700',
    content: 'bg-slate-900',
    title: 'text-slate-100',
    subtitle: 'text-cyan-300',
    closeButton: 'hover:bg-slate-800 text-slate-300',
    footer: 'bg-slate-900/95 border-slate-700',
    footerText: 'text-slate-400',
    prose: 'prose-invert',
    paragraph: 'text-slate-200',
    heading: 'text-slate-100',
    strong: 'text-cyan-300',
    quote: 'border-cyan-400 bg-slate-800 text-slate-300',
    link: 'text-cyan-300 hover:text-cyan-200',
    controlIdle: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
    controlActive: 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20',
  },
];

const FONT_SIZE_OPTIONS: Array<{ id: FontSize; article: string; h1: string; h2: string; h3: string; indicator: string }> = [
  { id: 'xs', article: 'text-[20px] md:text-[16px]', h1: 'text-[2.5rem] md:text-[2rem]', h2: 'text-[2.1rem] md:text-[1.6rem]', h3: 'text-[1.75rem] md:text-[1.3rem]', indicator: 'text-lg' },
  { id: 'sm', article: 'text-[24px] md:text-[18px]', h1: 'text-[3rem] md:text-[2.25rem]', h2: 'text-[2.5rem] md:text-[1.85rem]', h3: 'text-[2.1rem] md:text-[1.45rem]', indicator: 'text-xl' },
  { id: 'md', article: 'text-[30px] md:text-[22px]', h1: 'text-[3.6rem] md:text-[2.7rem]', h2: 'text-[3rem] md:text-[2.2rem]', h3: 'text-[2.4rem] md:text-[1.7rem]', indicator: 'text-2xl' },
  { id: 'lg', article: 'text-[38px] md:text-[28px]', h1: 'text-[4.4rem] md:text-[3.2rem]', h2: 'text-[3.6rem] md:text-[2.55rem]', h3: 'text-[2.9rem] md:text-[2rem]', indicator: 'text-3xl' },
  { id: 'xl', article: 'text-[48px] md:text-[34px]', h1: 'text-[5.5rem] md:text-[3.8rem]', h2: 'text-[4.5rem] md:text-[3rem]', h3: 'text-[3.5rem] md:text-[2.35rem]', indicator: 'text-4xl' },
];

const LINE_HEIGHT_OPTIONS: Array<{ id: LineHeight; label: string; article: string; paragraph: string; list: string }> = [
  { id: 'tight', label: '緊密', article: 'leading-[1.7] md:leading-8', paragraph: 'leading-[1.7] md:leading-8', list: 'space-y-2' },
  { id: 'relaxed', label: '舒適', article: 'leading-[1.95] md:leading-9', paragraph: 'leading-[1.95] md:leading-9', list: 'space-y-3' },
  { id: 'airy', label: '寬鬆', article: 'leading-[2.2] md:leading-[2.1]', paragraph: 'leading-[2.2] md:leading-[2.1]', list: 'space-y-4' },
];

function getFullscreenElement(): Element | null {
  if (typeof document === 'undefined' || !('fullscreenElement' in document)) {
    return null;
  }

  return document.fullscreenElement;
}

function supportsFullscreenApi() {
  return (
    typeof document !== 'undefined' &&
    'fullscreenElement' in document &&
    typeof document.exitFullscreen === 'function' &&
    typeof Element !== 'undefined' &&
    typeof Element.prototype.requestFullscreen === 'function'
  );
}

function canUseFullscreen(element: HTMLDivElement | null): element is HTMLDivElement & {
  requestFullscreen: () => Promise<void>;
} {
  return Boolean(
    element &&
    supportsFullscreenApi() &&
    typeof element.requestFullscreen === 'function'
  );
}

function safeStorageGet(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures on restricted mobile browsers/webviews.
  }
}

function getStoredValue<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  const storedValue = safeStorageGet(key);
  if (storedValue && allowed.includes(storedValue as T)) {
    return storedValue as T;
  }

  return fallback;
}

export default function ArticleModal({ isOpen, onClose, article }: ArticleModalProps) {
  const { convert } = useLanguage();
  const [content, setContent] = useState<string>('');
  const [loadedArticleId, setLoadedArticleId] = useState<string | null>(null);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>(() =>
    getStoredValue(STORAGE_KEYS.theme, ['warm', 'paper', 'night'] as const, 'warm')
  );
  const [fontSize, setFontSize] = useState<FontSize>(() =>
    getStoredValue(STORAGE_KEYS.fontSize, ['xs', 'sm', 'md', 'lg', 'xl'] as const, 'md')
  );
  const [lineHeight, setLineHeight] = useState<LineHeight>(() =>
    getStoredValue(STORAGE_KEYS.lineHeight, ['tight', 'relaxed', 'airy'] as const, 'relaxed')
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [showSettings, setShowSettings] = useState(true);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(-1);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const supportsFullscreen = supportsFullscreenApi();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowSettings(false);
    }
  }, []);
  const ttsStateRef = useRef({ stopped: false, chunks: [] as string[], currentIndex: 0 });

  const articleStorageKey = article ? `${READING_POSITION_PREFIX}:${article.sourceDir}:${article.id}` : null;

  const getBlocksAndChunks = () => {
    const container = contentRef.current?.querySelector('article');
    if (!container) return { validBlocks: [], chunks: [] };
    
    // 選出所有可能包含文字的區塊元素
    const elements = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote'));
    const validBlocks = elements.filter(el => el.textContent?.trim());
    const chunks = validBlocks.map(el => el.textContent?.trim() || '');
    
    return { validBlocks, chunks };
  };

  const clearTTSHighlights = () => {
    const container = contentRef.current?.querySelector('article');
    if (container) {
      container.querySelectorAll('[data-tts-active]').forEach(el => {
        (el as HTMLElement).removeAttribute('data-tts-active');
      });
    }
    setCurrentChunkIndex(-1);
  };

  // 當 currentChunkIndex 變化時，透過 DOM 操作更新高亮標示並捲動
  useEffect(() => {
    const container = contentRef.current?.querySelector('article');
    if (!container) return;

    // 清除所有舊的高亮
    container.querySelectorAll('[data-tts-active]').forEach(el => {
      (el as HTMLElement).removeAttribute('data-tts-active');
    });

    if (currentChunkIndex < 0) return;

    // 選出所有可朗讀區塊
    const elements = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote'));
    const validBlocks = elements.filter(el => el.textContent?.trim());
    const target = validBlocks[currentChunkIndex] as HTMLElement | undefined;

    if (target) {
      target.setAttribute('data-tts-active', 'true');

      // 手動計算捲動位置，以 contentRef 容器為基準居中
      const scrollContainer = contentRef.current;
      if (scrollContainer) {
        requestAnimationFrame(() => {
          const containerRect = scrollContainer.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          // 計算目標相對於捲動容器頂部的偏移，減去容器一半高度以置中
          const offset = targetRect.top - containerRect.top + scrollContainer.scrollTop - (containerRect.height / 2) + (targetRect.height / 2);
          scrollContainer.scrollTo({
            top: Math.max(0, offset),
            behavior: 'smooth',
          });
        });
      }
    }
  }, [currentChunkIndex]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      let zhVoices = availableVoices.filter(v => v.lang.includes('zh') || v.lang.includes('cmn'));
      if (zhVoices.length === 0) {
        zhVoices = availableVoices;
      }
      setVoices(zhVoices);
      
      const storedThemeVoice = safeStorageGet('bfnn-reader-voice');
      if (storedThemeVoice && zhVoices.some(v => v.voiceURI === storedThemeVoice)) {
        setSelectedVoice(storedThemeVoice);
      } else if (zhVoices.length > 0) {
        const twVoice = zhVoices.find(v => v.lang === 'zh-TW') || zhVoices[0];
        setSelectedVoice(twVoice.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (selectedVoice) {
      safeStorageSet('bfnn-reader-voice', selectedVoice);
    }
  }, [selectedVoice]);

  useEffect(() => {
    if (isOpen && article) {
      queueMicrotask(() => {
        setReadingProgress(0);
      });
      fetch(`${import.meta.env.BASE_URL}${article.sourceDir}/${article.id}.md`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.text();
        })
        .then((text) => {
          setContent(text);
          setLoadedArticleId(article.id);
        })
        .catch((err) => {
          console.error('Failed to load article:', err);
          setContent('文章內容暫時無法載入，請稍後再試。');
          setLoadedArticleId(article.id);
        });
    }
  }, [isOpen, article]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.theme, readerTheme);
  }, [readerTheme]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.fontSize, fontSize);
  }, [fontSize]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.lineHeight, lineHeight);
  }, [lineHeight]);

  useEffect(() => {
    if (!supportsFullscreen) {
      return;
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(getFullscreenElement() === modalRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [supportsFullscreen]);

  useEffect(() => {
    if (!isOpen) {
      ttsStateRef.current.stopped = true;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setIsPaused(false);
      clearTTSHighlights();
    }
    return () => {
      ttsStateRef.current.stopped = true;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      clearTTSHighlights();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!supportsFullscreen) {
      return;
    }

    if (!isOpen && getFullscreenElement() === modalRef.current) {
      void document.exitFullscreen();
    }
  }, [isOpen, supportsFullscreen]);

  useEffect(() => {
    if (!isOpen || !articleStorageKey || loadedArticleId !== article?.id) {
      return;
    }

    const container = contentRef.current;
    if (!container) {
      return;
    }

    const storedRaw = safeStorageGet(articleStorageKey);
    if (!storedRaw) {
      return;
    }

    try {
      const stored = JSON.parse(storedRaw) as { scrollTop?: number };
      const restore = () => {
        if (typeof stored.scrollTop === 'number') {
          container.scrollTop = stored.scrollTop;
        }
        const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 0);
        const nextProgress = maxScroll === 0 ? 0 : (container.scrollTop / maxScroll) * 100;
        setReadingProgress(Math.max(0, Math.min(100, nextProgress)));
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(restore);
      });
    } catch {
      return;
    }
  }, [article?.id, articleStorageKey, isOpen, loadedArticleId]);

  if (!isOpen || !article) return null;

  const isLoading = loadedArticleId !== article.id;
  const theme = THEME_OPTIONS.find((option) => option.id === readerTheme) ?? THEME_OPTIONS[0];
  const selectedFontSize = FONT_SIZE_OPTIONS.find((option) => option.id === fontSize) ?? FONT_SIZE_OPTIONS[2];
  const selectedLineHeight = LINE_HEIGHT_OPTIONS.find((option) => option.id === lineHeight) ?? LINE_HEIGHT_OPTIONS[1];
  const selectedFontIndex = FONT_SIZE_OPTIONS.findIndex((option) => option.id === selectedFontSize.id);

  const toggleFullscreen = async () => {
    if (!canUseFullscreen(modalRef.current)) {
      return;
    }

    if (getFullscreenElement() === modalRef.current) {
      await document.exitFullscreen();
      return;
    }

    await modalRef.current.requestFullscreen();
  };


  const playChunk = (index: number) => {
    if (index < 0 || index >= ttsStateRef.current.chunks.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentChunkIndex(-1);
      return;
    }
    
    ttsStateRef.current.stopped = false;
    ttsStateRef.current.currentIndex = index;
    setCurrentChunkIndex(index);
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(ttsStateRef.current.chunks[index]);
    if (selectedVoice) {
      const voice = voices.find(v => v.voiceURI === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    utterance.lang = 'zh-TW'; 
    utterance.rate = 1.0;
    
    utterance.onend = () => {
      if (ttsStateRef.current.stopped) return;
      playChunk(index + 1);
    };
    
    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.error('Speech synthesis error', e);
        setIsPlaying(false);
        setIsPaused(false);
      }
    };
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const startTTS = (fromVisible: boolean) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const { validBlocks, chunks } = getBlocksAndChunks();
    if (chunks.length === 0) return;
    
    ttsStateRef.current.chunks = chunks;
    
    let startIndex = 0;
    if (fromVisible) {
      const containerRect = contentRef.current?.getBoundingClientRect();
      if (containerRect) {
        for (let i = 0; i < validBlocks.length; i++) {
          const rect = validBlocks[i].getBoundingClientRect();
          // 找出第一個底部位置在可視範圍內的段落
          if (rect.bottom > containerRect.top + 10) {
            startIndex = i;
            break;
          }
        }
      }
    }
    
    playChunk(startIndex);
  };

  const handleTTS = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('您的瀏覽器不支援語音朗讀功能');
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    startTTS(true);
  };

  const stopTTS = () => {
    ttsStateRef.current.stopped = true;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(-1);
  };

  const nextChunk = () => {
    if (!isPlaying) return;
    ttsStateRef.current.stopped = true;
    window.speechSynthesis.cancel();
    playChunk(ttsStateRef.current.currentIndex + 1);
  };
  
  const prevChunk = () => {
    if (!isPlaying) return;
    ttsStateRef.current.stopped = true;
    window.speechSynthesis.cancel();
    playChunk(Math.max(0, ttsStateRef.current.currentIndex - 1));
  };

  const handleReaderScroll = () => {
    const container = contentRef.current;
    if (!container || !articleStorageKey) {
      return;
    }

    const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 0);
    const progress = maxScroll === 0 ? 0 : (container.scrollTop / maxScroll) * 100;
    const normalizedProgress = Math.max(0, Math.min(100, progress));

    setReadingProgress(normalizedProgress);
    safeStorageSet(
      articleStorageKey,
      JSON.stringify({
        scrollTop: container.scrollTop,
      })
    );
  };

  const renderToggleGroup = <T extends string>(
    title: string,
    value: T,
    onChange: (nextValue: T) => void,
    options: Array<{ id: T; label: string }>
  ) => (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-semibold tracking-[0.2em] md:text-xs ${theme.footerText}`}>{convert(title)}</span>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-full px-4 py-2 text-base font-medium transition md:px-3 md:py-1.5 md:text-sm ${
              value === option.id ? theme.controlActive : theme.controlIdle
            }`}
          >
            {convert(option.label)}
          </button>
        ))}
      </div>
    </div>
  );

  const stepFontSize = (direction: -1 | 1) => {
    const nextIndex = Math.min(FONT_SIZE_OPTIONS.length - 1, Math.max(0, selectedFontIndex + direction));
    setFontSize(FONT_SIZE_OPTIONS[nextIndex].id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        ref={modalRef}
        className={`relative flex w-full flex-col overflow-hidden rounded-3xl shadow-2xl ${theme.shell} ${isFullscreen ? 'max-w-none h-full max-h-none rounded-none' : 'max-w-5xl max-h-[88vh] max-h-[88svh] max-h-[88dvh]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`z-10 flex flex-shrink-0 flex-col gap-4 border-b px-4 py-4 backdrop-blur-md md:gap-3 md:px-6 md:py-4 ${theme.header}`}>
          <div className="mb-1 h-1 overflow-hidden rounded-full bg-black/6">
            <div
              className="h-full rounded-full bg-black/25 transition-[width] duration-200"
              style={{ width: `${readingProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-medium md:text-xs ${theme.subtitle}`}>#{article.id}</span>
              <h2 className={`truncate font-chinese text-2xl font-bold md:text-xl ${theme.title}`}>{convert(article.title)}</h2>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`rounded-full p-3 text-base font-medium transition md:p-2 md:text-sm ${showSettings ? theme.controlActive : theme.controlIdle}`}
                title="閱讀設定"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={onClose}
                className={`rounded-full p-3 transition-colors md:p-2 ${theme.closeButton}`}
                title="關閉"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`${showSettings ? 'flex' : 'hidden'} flex-col gap-4 pt-4 border-t border-slate-500/20`}>
            {/* TTS Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {voices.length > 0 && (
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className={`max-w-[150px] appearance-none truncate rounded-full border-none bg-transparent px-4 py-2 text-base font-medium outline-none transition sm:max-w-[170px] md:max-w-[150px] md:px-3 md:py-1.5 md:text-sm ${theme.controlIdle}`}
                  style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  title="選擇語音"
                >
                  {voices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI} className="text-gray-800 bg-white">
                      {v.name}
                    </option>
                  ))}
                </select>
              )}

              {isPlaying && (
                <button
                  type="button"
                  onClick={prevChunk}
                  className={`rounded-full px-4 py-2 text-base font-medium transition md:px-3 md:py-1.5 md:text-sm ${theme.controlIdle}`}
                  title="跳至上一段"
                >
                  上一段
                </button>
              )}

              <button
                type="button"
                onClick={handleTTS}
                className={`rounded-full px-4 py-2 text-base font-medium transition md:px-3 md:py-1.5 md:text-sm ${isPlaying && !isPaused ? theme.controlActive : theme.controlIdle}`}
              >
                {isPlaying ? (isPaused ? convert('繼續') : convert('暫停')) : convert('目前位置朗讀')}
              </button>

              {isPlaying && (
                <button
                  type="button"
                  onClick={nextChunk}
                  className={`rounded-full px-4 py-2 text-base font-medium transition md:px-3 md:py-1.5 md:text-sm ${theme.controlIdle}`}
                  title={convert('跳至下一段')}
                >
                  {convert('下一段')}
                </button>
              )}

              {isPlaying && (
                <button
                  type="button"
                  onClick={stopTTS}
                  className={`rounded-full px-4 py-2 text-base font-medium transition md:px-3 md:py-1.5 md:text-sm ${theme.controlIdle}`}
                >
                  {convert('停止')}
                </button>
              )}
            </div>

            {/* Readability Controls */}
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
              {renderToggleGroup('主題', readerTheme, setReaderTheme, THEME_OPTIONS)}
              
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold tracking-[0.2em] md:text-xs ${theme.footerText}`}>{convert('字級')}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stepFontSize(-1)}
                    disabled={selectedFontIndex === 0}
                    className={`rounded-full px-4 py-2 text-base font-medium transition disabled:cursor-not-allowed disabled:opacity-40 md:px-3 md:py-1.5 md:text-sm ${theme.controlIdle}`}
                  >
                    -
                  </button>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full md:h-8 md:w-8 ${theme.controlActive}`}>
                    <span className={`font-bold leading-none ${selectedFontSize.indicator}`}>A</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => stepFontSize(1)}
                    disabled={selectedFontIndex === FONT_SIZE_OPTIONS.length - 1}
                    className={`rounded-full px-4 py-2 text-base font-medium transition disabled:cursor-not-allowed disabled:opacity-40 md:px-3 md:py-1.5 md:text-sm ${theme.controlIdle}`}
                  >
                    +
                  </button>
                </div>
              </div>

              {renderToggleGroup('行距', lineHeight, setLineHeight, LINE_HEIGHT_OPTIONS)}

              {supportsFullscreen && (
                <button
                  type="button"
                  onClick={() => void toggleFullscreen()}
                  className={`self-start rounded-full px-4 py-2 text-base font-medium transition lg:self-auto md:px-3 md:py-1.5 md:text-sm ${isFullscreen ? theme.controlActive : theme.controlIdle}`}
                >
                  {isFullscreen ? convert('離開全螢幕') : convert('全螢幕')}
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          onScroll={handleReaderScroll}
          className={`flex-1 overflow-y-auto p-5 md:p-8 ${theme.content}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent" />
            </div>
          ) : (
            <article className={`prose prose-lg max-w-none font-chinese ${theme.prose} ${selectedFontSize.article} ${selectedLineHeight.article}`}>
              <style>{`
                [data-tts-active="true"] {
                  background-color: ${readerTheme === 'night' ? 'rgba(34, 211, 238, 0.15)' : 'rgba(245, 158, 11, 0.15)'} !important;
                  border-left: 4px solid ${readerTheme === 'night' ? '#22d3ee' : '#f59e0b'} !important;
                  padding-left: 1rem !important;
                  margin-left: -1rem !important;
                  border-radius: 0 0.5rem 0.5rem 0 !important;
                  transition: all 0.3s ease !important;
                }
              `}</style>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className={`mb-6 mt-8 font-bold ${theme.heading} ${selectedFontSize.h1}`}>{children}</h1>,
                  h2: ({ children }) => <h2 className={`mb-4 mt-8 font-bold ${theme.heading} ${selectedFontSize.h2}`}>{children}</h2>,
                  h3: ({ children }) => <h3 className={`mb-3 mt-6 font-bold ${theme.heading} ${selectedFontSize.h3}`}>{children}</h3>,
                  p: ({ children }) => <p className={`mb-4 ${theme.paragraph} ${selectedLineHeight.paragraph}`}>{children}</p>,
                  strong: ({ children }) => <strong className={`font-bold ${theme.strong}`}>{children}</strong>,
                  ul: ({ children }) => <ul className={`mb-4 list-disc list-inside ${theme.paragraph} ${selectedLineHeight.list}`}>{children}</ul>,
                  ol: ({ children }) => <ol className={`mb-4 list-decimal list-inside ${theme.paragraph} ${selectedLineHeight.list}`}>{children}</ol>,
                  li: ({ children }) => <li className={`${theme.paragraph} ${selectedLineHeight.paragraph}`}>{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className={`my-4 rounded-r-lg border-l-4 py-3 pl-4 italic ${theme.quote}`}>
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className={`underline ${theme.link}`} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {convert(content)}
              </ReactMarkdown>
            </article>
          )}
        </div>

        <div className={`flex flex-shrink-0 items-center justify-between border-t px-4 py-4 backdrop-blur-md md:px-6 ${theme.footer}`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 transition-colors ${theme.footerText}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{convert('返回列表')}</span>
          </button>
          <div className={`flex items-center gap-2 text-base md:text-sm ${theme.footerText}`}>
            <span>{isFullscreen ? convert('按 Esc 可離開全螢幕') : convert(`已閱讀 ${Math.round(readingProgress)}%`)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
