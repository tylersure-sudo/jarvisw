import { useState, useEffect, useRef } from 'react';
import {
  StarryBackground,
  SpaceTimeDisplay,
  EchoButton,
  EchoResult,
} from './components';
import { useSpaceTime } from './hooks/useSpaceTime';
import { generateEcho } from './utils/echoGenerator';
import { getRandomMoods } from './utils/moods';
import type { AppPhase, EchoResponse } from './types';
import './App.css';

function App() {
  const { context, loading } = useSpaceTime();
  const [phase, setPhase] = useState<AppPhase>('collecting');
  const [progress, setProgress] = useState(0);
  const [echo, setEcho] = useState<EchoResponse | null>(null);

  const progressIntervalRef = useRef<number | null>(null);

  // 是否可以点击回响按钮
  const canEcho = !loading;

  // 处理回响点击
  const handleEcho = async () => {
    if (!canEcho) return;

    setPhase('listening');
    setProgress(0);

    // 随机选择情绪
    const randomMoods = getRandomMoods(2).map(mood => ({ mood }));

    // 模拟进度
    const startTime = Date.now();
    const estimatedDuration = 20000; // 预估 20 秒

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / estimatedDuration) * 90, 90);
      setProgress(newProgress);
    }, 100);

    try {
      setPhase('responding');
      const response = await generateEcho(context, randomMoods);

      // 清除进度定时器
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
    <div className="min-h-screen cosmic-gradient text-white relative overflow-hidden">
      {/* 星空背景 */}
      <StarryBackground />

      {/* 主内容 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 头部 */}
        <header className="p-6 text-center">
          <h1 className="text-3xl md:text-4xl font-light tracking-wider animate-float">
            <span className="text-purple-300">每日</span>
            <span className="text-white">灵感</span>
            <span className="text-indigo-300">回响</span>
          </h1>
          <p className="mt-2 text-gray-400 text-sm">让宇宙聆听你此刻的心声</p>
        </header>

        {/* 主体内容区 */}
        <main className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full space-y-6">
          {phase !== 'complete' || !echo ? (
            <>
              {/* 时空信息展示 */}
              <SpaceTimeDisplay context={context} loading={loading} />

              {/* 回响按钮 */}
              <div className="pt-4">
                <EchoButton
                  phase={phase}
                  disabled={!canEcho}
                  onClick={handleEcho}
                  progress={progress}
                />
              </div>
            </>
          ) : (
            /* 结果展示 */
            <EchoResult echo={echo} onReset={handleReset} />
          )}
        </main>

        {/* 底部 */}
        <footer className="p-4 text-center text-xs text-gray-500">
          <p>每一次回响，都是宇宙与你的对话</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
