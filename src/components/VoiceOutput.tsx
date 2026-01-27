import { useState, useEffect, useCallback } from 'react';

interface VoiceOutputProps {
  text: string;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

export function VoiceOutput({ text, autoPlay = false, onStart, onEnd }: VoiceOutputProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(() => {
    if (!isSupported || !text) return;

    // 停止当前播放
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    // 尝试使用更自然的中文语音
    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(v =>
      v.lang.includes('zh') && (v.name.includes('Female') || v.name.includes('Tingting') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.includes('zh'));

    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, isSupported, onStart, onEnd]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  // 自动播放
  useEffect(() => {
    if (autoPlay && text && isSupported) {
      // 延迟一点让UI先渲染
      const timer = setTimeout(speak, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, text, isSupported, speak]);

  // 组件卸载时停止
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3">
      {!isSpeaking ? (
        <button
          onClick={speak}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30
            hover:bg-purple-500/30 transition-colors text-purple-200 text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <span>聆听宇宙的声音</span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {/* 音频波形动画 */}
          <div className="flex items-center gap-1 px-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-purple-400 rounded-full animate-pulse"
                style={{
                  height: `${12 + Math.random() * 12}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.5s',
                }}
              />
            ))}
          </div>

          {/* 暂停/继续 */}
          <button
            onClick={isPaused ? resume : pause}
            className="p-2 rounded-full bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 transition-colors"
          >
            {isPaused ? (
              <svg className="w-4 h-4 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            )}
          </button>

          {/* 停止 */}
          <button
            onClick={stop}
            className="p-2 rounded-full bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 transition-colors"
          >
            <svg className="w-4 h-4 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
