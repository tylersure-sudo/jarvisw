/**
 * 文化智慧模块类型定义
 * Cultural Wisdom Module Types
 */

import type { SpaceTimeContext, SelectedMood } from '../../types';

// ==================== 易经 I Ching ====================

/** 八卦 - Eight Trigrams */
export interface Trigram {
  name: string;        // 卦名
  symbol: string;      // 符号 (☰, ☱, etc.)
  nature: string;      // 自然象征 (天、泽、火、雷等)
  attribute: string;   // 属性 (健、悦、明、动等)
  element: FiveElement;// 对应五行
  direction: string;   // 方位
  family: string;      // 家庭角色
  bodyPart: string;    // 对应身体部位
  animal: string;      // 对应动物
}

/** 六十四卦 - 64 Hexagrams */
export interface Hexagram {
  number: number;      // 卦序 (1-64)
  name: string;        // 卦名
  upperTrigram: string;// 上卦
  lowerTrigram: string;// 下卦
  judgment: string;    // 卦辞
  image: string;       // 象辞
  meaning: string;     // 现代解读
  advice: string;      // 建议
}

/** 易经分析结果 */
export interface IChingReading {
  hexagram: Hexagram;
  changingLines: number[]; // 变爻 (0-5)
  interpretation: string;
  guidance: string;
}

// ==================== 六爻 Six Lines ====================

/** 爻位 - Line Position */
export interface YaoLine {
  position: number;    // 位置 (1-6, 从下到上)
  type: 'yang' | 'yin';// 阳爻或阴爻
  changing: boolean;   // 是否变爻
  text: string;        // 爻辞
  meaning: string;     // 含义
}

/** 六爻卦象 */
export interface SixLinesGua {
  lines: YaoLine[];
  worldLine: number;   // 世爻位置
  responseLine: number;// 应爻位置
  subject: string;     // 主卦
  object: string;      // 变卦
}

/** 六爻预测结果 */
export interface SixLinesPrediction {
  gua: SixLinesGua;
  analysis: string;
  shortTerm: string;   // 近期预测
  longTerm: string;    // 长期趋势
  advice: string;
}

// ==================== 黄帝内经 Five Elements ====================

/** 五行 - Five Elements */
export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

/** 五行属性 */
export interface ElementProperties {
  element: FiveElement;
  chineseName: string; // 木火土金水
  season: string;      // 对应季节
  direction: string;   // 方位
  color: string;       // 颜色
  emotion: string;     // 情志
  organ: string;       // 脏腑
  taste: string;       // 味道
  sound: string;       // 声音
  climate: string;     // 气候
}

/** 五行关系 */
export interface ElementRelation {
  generating: FiveElement;  // 生我者
  generated: FiveElement;   // 我生者
  controlling: FiveElement; // 克我者
  controlled: FiveElement;  // 我克者
}

/** 黄帝内经分析结果 */
export interface HuangdiAnalysis {
  dominantElement: FiveElement;
  elementBalance: Record<FiveElement, number>; // -1 to 1 (不足到过盛)
  healthAdvice: string;
  emotionAdvice: string;
  lifestyleAdvice: string;
  seasonalGuidance: string;
}

// ==================== 西方心理学 Psychology ====================

/** 荣格原型 - Jungian Archetypes */
export type JungianArchetype =
  | 'hero'      // 英雄
  | 'mentor'    // 导师
  | 'explorer'  // 探索者
  | 'rebel'     // 反叛者
  | 'lover'     // 恋人
  | 'creator'   // 创造者
  | 'jester'    // 小丑
  | 'sage'      // 智者
  | 'innocent'  // 天真者
  | 'orphan'    // 孤儿
  | 'caregiver' // 照顾者
  | 'ruler';    // 统治者

/** 情绪维度 (PAD模型) */
export interface EmotionalDimension {
  pleasure: number;    // 愉悦度 (-1 to 1)
  arousal: number;     // 唤醒度 (-1 to 1)
  dominance: number;   // 控制度 (-1 to 1)
}

/** 心理状态分析 */
export interface PsychologyAnalysis {
  archetype: JungianArchetype;
  archetypeDescription: string;
  emotionalState: EmotionalDimension;
  cognitiveFrame: string;      // 认知框架
  copingStyle: string;         // 应对方式
  growthOpportunity: string;   // 成长机会
  affirmation: string;         // 积极肯定语
}

// ==================== 综合智慧分析 ====================

/** 文化智慧综合分析输入 */
export interface WisdomInput {
  context: SpaceTimeContext;
  moods: SelectedMood[];
  timestamp: Date;
}

/** 文化智慧综合分析结果 */
export interface WisdomAnalysis {
  iChing: IChingReading;
  sixLines: SixLinesPrediction;
  huangdi: HuangdiAnalysis;
  psychology: PsychologyAnalysis;

  // 综合解读
  synthesis: {
    theme: string;           // 核心主题
    eastWestBridge: string;  // 东西方智慧桥接
    practicalAdvice: string; // 实践建议
    meditation: string;      // 冥想指引
    affirmation: string;     // 肯定语句
  };
}

/** AI提示词模板数据 */
export interface PromptData {
  wisdomAnalysis: WisdomAnalysis;
  userContext: {
    time: string;
    season: string;
    weather: string;
    location: string;
    moods: string[];
  };
  culturalReferences: {
    hexagramName: string;
    hexagramMeaning: string;
    dominantElement: string;
    elementAdvice: string;
    archetype: string;
    archetypeDescription: string;
  };
}
