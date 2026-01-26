import { useState } from 'react';
import type { SpaceTimeContext } from '../types';
import { formatTime, formatDate, getTimeOfDayLabel, getSeasonLabel } from '../utils/time';

interface SpaceTimeDisplayProps {
  context: SpaceTimeContext;
  loading: boolean;
  onRequestPermission: () => void;
  hasPermission: boolean;
}

export function SpaceTimeDisplay({
  context,
  loading,
  onRequestPermission,
  hasPermission,
}: SpaceTimeDisplayProps) {
  const [expanded, setExpanded] = useState(false);

  // 未授权状态
  if (!hasPermission) {
    return (
      <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4">
        <button
          onClick={onRequestPermission}
          className="w-full flex items-center justify-between group active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400/50 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm text-gray-300 font-mono uppercase tracking-wider">Spacetime Sensor</div>
              <div className="text-[10px] sm:text-xs text-gray-500">Tap to initialize</div>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/20 group-active:bg-cyan-500/30 transition-colors">
            <span className="text-cyan-400 text-xs sm:text-sm">→</span>
          </div>
        </button>
      </div>
    );
  }

  // 加载中状态
  if (loading) {
    return (
      <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-cyan-300 font-mono uppercase tracking-wider">Scanning...</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Acquiring coordinates</div>
          </div>
        </div>
      </div>
    );
  }

  // 已授权，显示数据
  return (
    <div className="glass-card rounded-lg sm:rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* 状态指示器 */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-lg sm:text-xl">{context.weather?.icon || '◉'}</span>
          </div>

          {/* 主要信息 */}
          <div className="text-left min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className="text-cyan-200 font-mono">{formatTime(context.time)}</span>
              <span className="text-gray-600 hidden xs:inline">|</span>
              <span className="text-gray-300 truncate">{context.location?.city || 'Unknown'}</span>
              {context.weather && (
                <>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-300">{context.weather.temperature}°</span>
                </>
              )}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 font-mono mt-0.5 truncate">
              {getSeasonLabel(context.season).toUpperCase()} · {getTimeOfDayLabel(context.timeOfDay).toUpperCase()}
            </div>
          </div>
        </div>

        {/* 展开指示器 */}
        <div className={`text-gray-500 text-[10px] sm:text-xs ml-2 shrink-0 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>

      {/* 展开详情 */}
      {expanded && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4">
            {/* 时间 */}
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[9px] sm:text-[10px] text-gray-600 font-mono uppercase tracking-wider">Date</div>
              <div className="text-[10px] sm:text-xs text-gray-300">{formatDate(context.time)}</div>
            </div>

            {/* 位置 */}
            {context.location && (
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-[9px] sm:text-[10px] text-gray-600 font-mono uppercase tracking-wider">Coordinates</div>
                <div className="text-[10px] sm:text-xs text-gray-300 font-mono">
                  {context.location.latitude.toFixed(2)}° {context.location.longitude.toFixed(2)}°
                </div>
              </div>
            )}

            {/* 天气 */}
            {context.weather && (
              <>
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-[9px] sm:text-[10px] text-gray-600 font-mono uppercase tracking-wider">Condition</div>
                  <div className="text-[10px] sm:text-xs text-gray-300">{context.weather.description}</div>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-[9px] sm:text-[10px] text-gray-600 font-mono uppercase tracking-wider">Atmosphere</div>
                  <div className="text-[10px] sm:text-xs text-gray-300 font-mono">
                    H:{context.weather.humidity}% W:{context.weather.windSpeed}km/h
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
