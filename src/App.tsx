import { useState, useEffect, useCallback } from 'react';
import { StarryBackground, CallUniverse, ConversationScreen } from './components';
import type { CallMode } from './components';
import type { EnergyBlock } from './components/EnergyBlocks';
import { generateEcho } from './utils/echoGenerator';
import { getCurrentLocation } from './utils/location';
import { getWeather } from './utils/weather';
import { buildSpaceTimeContext } from './utils/time';
import { getShiChen, getSolarTerm, getLunarDateDisplay } from './utils/easternTime';
import type { SpaceTimeContext, LocationInfo, WeatherInfo } from './types';
import './App.css';

function App() {
  const [spaceTimeReady, setSpaceTimeReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [context, setContext] = useState<SpaceTimeContext>(() => buildSpaceTimeContext(null, null));
  const [activeMode, setActiveMode] = useState<CallMode | null>(null);

  // 更新时空上下文
  useEffect(() => {
    setContext(buildSpaceTimeContext(location, weather));
  }, [location, weather]);

  // 定时更新时空上下文
  useEffect(() => {
    const timer = setInterval(() => {
      setContext(buildSpaceTimeContext(location, weather));
    }, 60000);
    return () => clearInterval(timer);
  }, [location, weather]);

  // 获取时空信息
  const handleGetSpaceTime = useCallback(async () => {
    if (spaceTimeReady || loading) return;

    setLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      const weatherData = await getWeather(loc);
      setWeather(weatherData);
      setSpaceTimeReady(true);
    } catch (error) {
      console.error('获取位置或天气失败:', error);
      setLocation({
        latitude: 39.9,
        longitude: 116.4,
        city: '未知城市',
        country: '未知国家',
      });
      setSpaceTimeReady(true);
    } finally {
      setLoading(false);
    }
  }, [spaceTimeReady, loading]);

  // 开始呼叫
  const handleStartCall = (mode: CallMode) => {
    setActiveMode(mode);
  };

  // 关闭对话
  const handleCloseConversation = () => {
    setActiveMode(null);
  };

  // 生成回应
  const handleGenerateResponse = async (
    userInput: string,
    mode: CallMode,
    energies: EnergyBlock[]
  ): Promise<{ story: string; imageUrl?: string }> => {
    const moodMap: Record<CallMode, { id: string; label: string; emoji: string }> = {
      daily: { id: 'hopeful', label: '期待', emoji: '🌟' },
      mood: { id: 'peaceful', label: '平和', emoji: '🌊' },
      dream: { id: 'mysterious', label: '神秘', emoji: '🌙' },
      question: { id: 'curious', label: '好奇', emoji: '✨' },
    };

    const selectedMood = {
      mood: {
        ...moodMap[mode],
        intensity: 'moderate' as const,
        category: 'neutral' as const,
      },
      customNote: userInput || undefined,
    };

    const response = await generateEcho(context, [selectedMood], energies);

    return {
      story: response.story,
      imageUrl: response.imageUrl,
    };
  };

  // 获取时空显示信息
  const shichen = getShiChen(context.time.getHours());
  const solarTerm = getSolarTerm(context.time);
  const lunarDate = getLunarDateDisplay(context.time);

  return (
    <div className="min-h-screen-safe bg-gradient-to-b from-gray-900 via-purple-950/20 to-gray-900 text-white relative overflow-hidden">
      <StarryBackground />

      {/* 对话界面 */}
      {activeMode && (
        <ConversationScreen
          mode={activeMode}
          onClose={handleCloseConversation}
          onGenerateResponse={handleGenerateResponse}
        />
      )}

      {/* 主界面 */}
      <div className={`relative z-10 min-h-screen-safe flex flex-col transition-opacity duration-300 ${activeMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

        {/* 时空信息背景展示 - 只有获取后才显示 */}
        {spaceTimeReady && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* 顶部时间信息 */}
            <div className="absolute top-6 left-0 right-0 flex justify-center">
              <div className="text-center opacity-40">
                <div className="text-4xl sm:text-5xl font-extralight tracking-[0.3em] text-purple-200/80">
                  {shichen.name}
                </div>
              </div>
            </div>

            {/* 左侧信息 */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
              <div className="writing-vertical text-sm tracking-[0.5em] text-gray-400 font-light">
                {lunarDate}
              </div>
            </div>

            {/* 右侧信息 */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
              <div className="writing-vertical text-sm tracking-[0.5em] text-gray-400 font-light">
                {solarTerm.name}
              </div>
            </div>

            {/* 底部位置信息 */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
              <div className="text-center opacity-30">
                <div className="text-xs tracking-widest text-gray-500">
                  {context.location?.city || ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 中央主区域 */}
        <main className="flex-1 flex items-center justify-center px-4">
          {!spaceTimeReady ? (
            /* 未获取时空信息 - 显示感应按钮 */
            <div className="flex flex-col items-center">
              <button
                onClick={handleGetSpaceTime}
                disabled={loading}
                className="relative group"
              >
                {/* 外层光环 */}
                <div className="absolute inset-[-30px] rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />

                {/* 主按钮 */}
                <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-600/80 to-orange-700/80
                  flex items-center justify-center shadow-2xl
                  transition-all duration-300 group-hover:scale-105 group-active:scale-95
                  border border-amber-400/30 overflow-hidden
                  ${loading ? 'animate-pulse' : ''}`}
                >
                  {/* 光泽 */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

                  {/* 内容 */}
                  <div className="flex flex-col items-center relative z-10">
                    {loading ? (
                      <div className="w-8 h-8 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-amber-100" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                        <span className="text-amber-100 text-xs mt-2 tracking-wider">感应时空</span>
                      </>
                    )}
                  </div>
                </div>
              </button>

              <p className="mt-8 text-gray-500 text-sm text-center max-w-xs font-light">
                {loading ? '正在感应天地能量...' : '轻触开启时空感应'}
              </p>
            </div>
          ) : (
            /* 已获取时空信息 - 显示呼叫宇宙 */
            <CallUniverse
              onStartCall={handleStartCall}
              isConnected={true}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
