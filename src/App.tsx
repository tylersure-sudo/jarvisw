import { useState, useEffect, useRef, useCallback } from 'react';
import { StarryBackground, SpaceTimeDisplay, EchoButton, EchoResult, EnergyBlocks } from './components';
import { MoodBubbles } from './components/MoodBubbles';
import type { EnergyBlock } from './components/EnergyBlocks';
import { generateEcho } from './utils/echoGenerator';
import { getCurrentLocation } from './utils/location';
import { getWeather } from './utils/weather';
import { buildSpaceTimeContext } from './utils/time';
import type { AppPhase, SelectedMood, EchoResponse, SpaceTimeContext, LocationInfo, WeatherInfo } from './types';
import './App.css';

function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [context, setContext] = useState<SpaceTimeContext>(() => buildSpaceTimeContext(null, null));
  const [selectedMood, setSelectedMood] = useState<SelectedMood | null>(null);
  const [phase, setPhase] = useState<AppPhase>('collecting');
  const [progress, setProgress] = useState(0);
  const [echo, setEcho] = useState<EchoResponse | null>(null);
  const [collectedEnergies, setCollectedEnergies] = useState<EnergyBlock[]>([]);
  const [showEnergyBlocks, setShowEnergyBlocks] = useState(false);

  const progressIntervalRef = useRef<number | null>(null);
  const generationRef = useRef<boolean>(false);

  useEffect(() => {
    setContext(buildSpaceTimeContext(location, weather));
  }, [location, weather]);

  useEffect(() => {
    const timer = setInterval(() => {
      setContext(buildSpaceTimeContext(location, weather));
    }, 60000);
    return () => clearInterval(timer);
  }, [location, weather]);

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

  const canEcho = selectedMood !== null;

  // 处理能量收集
  const handleEnergyCollected = useCallback((energies: EnergyBlock[]) => {
    setCollectedEnergies(energies);
  }, []);

  // 开始生成回响
  const handleEcho = async () => {
    if (!canEcho || !selectedMood) return;

    setPhase('listening');
    setProgress(0);
    setCollectedEnergies([]);
    setShowEnergyBlocks(true);
    generationRef.current = true;

    const startTime = Date.now();
    const estimatedDuration = 25000; // 25秒，给用户更多时间收集能量

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / estimatedDuration) * 85, 85);
      setProgress(newProgress);
    }, 100);

    // 等待一段时间让用户收集能量，然后开始生成
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
      setPhase('responding');

      // 使用收集的能量生成回响
      const response = await generateEcho(context, [selectedMood], collectedEnergies);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      setProgress(100);
      setShowEnergyBlocks(false);
      setEcho(response);
      setPhase('complete');
    } catch (error) {
      console.error('生成回响失败:', error);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setShowEnergyBlocks(false);
      setPhase('collecting');
      setProgress(0);
    }

    generationRef.current = false;
  };

  const handleReset = () => {
    setSelectedMood(null);
    setPhase('collecting');
    setProgress(0);
    setEcho(null);
    setCollectedEnergies([]);
    setShowEnergyBlocks(false);
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen-safe cosmic-gradient text-white relative overflow-x-hidden">
      <StarryBackground />

      {/* 能量块交互层 */}
      <EnergyBlocks
        isActive={showEnergyBlocks}
        onEnergyCollected={handleEnergyCollected}
      />

      <div className="relative z-10 min-h-screen-safe flex flex-col safe-top safe-bottom">
        {/* 标题 */}
        <header className="px-4 pt-3 pb-2 sm:px-6 sm:pt-4 sm:pb-3 text-center shrink-0">
          <div className="inline-block relative">
            {/* 装饰线 - 只在大屏显示 */}
            <div className="hidden sm:block absolute -left-10 top-1/2 w-8 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
            <div className="hidden sm:block absolute -right-10 top-1/2 w-8 h-px bg-gradient-to-l from-transparent to-amber-500/50" />

            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.15em] sm:tracking-[0.2em]">
              <span className="text-amber-200/90">灵感</span>
              <span className="text-white/60 mx-1 sm:mx-2">·</span>
              <span className="text-cyan-200/90">回响</span>
            </h1>
          </div>
          <p className="mt-1 sm:mt-2 text-gray-500 text-[10px] sm:text-xs font-light tracking-wider">
            聆听宇宙的声音
          </p>
        </header>

        {/* 主体内容区 */}
        <main className="flex-1 px-3 sm:px-4 pb-2 sm:pb-4 max-w-lg mx-auto w-full space-y-3 sm:space-y-4 overflow-y-auto">
          {phase !== 'complete' || !echo ? (
            <>
              <SpaceTimeDisplay
                context={context}
                loading={loading}
                hasPermission={hasPermission}
                onRequestPermission={handleRequestPermission}
              />

              <MoodBubbles
                selectedMood={selectedMood}
                onMoodChange={setSelectedMood}
              />

              <div className="pt-1 sm:pt-2 pb-safe">
                <EchoButton
                  phase={phase}
                  disabled={!canEcho}
                  onClick={handleEcho}
                  progress={progress}
                />
                {!canEcho && (
                  <p className="text-center text-[10px] sm:text-xs text-gray-600 mt-3 sm:mt-4 font-light">
                    选择你此刻的心境以继续
                  </p>
                )}
              </div>
            </>
          ) : (
            <EchoResult echo={echo} onReset={handleReset} />
          )}
        </main>

        {/* 底部 */}
        <footer className="px-3 py-2 sm:p-3 text-center shrink-0 pb-safe">
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-gray-600 font-light">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 animate-pulse" />
            <span>与宇宙同频</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
