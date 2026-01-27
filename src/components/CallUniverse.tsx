import { useState, useEffect } from 'react';
import { CosmicButton } from './CosmicButton';
import type { ButtonType } from './CosmicButton';

export type CallMode = 'daily' | 'mood' | 'dream' | 'question';

interface CallUniverseProps {
  onStartCall: (mode: CallMode) => void;
  isConnected: boolean;
}

const CALL_MODES: Array<{
  id: CallMode;
  buttonType: ButtonType;
  title: string;
  subtitle: string;
}> = [
  {
    id: 'daily',
    buttonType: 'daily',
    title: '今日运势',
    subtitle: '感应宇宙能量',
  },
  {
    id: 'mood',
    buttonType: 'mood',
    title: '心情回响',
    subtitle: '与星河共鸣',
  },
  {
    id: 'dream',
    buttonType: 'dream',
    title: '梦境解析',
    subtitle: '探索潜意识',
  },
  {
    id: 'question',
    buttonType: 'question',
    title: '问问宇宙',
    subtitle: '寻找答案',
  },
];

export function CallUniverse({ onStartCall, isConnected }: CallUniverseProps) {
  const [showModes, setShowModes] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  // 呼吸灯效果
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleModeSelect = (mode: CallMode) => {
    setShowModes(false);
    onStartCall(mode);
  };

  const pulseOpacity = 0.3 + Math.sin(pulsePhase * Math.PI / 180) * 0.2;
  const pulseScale = 1 + Math.sin(pulsePhase * Math.PI / 180) * 0.03;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* 主呼叫按钮 */}
      {!showModes ? (
        <div className="flex flex-col items-center">
          {/* 连接状态 */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-gray-500'}`}>
              <div className={`w-full h-full rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : ''}`} />
            </div>
            <span className="text-gray-400 text-sm font-light tracking-wide">
              {isConnected ? '宇宙频道已连接' : '正在连接宇宙...'}
            </span>
          </div>

          {/* 中央呼叫按钮 - 使用 CosmicButton */}
          <div className="relative">
            {/* 外层光环动画 */}
            <div
              className="absolute inset-[-40px] rounded-full bg-gradient-to-br from-purple-500/20 via-indigo-500/15 to-violet-500/20 blur-2xl"
              style={{
                opacity: pulseOpacity,
                transform: `scale(${pulseScale})`,
              }}
            />
            <div
              className="absolute inset-[-25px] rounded-full bg-gradient-to-br from-purple-500/30 via-indigo-500/20 to-violet-500/30 blur-xl"
              style={{
                opacity: pulseOpacity + 0.1,
                transform: `scale(${pulseScale * 0.98})`,
              }}
            />

            <CosmicButton
              type="call"
              title="呼叫宇宙"
              subtitle="开始对话"
              onClick={() => setShowModes(true)}
              size="xl"
            />
          </div>

        </div>
      ) : (
        /* 模式选择 */
        <div className="w-full max-w-md animate-fadeIn">

          <div className="grid grid-cols-2 gap-4 px-2">
            {CALL_MODES.map((mode) => (
              <div key={mode.id} className="flex justify-center">
                <CosmicButton
                  type={mode.buttonType}
                  title={mode.title}
                  subtitle={mode.subtitle}
                  onClick={() => handleModeSelect(mode.id)}
                  size="lg"
                />
              </div>
            ))}
          </div>

          {/* 返回按钮 */}
          <button
            onClick={() => setShowModes(false)}
            className="w-full mt-6 py-2 text-gray-500 text-xs hover:text-gray-300 transition-colors"
          >
            收起
          </button>
        </div>
      )}
    </div>
  );
}
