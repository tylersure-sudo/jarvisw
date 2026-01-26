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
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [context, setContext] = useState<SpaceTimeContext>(() => buildSpaceTimeContext(null, null));
  const [selectedMoods, setSelectedMoods] = useState<SelectedMood[]>([]);
  const [phase, setPhase] = useState<AppPhase>('collecting');
  const [progress, setProgress] = useState(0);
  const [echo, setEcho] = useState<EchoResponse | null>(null);

  const progressIntervalRef = useRef<number | null>(null);

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

  const canEcho = selectedMoods.length > 0;

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
      const response = await generateEcho(context, selectedMoods);

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

  const handleReset = () => {
    setSelectedMoods([]);
    setPhase('collecting');
    setProgress(0);
    setEcho(null);
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] cosmic-gradient text-white relative overflow-x-hidden">
      <StarryBackground />

      <div className="relative z-10 min-h-screen min-h-[100dvh] flex flex-col">
        {/* 科幻标题 */}
        <header className="p-4 sm:p-6 text-center shrink-0">
          <div className="inline-block relative">
            {/* 装饰线 */}
            <div className="absolute -left-8 top-1/2 w-6 h-px bg-gradient-to-r from-transparent to-cyan-500/50" />
            <div className="absolute -right-8 top-1/2 w-6 h-px bg-gradient-to-l from-transparent to-cyan-500/50" />

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.3em] uppercase animate-float">
              <span className="neon-text text-cyan-200">COSMIC</span>
              <span className="text-white mx-2">·</span>
              <span className="neon-text-purple text-purple-200">ECHO</span>
            </h1>
          </div>
          <p className="mt-2 sm:mt-3 text-gray-500 text-xs sm:text-sm font-mono tracking-wider">
            // UNIVERSAL VOICE INTERFACE v1.0
          </p>
        </header>

        {/* 主体内容区 */}
        <main className="flex-1 px-3 sm:px-4 pb-4 sm:pb-8 max-w-lg mx-auto w-full space-y-4 sm:space-y-6 overflow-y-auto">
          {phase !== 'complete' || !echo ? (
            <>
              <SpaceTimeDisplay
                context={context}
                loading={loading}
                hasPermission={hasPermission}
                onRequestPermission={handleRequestPermission}
              />

              <MoodBubbles
                selectedMoods={selectedMoods}
                onMoodsChange={setSelectedMoods}
              />

              <div className="pt-2 sm:pt-4 pb-safe">
                <EchoButton
                  phase={phase}
                  disabled={!canEcho}
                  onClick={handleEcho}
                  progress={progress}
                />
                {!canEcho && (
                  <p className="text-center text-xs text-gray-600 mt-4 font-mono">
                    SELECT YOUR CURRENT STATE TO CONTINUE
                  </p>
                )}
              </div>
            </>
          ) : (
            <EchoResult echo={echo} onReset={handleReset} />
          )}
        </main>

        {/* 底部 */}
        <footer className="p-3 sm:p-4 text-center shrink-0">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-pulse" />
            <span>CONNECTED TO UNIVERSE</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
