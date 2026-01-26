import { useState, useEffect, useRef } from 'react';
import type { MoodOption, SelectedMood } from '../types';
import { MOOD_OPTIONS } from '../utils/moods';

interface MoodBubblesProps {
  selectedMoods: SelectedMood[];
  onMoodsChange: (moods: SelectedMood[]) => void;
}

interface BubblePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export function MoodBubbles({ selectedMoods, onMoodsChange }: MoodBubblesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Map<string, BubblePosition>>(new Map());
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);

  // 初始化球体位置 - 响应式大小
  useEffect(() => {
    const initPositions = new Map<string, BubblePosition>();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 根据容器大小调整球体尺寸
    const isSmallScreen = rect.width < 360;
    const isMediumScreen = rect.width < 500;
    const sizeMultiplier = isSmallScreen ? 0.75 : isMediumScreen ? 0.85 : 1;
    const radiusBase = isSmallScreen ? 50 : isMediumScreen ? 65 : 80;
    const radiusRandom = isSmallScreen ? 40 : isMediumScreen ? 50 : 60;

    MOOD_OPTIONS.forEach((mood, index) => {
      const angle = (index / MOOD_OPTIONS.length) * Math.PI * 2;
      const radius = radiusBase + Math.random() * radiusRandom;
      const baseSize = mood.intensity === 'strong' ? 52 : mood.intensity === 'moderate' ? 44 : 38;
      const size = Math.round(baseSize * sizeMultiplier);

      initPositions.set(mood.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size,
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

          vx += (Math.random() - 0.5) * 0.02;
          vy += (Math.random() - 0.5) * 0.02;

          const maxSpeed = 0.8;
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
    const isSelected = selectedMoods.some((m) => m.mood.id === mood.id);

    if (isSelected) {
      onMoodsChange(selectedMoods.filter((m) => m.mood.id !== mood.id));
    } else {
      if (selectedMoods.length >= 3) {
        onMoodsChange([...selectedMoods.slice(1), { mood }]);
      } else {
        onMoodsChange([...selectedMoods, { mood }]);
      }
    }
  };

  const getCategoryGradient = (category: MoodOption['category']) => {
    switch (category) {
      case 'positive':
        return 'from-emerald-400 to-teal-500';
      case 'neutral':
        return 'from-blue-400 to-indigo-500';
      case 'negative':
        return 'from-purple-400 to-rose-500';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 浮动球体区域 */}
      <div
        ref={containerRef}
        className="relative h-56 xs:h-64 sm:h-72 md:h-80 glass-card rounded-xl sm:rounded-2xl overflow-hidden bubble-container"
      >
        {/* 提示文字 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <p className="text-gray-500/50 text-xs sm:text-sm">点击选择你的心情</p>
        </div>

        {/* 浮动球体 */}
        {MOOD_OPTIONS.map((mood) => {
          const pos = positions.get(mood.id);
          if (!pos) return null;

          const isSelected = selectedMoods.some((m) => m.mood.id === mood.id);
          const isHovered = hoveredMood === mood.id;

          return (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood)}
              onMouseEnter={() => setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
              onTouchStart={() => setHoveredMood(mood.id)}
              onTouchEnd={() => setTimeout(() => setHoveredMood(null), 1500)}
              className={`absolute rounded-full flex items-center justify-center cursor-pointer mood-bubble
                ${
                  isSelected
                    ? `bg-gradient-to-br ${getCategoryGradient(mood.category)} shadow-lg ring-2 ring-white/50`
                    : 'bg-white/10 active:bg-white/30'
                }
              `}
              style={{
                left: pos.x - pos.size / 2,
                top: pos.y - pos.size / 2,
                width: pos.size,
                height: pos.size,
                transform: isSelected ? 'scale(1.1)' : isHovered ? 'scale(1.08)' : 'scale(1)',
                boxShadow: isSelected
                  ? `0 0 20px rgba(100, 200, 255, 0.4), 0 0 40px rgba(100, 200, 255, 0.2)`
                  : 'none',
              }}
              aria-label={mood.label}
              aria-pressed={isSelected}
            >
              <span
                className={`text-base sm:text-lg md:text-xl select-none ${mood.intensity === 'strong' ? 'sm:text-2xl' : ''}`}
              >
                {mood.emoji}
              </span>

              {/* 悬浮标签 - 移动端也显示 */}
              {isHovered && (
                <div
                  className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-[10px] sm:text-xs rounded whitespace-nowrap z-50 pointer-events-none"
                  style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                >
                  {mood.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 已选情绪展示 */}
      {selectedMoods.length > 0 && (
        <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="text-[10px] sm:text-xs text-gray-400 font-mono tracking-wider">SELECTED MOODS (MAX 3)</div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {selectedMoods.map((selected) => (
              <span
                key={selected.mood.id}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm bg-gradient-to-r ${getCategoryGradient(selected.mood.category)} text-white`}
              >
                <span>{selected.mood.emoji}</span>
                <span className="hidden xs:inline">{selected.mood.label}</span>
                <button
                  onClick={() => handleMoodClick(selected.mood)}
                  className="ml-0.5 sm:ml-1 hover:bg-white/20 active:bg-white/30 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center transition-colors"
                  aria-label={`移除 ${selected.mood.label}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
