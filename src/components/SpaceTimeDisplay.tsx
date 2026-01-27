import { useState, useEffect } from 'react';
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
  const [showOverlay, setShowOverlay] = useState(false);

  // 获取东方时空信息
  const easternTime = getEasternSpaceTime(
    context.time,
    context.location?.latitude,
    context.location?.longitude
  );

  const shichen = getShiChen(context.time.getHours());
  const solarTerm = getSolarTerm(context.time);

  // 点击外部关闭浮层
  useEffect(() => {
    if (showOverlay) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.spacetime-overlay') && !target.closest('.spacetime-trigger')) {
          setShowOverlay(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showOverlay]);

  // 未授权状态
  if (!hasPermission) {
    return (
      <div className="glass-card rounded-2xl p-3 sm:p-4">
        <button
          onClick={onRequestPermission}
          className="w-full flex items-center justify-between group active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            {/* 时空图标 */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
              <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm text-amber-200/90 font-medium tracking-wide">时空感应</div>
              <div className="text-[11px] text-gray-500 mt-0.5">轻触开启天地连接</div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform">
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </button>
      </div>
    );
  }

  // 加载中状态
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <div className="text-sm text-amber-200/90 font-medium">感应中...</div>
            <div className="text-[11px] text-gray-500 mt-0.5">获取天地方位</div>
          </div>
        </div>
      </div>
    );
  }

  // 已授权，显示东方文化格式数据
  return (
    <div className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setShowOverlay(true)}
        className="spacetime-trigger w-full glass-card rounded-2xl p-3 sm:p-4 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* 时辰图标 */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            <span className="text-xl relative z-10">{getShiChenEmoji(shichen.name)}</span>
          </div>

          {/* 主要信息 */}
          <div className="text-left min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2 text-sm">
              <span className="text-amber-200/90 font-medium">{getShiChenDisplay(context.time.getHours())}</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-300 truncate">{context.location?.city || '某处'}</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {getLunarDateDisplay(context.time)} · {solarTerm.name}
            </div>
          </div>
        </div>

        {/* 展开图标 */}
        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center ml-2 shrink-0">
          <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="6" r="1" fill="currentColor" />
            <circle cx="12" cy="18" r="1" fill="currentColor" />
          </svg>
        </div>
      </button>

      {/* 浮层 */}
      {showOverlay && (
        <>
          {/* 遮罩 */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn" onClick={() => setShowOverlay(false)} />

          {/* 浮层内容 */}
          <div className="spacetime-overlay fixed left-4 right-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto animate-scaleIn">
            <div className="bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {/* 顶部装饰 */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent pointer-events-none" />

              {/* 头部 */}
              <div className="relative px-5 pt-5 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/30 border border-amber-500/40 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      <span className="text-2xl relative z-10">{getShiChenEmoji(shichen.name)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white tracking-wide">天地时空</h3>
                      <p className="text-xs text-amber-300/70 mt-0.5">宇宙能量感应</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOverlay(false)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 内容 */}
              <div className="px-5 py-4 space-y-4">
                {/* 时辰详情 */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard
                    icon={<span className="text-lg">🕐</span>}
                    label="时辰"
                    value={`${shichen.name}（${shichen.alias}）`}
                    subValue={shichen.hours}
                    color="amber"
                  />
                  <InfoCard
                    icon={<span className="text-lg">🌿</span>}
                    label="节气"
                    value={solarTerm.name}
                    subValue={solarTerm.description}
                    color="emerald"
                  />
                  <InfoCard
                    icon={<span className="text-lg">🌙</span>}
                    label="农历"
                    value={`${easternTime.lunarDate.ganZhi.gan}${easternTime.lunarDate.ganZhi.zhi}年`}
                    subValue={`${easternTime.lunarDate.monthName}月${easternTime.lunarDate.dayName} · ${easternTime.lunarDate.ganZhi.shengxiao}年`}
                    color="rose"
                  />
                  <InfoCard
                    icon={<span className="text-lg">✨</span>}
                    label="五行养生"
                    value={`${shichen.element}气 · ${shichen.organ}`}
                    subValue={shichen.description}
                    color="cyan"
                  />
                </div>

                {/* 位置信息 */}
                {context.location && (
                  <div className="pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">天地方位</div>
                        <div className="text-sm text-gray-200 font-mono mt-0.5">
                          {formatCoordinateShort(context.location.latitude, context.location.longitude)}
                        </div>
                      </div>
                      {context.weather && (
                        <div className="text-right">
                          <div className="text-lg">{context.weather.icon}</div>
                          <div className="text-xs text-gray-400">{context.weather.temperature}°</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 节气建议 */}
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                  <div className="absolute top-3 left-3 text-2xl opacity-20">❝</div>
                  <p className="text-sm text-gray-300 italic pl-4 leading-relaxed">
                    {solarTerm.advice}
                  </p>
                </div>
              </div>

              {/* 底部 */}
              <div className="px-5 py-4 border-t border-white/5 bg-black/20">
                <button
                  onClick={() => setShowOverlay(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-200 text-sm font-medium hover:from-amber-500/30 hover:to-orange-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  感应完成
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 信息卡片组件
function InfoCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  color: 'amber' | 'emerald' | 'rose' | 'cyan';
}) {
  const colorClasses = {
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-200',
    emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-200',
    rose: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-200',
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-200',
  };

  return (
    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')} border ${colorClasses[color].split(' ')[2]}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-md bg-black/20 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-sm font-medium ${colorClasses[color].split(' ')[3]}`}>{value}</div>
      <div className="text-[10px] text-gray-400 mt-0.5">{subValue}</div>
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
