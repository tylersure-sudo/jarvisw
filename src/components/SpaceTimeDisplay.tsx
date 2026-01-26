import type { SpaceTimeContext } from '../types';
import { formatTime, formatDate, getTimeOfDayLabel, getSeasonLabel } from '../utils/time';

interface SpaceTimeDisplayProps {
  context: SpaceTimeContext;
  loading: boolean;
}

export function SpaceTimeDisplay({ context, loading }: SpaceTimeDisplayProps) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-medium text-purple-200 flex items-center gap-2">
        <span className="text-2xl">🌌</span>
        此刻的时空
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* 时间 */}
        <div className="space-y-1">
          <div className="text-xs text-gray-400 uppercase tracking-wider">时间</div>
          <div className="text-2xl font-light text-white">{formatTime(context.time)}</div>
          <div className="text-sm text-gray-300">{formatDate(context.time)}</div>
          <div className="text-xs text-purple-300">
            {getSeasonLabel(context.season)} · {getTimeOfDayLabel(context.timeOfDay)}
          </div>
        </div>

        {/* 位置 */}
        <div className="space-y-1">
          <div className="text-xs text-gray-400 uppercase tracking-wider">位置</div>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              定位中...
            </div>
          ) : context.location ? (
            <>
              <div className="text-xl font-light text-white">{context.location.city}</div>
              <div className="text-sm text-gray-300">{context.location.country}</div>
              <div className="text-xs text-purple-300">
                {context.location.latitude.toFixed(2)}°,{' '}
                {context.location.longitude.toFixed(2)}°
              </div>
            </>
          ) : (
            <div className="text-gray-400">未知位置</div>
          )}
        </div>

        {/* 天气 */}
        <div className="col-span-2 space-y-1">
          <div className="text-xs text-gray-400 uppercase tracking-wider">天气</div>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              获取天气中...
            </div>
          ) : context.weather ? (
            <div className="flex items-center gap-4">
              <span className="text-4xl">{context.weather.icon}</span>
              <div>
                <div className="text-2xl font-light text-white">
                  {context.weather.temperature}°C
                </div>
                <div className="text-sm text-gray-300">{context.weather.description}</div>
              </div>
              <div className="ml-auto text-right text-xs text-gray-400">
                <div>湿度 {context.weather.humidity}%</div>
                <div>风速 {context.weather.windSpeed} km/h</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">未知天气</div>
          )}
        </div>
      </div>
    </div>
  );
}
