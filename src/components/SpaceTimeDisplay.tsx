import { useState } from 'react';
import type { SpaceTimeContext } from '../types';
import {
  getShiChen,
  getShiChenDisplay,
  getSolarTerm,
  getLunarDateDisplay,
  formatCoordinateShort,
  getEasternSpaceTime,
} from '../utils/easternTime';

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

  // 获取东方时空信息
  const easternTime = getEasternSpaceTime(
    context.time,
    context.location?.latitude,
    context.location?.longitude
  );

  const shichen = getShiChen(context.time.getHours());
  const solarTerm = getSolarTerm(context.time);

  // 未授权状态
  if (!hasPermission) {
    return (
      <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4">
        <button
          onClick={onRequestPermission}
          className="w-full flex items-center justify-between group active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center justify-center">
              <span className="text-lg">☯</span>
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm text-amber-200/80 font-light">时空感应</div>
              <div className="text-[10px] sm:text-xs text-gray-500">轻触开启天地连接</div>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500/20 group-active:bg-amber-500/30 transition-colors">
            <span className="text-amber-400 text-xs sm:text-sm">→</span>
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
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-amber-200/80 font-light">感应中...</div>
            <div className="text-[10px] sm:text-xs text-gray-500">获取天地方位</div>
          </div>
        </div>
      </div>
    );
  }

  // 已授权，显示东方文化格式数据
  return (
    <div className="glass-card rounded-lg sm:rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* 时辰图标 */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <span className="text-lg sm:text-xl">{getShiChenEmoji(shichen.name)}</span>
          </div>

          {/* 主要信息 - 时辰和位置 */}
          <div className="text-left min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <span className="text-amber-200/90 font-light">{getShiChenDisplay(context.time.getHours())}</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-300 truncate">{context.location?.city || '某处'}</span>
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
              {getLunarDateDisplay(context.time)} · {solarTerm.name}
            </div>
          </div>
        </div>

        {/* 展开指示器 */}
        <div className={`text-gray-500 text-[10px] sm:text-xs ml-2 shrink-0 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>

      {/* 展开详情 - 完整东方时空信息 */}
      {expanded && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 border-t border-white/5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4">
            {/* 时辰详情 */}
            <div className="space-y-1">
              <div className="text-[9px] sm:text-[10px] text-gray-600 font-light tracking-wider">时辰</div>
              <div className="text-xs sm:text-sm text-amber-200/80">{shichen.name}（{shichen.alias}）</div>
              <div className="text-[10px] text-gray-400">{shichen.hours}</div>
            </div>

            {/* 节气 */}
            <div className="space-y-1">
              <div className="text-[9px] sm:text-[10px] text-gray-600 font-light tracking-wider">节气</div>
              <div className="text-xs sm:text-sm text-emerald-200/80">{solarTerm.name}</div>
              <div className="text-[10px] text-gray-400">{solarTerm.description}</div>
            </div>

            {/* 农历 */}
            <div className="space-y-1">
              <div className="text-[9px] sm:text-[10px] text-gray-600 font-light tracking-wider">农历</div>
              <div className="text-xs sm:text-sm text-rose-200/80">
                {easternTime.lunarDate.ganZhi.gan}{easternTime.lunarDate.ganZhi.zhi}年
              </div>
              <div className="text-[10px] text-gray-400">
                {easternTime.lunarDate.monthName}月{easternTime.lunarDate.dayName} · {easternTime.lunarDate.ganZhi.shengxiao}年
              </div>
            </div>

            {/* 五行与经络 */}
            <div className="space-y-1">
              <div className="text-[9px] sm:text-[10px] text-gray-600 font-light tracking-wider">五行养生</div>
              <div className="text-xs sm:text-sm text-cyan-200/80">{shichen.element}气 · {shichen.organ}</div>
              <div className="text-[10px] text-gray-400">{shichen.description}</div>
            </div>

            {/* 经纬度 */}
            {context.location && (
              <div className="col-span-2 space-y-1 pt-2 border-t border-white/5">
                <div className="text-[9px] sm:text-[10px] text-gray-600 font-light tracking-wider">天地方位</div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-300 font-mono">
                    {formatCoordinateShort(context.location.latitude, context.location.longitude)}
                  </span>
                  {context.weather && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span className="text-xs text-gray-400">
                        {context.weather.icon} {context.weather.temperature}° {context.weather.description}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 节气建议 */}
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="text-[10px] text-gray-500 italic">
              「{solarTerm.advice}」
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 根据时辰名获取对应emoji */
function getShiChenEmoji(name: string): string {
  const emojiMap: Record<string, string> = {
    '子时': '🌙',
    '丑时': '🌃',
    '寅时': '🌄',
    '卯时': '🌅',
    '辰时': '☀️',
    '巳时': '🌤️',
    '午时': '☀️',
    '未时': '🌤️',
    '申时': '⛅',
    '酉时': '🌇',
    '戌时': '🌆',
    '亥时': '🌙',
  };
  return emojiMap[name] || '☯';
}
