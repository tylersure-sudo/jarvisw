/**
 * 黄帝内经·五行模块 - Five Elements from Yellow Emperor's Classic
 * 基于中医五行理论分析身心状态
 */

import type { SpaceTimeContext, SelectedMood } from '../../types';
import type { FiveElement, ElementProperties, ElementRelation, HuangdiAnalysis } from './types';

// ==================== 五行基础数据 ====================

export const FIVE_ELEMENTS: Record<FiveElement, ElementProperties> = {
  wood: {
    element: 'wood',
    chineseName: '木',
    season: 'spring',
    direction: '东',
    color: '青',
    emotion: '怒',
    organ: '肝',
    taste: '酸',
    sound: '呼',
    climate: '风',
  },
  fire: {
    element: 'fire',
    chineseName: '火',
    season: 'summer',
    direction: '南',
    color: '赤',
    emotion: '喜',
    organ: '心',
    taste: '苦',
    sound: '笑',
    climate: '热',
  },
  earth: {
    element: 'earth',
    chineseName: '土',
    season: 'late_summer', // 长夏
    direction: '中',
    color: '黄',
    emotion: '思',
    organ: '脾',
    taste: '甘',
    sound: '歌',
    climate: '湿',
  },
  metal: {
    element: 'metal',
    chineseName: '金',
    season: 'autumn',
    direction: '西',
    color: '白',
    emotion: '悲',
    organ: '肺',
    taste: '辛',
    sound: '哭',
    climate: '燥',
  },
  water: {
    element: 'water',
    chineseName: '水',
    season: 'winter',
    direction: '北',
    color: '黑',
    emotion: '恐',
    organ: '肾',
    taste: '咸',
    sound: '呻',
    climate: '寒',
  },
};

// 五行相生相克关系
export const ELEMENT_RELATIONS: Record<FiveElement, ElementRelation> = {
  wood: { generating: 'water', generated: 'fire', controlling: 'metal', controlled: 'earth' },
  fire: { generating: 'wood', generated: 'earth', controlling: 'water', controlled: 'metal' },
  earth: { generating: 'fire', generated: 'metal', controlling: 'wood', controlled: 'water' },
  metal: { generating: 'earth', generated: 'water', controlling: 'fire', controlled: 'wood' },
  water: { generating: 'metal', generated: 'wood', controlling: 'earth', controlled: 'fire' },
};

// 季节与五行对应
const SEASON_ELEMENT: Record<string, FiveElement> = {
  spring: 'wood',
  summer: 'fire',
  autumn: 'metal',
  winter: 'water',
};

// 时辰与五行对应 (简化版)
const HOUR_ELEMENT: Record<number, FiveElement> = {
  // 寅卯时(3-7) - 木
  3: 'wood', 4: 'wood', 5: 'wood', 6: 'wood',
  // 巳午时(9-13) - 火
  9: 'fire', 10: 'fire', 11: 'fire', 12: 'fire',
  // 丑辰未戌时(1-3, 7-9, 13-15, 19-21) - 土
  1: 'earth', 2: 'earth', 7: 'earth', 8: 'earth',
  13: 'earth', 14: 'earth', 19: 'earth', 20: 'earth',
  // 申酉时(15-19) - 金
  15: 'metal', 16: 'metal', 17: 'metal', 18: 'metal',
  // 亥子时(21-1) - 水
  21: 'water', 22: 'water', 23: 'water', 0: 'water',
};

// ==================== 五行分析逻辑 ====================

/** 获取季节对应的五行 */
function getSeasonElement(season: string): FiveElement {
  return SEASON_ELEMENT[season] || 'earth';
}

/** 获取时辰对应的五行 */
function getHourElement(hour: number): FiveElement {
  return HOUR_ELEMENT[hour] || 'earth';
}

/** 根据情绪判断五行 */
function getMoodElement(moods: SelectedMood[]): FiveElement | null {
  if (moods.length === 0) return null;

  const primaryMood = moods[0].mood;
  const label = primaryMood.label.toLowerCase();

  // 情绪与五行映射
  // 怒 - 木 | 喜 - 火 | 思 - 土 | 悲 - 金 | 恐 - 水
  if (label.includes('愤') || label.includes('怒') || label.includes('烦') || label.includes('急')) {
    return 'wood';
  }
  if (label.includes('喜') || label.includes('乐') || label.includes('兴') || label.includes('开心') || label.includes('快乐')) {
    return 'fire';
  }
  if (label.includes('思') || label.includes('虑') || label.includes('忧') || label.includes('担') || label.includes('焦')) {
    return 'earth';
  }
  if (label.includes('悲') || label.includes('伤') || label.includes('哀') || label.includes('失') || label.includes('孤')) {
    return 'metal';
  }
  if (label.includes('恐') || label.includes('怕') || label.includes('惧') || label.includes('紧张') || label.includes('不安')) {
    return 'water';
  }

  // 根据情绪类别默认映射
  if (primaryMood.category === 'positive') return 'fire';
  if (primaryMood.category === 'negative') return 'water';
  return 'earth';
}

/** 根据天气判断五行 */
function getWeatherElement(weatherDesc: string): FiveElement {
  const lower = weatherDesc.toLowerCase();

  if (lower.includes('风') || lower.includes('wind')) return 'wood';
  if (lower.includes('热') || lower.includes('晴') || lower.includes('sun') || lower.includes('hot')) return 'fire';
  if (lower.includes('湿') || lower.includes('humid') || lower.includes('闷')) return 'earth';
  if (lower.includes('燥') || lower.includes('干') || lower.includes('dry')) return 'metal';
  if (lower.includes('寒') || lower.includes('冷') || lower.includes('雨') || lower.includes('雪') || lower.includes('rain') || lower.includes('cold')) return 'water';

  return 'earth';
}

/** 计算五行平衡度 */
function calculateElementBalance(
  context: SpaceTimeContext,
  moods: SelectedMood[]
): Record<FiveElement, number> {
  const balance: Record<FiveElement, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  // 季节影响 (权重: 0.3)
  const seasonElement = getSeasonElement(context.season);
  balance[seasonElement] += 0.3;

  // 时辰影响 (权重: 0.2)
  const hourElement = getHourElement(context.time.getHours());
  balance[hourElement] += 0.2;

  // 天气影响 (权重: 0.2)
  if (context.weather) {
    const weatherElement = getWeatherElement(context.weather.description);
    balance[weatherElement] += 0.2;
  }

  // 情绪影响 (权重: 0.3)
  const moodElement = getMoodElement(moods);
  if (moodElement) {
    balance[moodElement] += 0.3;
    // 情绪过盛时相应五行会过强
    if (moods[0].mood.intensity === 'strong') {
      balance[moodElement] += 0.2;
    }
  }

  // 归一化到 -1 到 1 的范围
  const maxVal = Math.max(...Object.values(balance));
  const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];

  elements.forEach((element) => {
    // 转换为 -1 到 1 的范围，0 表示平衡
    balance[element] = maxVal > 0 ? (balance[element] / maxVal) * 2 - 1 : 0;
  });

  return balance;
}

/** 判断主导五行 */
function getDominantElement(balance: Record<FiveElement, number>): FiveElement {
  let dominant: FiveElement = 'earth';
  let maxValue = -Infinity;

  (Object.entries(balance) as [FiveElement, number][]).forEach(([element, value]) => {
    if (value > maxValue) {
      maxValue = value;
      dominant = element;
    }
  });

  return dominant;
}

/** 生成健康建议 */
function generateHealthAdvice(dominantElement: FiveElement, balance: Record<FiveElement, number>): string {
  const props = FIVE_ELEMENTS[dominantElement];
  const relation = ELEMENT_RELATIONS[dominantElement];

  let advice = `当前${props.chineseName}气较盛，对应脏腑为${props.organ}。\n\n`;

  // 根据平衡状态给出建议
  if (balance[dominantElement] > 0.5) {
    advice += `${props.chineseName}气过旺可能导致${props.emotion}情绪。`;
    advice += `建议：适当补充${FIVE_ELEMENTS[relation.controlling].chineseName}的能量来平衡，`;
    advice += `比如食用${FIVE_ELEMENTS[relation.controlled].taste}味食物，`;
    advice += `朝向${FIVE_ELEMENTS[relation.generating].direction}方静坐调息。`;
  } else if (balance[dominantElement] < -0.3) {
    advice += `${props.chineseName}气偏弱，需要适当补充。`;
    advice += `建议：多食${props.taste}味食物，`;
    advice += `在${props.direction}方位活动，`;
    advice += `穿着${props.color}色衣物。`;
  } else {
    advice += `五行相对平衡，继续保持当前的生活节奏。`;
    advice += `适量运动、规律作息是维持平衡的关键。`;
  }

  return advice;
}

/** 生成情志建议 */
function generateEmotionAdvice(dominantElement: FiveElement, moods: SelectedMood[]): string {
  const props = FIVE_ELEMENTS[dominantElement];
  const relation = ELEMENT_RELATIONS[dominantElement];

  let advice = `从情志角度来看，${props.chineseName}主${props.emotion}。\n\n`;

  if (moods.length > 0) {
    const primaryMood = moods[0].mood;

    if (primaryMood.category === 'negative') {
      // 情志相胜法
      advice += `《黄帝内经》有云："${props.emotion}伤${props.organ}"。`;
      advice += `建议用${FIVE_ELEMENTS[relation.controlling].emotion}情来调节，`;
      advice += `比如通过${FIVE_ELEMENTS[relation.controlling].sound}声来疏导情绪。`;
    } else if (primaryMood.category === 'positive') {
      advice += `喜悦的情绪有助于气血通畅，但也要注意适度，`;
      advice += `"喜则气缓"，保持平和才能持久。`;
    } else {
      advice += `平和的心态是养生之本，`;
      advice += `"恬淡虚无，真气从之"，保持当前的状态即可。`;
    }
  } else {
    advice += `保持情志平和，避免大喜大悲，`;
    advice += `"正气存内，邪不可干"。`;
  }

  return advice;
}

/** 生成起居建议 */
function generateLifestyleAdvice(context: SpaceTimeContext, _dominantElement: FiveElement): string {
  let advice = '';

  // 根据时段建议
  const { timeOfDay } = context;
  if (timeOfDay === 'morning' || timeOfDay === 'dawn') {
    advice += '晨起宜早，顺应阳气升发，';
    advice += '可面向东方伸展身体，吐故纳新。\n\n';
  } else if (timeOfDay === 'afternoon') {
    advice += '午后阳气渐收，适合处理日常事务，';
    advice += '避免剧烈运动，保持平稳节奏。\n\n';
  } else if (timeOfDay === 'evening') {
    advice += '傍晚时分，阳气入阴，宜放松身心，';
    advice += '可散步或进行轻柔的伸展运动。\n\n';
  } else {
    advice += '夜深人静，阴气最盛，宜早早安眠，';
    advice += '让身体在睡眠中修复。\n\n';
  }

  // 根据季节建议
  const seasonAdvice: Record<string, string> = {
    spring: '春季宜早起，舒展筋骨，让肝气条达；穿着宜宽松，让阳气升发。',
    summer: '夏季宜晚睡早起，适当出汗；但要避免过度贪凉，伤及阳气。',
    autumn: '秋季宜早睡早起，收敛神气；适当进补，但避免过于滋腻。',
    winter: '冬季宜早睡晚起，藏精养神；注意保暖，避免寒邪侵袭。',
  };

  advice += seasonAdvice[context.season] || '';

  return advice;
}

/** 生成季节养生指导 */
function generateSeasonalGuidance(context: SpaceTimeContext): string {
  const seasonElement = getSeasonElement(context.season);
  const props = FIVE_ELEMENTS[seasonElement];

  let guidance = `当前${context.season === 'spring' ? '春' : context.season === 'summer' ? '夏' : context.season === 'autumn' ? '秋' : '冬'}季，`;
  guidance += `五行属${props.chineseName}，主${props.organ}。\n\n`;

  const seasonalFood: Record<string, string> = {
    spring: '宜食青色蔬菜如菠菜、芹菜，适当食酸以养肝；少食辛辣以免伤肝。',
    summer: '宜食苦味如苦瓜、莲子，清心降火；适当食酸以收敛汗液。',
    autumn: '宜食白色食物如百合、银耳，润肺生津；少食寒凉以免伤脾。',
    winter: '宜食黑色食物如黑豆、黑芝麻，补肾养精；适当进补温热之品。',
  };

  guidance += seasonalFood[context.season] || '';

  const seasonalActivity: Record<string, string> = {
    spring: '\n\n适合户外活动，踏青赏花，疏肝理气。',
    summer: '\n\n适合游泳、瑜伽等运动，出汗排毒，但要及时补充水分。',
    autumn: '\n\n适合登高远望，调节情志，增强肺活量。',
    winter: '\n\n适合室内运动如太极、八段锦，藏精蓄锐。',
  };

  guidance += seasonalActivity[context.season] || '';

  return guidance;
}

// ==================== 导出函数 ====================

/** 获取黄帝内经五行分析 */
export function getHuangdiAnalysis(
  context: SpaceTimeContext,
  moods: SelectedMood[]
): HuangdiAnalysis {
  // 计算五行平衡
  const elementBalance = calculateElementBalance(context, moods);

  // 判断主导五行
  const dominantElement = getDominantElement(elementBalance);

  // 生成各项建议
  const healthAdvice = generateHealthAdvice(dominantElement, elementBalance);
  const emotionAdvice = generateEmotionAdvice(dominantElement, moods);
  const lifestyleAdvice = generateLifestyleAdvice(context, dominantElement);
  const seasonalGuidance = generateSeasonalGuidance(context);

  return {
    dominantElement,
    elementBalance,
    healthAdvice,
    emotionAdvice,
    lifestyleAdvice,
    seasonalGuidance,
  };
}

/** 获取五行属性 */
export function getElementProperties(element: FiveElement): ElementProperties {
  return FIVE_ELEMENTS[element];
}

/** 获取五行相生相克关系 */
export function getElementRelation(element: FiveElement): ElementRelation {
  return ELEMENT_RELATIONS[element];
}

/** 获取五行的中文名称 */
export function getElementChineseName(element: FiveElement): string {
  return FIVE_ELEMENTS[element].chineseName;
}
