import type { AppPhase } from '../types';

interface EchoButtonProps {
  phase: AppPhase;
  disabled: boolean;
  onClick: () => void;
  progress: number; // 0-100
}

export function EchoButton({ phase, disabled, onClick, progress }: EchoButtonProps) {
  const getButtonContent = () => {
    switch (phase) {
      case 'collecting':
        return (
          <>
            <span className="text-2xl">✨</span>
            <span>回响</span>
          </>
        );
      case 'listening':
        return (
          <>
            <div className="relative w-8 h-8">
              {/* 脉动圆环 */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping opacity-30" />
              <div
                className="absolute inset-1 rounded-full border-2 border-purple-400 animate-ping opacity-20"
                style={{ animationDelay: '0.5s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg animate-pulse">🌟</span>
              </div>
            </div>
            <span>宇宙正在聆听...</span>
          </>
        );
      case 'responding':
        return (
          <>
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-lg animate-bounce">💫</span>
            </div>
            <span>生成回响中...</span>
          </>
        );
      case 'complete':
        return (
          <>
            <span className="text-2xl">🔄</span>
            <span>再次回响</span>
          </>
        );
    }
  };

  const isProcessing = phase === 'listening' || phase === 'responding';

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className={`
          relative w-full py-5 px-8 rounded-2xl font-medium text-lg
          flex items-center justify-center gap-3
          transition-all duration-300
          ${
            disabled || isProcessing
              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 animate-pulse-glow cursor-pointer'
          }
        `}
      >
        {getButtonContent()}
      </button>

      {/* 进度条 */}
      {isProcessing && (
        <div className="absolute -bottom-3 left-0 right-0 px-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-center text-xs text-gray-400">
            {Math.round(progress)}% · 请稍等片刻
          </div>
        </div>
      )}

      {/* 涟漪效果（点击时） */}
      {phase === 'listening' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border border-purple-400/50 animate-ripple" />
          <div
            className="absolute inset-0 rounded-2xl border border-purple-400/30 animate-ripple"
            style={{ animationDelay: '0.5s' }}
          />
        </div>
      )}
    </div>
  );
}
