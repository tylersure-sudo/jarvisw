import { useState, useEffect, useRef } from 'react';
import type { MoodOption, SelectedMood } from '../types';
import { MOOD_OPTIONS, getMoodGradient, getMoodGlowColor } from '../utils/moods';

interface MoodBubblesProps {
  selectedMood: SelectedMood | null;
  onMoodChange: (mood: SelectedMood | null) => void;
}

interface BubblePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

// 心情ID到丰富图标的映射
const MOOD_ICONS: Record<string, React.ReactNode> = {
  joyful: (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <defs>
        <radialGradient id="joyGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="18" fill="url(#joyGrad)" />
      {[...Array(10)].map((_, i) => (
        <line key={i} x1="24" y1="4" x2="24" y2="1" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i * 36} 24 24)`} opacity="0.8" />
      ))}
      <circle cx="18" cy="18" r="4" fill="white" opacity="0.5" />
    </svg>
  ),
  peaceful: (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <defs>
        <linearGradient id="peaceGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="30" rx="20" ry="10" fill="url(#peaceGrad)" opacity="0.8" />
      <ellipse cx="24" cy="26" rx="14" ry="6" fill="#67E8F9" opacity="0.5" />
      <ellipse cx="24" cy="22" rx="8" ry="3" fill="#A5F3FC" opacity="0.4" />
      <circle cx="24" cy="12" r="5" fill="#ECFEFF" />
      <circle cx="22" cy="10" r="2" fill="white" opacity="0.7" />
    </svg>
  ),
  melancholy: (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <defs>
        <linearGradient id="melGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="16" rx="18" ry="10" fill="url(#melGrad)" />
      {[[14, 28], [22, 32], [30, 28], [18, 40], [28, 42], [34, 36]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2" ry="5" fill="#9CA3AF" opacity={0.4 + i * 0.08}>
          <animate attributeName="cy" values={`${y};${Number(y) + 8};${y}`} dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
    </svg>
  ),
  anxious: (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <defs>
        <linearGradient id="anxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <path d="M24 6 Q42 16 34 24 Q44 34 24 44 Q4 34 14 24 Q6 16 24 6" fill="none" stroke="url(#anxGrad)" strokeWidth="3">
        <animate attributeName="d" values="M24 6 Q42 16 34 24 Q44 34 24 44 Q4 34 14 24 Q6 16 24 6;M24 8 Q40 18 32 24 Q42 32 24 42 Q6 32 16 24 Q8 18 24 8;M24 6 Q42 16 34 24 Q44 34 24 44 Q4 34 14 24 Q6 16 24 6" dur="2s" repeatCount="indefinite" />
      </path>
      <circle cx="24" cy="24" r="8" fill="#A78BFA" opacity="0.5" />
      <circle cx="24" cy="24" r="4" fill="#DDD6FE" />
    </svg>
  ),
  hopeful: (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <defs>
        <linearGradient id="hopeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F9A8D4" />
          <stop offset="50%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="40" rx="16" ry="5" fill="#E5E7EB" opacity="0.2" />
      <polygon points="24,6 28,18 40,18 30,26 34,38 24,30 14,38 18,26 8,18 20,18" fill="url(#hopeGrad)" />
      <polygon points="24,12 26,20 32,20 27,25 29,32 24,28 19,32 21,25 16,20 22,20" fill="white" opacity="0.4" />
    </svg>
  ),
};

export function MoodBubbles({ selectedMood, onMoodChange }: MoodBubblesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Map<string, BubblePosition>>(new Map());
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);

  // 初始化球体位置 - 5个球均匀分布
  useEffect(() => {
    const initPositions = new Map<string, BubblePosition>();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 根据容器大小调整球体尺寸
    const isSmallScreen = rect.width < 360;
    const radiusBase = isSmallScreen ? 60 : 80;
    const baseSize = isSmallScreen ? 56 : 68;

    MOOD_OPTIONS.forEach((mood, index) => {
      const angle = (index / MOOD_OPTIONS.length) * Math.PI * 2 - Math.PI / 2;
      const radius = radiusBase + Math.random() * 20;

      initPositions.set(mood.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: baseSize,
      });
    });

    setPositions(initPositions);
  }, []);

  // 动画更新
  useEffect(() => {
    const container = containerRef.current;
    if (!container || positions.size === 0) return;

    const animate = () => {
      const rect = container.getBoundingClientRect();

      setPositions((prev) => {
        const next = new Map(prev);

        next.forEach((pos, id) => {
          let { x, y, vx, vy, size } = pos;

          x += vx;
          y += vy;

          const padding = size / 2 + 10;
          if (x < padding || x > rect.width - padding) {
            vx = -vx * 0.8;
            x = Math.max(padding, Math.min(rect.width - padding, x));
          }
          if (y < padding || y > rect.height - padding) {
            vy = -vy * 0.8;
            y = Math.max(padding, Math.min(rect.height - padding, y));
          }

          vx += (Math.random() - 0.5) * 0.015;
          vy += (Math.random() - 0.5) * 0.015;

          const maxSpeed = 0.5;
          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > maxSpeed) {
            vx = (vx / speed) * maxSpeed;
            vy = (vy / speed) * maxSpeed;
          }

          next.set(id, { x, y, vx, vy, size });
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
  }, [positions.size]);

  const handleMoodClick = (mood: MoodOption) => {
    const isSelected = selectedMood?.mood.id === mood.id;
    if (isSelected) {
      onMoodChange(null);
    } else {
      onMoodChange({ mood });
    }
  };

  return (
    <div className="space-y-3">
      {/* 提示文字 */}
      <div className="text-center">
        <span className="text-gray-400 text-xs sm:text-sm font-light">
          {selectedMood ? `当前心境：${selectedMood.mood.label}` : '选择你此刻的心境'}
        </span>
      </div>

      {/* 浮动球体区域 */}
      <div
        ref={containerRef}
        className="relative h-52 xs:h-56 sm:h-64 glass-card rounded-xl sm:rounded-2xl overflow-hidden"
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 blur-2xl" />
        </div>

        {/* 浮动球体 - 5个简化心情 */}
        {MOOD_OPTIONS.map((mood) => {
          const pos = positions.get(mood.id);
          if (!pos) return null;

          const isSelected = selectedMood?.mood.id === mood.id;
          const isHovered = hoveredMood === mood.id;
          const gradient = getMoodGradient(mood.id);
          const glowColor = getMoodGlowColor(mood.id);
          const moodIcon = MOOD_ICONS[mood.id];

          return (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood)}
              onMouseEnter={() => setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
              onTouchStart={() => setHoveredMood(mood.id)}
              onTouchEnd={() => setTimeout(() => setHoveredMood(null), 1500)}
              className={`absolute rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden
                ${isSelected
                  ? `bg-gradient-to-br ${gradient} shadow-2xl ring-2 ring-white/40`
                  : `bg-gradient-to-br ${gradient} opacity-70 hover:opacity-95`
                }
              `}
              style={{
                left: pos.x - pos.size / 2,
                top: pos.y - pos.size / 2,
                width: pos.size,
                height: pos.size,
                transform: isSelected ? 'scale(1.15)' : isHovered ? 'scale(1.08)' : 'scale(1)',
                boxShadow: isSelected
                  ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor}, inset 0 0 20px rgba(255,255,255,0.1)`
                  : isHovered
                    ? `0 0 20px ${glowColor}, inset 0 0 15px rgba(255,255,255,0.05)`
                    : `0 4px 15px rgba(0,0,0,0.2)`,
              }}
              aria-label={mood.label}
              aria-pressed={isSelected}
            >
              {/* 光泽效果 */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 rounded-full" />

              {/* 图标 */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative z-10">
                {moodIcon}
              </div>
              <span className="text-[10px] sm:text-xs text-white font-medium mt-0.5 drop-shadow-md relative z-10">
                {mood.label}
              </span>

              {/* 边框 */}
              <div className="absolute inset-0 rounded-full border border-white/20" />

              {/* 选中时的光环效果 */}
              {isSelected && (
                <>
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-[-4px] rounded-full border border-white/30 animate-pulse" />
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
