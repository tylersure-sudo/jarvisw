import { useState, useEffect, useRef, useCallback } from 'react';

export interface EnergyBlock {
  id: string;
  type: 'light' | 'warmth' | 'wisdom' | 'strength' | 'peace' | 'mystery';
  label: string;
  color: string;
  glowColor: string;
  size: 'small' | 'medium' | 'large';
}

interface EnergyBlocksProps {
  onEnergyCollected: (energies: EnergyBlock[]) => void;
  isActive: boolean;
}

// 能量块定义
const ENERGY_TYPES: EnergyBlock[] = [
  { id: 'light', type: 'light', label: '光明', color: 'from-yellow-400 to-amber-500', glowColor: 'rgba(251, 191, 36, 0.6)', size: 'large' },
  { id: 'warmth', type: 'warmth', label: '温暖', color: 'from-orange-400 to-red-500', glowColor: 'rgba(251, 146, 60, 0.6)', size: 'medium' },
  { id: 'wisdom', type: 'wisdom', label: '智慧', color: 'from-indigo-400 to-purple-500', glowColor: 'rgba(129, 140, 248, 0.6)', size: 'medium' },
  { id: 'strength', type: 'strength', label: '力量', color: 'from-emerald-400 to-teal-500', glowColor: 'rgba(52, 211, 153, 0.6)', size: 'large' },
  { id: 'peace', type: 'peace', label: '宁静', color: 'from-cyan-400 to-blue-500', glowColor: 'rgba(34, 211, 238, 0.6)', size: 'small' },
  { id: 'mystery', type: 'mystery', label: '神秘', color: 'from-violet-400 to-fuchsia-500', glowColor: 'rgba(167, 139, 250, 0.6)', size: 'medium' },
];

interface BlockPosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  scale: number;
  opacity: number;
}

export function EnergyBlocks({ onEnergyCollected, isActive }: EnergyBlocksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Map<string, BlockPosition>>(new Map());
  const [collectedEnergies, setCollectedEnergies] = useState<EnergyBlock[]>([]);
  const [showHint, setShowHint] = useState(true);
  const [cosmicPhase, setCosmicPhase] = useState(0);
  const animationRef = useRef<number | null>(null);

  // 初始化能量块位置
  useEffect(() => {
    if (!isActive) return;

    const initPositions = new Map<string, BlockPosition>();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    ENERGY_TYPES.forEach((energy, index) => {
      const angle = (index / ENERGY_TYPES.length) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 80 + Math.random() * 60;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      initPositions.set(energy.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 2,
        scale: 0,
        opacity: 0,
      });
    });

    setPositions(initPositions);
    setCollectedEnergies([]);
    setShowHint(true);
  }, [isActive]);

  // 宇宙声音渐入效果
  useEffect(() => {
    if (!isActive) {
      setCosmicPhase(0);
      return;
    }

    const interval = setInterval(() => {
      setCosmicPhase(prev => Math.min(prev + 0.02, 1));
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  // 能量块出现动画
  useEffect(() => {
    if (!isActive || positions.size === 0) return;

    // 延迟显示每个能量块
    ENERGY_TYPES.forEach((energy, index) => {
      setTimeout(() => {
        setPositions(prev => {
          const next = new Map(prev);
          const pos = next.get(energy.id);
          if (pos) {
            next.set(energy.id, { ...pos, scale: 1, opacity: 1 });
          }
          return next;
        });
      }, 300 + index * 150);
    });
  }, [isActive, positions.size]);

  // 动画循环
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isActive || positions.size === 0) return;

    const animate = () => {
      const rect = container.getBoundingClientRect();

      setPositions(prev => {
        const next = new Map(prev);

        next.forEach((pos, id) => {
          let { x, y, vx, vy, rotation, vr, scale, opacity } = pos;

          // 位置更新
          x += vx;
          y += vy;
          rotation += vr;

          // 边界反弹
          const blockSize = getBlockSize(ENERGY_TYPES.find(e => e.id === id)?.size || 'medium');
          const padding = blockSize / 2 + 10;

          if (x < padding || x > rect.width - padding) {
            vx = -vx * 0.9;
            x = Math.max(padding, Math.min(rect.width - padding, x));
          }
          if (y < padding || y > rect.height - padding) {
            vy = -vy * 0.9;
            y = Math.max(padding, Math.min(rect.height - padding, y));
          }

          // 微小随机扰动
          vx += (Math.random() - 0.5) * 0.03;
          vy += (Math.random() - 0.5) * 0.03;

          // 限速
          const maxSpeed = 1.2;
          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > maxSpeed) {
            vx = (vx / speed) * maxSpeed;
            vy = (vy / speed) * maxSpeed;
          }

          next.set(id, { x, y, vx, vy, rotation, vr, scale, opacity });
        });

        return next;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, positions.size]);

  // 收集能量
  const handleCollectEnergy = useCallback((energy: EnergyBlock) => {
    if (collectedEnergies.find(e => e.id === energy.id)) return;

    setShowHint(false);

    const newCollected = [...collectedEnergies, energy];
    setCollectedEnergies(newCollected);
    onEnergyCollected(newCollected);

    // 收集动画 - 缩小并淡出
    setPositions(prev => {
      const next = new Map(prev);
      const pos = next.get(energy.id);
      if (pos) {
        next.set(energy.id, { ...pos, scale: 0.3, opacity: 0.3 });
      }
      return next;
    });
  }, [collectedEnergies, onEnergyCollected]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 宇宙背景渐入效果 */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center,
            rgba(17, 24, 39, ${0.7 + cosmicPhase * 0.3}) 0%,
            rgba(0, 0, 0, ${0.9 + cosmicPhase * 0.1}) 100%)`,
        }}
      >
        {/* 星尘粒子 */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: cosmicPhase * (0.3 + Math.random() * 0.7),
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* 中央光晕 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
          style={{
            background: `radial-gradient(circle,
              rgba(96, 165, 250, ${cosmicPhase * 0.15}) 0%,
              rgba(139, 92, 246, ${cosmicPhase * 0.1}) 40%,
              transparent 70%)`,
            filter: 'blur(40px)',
            transform: `scale(${1 + cosmicPhase * 0.5})`,
          }}
        />
      </div>

      {/* 提示文字 */}
      <div
        className="absolute top-20 left-0 right-0 text-center transition-all duration-500"
        style={{ opacity: showHint ? cosmicPhase : 0, transform: `translateY(${showHint ? 0 : -20}px)` }}
      >
        <p className="text-cyan-300/80 text-sm sm:text-base font-light tracking-wider">
          宇宙的声音正在走近...
        </p>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          轻点能量块给当前回响注入灵感
        </p>
      </div>

      {/* 能量块容器 */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ opacity: cosmicPhase }}
      >
        {ENERGY_TYPES.map((energy) => {
          const pos = positions.get(energy.id);
          if (!pos) return null;

          const isCollected = collectedEnergies.find(e => e.id === energy.id);
          const blockSize = getBlockSize(energy.size);

          return (
            <button
              key={energy.id}
              onClick={() => handleCollectEnergy(energy)}
              disabled={!!isCollected}
              className={`absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-500
                ${isCollected ? 'pointer-events-none' : 'hover:scale-110 active:scale-95'}
              `}
              style={{
                left: pos.x - blockSize / 2,
                top: pos.y - blockSize / 2,
                width: blockSize,
                height: blockSize,
                transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
                opacity: pos.opacity,
              }}
            >
              {/* 能量块主体 */}
              <div
                className={`w-full h-full rounded-2xl bg-gradient-to-br ${energy.color}
                  flex flex-col items-center justify-center
                  shadow-lg backdrop-blur-sm`}
                style={{
                  boxShadow: `0 0 ${isCollected ? 10 : 25}px ${energy.glowColor},
                    inset 0 0 20px rgba(255,255,255,0.2)`,
                }}
              >
                <span
                  className="text-white/90 text-xs sm:text-sm font-medium"
                  style={{ transform: `rotate(${-pos.rotation}deg)` }}
                >
                  {energy.label}
                </span>
              </div>

              {/* 脉冲效果 */}
              {!isCollected && (
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${energy.color} animate-ping`}
                  style={{
                    animationDuration: '2s',
                    opacity: 0.3,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 已收集的能量展示 */}
      {collectedEnergies.length > 0 && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 px-4">
          <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-gray-400 text-xs">注入灵感:</span>
            {collectedEnergies.map((energy) => (
              <span
                key={energy.id}
                className={`px-2 py-1 rounded-full text-[10px] sm:text-xs text-white bg-gradient-to-r ${energy.color}`}
              >
                {energy.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 底部进度提示 */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-gray-500 text-xs animate-pulse">
          正在与宇宙建立连接...
        </p>
      </div>
    </div>
  );
}

function getBlockSize(size: 'small' | 'medium' | 'large'): number {
  switch (size) {
    case 'small': return 48;
    case 'medium': return 60;
    case 'large': return 72;
  }
}

// 添加 CSS 动画
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#energy-blocks-style')) {
  style.id = 'energy-blocks-style';
  document.head.appendChild(style);
}
