import { useState } from 'react';
import type { MoodOption, SelectedMood } from '../types';
import { MOOD_OPTIONS, getCategoryLabel, getCategoryColor } from '../utils/moods';

interface MoodSelectorProps {
  selectedMoods: SelectedMood[];
  onMoodsChange: (moods: SelectedMood[]) => void;
  customNote: string;
  onCustomNoteChange: (note: string) => void;
}

export function MoodSelector({
  selectedMoods,
  onMoodsChange,
  customNote,
  onCustomNoteChange,
}: MoodSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<MoodOption['category']>('positive');

  const categories: MoodOption['category'][] = ['positive', 'neutral', 'negative'];

  const handleMoodToggle = (mood: MoodOption) => {
    const isSelected = selectedMoods.some((m) => m.mood.id === mood.id);

    if (isSelected) {
      onMoodsChange(selectedMoods.filter((m) => m.mood.id !== mood.id));
    } else {
      // 最多选择 3 个情绪
      if (selectedMoods.length >= 3) {
        onMoodsChange([...selectedMoods.slice(1), { mood }]);
      } else {
        onMoodsChange([...selectedMoods, { mood }]);
      }
    }
  };

  const filteredMoods = MOOD_OPTIONS.filter((m) => m.category === activeCategory);

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-purple-200 flex items-center gap-2">
          <span className="text-2xl">💫</span>
          此刻的心情
        </h2>
        <p className="text-sm text-gray-400 mt-1">选择最多 3 个描述你当前状态的情绪</p>
      </div>

      {/* 分类切换 */}
      <div className="flex gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeCategory === category
                ? `bg-gradient-to-r ${getCategoryColor(category)} text-white border border-white/20`
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
            }`}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>

      {/* 情绪标签 */}
      <div className="flex flex-wrap gap-2">
        {filteredMoods.map((mood) => {
          const isSelected = selectedMoods.some((m) => m.mood.id === mood.id);
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodToggle(mood)}
              className={`mood-tag px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
                isSelected
                  ? 'selected text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>

      {/* 已选情绪展示 */}
      {selectedMoods.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-400">已选择的情绪：</div>
          <div className="flex flex-wrap gap-2">
            {selectedMoods.map((selected, index) => (
              <span
                key={selected.mood.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm"
              >
                {index + 1}. {selected.mood.emoji} {selected.mood.label}
                <button
                  onClick={() => handleMoodToggle(selected.mood)}
                  className="ml-1 text-purple-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 自定义备注 */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">想对宇宙说点什么？（可选）</label>
        <textarea
          value={customNote}
          onChange={(e) => onCustomNoteChange(e.target.value)}
          placeholder="写下此刻你心中的想法..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
          rows={3}
          maxLength={200}
        />
        <div className="text-xs text-gray-500 text-right">{customNote.length}/200</div>
      </div>
    </div>
  );
}
