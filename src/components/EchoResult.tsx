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
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs text-cyan-300 font-mono tracking-wider uppercase">Echo Received</span>
        </div>
      </div>

      {/* 翻转卡片容器 */}
      <div
        className="relative aspect-[3/4] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '1000px' }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* 正面 - 图片 */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="relative w-full h-full glass-card">
              {/* 加载状态 */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
                  </div>
                  <span className="mt-4 text-sm text-gray-400 font-mono">LOADING IMAGE...</span>
                </div>
              )}

              {/* 错误状态 */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-2xl">!</span>
                  </div>
                  <span className="mt-4 text-sm text-gray-400">Signal Lost</span>
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
                />
              )}

              {/* 图片叠加层 */}
              {imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  {/* 点击提示 */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                      <span className="text-xs text-gray-300 font-mono">TAP TO REVEAL STORY</span>
                      <span className="animate-bounce">↻</span>
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
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/50" />
              <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400/50" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400/50" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400/50" />
            </div>
          </div>

          {/* 背面 - 故事 */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="relative w-full h-full glass-card p-6 overflow-y-auto">
              {/* 背景装饰 */}
              <div className="absolute inset-0 data-bg opacity-30" />

              {/* 故事内容 */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs text-cyan-400 font-mono tracking-wider uppercase">Cosmic Message</span>
                </div>

                <div className="space-y-4">
                  {echo.story.split('\n\n').map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-200 text-sm leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* 时间戳 */}
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>TIMESTAMP</span>
                    <span>{echo.generatedAt.toLocaleString('zh-CN')}</span>
                  </div>
                </div>

                {/* 点击提示 */}
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <span className="text-xs text-gray-400">TAP TO VIEW IMAGE</span>
                  </div>
                </div>
              </div>

              {/* 边框装饰 */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/50" />
              <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400/50" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400/50" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400/50" />
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 py-3 px-4 rounded-xl glass-card text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-mono"
        >
          <span>↗</span>
          <span>SHARE</span>
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 px-4 rounded-xl sci-fi-btn text-cyan-100 flex items-center justify-center gap-2 text-sm font-mono"
        >
          <span>↻</span>
          <span>NEW ECHO</span>
        </button>
      </div>
    </div>
  );
}
