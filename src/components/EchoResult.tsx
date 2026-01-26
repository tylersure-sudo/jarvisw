import { useState } from 'react';
import type { EchoResponse } from '../types';

interface EchoResultProps {
  echo: EchoResponse;
  onReset: () => void;
}

export function EchoResult({ echo, onReset }: EchoResultProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '来自宇宙的回响',
          text: echo.story,
        });
      } catch {
        // 用户取消分享
      }
    } else {
      await navigator.clipboard.writeText(echo.story);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 标题 */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs text-cyan-300 font-mono tracking-wider uppercase">Echo Received</span>
        </div>
      </div>

      {/* 翻转卡片容器 */}
      <div
        className="relative aspect-[3/4] cursor-pointer flip-card touch-manipulation"
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        aria-label={isFlipped ? '点击查看图片' : '点击查看故事'}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsFlipped(!isFlipped)}
      >
        <div
          className="relative w-full h-full flip-card-inner"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* 正面 - 图片 */}
          <div
            className="absolute inset-0 flip-card-front rounded-xl sm:rounded-2xl overflow-hidden"
          >
            <div className="relative w-full h-full glass-card">
              {/* 加载状态 */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
                  </div>
                  <span className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 font-mono">LOADING IMAGE...</span>
                </div>
              )}

              {/* 错误状态 */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">!</span>
                  </div>
                  <span className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">Signal Lost</span>
                </div>
              )}

              {/* 图片 */}
              {!imageError && (
                <img
                  src={echo.imageUrl}
                  alt="宇宙的回响"
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  loading="lazy"
                  decoding="async"
                />
              )}

              {/* 图片叠加层 */}
              {imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  {/* 点击提示 */}
                  <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center">
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                      <span className="text-[10px] sm:text-xs text-gray-300 font-mono">TAP TO REVEAL STORY</span>
                      <span className="animate-bounce text-sm">↻</span>
                    </div>
                  </div>

                  {/* 扫描线效果 */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                      style={{
                        animation: 'scan-line 3s linear infinite',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 边框装饰 */}
              <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 border-l-2 border-t-2 border-cyan-400/50" />
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 border-r-2 border-t-2 border-cyan-400/50" />
              <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 border-l-2 border-b-2 border-cyan-400/50" />
              <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 border-r-2 border-b-2 border-cyan-400/50" />
            </div>
          </div>

          {/* 背面 - 故事 */}
          <div
            className="absolute inset-0 flip-card-back rounded-xl sm:rounded-2xl overflow-hidden"
            style={{
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="relative w-full h-full glass-card p-4 sm:p-6 overflow-y-auto">
              {/* 背景装饰 */}
              <div className="absolute inset-0 data-bg opacity-30" />

              {/* 故事内容 */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400" />
                  <span className="text-[10px] sm:text-xs text-cyan-400 font-mono tracking-wider uppercase">Cosmic Message</span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {echo.story.split('\n\n').map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-200 text-xs sm:text-sm leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* 时间戳 */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 font-mono">
                    <span>TIMESTAMP</span>
                    <span>{echo.generatedAt.toLocaleString('zh-CN')}</span>
                  </div>
                </div>

                {/* 点击提示 */}
                <div className="mt-3 sm:mt-4 flex justify-center">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <span className="text-[10px] sm:text-xs text-gray-400">TAP TO VIEW IMAGE</span>
                  </div>
                </div>
              </div>

              {/* 边框装饰 */}
              <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 border-l-2 border-t-2 border-cyan-400/50" />
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 border-r-2 border-t-2 border-cyan-400/50" />
              <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 border-l-2 border-b-2 border-cyan-400/50" />
              <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 border-r-2 border-b-2 border-cyan-400/50" />
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); handleShare(); }}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl glass-card text-gray-300 hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-mono"
        >
          <span>↗</span>
          <span>SHARE</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onReset(); }}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl sci-fi-btn text-cyan-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-mono"
        >
          <span>↻</span>
          <span>NEW ECHO</span>
        </button>
      </div>
    </div>
  );
}
