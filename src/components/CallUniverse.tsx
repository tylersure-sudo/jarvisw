import { useState, useEffect } from 'react';

export type CallMode = 'daily' | 'mood' | 'dream' | 'question';

interface CallUniverseProps {
  onStartCall: (mode: CallMode) => void;
  isConnected: boolean;
}

const CALL_MODES = [
  {
    id: 'daily' as CallMode,
    title: '今日运势',
    subtitle: '让宇宙告诉你今天的能量',
    icon: '☀️',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-400/30',
  },
  {
    id: 'mood' as CallMode,
    title: '心情回响',
    subtitle: '分享你的感受，获得宇宙回应',
    icon: '💫',
    color: 'from-purple-400 to-indigo-500',
    bgColor: 'from-purple-500/10 to-indigo-500/10',
    borderColor: 'border-purple-400/30',
  },
  {
    id: 'dream' as CallMode,
    title: '梦境解析',
    subtitle: '解读潜意识的信息',
    icon: '🌙',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-400/30',
  },
  {
    id: 'question' as CallMode,
    title: '问问宇宙',
    subtitle: '向宇宙提出你的疑问',
    icon: '✨',
    color: 'from-rose-400 to-pink-500',
    bgColor: 'from-rose-500/10 to-pink-500/10',
    borderColor: 'border-rose-400/30',
  },
];

export function CallUniverse({ onStartCall, isConnected }: CallUniverseProps) {
  const [, setSelectedMode] = useState<CallMode | null>(null);
  const [showModes, setShowModes] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  // 呼吸灯效果
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleModeSelect = (mode: CallMode) => {
    setSelectedMode(mode);
    setShowModes(false);
    onStartCall(mode);
  };

  const pulseOpacity = 0.3 + Math.sin(pulsePhase * Math.PI / 180) * 0.2;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* 主呼叫按钮 */}
      {!showModes ? (
        <div className="flex flex-col items-center">
          {/* 连接状态 */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-gray-500'} animate-pulse`} />
            <span className="text-gray-400 text-sm">
              {isConnected ? '已连接宇宙' : '等待连接...'}
            </span>
          </div>

          {/* 中央呼叫按钮 */}
          <button
            onClick={() => setShowModes(true)}
            className="relative group"
          >
            {/* 外层光环 */}
            <div
              className="absolute inset-[-30px] rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 blur-xl transition-all duration-500 group-hover:scale-110"
              style={{ opacity: pulseOpacity }}
            />
            <div
              className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 blur-lg transition-all duration-500 group-hover:scale-105"
              style={{ opacity: pulseOpacity + 0.1 }}
            />

            {/* 主按钮 */}
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700
              flex items-center justify-center shadow-2xl
              transition-all duration-300 group-hover:scale-105 group-active:scale-95
              border border-purple-400/30"
            >
              {/* 内部装饰 */}
              <div className="absolute inset-2 rounded-full border border-purple-300/20" />
              <div className="absolute inset-4 rounded-full border border-purple-300/10" />

              {/* 图标和文字 */}
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-1">🌌</span>
                <span className="text-white/90 text-sm font-light tracking-wider">呼叫宇宙</span>
              </div>
            </div>
          </button>

          {/* 提示文字 */}
          <p className="mt-8 text-gray-500 text-sm text-center max-w-xs">
            轻触按钮，开始与宇宙对话
          </p>
        </div>
      ) : (
        /* 模式选择 */
        <div className="w-full max-w-sm animate-fadeIn">
          <h3 className="text-center text-gray-300 text-lg font-light mb-6">
            你想和宇宙聊些什么？
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {CALL_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode.id)}
                className={`relative p-4 rounded-2xl bg-gradient-to-br ${mode.bgColor}
                  border ${mode.borderColor}
                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                  group overflow-hidden`}
              >
                {/* 悬停光效 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative flex flex-col items-center text-center">
                  <span className="text-3xl mb-2">{mode.icon}</span>
                  <span className="text-white/90 text-sm font-medium">{mode.title}</span>
                  <span className="text-gray-500 text-[10px] mt-1">{mode.subtitle}</span>
                </div>
              </button>
            ))}
          </div>

          {/* 返回按钮 */}
          <button
            onClick={() => setShowModes(false)}
            className="w-full mt-4 py-3 text-gray-500 text-sm hover:text-gray-300 transition-colors"
          >
            返回
          </button>
        </div>
      )}
    </div>
  );
}
