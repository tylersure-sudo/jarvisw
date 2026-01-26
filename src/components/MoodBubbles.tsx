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

          return (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood)}
              onMouseEnter={() => setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
              onTouchStart={() => setHoveredMood(mood.id)}
              onTouchEnd={() => setTimeout(() => setHoveredMood(null), 1500)}
              className={`absolute rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                ${isSelected
                  ? `bg-gradient-to-br ${gradient} shadow-2xl ring-2 ring-white/40`
                  : `bg-gradient-to-br ${gradient} opacity-60 hover:opacity-90`
                }
              `}
              style={{
                left: pos.x - pos.size / 2,
                top: pos.y - pos.size / 2,
                width: pos.size,
                height: pos.size,
                transform: isSelected ? 'scale(1.15)' : isHovered ? 'scale(1.08)' : 'scale(1)',
                boxShadow: isSelected
                  ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`
                  : isHovered
                    ? `0 0 15px ${glowColor}`
                    : 'none',
              }}
              aria-label={mood.label}
              aria-pressed={isSelected}
            >
              <span className="text-2xl sm:text-3xl select-none mb-0.5">
                {mood.emoji}
              </span>
              <span className="text-[10px] sm:text-xs text-white/90 font-medium">
                {mood.label}
              </span>

              {/* 选中时的光环效果 */}
              {isSelected && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-white/20" style={{ animationDuration: '2s' }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
