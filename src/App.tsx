import { useState, useEffect, useRef, useCallback } from 'react';
import { StarryBackground, SpaceTimeDisplay, EchoButton, EchoResult } from './components';
import { MoodBubbles } from './components/MoodBubbles';
import { generateEcho } from './utils/echoGenerator';
import { getCurrentLocation } from './utils/location';
import { getWeather } from './utils/weather';
import { buildSpaceTimeContext } from './utils/time';
import type { AppPhase, SelectedMood, EchoResponse, SpaceTimeContext, LocationInfo, WeatherInfo } from './types';
import './App.css';

function App() {
  // 授权状态
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);

  // 时空信息
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [context, setContext] = useState<SpaceTimeContext>(() => buildSpaceTimeContext(null, null));

  // 情绪和回响状态
  const [selectedMoods, setSelectedMoods] = useState<SelectedMood[]>([]);
  const [customNote, setCustomNote] = useState('');
  const [phase, setPhase] = useState<AppPhase>('collecting');
  const [progress, setProgress] = useState(0);
  const [echo, setEcho] = useState<EchoResponse | null>(null);

  const progressIntervalRef = useRef<number | null>(null);

  // 更新时空上下文
  useEffect(() => {
    setContext(buildSpaceTimeContext(location, weather));
  }, [location, weather]);

  // 每分钟更新时间
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
    } catch (error) {
      console.error('获取位置或天气失败:', error);
      // 即使失败也设置默认值
      setLocation({
        latitude: 39.9,
        longitude: 116.4,
        city: '未知城市',
        country: '未知国家',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // 是否可以点击回响按钮
  const canEcho = selectedMoods.length > 0;

  // 处理回响点击
  const handleEcho = async () => {
    if (!canEcho) return;

    setPhase('listening');
    setProgress(0);

    const startTime = Date.now();
    const estimatedDuration = 20000;

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / estimatedDuration) * 90, 90);
      setProgress(newProgress);
    }, 100);

    try {
      setPhase('responding');
      const response = await generateEcho(context, selectedMoods, customNote);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      setProgress(100);
      setEcho(response);
      setPhase('complete');
    } catch (error) {
      console.error('生成回响失败:', error);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setPhase('collecting');
      setProgress(0);
    }
  };

  // 重置
  const handleReset = () => {
    setSelectedMoods([]);
    setCustomNote('');
    setPhase('collecting');
    setProgress(0);
    setEcho(null);
  };

  // 清理
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] cosmic-gradient text-white relative overflow-x-hidden">
      {/* 星空背景 */}
      <StarryBackground />

      {/* 主内容 */}
      <div className="relative z-10 min-h-screen min-h-[100dvh] flex flex-col">
        {/* 头部 */}
        <header className="p-4 sm:p-6 text-center shrink-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wider animate-float">
            <span className="text-purple-300">每日</span>
            <span className="text-white">灵感</span>
            <span className="text-indigo-300">回响</span>
          </h1>
          <p className="mt-1 sm:mt-2 text-gray-400 text-xs sm:text-sm">让宇宙聆听你此刻的心声</p>
        </header>

        {/* 主体内容区 */}
        <main className="flex-1 px-3 sm:px-4 pb-4 sm:pb-8 max-w-lg mx-auto w-full space-y-4 sm:space-y-6 overflow-y-auto">
          {phase !== 'complete' || !echo ? (
            <>
              {/* 时空信息展示 */}
              <SpaceTimeDisplay
                context={context}
                loading={loading}
                hasPermission={hasPermission}
                onRequestPermission={handleRequestPermission}
              />

              {/* 浮动球体心情选择 */}
              <MoodBubbles
                selectedMoods={selectedMoods}
                onMoodsChange={setSelectedMoods}
                customNote={customNote}
                onCustomNoteChange={setCustomNote}
              />

              {/* 回响按钮 */}
              <div className="pt-2 sm:pt-4 pb-safe">
                <EchoButton
                  phase={phase}
                  disabled={!canEcho}
                  onClick={handleEcho}
                  progress={progress}
                />
                {!canEcho && (
                  <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                    点击上方的心情球体，选择你此刻的感受
                  </p>
                )}
              </div>
            </>
          ) : (
            /* 结果展示 */
            <EchoResult echo={echo} onReset={handleReset} />
          )}
        </main>

        {/* 底部 */}
        <footer className="p-3 sm:p-4 text-center text-xs text-gray-500 shrink-0">
          <p>每一次回响，都是宇宙与你的对话</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
