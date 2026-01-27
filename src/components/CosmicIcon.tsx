import { useState, useEffect } from 'react';

export type IconType =
  | 'daily' | 'mood' | 'dream' | 'question'
  | 'joyful' | 'peaceful' | 'melancholy' | 'anxious' | 'hopeful'
  | 'universe' | 'call' | 'voice' | 'back' | 'send'
  | 'light' | 'warmth' | 'wisdom' | 'strength' | 'peace' | 'mystery';

interface CosmicIconProps {
  type: IconType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

// 图标 SVG 定义
const ICON_SVGS: Record<IconType, React.ReactNode> = {
  // 功能模块图标
  daily: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        <filter id="sun-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="25" fill="url(#sun-grad)" filter="url(#sun-glow)" />
      {[...Array(8)].map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="15"
          x2="50"
          y2="5"
          stroke="#FCD34D"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 50 50)`}
          opacity="0.8"
        />
      ))}
      <circle cx="42" cy="42" r="6" fill="white" opacity="0.4" />
    </svg>
  ),

  mood: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="mood-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <path
        d="M50 10 C70 25, 85 40, 85 55 C85 75, 70 90, 50 90 C30 90, 15 75, 15 55 C15 40, 30 25, 50 10"
        fill="url(#mood-grad)"
        opacity="0.9"
      />
      <ellipse cx="50" cy="50" rx="20" ry="25" fill="#C4B5FD" opacity="0.3" />
      <circle cx="35" cy="40" r="5" fill="white" opacity="0.5" />
      <circle cx="60" cy="55" r="3" fill="white" opacity="0.3" />
    </svg>
  ),

  dream: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="dream-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <path
        d="M70 50 A25 25 0 1 1 45 25 A18 18 0 1 0 70 50"
        fill="url(#dream-grad)"
      />
      {[[25, 20], [75, 30], [60, 70], [30, 75], [85, 55]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2 + i % 2} fill="white" opacity={0.6 + i * 0.08} />
      ))}
      <circle cx="55" cy="40" r="4" fill="#BFDBFE" opacity="0.5" />
    </svg>
  ),

  question: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="question-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
      </defs>
      {[[20, 25], [80, 25], [50, 15], [30, 85], [70, 80]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3 + i % 3} fill="#FDF4FF" opacity={0.5 + i * 0.1}>
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="50" y="65" textAnchor="middle" fontSize="40" fontWeight="bold" fill="url(#question-grad)">?</text>
    </svg>
  ),

  // 心情图标
  joyful: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="joy-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="35" fill="url(#joy-grad)" />
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="50" y1="10" x2="50" y2="3"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${i * 30} 50 50)`}
          opacity="0.7"
        />
      ))}
      <circle cx="40" cy="40" r="8" fill="white" opacity="0.5" />
    </svg>
  ),

  peaceful: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="peace-bg" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="60" rx="45" ry="20" fill="url(#peace-bg)" opacity="0.8" />
      <ellipse cx="50" cy="55" rx="35" ry="12" fill="#67E8F9" opacity="0.5" />
      <ellipse cx="50" cy="50" rx="25" ry="8" fill="#A5F3FC" opacity="0.4" />
      <circle cx="50" cy="25" r="8" fill="#F0FDFA" opacity="0.9" />
      <circle cx="46" cy="23" r="2" fill="white" opacity="0.6" />
    </svg>
  ),

  melancholy: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="rain-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="35" rx="35" ry="20" fill="url(#rain-grad)" />
      {[[30, 55], [45, 60], [60, 55], [35, 75], [55, 80], [70, 70]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2" ry="6" fill="#9CA3AF" opacity={0.4 + i * 0.1}>
          <animate attributeName="cy" values={`${y};${y + 15};${y}`} dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
    </svg>
  ),

  anxious: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="anx-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <path
        d="M50 10 Q80 30 70 50 Q90 70 50 90 Q10 70 30 50 Q20 30 50 10"
        fill="none"
        stroke="url(#anx-grad)"
        strokeWidth="4"
      />
      <circle cx="50" cy="50" r="15" fill="#A78BFA" opacity="0.5" />
      <circle cx="50" cy="50" r="8" fill="#C4B5FD" opacity="0.7" />
    </svg>
  ),

  hopeful: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="hope-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F9A8D4" />
          <stop offset="50%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="75" rx="40" ry="15" fill="#E5E7EB" opacity="0.3" />
      <polygon
        points="50,15 56,35 78,35 60,48 67,68 50,55 33,68 40,48 22,35 44,35"
        fill="url(#hope-grad)"
      />
      <polygon
        points="50,25 53,35 63,35 55,42 58,52 50,46 42,52 45,42 37,35 47,35"
        fill="white"
        opacity="0.4"
      />
    </svg>
  ),

  // UI 图标
  universe: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="uni-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#uni-grad)" opacity="0.8" />
      <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="#A5B4FC" strokeWidth="2" opacity="0.6" transform="rotate(-20 50 50)" />
      <ellipse cx="50" cy="50" rx="25" ry="8" fill="none" stroke="#C7D2FE" strokeWidth="1.5" opacity="0.5" transform="rotate(30 50 50)" />
      <circle cx="50" cy="50" r="8" fill="#E0E7FF" />
      {[[30, 30], [70, 35], [25, 65], [75, 70], [50, 20]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.5} fill="white" opacity={0.6 + i * 0.08} />
      ))}
    </svg>
  ),

  call: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="call-grad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <path d="M20 50 Q35 30 50 50 Q65 70 80 50" fill="none" stroke="url(#call-grad)" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 50 Q35 70 50 50 Q65 30 80 50" fill="none" stroke="url(#call-grad)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <circle cx="50" cy="50" r="8" fill="#C4B5FD" />
    </svg>
  ),

  voice: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="voice-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="40" y="20" width="20" height="35" rx="10" fill="url(#voice-grad)" />
      <path d="M30 45 Q30 70 50 70 Q70 70 70 45" fill="none" stroke="#A78BFA" strokeWidth="3" />
      <line x1="50" y1="70" x2="50" y2="85" stroke="#A78BFA" strokeWidth="3" />
      <line x1="35" y1="85" x2="65" y2="85" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  back: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M60 25 L35 50 L60 75" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  send: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="send-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      <path d="M50 80 L50 20 M30 40 L50 20 L70 40" fill="none" stroke="url(#send-grad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // 能量块图标
  light: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="light-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <filter id="light-glow">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="35" fill="url(#light-grad)" filter="url(#light-glow)" opacity="0.5" />
      <circle cx="50" cy="50" r="25" fill="url(#light-grad)" />
      <circle cx="40" cy="40" r="8" fill="white" opacity="0.6" />
    </svg>
  ),

  warmth: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="warmth-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="50%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="30" fill="url(#warmth-grad)" />
      <ellipse cx="50" cy="55" rx="20" ry="15" fill="#FDBA74" opacity="0.4" />
      <circle cx="42" cy="42" r="6" fill="white" opacity="0.5" />
    </svg>
  ),

  wisdom: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="wisdom-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#DDD6FE" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="30" fill="url(#wisdom-grad)" />
      <polygon points="50,25 55,45 75,45 59,57 65,77 50,65 35,77 41,57 25,45 45,45" fill="#EDE9FE" opacity="0.4" transform="scale(0.5) translate(50 50)" />
      <circle cx="42" cy="42" r="5" fill="white" opacity="0.5" />
    </svg>
  ),

  strength: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="strength-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="30" fill="url(#strength-grad)" />
      <path d="M50 30 L60 50 L50 45 L40 50 Z" fill="#D1FAE5" opacity="0.6" />
      <circle cx="42" cy="42" r="5" fill="white" opacity="0.5" />
    </svg>
  ),

  peace: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="peace-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="50%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0891B2" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="30" fill="url(#peace-grad)" />
      <ellipse cx="50" cy="55" rx="18" ry="10" fill="#CFFAFE" opacity="0.4" />
      <circle cx="42" cy="42" r="5" fill="white" opacity="0.5" />
    </svg>
  ),

  mystery: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="mystery-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5D0FE" />
          <stop offset="50%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#A21CAF" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="30" fill="url(#mystery-grad)" />
      <path d="M35 50 Q50 30 65 50 Q50 70 35 50" fill="#FAE8FF" opacity="0.3" />
      <circle cx="42" cy="42" r="5" fill="white" opacity="0.5" />
      <circle cx="60" cy="55" r="3" fill="white" opacity="0.3" />
    </svg>
  ),
};

const SIZE_CLASSES = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

export function CosmicIcon({ type, size = 'md', className = '', animated = false }: CosmicIconProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        ${SIZE_CLASSES[size]}
        ${className}
        ${animated ? 'animate-pulse' : ''}
        transition-all duration-300
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
      `}
    >
      {ICON_SVGS[type]}
    </div>
  );
}
