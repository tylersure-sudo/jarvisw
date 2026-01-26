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
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <button
          onClick={onRequestPermission}
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌌</span>
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-medium text-purple-200">感知此刻的时空</h2>
              <p className="text-xs sm:text-sm text-gray-400">点击授权获取位置和天气信息</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
            <span className="text-purple-300">→</span>
          </div>
        </button>
      </div>
    );
  }

  // 加载中状态
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <div>
            <h2 className="text-base sm:text-lg font-medium text-purple-200">感知中...</h2>
            <p className="text-xs sm:text-sm text-gray-400">正在获取你的时空信息</p>
          </div>
        </div>
      </div>
    );
  }

  // 已授权，显示简洁版或展开版
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* 简洁版头部 - 始终显示 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-3xl sm:text-4xl">{context.weather?.icon || '🌌'}</span>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg sm:text-xl font-light text-white">
                {formatTime(context.time)}
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-sm sm:text-base text-gray-300">
                {context.location?.city || '未知位置'}
              </span>
              {context.weather && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm sm:text-base text-gray-300">
                    {context.weather.temperature}°C
                  </span>
                </>
              )}
            </div>
            <div className="text-xs sm:text-sm text-purple-300 mt-0.5">
              {getSeasonLabel(context.season)} · {getTimeOfDayLabel(context.timeOfDay)}
            </div>
          </div>
        </div>
        <div
          className={`text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        >
          ▼
        </div>
      </button>

      {/* 展开详情 */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-white/5 animate-fade-in">
          <div className="grid grid-cols-2 gap-4 pt-4">
            {/* 时间详情 */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500 uppercase tracking-wider">时间</div>
              <div className="text-sm text-gray-300">{formatDate(context.time)}</div>
            </div>

            {/* 位置详情 */}
            {context.location && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">位置</div>
                <div className="text-sm text-gray-300">{context.location.country}</div>
                <div className="text-xs text-gray-500">
                  {context.location.latitude.toFixed(2)}°, {context.location.longitude.toFixed(2)}°
                </div>
              </div>
            )}

            {/* 天气详情 */}
            {context.weather && (
              <div className="col-span-2 space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">天气详情</div>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span>{context.weather.description}</span>
                  <span>湿度 {context.weather.humidity}%</span>
                  <span>风速 {context.weather.windSpeed} km/h</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
