import type { AppPhase } from '../types';

interface EchoButtonProps {
  phase: AppPhase;
  disabled: boolean;
  onClick: () => void;
  progress: number;
}

export function EchoButton({ phase, disabled, onClick, progress }: EchoButtonProps) {
  const getButtonContent = () => {
    switch (phase) {
      case 'collecting':
        return (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-amber-400/50" />
            </div>
            <span className="tracking-[0.15em] sm:tracking-widest text-sm sm:text-base font-light">感应回响</span>
          </div>
        );
      case 'listening':
        return (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-spin" style={{ borderTopColor: 'transparent' }} />
            </div>
            <span className="tracking-wider text-sm sm:text-base font-light">聆听中...</span>
          </div>
        );
      case 'responding':
        return (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <div className="absolute inset-0 rounded-full bg-cyan-400/50 animate-pulse" />
            </div>
            <span className="tracking-wider text-sm sm:text-base font-light">生成中...</span>
          </div>
        );
      case 'complete':
        return (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400/30 flex items-center justify-center">
              <span className="text-[10px] sm:text-xs">↻</span>
            </div>
            <span className="tracking-[0.15em] sm:tracking-widest text-sm sm:text-base font-light">再次感应</span>
          </div>
        );
    }
  };

  const isProcessing = phase === 'listening' || phase === 'responding';

  return (
    <div className="relative">
      {/* 主按钮 */}
      <button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className={`
          relative w-full py-4 sm:py-5 px-6 sm:px-8 rounded-lg sm:rounded-xl font-medium
          flex items-center justify-center
          transition-all duration-300
          active:scale-[0.98]
          ${
            disabled || isProcessing
              ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700/50'
              : 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 text-amber-100 cursor-pointer hover:from-amber-900/40 hover:to-orange-900/40'
          }
        `}
      >
        {/* 角落装饰 */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 sm:w-3 sm:h-3 border-l-2 border-t-2 border-amber-400/50" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 border-r-2 border-t-2 border-amber-400/50" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 sm:w-3 sm:h-3 border-l-2 border-b-2 border-amber-400/50" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 border-r-2 border-b-2 border-amber-400/50" />

        {getButtonContent()}
      </button>

      {/* 进度条 */}
      {isProcessing && (
        <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 font-light">
            <span>与宇宙连接中</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* 波纹效果 */}
      {phase === 'listening' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-lg sm:rounded-xl border border-amber-400/30 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
      )}
    </div>
  );
}
