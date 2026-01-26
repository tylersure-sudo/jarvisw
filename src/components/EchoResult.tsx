import { useState } from 'react';
import type { EchoResponse } from '../types';

interface EchoResultProps {
  echo: EchoResponse;
  onReset: () => void;
}

export function EchoResult({ echo, onReset }: EchoResultProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
      // 复制到剪贴板
      await navigator.clipboard.writeText(echo.story);
      alert('故事已复制到剪贴板');
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = echo.imageUrl;
    link.download = `echo-${Date.now()}.jpg`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 标题 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium text-purple-200">
          ✨ 宇宙的回响
        </h2>
        <p className="text-sm text-gray-400">
          生成于 {echo.generatedAt.toLocaleTimeString('zh-CN')}
        </p>
      </div>

      {/* 图片 */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400">画面显现中...</span>
            </div>
          </div>
        )}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
            <div className="text-center space-y-2">
              <span className="text-4xl">🌌</span>
              <p className="text-sm text-gray-400">图像在星际中迷失了...</p>
            </div>
          </div>
        ) : (
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
      </div>

      {/* 故事 */}
      <div className="glass-card rounded-2xl p-6">
        <div className="prose prose-invert max-w-none">
          {echo.story.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-gray-200 leading-relaxed mb-4 last:mb-0"
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <span>📤</span>
          <span>分享</span>
        </button>
        <button
          onClick={handleDownloadImage}
          className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <span>💾</span>
          <span>保存图片</span>
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600/50 to-indigo-600/50 border border-purple-400/30 text-white hover:from-purple-600/70 hover:to-indigo-600/70 transition-colors flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          <span>再次回响</span>
        </button>
      </div>
    </div>
  );
}
