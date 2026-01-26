import type { MoodOption } from '../types';

/**
 * 简化的心情选项 - 5个核心状态
 * Simplified mood options - 5 core states
 */
export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'joyful',
    label: '开心',
    emoji: '☀️',
    intensity: 'moderate',
    category: 'positive',
  },
  {
    id: 'peaceful',
    label: '平和',
    emoji: '🌊',
    intensity: 'moderate',
    category: 'neutral',
  },
  {
    id: 'melancholy',
    label: '沮丧',
    emoji: '🌧️',
    intensity: 'moderate',
    category: 'negative',
  },
  {
    id: 'anxious',
    label: '焦虑',
    emoji: '🌀',
    intensity: 'moderate',
    category: 'negative',
  },
  {
    id: 'hopeful',
    label: '期待',
    emoji: '🌟',
    intensity: 'moderate',
    category: 'positive',
  },
];

/** 获取心情的颜色渐变 */
export function getMoodGradient(moodId: string): string {
  const gradients: Record<string, string> = {
    joyful: 'from-amber-400 to-orange-500',
    peaceful: 'from-cyan-400 to-blue-500',
    melancholy: 'from-slate-400 to-indigo-500',
    anxious: 'from-purple-400 to-fuchsia-500',
    hopeful: 'from-emerald-400 to-teal-500',
  };
  return gradients[moodId] || 'from-gray-400 to-gray-500';
}

/** 获取心情的光晕颜色 */
export function getMoodGlowColor(moodId: string): string {
  const glows: Record<string, string> = {
    joyful: 'rgba(251, 191, 36, 0.5)',
    peaceful: 'rgba(34, 211, 238, 0.5)',
    melancholy: 'rgba(99, 102, 241, 0.5)',
    anxious: 'rgba(192, 132, 252, 0.5)',
    hopeful: 'rgba(52, 211, 153, 0.5)',
  };
  return glows[moodId] || 'rgba(156, 163, 175, 0.5)';
}

/** 根据类别获取心情列表 */
export function getMoodsByCategory(category: MoodOption['category']): MoodOption[] {
  return MOOD_OPTIONS.filter((m) => m.category === category);
}

/** 获取类别标签 */
export function getCategoryLabel(category: MoodOption['category']): string {
  const labels: Record<MoodOption['category'], string> = {
    positive: '积极',
    neutral: '中性',
    negative: '消极',
  };
  return labels[category];
}

/** 获取类别颜色 */
export function getCategoryColor(category: MoodOption['category']): string {
  const colors: Record<MoodOption['category'], string> = {
    positive: 'from-amber-500/30 to-emerald-500/30',
    neutral: 'from-cyan-500/30 to-blue-500/30',
    negative: 'from-purple-500/30 to-rose-500/30',
  };
  return colors[category];
}
