import { useState, useEffect, useCallback } from 'react';
import { StarryBackground, CallUniverse, ConversationScreen, SpaceTimeDisplay } from './components';
import type { CallMode } from './components';
import type { EnergyBlock } from './components/EnergyBlocks';
import { generateEcho } from './utils/echoGenerator';
import { getCurrentLocation } from './utils/location';
import { getWeather } from './utils/weather';
import { buildSpaceTimeContext } from './utils/time';
import type { SpaceTimeContext, LocationInfo, WeatherInfo } from './types';
import './App.css';

function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [context, setContext] = useState<SpaceTimeContext>(() => buildSpaceTimeContext(null, null));
  const [activeMode, setActiveMode] = useState<CallMode | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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

  // 请求位置权限
  const handleRequestPermission = useCallback(async () => {
    setHasPermission(true);
    setLoading(true);

    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      const weatherData = await getWeather(loc);
      setWeather(weatherData);
      setIsConnected(true);
    } catch (error) {
      console.error('获取位置或天气失败:', error);
      setLocation({
        latitude: 39.9,
        longitude: 116.4,
        city: '未知城市',
        country: '未知国家',
      });
      setIsConnected(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // 自动请求权限
  useEffect(() => {
    if (!hasPermission) {
      handleRequestPermission();
    }
  }, [hasPermission, handleRequestPermission]);

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
    // 根据模式构建心情
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

    // 生成回响
    const response = await generateEcho(context, [selectedMood], energies);

    return {
      story: response.story,
      imageUrl: response.imageUrl,
    };
  };

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
      <div className={`relative z-10 min-h-screen-safe flex flex-col safe-top safe-bottom transition-opacity duration-300 ${activeMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* 顶部 */}
        <header className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6 text-center shrink-0">
          {/* 装饰光晕 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative">
            {/* 标题 */}
            <h1 className="text-2xl sm:text-3xl font-medium tracking-widest relative inline-block">
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                灵感回响
              </span>
              {/* 星星装饰 */}
              <span className="absolute -top-1 -right-4 text-amber-300/60 text-xs animate-pulse">✦</span>
              <span className="absolute -bottom-1 -left-3 text-purple-300/50 text-[10px] animate-pulse" style={{ animationDelay: '0.5s' }}>✧</span>
            </h1>

            {/* 副标题 */}
            <p className="mt-2 text-gray-400 text-xs sm:text-sm font-light tracking-wider flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              <span>与宇宙对话 · 聆听内心</span>
              <span className="w-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            </p>
          </div>
        </header>

        {/* 时空信息 */}
        <div className="px-4 sm:px-6 mt-2">
          <SpaceTimeDisplay
            context={context}
            loading={loading}
            hasPermission={hasPermission}
            onRequestPermission={handleRequestPermission}
          />
        </div>

        {/* 主呼叫区域 */}
        <main className="flex-1 flex items-center justify-center px-4">
          <CallUniverse
            onStartCall={handleStartCall}
            isConnected={isConnected}
          />
        </main>

        {/* 底部提示 */}
        <footer className="px-4 py-4 sm:py-6 text-center shrink-0 safe-bottom">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5">
            <span className="text-purple-400/60 text-[10px]">☯</span>
            <p className="text-gray-500 text-[11px] tracking-wider">
              易经智慧 · 荣格心理 · 宇宙能量
            </p>
            <span className="text-amber-400/60 text-[10px]">✧</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
