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
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-cyan-400/50" />
            </div>
            <span className="tracking-widest">ECHO</span>
          </div>
        );
      case 'listening':
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-spin" style={{ borderTopColor: 'transparent' }} />
            </div>
            <span className="tracking-wider">LISTENING...</span>
          </div>
        );
      case 'responding':
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full bg-cyan-400/50 animate-pulse" />
            </div>
            <span className="tracking-wider">GENERATING...</span>
          </div>
        );
      case 'complete':
        return (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-400/30 flex items-center justify-center">
              <span className="text-xs">↻</span>
            </div>
            <span className="tracking-widest">ECHO AGAIN</span>
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
          relative w-full py-5 px-8 rounded-xl font-medium text-base uppercase
          flex items-center justify-center
          transition-all duration-300
          ${
            disabled || isProcessing
              ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700/50'
              : 'sci-fi-btn text-cyan-100 cursor-pointer'
          }
        `}
      >
        {/* 角落装饰 */}
        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-cyan-400/50" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-cyan-400/50" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-cyan-400/50" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-cyan-400/50" />

        {getButtonContent()}
      </button>

      {/* 进度条 */}
      {isProcessing && (
        <div className="mt-4 space-y-2">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-mono">
            <span>PROCESSING</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* 波纹效果 */}
      {phase === 'listening' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-xl border border-cyan-400/30 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
      )}
    </div>
  );
}
