/**
 * 西方心理学模块 - Psychology Analysis
 * 基于荣格原型理论和PAD情绪模型
 */

import type { SpaceTimeContext, SelectedMood } from '../../types';
import type { JungianArchetype, EmotionalDimension, PsychologyAnalysis } from './types';

// ==================== 荣格十二原型数据 ====================

interface ArchetypeInfo {
  name: string;
  chineseName: string;
  description: string;
  motivation: string;
  fear: string;
  strength: string;
  weakness: string;
  affirmation: string;
}

const ARCHETYPES: Record<JungianArchetype, ArchetypeInfo> = {
  hero: {
    name: 'Hero',
    chineseName: '英雄',
    description: '你内心住着一位英雄，勇于面对挑战，追求胜利和成长。',
    motivation: '证明自己的价值，通过勇气和决心克服困难',
    fear: '软弱、被打败、逃避',
    strength: '勇气、毅力、能力',
    weakness: '傲慢、过度自信',
    affirmation: '我有力量克服任何挑战，每一次挫折都让我更强大。',
  },
  mentor: {
    name: 'Mentor/Sage',
    chineseName: '导师',
    description: '你内心有一位智慧的导师，渴望理解世界的真相并分享智慧。',
    motivation: '用智慧和知识理解世界',
    fear: '无知、被误导',
    strength: '智慧、洞察力、真理',
    weakness: '过于理性、脱离现实',
    affirmation: '我相信自己的智慧，每一次思考都让我更接近真理。',
  },
  explorer: {
    name: 'Explorer',
    chineseName: '探索者',
    description: '你的灵魂渴望自由和发现，不断探索未知的领域。',
    motivation: '通过探索世界找到自我',
    fear: '被困住、空虚、从众',
    strength: '自主、野心、忠于自我',
    weakness: '漫无目的、无法承诺',
    affirmation: '我有勇气探索未知，每一段旅程都是自我发现。',
  },
  rebel: {
    name: 'Rebel',
    chineseName: '反叛者',
    description: '你内心有一股打破常规的力量，敢于挑战不公正。',
    motivation: '打破不再有用的东西',
    fear: '无力改变、被忽视',
    strength: '特立独行、突破性思维',
    weakness: '过于极端、破坏性',
    affirmation: '我有勇气质疑常规，我的独特视角是一种力量。',
  },
  lover: {
    name: 'Lover',
    chineseName: '恋人',
    description: '你的心充满爱与热情，渴望深层的连接和亲密。',
    motivation: '与人、工作和环境建立亲密关系',
    fear: '孤独、不被爱、不被渴望',
    strength: '热情、感恩、欣赏',
    weakness: '过于理想化、失去自我',
    affirmation: '我值得被爱，我的爱让世界更美好。',
  },
  creator: {
    name: 'Creator',
    chineseName: '创造者',
    description: '你内心有强烈的创造冲动，渴望将想象变为现实。',
    motivation: '创造有持久价值的东西',
    fear: '平庸的想法、不完美的执行',
    strength: '创造力、想象力、愿景',
    weakness: '完美主义、拖延',
    affirmation: '我的创意是独特的礼物，我允许自己自由表达。',
  },
  jester: {
    name: 'Jester',
    chineseName: '小丑',
    description: '你有着轻松愉快的灵魂，善于用幽默照亮生活。',
    motivation: '享受当下，给世界带来快乐',
    fear: '无聊、被视为无趣',
    strength: '快乐、幽默、活在当下',
    weakness: '浪费时间、不认真',
    affirmation: '快乐是我的超能力，我有权利享受生活。',
  },
  sage: {
    name: 'Sage',
    chineseName: '智者',
    description: '你追求深层的智慧和理解，相信真理能带来自由。',
    motivation: '发现真理，理解世界',
    fear: '被欺骗、无知',
    strength: '智慧、理解、真实',
    weakness: '过于批判、无行动',
    affirmation: '我相信自己的判断，真理是我最好的向导。',
  },
  innocent: {
    name: 'Innocent',
    chineseName: '天真者',
    description: '你内心保有一份纯真，相信世界本质上是美好的。',
    motivation: '获得幸福',
    fear: '做错事、被惩罚',
    strength: '乐观、信任、热情',
    weakness: '天真、否认问题',
    affirmation: '我选择看到世界的美好，希望是我的力量。',
  },
  orphan: {
    name: 'Orphan/Everyman',
    chineseName: '凡人',
    description: '你有着朴实的灵魂，渴望归属和联系。',
    motivation: '归属和连接',
    fear: '被排斥、孤立',
    strength: '共情、脚踏实地、真实',
    weakness: '失去独特性、随波逐流',
    affirmation: '我属于这里，我的普通中蕴含着非凡。',
  },
  caregiver: {
    name: 'Caregiver',
    chineseName: '照顾者',
    description: '你有着温暖的心，天生关心他人的幸福。',
    motivation: '保护和照顾他人',
    fear: '自私、忘恩负义',
    strength: '慷慨、同情、关怀',
    weakness: '牺牲自我、被利用',
    affirmation: '关心他人也是关心自己，我允许自己接受帮助。',
  },
  ruler: {
    name: 'Ruler',
    chineseName: '统治者',
    description: '你有领导者的气质，渴望创造秩序和繁荣。',
    motivation: '创造繁荣的家庭或社区',
    fear: '混乱、被推翻',
    strength: '领导力、责任感、组织能力',
    weakness: '控制欲、权威主义',
    affirmation: '我有能力创造积极的影响，我的领导是一种服务。',
  },
};

// ==================== PAD情绪模型 ====================

/** 根据情绪计算PAD维度 */
function calculateEmotionalDimension(moods: SelectedMood[]): EmotionalDimension {
  if (moods.length === 0) {
    return { pleasure: 0, arousal: 0, dominance: 0 };
  }

  let pleasure = 0;
  let arousal = 0;
  let dominance = 0;

  moods.forEach((m, index) => {
    const weight = 1 / (index + 1);
    const mood = m.mood;

    // 愉悦度 (Pleasure)
    if (mood.category === 'positive') {
      pleasure += weight * (mood.intensity === 'strong' ? 0.8 : mood.intensity === 'moderate' ? 0.5 : 0.3);
    } else if (mood.category === 'negative') {
      pleasure -= weight * (mood.intensity === 'strong' ? 0.8 : mood.intensity === 'moderate' ? 0.5 : 0.3);
    }

    // 唤醒度 (Arousal) - 根据强度
    const arousalFactor = mood.intensity === 'strong' ? 0.7 : mood.intensity === 'moderate' ? 0.4 : 0.1;
    arousal += weight * arousalFactor;

    // 控制度 (Dominance) - 根据情绪类型推断
    const label = mood.label.toLowerCase();
    if (label.includes('自信') || label.includes('兴奋') || label.includes('快乐') || label.includes('满足')) {
      dominance += weight * 0.5;
    } else if (label.includes('焦虑') || label.includes('紧张') || label.includes('害怕') || label.includes('无助')) {
      dominance -= weight * 0.5;
    }
  });

  // 归一化到 -1 到 1
  return {
    pleasure: Math.max(-1, Math.min(1, pleasure)),
    arousal: Math.max(-1, Math.min(1, arousal)),
    dominance: Math.max(-1, Math.min(1, dominance)),
  };
}

// ==================== 原型判断逻辑 ====================

/** 根据情绪和时间上下文判断当前原型 */
function determineArchetype(
  moods: SelectedMood[],
  context: SpaceTimeContext,
  emotion: EmotionalDimension
): JungianArchetype {
  // 没有情绪时根据时间判断
  if (moods.length === 0) {
    const hour = context.time.getHours();
    if (hour >= 5 && hour < 9) return 'innocent'; // 清晨 - 天真者
    if (hour >= 9 && hour < 12) return 'hero'; // 上午 - 英雄
    if (hour >= 12 && hour < 17) return 'creator'; // 下午 - 创造者
    if (hour >= 17 && hour < 21) return 'explorer'; // 傍晚 - 探索者
    return 'sage'; // 夜晚 - 智者
  }

  const primaryMood = moods[0].mood;
  const label = primaryMood.label.toLowerCase();

  // 基于情绪关键词判断
  if (label.includes('自信') || label.includes('勇敢') || label.includes('坚定')) {
    return 'hero';
  }
  if (label.includes('快乐') || label.includes('开心') || label.includes('轻松') || label.includes('有趣')) {
    return 'jester';
  }
  if (label.includes('爱') || label.includes('温暖') || label.includes('亲密') || label.includes('感动')) {
    return 'lover';
  }
  if (label.includes('创意') || label.includes('灵感') || label.includes('想象')) {
    return 'creator';
  }
  if (label.includes('好奇') || label.includes('期待') || label.includes('探索')) {
    return 'explorer';
  }
  if (label.includes('平静') || label.includes('安宁') || label.includes('满足')) {
    return 'innocent';
  }
  if (label.includes('思考') || label.includes('沉思') || label.includes('反省')) {
    return 'sage';
  }
  if (label.includes('关心') || label.includes('担忧') || label.includes('牵挂')) {
    return 'caregiver';
  }
  if (label.includes('不公') || label.includes('愤怒') || label.includes('反抗')) {
    return 'rebel';
  }

  // 基于PAD维度判断
  if (emotion.pleasure > 0.5 && emotion.arousal > 0.3) {
    return emotion.dominance > 0 ? 'hero' : 'jester';
  }
  if (emotion.pleasure > 0.3 && emotion.arousal < 0) {
    return 'innocent';
  }
  if (emotion.pleasure < 0 && emotion.arousal > 0.3) {
    return 'rebel';
  }
  if (emotion.pleasure < 0 && emotion.dominance < 0) {
    return 'orphan';
  }

  // 默认返回凡人原型
  return 'orphan';
}

/** 生成认知框架描述 */
function generateCognitiveFrame(archetype: JungianArchetype, emotion: EmotionalDimension): string {
  const archeInfo = ARCHETYPES[archetype];

  let frame = `你当前的心理状态呈现出「${archeInfo.chineseName}」原型的特质。`;

  // 基于PAD分析
  if (emotion.pleasure > 0.5) {
    frame += '\n\n你的情绪状态整体积极，这为你提供了良好的心理资源。';
  } else if (emotion.pleasure < -0.3) {
    frame += '\n\n你可能正在经历一些情绪上的挑战，这是成长的机会。';
  } else {
    frame += '\n\n你的情绪状态相对平稳，这是一个适合反思的时刻。';
  }

  if (emotion.arousal > 0.5) {
    frame += '你的能量水平较高，适合采取行动。';
  } else if (emotion.arousal < -0.3) {
    frame += '你的能量水平较低，可能需要休息或温和的活动。';
  }

  if (emotion.dominance > 0.3) {
    frame += '你感到有掌控感，这是推进目标的好时机。';
  } else if (emotion.dominance < -0.3) {
    frame += '你可能感到有些失控，寻求支持和资源是明智的。';
  }

  return frame;
}

/** 生成应对方式建议 */
function generateCopingStyle(archetype: JungianArchetype, moods: SelectedMood[]): string {
  const archeInfo = ARCHETYPES[archetype];

  let coping = `作为「${archeInfo.chineseName}」，你的核心动机是：${archeInfo.motivation}。\n\n`;

  if (moods.length > 0 && moods[0].mood.category === 'negative') {
    coping += `面对当前的情绪，建议你：\n`;
    coping += `1. 觉察：接纳这种感受是正常的人类体验\n`;
    coping += `2. 表达：用安全的方式表达这种情绪，如写日记、运动\n`;
    coping += `3. 转化：思考这种情绪想要告诉你什么\n\n`;
    coping += `特别注意：${archeInfo.weakness}可能是你需要警惕的倾向。`;
  } else {
    coping += `在当前状态下，发挥你的优势：${archeInfo.strength}。\n`;
    coping += `同时保持觉察，避免：${archeInfo.weakness}。`;
  }

  return coping;
}

/** 生成成长机会 */
function generateGrowthOpportunity(archetype: JungianArchetype, context: SpaceTimeContext): string {
  let growth = '成长机会：\n\n';

  // 根据原型给出针对性建议
  const growthMap: Record<JungianArchetype, string> = {
    hero: '尝试在不需要证明自己的情况下，也能感受到自我价值。',
    mentor: '除了思考和分析，也尝试通过体验和感受来理解世界。',
    explorer: '在探索外部世界的同时，也花时间探索内心世界。',
    rebel: '在打破旧规则的同时，也思考你想要建立什么。',
    lover: '在关爱他人的同时，记得给予自己同样的爱。',
    creator: '接纳"足够好"，完美不是创造的前提，完成比完美更重要。',
    jester: '在轻松和欢笑中，也允许自己体验深刻的情感。',
    sage: '将智慧转化为行动，知行合一才能真正成长。',
    innocent: '在保持希望的同时，也学会面对生活的复杂性。',
    orphan: '你的"普通"是独特的，找到属于你自己的特别之处。',
    caregiver: '学会说"不"，照顾自己和照顾他人同样重要。',
    ruler: '在追求控制的同时，也练习放手和信任。',
  };

  growth += growthMap[archetype];

  // 根据季节添加额外指导
  const seasonGrowth: Record<string, string> = {
    spring: '\n\n春季是新开始的季节，适合播下成长的种子。',
    summer: '\n\n夏季是绽放的季节，勇敢地展现自己吧。',
    autumn: '\n\n秋季是收获的季节，回顾你的成长历程。',
    winter: '\n\n冬季是休养的季节，给自己温柔的空间。',
  };

  growth += seasonGrowth[context.season] || '';

  return growth;
}

// ==================== 导出函数 ====================

/** 获取心理学分析 */
export function getPsychologyAnalysis(
  context: SpaceTimeContext,
  moods: SelectedMood[]
): PsychologyAnalysis {
  // 计算PAD情绪维度
  const emotionalState = calculateEmotionalDimension(moods);

  // 判断当前原型
  const archetype = determineArchetype(moods, context, emotionalState);
  const archeInfo = ARCHETYPES[archetype];

  // 生成分析
  const cognitiveFrame = generateCognitiveFrame(archetype, emotionalState);
  const copingStyle = generateCopingStyle(archetype, moods);
  const growthOpportunity = generateGrowthOpportunity(archetype, context);

  return {
    archetype,
    archetypeDescription: archeInfo.description,
    emotionalState,
    cognitiveFrame,
    copingStyle,
    growthOpportunity,
    affirmation: archeInfo.affirmation,
  };
}

/** 获取原型详细信息 */
export function getArchetypeInfo(archetype: JungianArchetype): ArchetypeInfo {
  return ARCHETYPES[archetype];
}

/** 解释PAD维度 */
export function explainPAD(emotion: EmotionalDimension): string {
  let explanation = '情绪维度分析（PAD模型）：\n\n';

  // 愉悦度
  explanation += `愉悦度 (${(emotion.pleasure * 100).toFixed(0)}%)：`;
  if (emotion.pleasure > 0.5) explanation += '非常积极\n';
  else if (emotion.pleasure > 0) explanation += '轻度积极\n';
  else if (emotion.pleasure > -0.5) explanation += '轻度消极\n';
  else explanation += '明显消极\n';

  // 唤醒度
  explanation += `唤醒度 (${(emotion.arousal * 100).toFixed(0)}%)：`;
  if (emotion.arousal > 0.5) explanation += '高度激活\n';
  else if (emotion.arousal > 0) explanation += '适度激活\n';
  else if (emotion.arousal > -0.5) explanation += '相对平静\n';
  else explanation += '非常平静\n';

  // 控制度
  explanation += `控制度 (${(emotion.dominance * 100).toFixed(0)}%)：`;
  if (emotion.dominance > 0.3) explanation += '感到掌控';
  else if (emotion.dominance > -0.3) explanation += '中性状态';
  else explanation += '感到受控';

  return explanation;
}
