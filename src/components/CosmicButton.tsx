import { useState, useEffect } from 'react';

export type ButtonType = 'daily' | 'mood' | 'dream' | 'question' | 'call' | 'energy';

interface CosmicButtonProps {
  type: ButtonType;
  title: string;
  subtitle?: string;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
}

// 每种按钮的视觉配置
const BUTTON_CONFIGS: Record<ButtonType, {
  bg: string;
  glow: string;
  accent: string;
  icon: React.ReactNode;
  pattern: 'stars' | 'waves' | 'circles' | 'sparkles' | 'rings' | 'dots';
}> = {
  daily: {
    bg: 'from-amber-600 via-orange-500 to-yellow-400',
    glow: 'rgba(251, 191, 36, 0.4)',
    accent: '#FCD34D',
    pattern: 'stars',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        {/* 太阳主体 */}
        <circle cx="32" cy="32" r="16" fill="url(#sunCore)" />
        {/* 光芒 */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="32" y1="8" x2="32" y2="2"
            stroke="#FEF3C7"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${i * 30} 32 32)`}
            opacity={0.7 + (i % 2) * 0.3}
          />
        ))}
        {/* 高光 */}
        <circle cx="26" cy="26" r="5" fill="white" opacity="0.4" />
        <defs>
          <radialGradient id="sunCore" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="50%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  mood: {
    bg: 'from-violet-600 via-purple-500 to-fuchsia-400',
    glow: 'rgba(167, 139, 250, 0.4)',
    accent: '#C4B5FD',
    pattern: 'waves',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        {/* 螺旋星系 */}
        <ellipse cx="32" cy="32" rx="22" ry="8" fill="url(#galaxyGrad)" opacity="0.8" transform="rotate(-30 32 32)" />
        <ellipse cx="32" cy="32" rx="16" ry="5" fill="url(#galaxyGrad)" opacity="0.6" transform="rotate(20 32 32)" />
        <ellipse cx="32" cy="32" rx="10" ry="3" fill="#E9D5FF" opacity="0.7" transform="rotate(-10 32 32)" />
        {/* 中心光点 */}
        <circle cx="32" cy="32" r="4" fill="#F5D0FE" />
        <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.8" />
        {/* 星星点缀 */}
        {[[18, 20], [45, 25], [22, 44], [48, 40]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1 + i * 0.3} fill="white" opacity={0.5 + i * 0.1} />
        ))}
        <defs>
          <linearGradient id="galaxyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  dream: {
    bg: 'from-blue-600 via-indigo-500 to-cyan-400',
    glow: 'rgba(99, 102, 241, 0.4)',
    accent: '#A5B4FC',
    pattern: 'circles',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        {/* 月亮 */}
        <path
          d="M44 32 A18 18 0 1 1 26 14 A14 14 0 1 0 44 32"
          fill="url(#moonGrad)"
        />
        {/* 云朵 */}
        <ellipse cx="20" cy="48" rx="12" ry="6" fill="white" opacity="0.2" />
        <ellipse cx="44" cy="50" rx="10" ry="5" fill="white" opacity="0.15" />
        {/* 星星 */}
        {[[15, 15], [50, 20], [52, 38], [12, 35]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <path d="M0,-3 L0.8,-0.8 L3,0 L0.8,0.8 L0,3 L-0.8,0.8 L-3,0 L-0.8,-0.8 Z" fill="white" opacity={0.6 + i * 0.1} />
          </g>
        ))}
        <defs>
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF" />
            <stop offset="50%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#A5B4FC" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  question: {
    bg: 'from-rose-600 via-pink-500 to-red-400',
    glow: 'rgba(244, 114, 182, 0.4)',
    accent: '#FBCFE8',
    pattern: 'sparkles',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        {/* 宇宙之眼 */}
        <ellipse cx="32" cy="32" rx="20" ry="12" fill="url(#eyeOuter)" />
        <ellipse cx="32" cy="32" rx="14" ry="8" fill="url(#eyeMiddle)" />
        <circle cx="32" cy="32" r="6" fill="#1E1B4B" />
        <circle cx="32" cy="32" r="3" fill="url(#eyeCore)" />
        {/* 光芒 */}
        <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.9" />
        <circle cx="34" cy="33" r="0.8" fill="white" opacity="0.6" />
        {/* 问号装饰 */}
        <text x="50" y="18" fontSize="14" fontWeight="bold" fill="#FECDD3" opacity="0.6">?</text>
        <defs>
          <radialGradient id="eyeOuter" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#F43F5E" />
          </radialGradient>
          <radialGradient id="eyeMiddle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FECDD3" />
            <stop offset="100%" stopColor="#FB7185" />
          </radialGradient>
          <radialGradient id="eyeCore" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FDF2F8" />
            <stop offset="100%" stopColor="#FBCFE8" />
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  call: {
    bg: 'from-indigo-600 via-purple-600 to-violet-500',
    glow: 'rgba(139, 92, 246, 0.5)',
    accent: '#C4B5FD',
    pattern: 'rings',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        {/* 宇宙球体 */}
        <circle cx="32" cy="32" r="20" fill="url(#cosmosGrad)" />
        {/* 轨道环 */}
        <ellipse cx="32" cy="32" rx="26" ry="8" fill="none" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.5" transform="rotate(-25 32 32)" />
        <ellipse cx="32" cy="32" rx="22" ry="6" fill="none" stroke="#DDD6FE" strokeWidth="1" opacity="0.4" transform="rotate(35 32 32)" />
        {/* 核心光点 */}
        <circle cx="32" cy="32" r="6" fill="#EDE9FE" />
        <circle cx="30" cy="30" r="2" fill="white" opacity="0.7" />
        {/* 星星 */}
        {[[14, 18], [50, 22], [18, 46], [48, 44]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.2} fill="white" opacity={0.5 + i * 0.1} />
        ))}
        <defs>
          <radialGradient id="cosmosGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="40%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#6D28D9" />
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  energy: {
    bg: 'from-emerald-600 via-teal-500 to-cyan-400',
    glow: 'rgba(52, 211, 153, 0.4)',
    accent: '#A7F3D0',
    pattern: 'dots',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        {/* 能量水晶 */}
        <polygon points="32,8 48,28 42,56 22,56 16,28" fill="url(#crystalGrad)" />
        <polygon points="32,8 42,28 32,50 22,28" fill="url(#crystalInner)" opacity="0.5" />
        {/* 光芒 */}
        <line x1="32" y1="4" x2="32" y2="0" stroke="#A7F3D0" strokeWidth="2" />
        <line x1="52" y1="28" x2="58" y2="25" stroke="#A7F3D0" strokeWidth="1.5" opacity="0.7" />
        <line x1="12" y1="28" x2="6" y2="25" stroke="#A7F3D0" strokeWidth="1.5" opacity="0.7" />
        {/* 高光 */}
        <polygon points="26,18 32,12 34,24 28,26" fill="white" opacity="0.4" />
        <defs>
          <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="crystalInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
};

// 背景图案组件
function BackgroundPattern({ pattern, accent }: { pattern: string; accent: string }) {
  switch (pattern) {
    case 'stars':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: 2 + (i % 3) * 2,
                height: 2 + (i % 3) * 2,
                backgroundColor: accent,
                left: `${10 + (i * 7) % 80}%`,
                top: `${15 + (i * 11) % 70}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      );
    case 'waves':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 70 Q25 50 50 70 T100 70 V100 H0 Z" fill={accent} opacity="0.5" />
            <path d="M0 80 Q25 60 50 80 T100 80 V100 H0 Z" fill={accent} opacity="0.3" />
          </svg>
        </div>
      );
    case 'circles':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                borderColor: accent,
                width: 20 + i * 25,
                height: 20 + i * 25,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.5 - i * 0.08,
              }}
            />
          ))}
        </div>
      );
    case 'sparkles':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${15 + (i * 13) % 70}%`,
                top: `${20 + (i * 17) % 60}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8">
                <path d="M4,0 L4.5,3 L8,4 L4.5,5 L4,8 L3.5,5 L0,4 L3.5,3 Z" fill={accent} />
              </svg>
            </div>
          ))}
        </div>
      );
    case 'rings':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-4 rounded-full border-2" style={{ borderColor: accent }} />
          <div className="absolute inset-8 rounded-full border" style={{ borderColor: accent, opacity: 0.5 }} />
          <div className="absolute inset-12 rounded-full border" style={{ borderColor: accent, opacity: 0.3 }} />
        </div>
      );
    case 'dots':
      return (
        <div className="absolute inset-0 overflow-hidden opacity-25">
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full p-2">
            {[...Array(36)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 2 + (i % 3),
                    height: 2 + (i % 3),
                    backgroundColor: accent,
                    opacity: 0.3 + (i % 4) * 0.2,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

const SIZE_STYLES = {
  sm: { wrapper: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-[10px]', subtext: 'text-[8px]' },
  md: { wrapper: 'w-28 h-28', icon: 'w-12 h-12', text: 'text-xs', subtext: 'text-[9px]' },
  lg: { wrapper: 'w-36 h-36', icon: 'w-16 h-16', text: 'text-sm', subtext: 'text-[10px]' },
  xl: { wrapper: 'w-44 h-44', icon: 'w-20 h-20', text: 'text-base', subtext: 'text-xs' },
};

export function CosmicButton({
  type,
  title,
  subtitle,
  onClick,
  size = 'md',
  disabled = false,
  className = '',
}: CosmicButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [glowPhase, setGlowPhase] = useState(0);

  const config = BUTTON_CONFIGS[type];
  const sizeStyle = SIZE_STYLES[size];

  // 呼吸灯动画
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPhase(prev => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const glowIntensity = 0.4 + Math.sin(glowPhase * Math.PI / 180) * 0.2;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => { setIsHovered(true); setIsPressed(true); }}
      onTouchEnd={() => { setIsHovered(false); setIsPressed(false); }}
      disabled={disabled}
      className={`
        relative ${sizeStyle.wrapper} rounded-3xl overflow-hidden
        transition-all duration-300 ease-out
        ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        boxShadow: isHovered
          ? `0 0 40px ${config.glow}, 0 20px 40px rgba(0,0,0,0.3)`
          : `0 0 ${20 * glowIntensity}px ${config.glow}, 0 10px 30px rgba(0,0,0,0.2)`,
      }}
    >
      {/* 主背景渐变 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg}`} />

      {/* 背景图案 */}
      <BackgroundPattern pattern={config.pattern} accent={config.accent} />

      {/* 光泽效果 */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20"
        style={{ opacity: isHovered ? 0.8 : 0.5 }}
      />

      {/* 悬停时的高光 */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent animate-pulse" />
      )}

      {/* 边框光效 */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          border: `1px solid ${config.accent}`,
          opacity: 0.3 + glowIntensity * 0.3,
        }}
      />

      {/* 内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-2">
        {/* 图标 */}
        <div className={`${sizeStyle.icon} mb-1 drop-shadow-lg`}>
          {config.icon}
        </div>

        {/* 标题 */}
        <span className={`${sizeStyle.text} text-white font-medium tracking-wide drop-shadow-md`}>
          {title}
        </span>

        {/* 副标题 */}
        {subtitle && (
          <span className={`${sizeStyle.subtext} text-white/70 mt-0.5 text-center leading-tight`}>
            {subtitle}
          </span>
        )}
      </div>

      {/* 按下时的波纹效果 */}
      {isPressed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-full h-full rounded-3xl animate-ping"
            style={{ backgroundColor: config.accent, opacity: 0.2 }}
          />
        </div>
      )}
    </button>
  );
}
