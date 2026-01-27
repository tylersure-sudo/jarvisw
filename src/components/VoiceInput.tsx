import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API 类型声明
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onListeningChange: (isListening: boolean) => void;
  isActive: boolean;
}

export function VoiceInput({ onTranscript, onListeningChange, isActive }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // 检查浏览器支持
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // 初始化语音识别
  useEffect(() => {
    if (!isSupported) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition: ISpeechRecognition = new SpeechRecognitionAPI();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      onListeningChange(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;

      setTranscript(text);

      if (result.isFinal) {
        onTranscript(text);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error === 'no-speech' ? '没有检测到语音' : '语音识别出错');
      setIsListening(false);
      onListeningChange(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      onListeningChange(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, onTranscript, onListeningChange]);

  // 开始/停止监听
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
  }, [isListening]);

  // 根据 isActive 自动控制
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isActive && !isListening) {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (_e) {
        // 可能已经在运行
      }
    } else if (!isActive && isListening) {
      recognitionRef.current.stop();
    }
  }, [isActive, isListening]);

  if (!isSupported) {
    return (
      <div className="text-center text-gray-500 text-sm">
        您的浏览器不支持语音输入
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* 语音按钮 */}
      <button
        onClick={toggleListening}
        className={`relative w-20 h-20 rounded-full transition-all duration-500
          ${isListening
            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 scale-110'
            : 'bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border border-purple-400/30'
          }
          flex items-center justify-center
        `}
      >
        {/* 脉冲效果 */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
            <div className="absolute inset-[-8px] rounded-full border-2 border-purple-400/50 animate-pulse" />
            <div className="absolute inset-[-16px] rounded-full border border-purple-400/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </>
        )}

        {/* 麦克风图标 */}
        <svg
          className={`w-8 h-8 transition-colors ${isListening ? 'text-white' : 'text-purple-300'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      </button>

      {/* 状态提示 */}
      <div className="mt-4 text-center">
        {isListening ? (
          <p className="text-purple-300 text-sm animate-pulse">正在聆听...</p>
        ) : (
          <p className="text-gray-500 text-sm">轻触开始说话</p>
        )}
      </div>

      {/* 实时转写 */}
      {transcript && (
        <div className="mt-3 px-4 py-2 bg-white/5 rounded-lg max-w-xs">
          <p className="text-white/80 text-sm text-center">{transcript}</p>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <p className="mt-2 text-red-400/80 text-xs">{error}</p>
      )}
    </div>
  );
}
