import type { MoodOption } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  // 正面情绪
  { id: 'happy-light', label: '一点点开心', emoji: '🙂', intensity: 'light', category: 'positive' },
  { id: 'happy-moderate', label: '比较开心', emoji: '😊', intensity: 'moderate', category: 'positive' },
  { id: 'happy-strong', label: '非常开心', emoji: '😄', intensity: 'strong', category: 'positive' },

  { id: 'peaceful-light', label: '一点点平静', emoji: '😌', intensity: 'light', category: 'positive' },
  { id: 'peaceful-moderate', label: '比较平静', emoji: '🧘', intensity: 'moderate', category: 'positive' },
  { id: 'peaceful-strong', label: '内心宁静', emoji: '☮️', intensity: 'strong', category: 'positive' },

  { id: 'grateful-light', label: '一点点感恩', emoji: '🙏', intensity: 'light', category: 'positive' },
  { id: 'grateful-moderate', label: '心怀感激', emoji: '💝', intensity: 'moderate', category: 'positive' },
  { id: 'grateful-strong', label: '满心感恩', emoji: '✨', intensity: 'strong', category: 'positive' },

  { id: 'satisfied-light', label: '一点点满足', emoji: '😊', intensity: 'light', category: 'positive' },
  { id: 'satisfied-moderate', label: '比较满足', emoji: '🥰', intensity: 'moderate', category: 'positive' },
  { id: 'satisfied-strong', label: '非常满足', emoji: '💫', intensity: 'strong', category: 'positive' },

  { id: 'hopeful-light', label: '一点点期待', emoji: '🌱', intensity: 'light', category: 'positive' },
  { id: 'hopeful-moderate', label: '满怀期待', emoji: '🌟', intensity: 'moderate', category: 'positive' },
  { id: 'hopeful-strong', label: '充满希望', emoji: '🌈', intensity: 'strong', category: 'positive' },

  // 中性情绪
  { id: 'calm-light', label: '有点平淡', emoji: '😐', intensity: 'light', category: 'neutral' },
  { id: 'calm-moderate', label: '比较平淡', emoji: '🙄', intensity: 'moderate', category: 'neutral' },
  { id: 'thinking-light', label: '若有所思', emoji: '🤔', intensity: 'light', category: 'neutral' },
  { id: 'thinking-moderate', label: '陷入沉思', emoji: '💭', intensity: 'moderate', category: 'neutral' },
  { id: 'curious-light', label: '有点好奇', emoji: '🧐', intensity: 'light', category: 'neutral' },
  { id: 'curious-moderate', label: '充满好奇', emoji: '❓', intensity: 'moderate', category: 'neutral' },

  // 负面情绪
  { id: 'tired-light', label: '一点点疲惫', emoji: '😪', intensity: 'light', category: 'negative' },
  { id: 'tired-moderate', label: '比较疲惫', emoji: '😴', intensity: 'moderate', category: 'negative' },
  { id: 'tired-strong', label: '非常疲惫', emoji: '🥱', intensity: 'strong', category: 'negative' },

  { id: 'anxious-light', label: '一点点焦虑', emoji: '😟', intensity: 'light', category: 'negative' },
  { id: 'anxious-moderate', label: '比较焦虑', emoji: '😰', intensity: 'moderate', category: 'negative' },
  { id: 'anxious-strong', label: '非常焦虑', emoji: '😨', intensity: 'strong', category: 'negative' },

  { id: 'sad-light', label: '一点点难过', emoji: '😢', intensity: 'light', category: 'negative' },
  { id: 'sad-moderate', label: '比较难过', emoji: '😭', intensity: 'moderate', category: 'negative' },
  { id: 'sad-strong', label: '非常难过', emoji: '💔', intensity: 'strong', category: 'negative' },

  { id: 'bored-light', label: '一点点无聊', emoji: '😑', intensity: 'light', category: 'negative' },
  { id: 'bored-moderate', label: '比较沉闷', emoji: '😶', intensity: 'moderate', category: 'negative' },
  { id: 'bored-strong', label: '非常沉闷', emoji: '🫥', intensity: 'strong', category: 'negative' },

  { id: 'lonely-light', label: '一点点孤单', emoji: '🌙', intensity: 'light', category: 'negative' },
  { id: 'lonely-moderate', label: '比较孤独', emoji: '🥀', intensity: 'moderate', category: 'negative' },
  { id: 'lonely-strong', label: '深感孤独', emoji: '🌑', intensity: 'strong', category: 'negative' },

  { id: 'stressed-light', label: '一点点压力', emoji: '😤', intensity: 'light', category: 'negative' },
  { id: 'stressed-moderate', label: '压力较大', emoji: '😩', intensity: 'moderate', category: 'negative' },
  { id: 'stressed-strong', label: '压力山大', emoji: '🤯', intensity: 'strong', category: 'negative' },
];

export function getMoodsByCategory(category: MoodOption['category']): MoodOption[] {
  return MOOD_OPTIONS.filter((m) => m.category === category);
}

export function getCategoryLabel(category: MoodOption['category']): string {
  const labels: Record<MoodOption['category'], string> = {
    positive: '积极情绪',
    neutral: '中性情绪',
    negative: '消极情绪',
  };
  return labels[category];
}

export function getCategoryColor(category: MoodOption['category']): string {
  const colors: Record<MoodOption['category'], string> = {
    positive: 'from-emerald-500/20 to-teal-500/20',
    neutral: 'from-blue-500/20 to-indigo-500/20',
    negative: 'from-purple-500/20 to-rose-500/20',
  };
  return colors[category];
}
