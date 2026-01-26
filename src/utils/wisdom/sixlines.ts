/**
 * 六爻预测模块 - Six Lines Divination
 * 基于时间因子和情绪状态进行预测分析
 */

import type { SpaceTimeContext, SelectedMood } from '../../types';
import type { YaoLine, SixLinesGua, SixLinesPrediction } from './types';

// ==================== 爻位解读数据 ====================

const YAO_MEANINGS = {
  1: { // 初爻
    yang: '初始阶段，阳刚蓄势，行动的种子已经播下',
    yin: '初始阶段，阴柔等待，静观其变是明智之选',
  },
  2: { // 二爻
    yang: '渐入佳境，保持中正，坚持的力量正在显现',
    yin: '顺势而为，柔中带刚，适时退让反能进取',
  },
  3: { // 三爻
    yang: '位处转折，需谨慎行事，过刚易折',
    yin: '处于变化之际，以柔克刚，顺应自然',
  },
  4: { // 四爻
    yang: '渐近核心，虽有阻力但前途光明',
    yin: '接近目标，保持谦逊，成功在望',
  },
  5: { // 五爻（尊位）
    yang: '居于正位，大吉大利，是最好的时机',
    yin: '以柔居尊，德才兼备，无往不利',
  },
  6: { // 上爻
    yang: '达到顶点，盛极而衰，注意保持',
    yin: '圆满之时，功成身退，知足常乐',
  },
};

// ==================== 世应关系解读 ====================

const WORLD_RESPONSE_MEANINGS: Record<string, string> = {
  '1-4': '自我与外界初步接触，宜保持开放心态',
  '2-5': '内在成长与外在机遇相呼应，是积极发展的时期',
  '3-6': '转折点与结果相连，当下的选择影响深远',
  '4-1': '外在压力转化为内在动力',
  '5-2': '地位与基础相呼应，稳中求进',
  '6-3': '终点与转折相连，旧的结束预示新的开始',
};

// ==================== 六爻计算逻辑 ====================

/** 根据时间戳生成伪随机的爻 */
function generateYaoLine(
  seed: number,
  position: number,
  moodInfluence: number
): YaoLine {
  // 使用更复杂的计算来模拟传统的摇钱法
  const combined = seed * (position + 1) + moodInfluence * 1000;
  const normalized = Math.abs(Math.sin(combined)) * 100;

  // 模拟三枚铜钱的结果 (6-9)
  // 6: 老阴(变爻) 7: 少阳 8: 少阴 9: 老阳(变爻)
  const coinValue = 6 + Math.floor(normalized % 4);

  const isYang = coinValue === 7 || coinValue === 9;
  const isChanging = coinValue === 6 || coinValue === 9;

  const positionKey = position as keyof typeof YAO_MEANINGS;
  const typeKey = isYang ? 'yang' : 'yin';

  return {
    position,
    type: isYang ? 'yang' : 'yin',
    changing: isChanging,
    text: `第${position}爻：${isYang ? '阳' : '阴'}${isChanging ? '（动）' : ''}`,
    meaning: YAO_MEANINGS[positionKey][typeKey],
  };
}

/** 计算世爻和应爻位置 */
function calculateWorldResponse(lines: YaoLine[]): { world: number; response: number } {
  // 简化的世应计算：基于阴阳分布
  const yangCount = lines.filter((l) => l.type === 'yang').length;

  // 世爻位置基于阳爻数量
  let world: number;
  if (yangCount <= 2) {
    world = 1 + yangCount;
  } else if (yangCount <= 4) {
    world = yangCount;
  } else {
    world = 6 - (yangCount - 4);
  }

  // 应爻与世爻相隔三位
  const response = ((world + 2) % 6) + 1;

  return { world, response };
}

/** 生成预测分析 */
function generateAnalysis(gua: SixLinesGua, context: SpaceTimeContext): string {
  const { lines, worldLine, responseLine } = gua;

  // 统计爻的分布
  const yangCount = lines.filter((l) => l.type === 'yang').length;
  const changingCount = lines.filter((l) => l.changing).length;

  let analysis = '';

  // 整体格局分析
  if (yangCount > 4) {
    analysis += '卦象阳气充足，整体态势积极向上，适合采取主动行动。';
  } else if (yangCount < 2) {
    analysis += '卦象以阴为主，适合静守等待，蓄势待发。';
  } else {
    analysis += '卦象阴阳平衡，保持中正和谐是当前的最佳策略。';
  }

  // 世应关系分析
  const key = `${worldLine}-${responseLine}`;
  if (WORLD_RESPONSE_MEANINGS[key]) {
    analysis += `\n\n世爻在第${worldLine}位，应爻在第${responseLine}位。`;
    analysis += WORLD_RESPONSE_MEANINGS[key];
  }

  // 变爻分析
  if (changingCount > 0) {
    const changingLines = lines.filter((l) => l.changing);
    analysis += `\n\n有${changingCount}个变爻，提示`;
    if (changingCount === 1) {
      const cl = changingLines[0];
      analysis += cl.position <= 3 ? '近期会有变化' : '长远趋势正在转变';
    } else {
      analysis += '变化较多，需要灵活应对';
    }
  }

  // 时间因素
  const { timeOfDay } = context;
  if (timeOfDay === 'dawn' || timeOfDay === 'morning') {
    analysis += '\n\n晨时起卦，利于开始新事物。';
  } else if (timeOfDay === 'night') {
    analysis += '\n\n夜时起卦，宜静思内省。';
  }

  return analysis;
}

/** 生成短期预测 */
function generateShortTermPrediction(gua: SixLinesGua, moods: SelectedMood[]): string {
  const { lines } = gua;

  // 看初爻和二爻（代表近期）
  const line1 = lines[0];
  const line2 = lines[1];

  let prediction = '近期展望：';

  if (line1.type === 'yang' && !line1.changing) {
    prediction += '起步顺利，';
  } else if (line1.changing) {
    prediction += '初期可能有变动，';
  } else {
    prediction += '开局宜稳，';
  }

  if (line2.type === 'yang') {
    prediction += '发展势头良好';
  } else {
    prediction += '稳步推进为宜';
  }

  // 结合情绪
  if (moods.length > 0) {
    const primaryMood = moods[0].mood;
    if (primaryMood.category === 'positive') {
      prediction += '，你当前的积极心态会带来好运。';
    } else if (primaryMood.category === 'negative') {
      prediction += '，调整心态后运势会有所好转。';
    } else {
      prediction += '，保持平常心，顺其自然。';
    }
  }

  return prediction;
}

/** 生成长期预测 */
function generateLongTermPrediction(gua: SixLinesGua): string {
  const { lines } = gua;

  // 看五爻和上爻（代表长远）
  const line5 = lines[4];
  const line6 = lines[5];

  let prediction = '长期趋势：';

  if (line5.type === 'yang' && line6.type === 'yang') {
    prediction += '前景光明，坚持努力终有收获。';
  } else if (line5.type === 'yin' && line6.type === 'yin') {
    prediction += '需要耐心等待，厚积薄发。';
  } else if (line5.type === 'yang') {
    prediction += '核心运势良好，但需注意收尾。';
  } else {
    prediction += '稳健发展，最终会有满意的结果。';
  }

  if (line5.changing || line6.changing) {
    prediction += '变爻显示未来会有转机，保持信心。';
  }

  return prediction;
}

/** 生成建议 */
function generateAdvice(gua: SixLinesGua, context: SpaceTimeContext): string {
  const { lines, worldLine } = gua;
  const worldYao = lines[worldLine - 1];

  let advice = '宇宙的建议：';

  // 基于世爻给出核心建议
  if (worldYao.type === 'yang') {
    advice += '你拥有足够的力量，';
    if (worldYao.changing) {
      advice += '但要学会适时收敛，刚柔并济。';
    } else {
      advice += '坚定地朝目标前进吧。';
    }
  } else {
    advice += '此刻宜守不宜攻，';
    if (worldYao.changing) {
      advice += '静待时机，变化即将到来。';
    } else {
      advice += '在等待中积蓄力量。';
    }
  }

  // 季节性建议
  const seasonAdvice: Record<string, string> = {
    spring: '\n\n春季宜播种，你播下的种子终会发芽。',
    summer: '\n\n夏季宜成长，绽放你的光芒。',
    autumn: '\n\n秋季宜收获，感恩你所拥有的一切。',
    winter: '\n\n冬季宜休养，为下一个春天做准备。',
  };

  advice += seasonAdvice[context.season] || '';

  return advice;
}

// ==================== 导出函数 ====================

/** 获取六爻预测 */
export function getSixLinesPrediction(
  context: SpaceTimeContext,
  moods: SelectedMood[]
): SixLinesPrediction {
  const timestamp = context.time.getTime();

  // 计算情绪影响因子
  let moodInfluence = 0;
  moods.forEach((m, index) => {
    const weight = 1 / (index + 1);
    if (m.mood.category === 'positive') {
      moodInfluence += weight * (m.mood.intensity === 'strong' ? 3 : m.mood.intensity === 'moderate' ? 2 : 1);
    } else if (m.mood.category === 'negative') {
      moodInfluence -= weight * (m.mood.intensity === 'strong' ? 3 : m.mood.intensity === 'moderate' ? 2 : 1);
    }
  });

  // 生成六爻
  const lines: YaoLine[] = [];
  for (let i = 1; i <= 6; i++) {
    lines.push(generateYaoLine(timestamp, i, moodInfluence));
  }

  // 计算世爻和应爻
  const { world, response } = calculateWorldResponse(lines);

  // 构建卦象
  const gua: SixLinesGua = {
    lines,
    worldLine: world,
    responseLine: response,
    subject: '本卦',
    object: lines.some((l) => l.changing) ? '变卦' : '无变',
  };

  // 生成预测
  return {
    gua,
    analysis: generateAnalysis(gua, context),
    shortTerm: generateShortTermPrediction(gua, moods),
    longTerm: generateLongTermPrediction(gua),
    advice: generateAdvice(gua, context),
  };
}

/** 获取爻的符号表示 */
export function getYaoSymbol(yao: YaoLine): string {
  if (yao.type === 'yang') {
    return yao.changing ? '⚊○' : '⚊'; // 老阳用○标记
  } else {
    return yao.changing ? '⚋×' : '⚋'; // 老阴用×标记
  }
}

/** 获取卦象的完整符号表示 */
export function getGuaSymbols(gua: SixLinesGua): string[] {
  return gua.lines.map(getYaoSymbol).reverse(); // 从上到下显示
}
