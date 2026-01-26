/**
 * 易经模块 - I Ching Module
 * 基于时间、情绪、环境计算卦象
 */

import type { SpaceTimeContext, SelectedMood } from '../../types';
import type { Trigram, Hexagram, IChingReading, FiveElement } from './types';

// ==================== 八卦数据 ====================

export const TRIGRAMS: Record<string, Trigram> = {
  qian: {
    name: '乾',
    symbol: '☰',
    nature: '天',
    attribute: '健',
    element: 'metal',
    direction: '西北',
    family: '父',
    bodyPart: '头',
    animal: '马',
  },
  kun: {
    name: '坤',
    symbol: '☷',
    nature: '地',
    attribute: '顺',
    element: 'earth',
    direction: '西南',
    family: '母',
    bodyPart: '腹',
    animal: '牛',
  },
  zhen: {
    name: '震',
    symbol: '☳',
    nature: '雷',
    attribute: '动',
    element: 'wood',
    direction: '东',
    family: '长男',
    bodyPart: '足',
    animal: '龙',
  },
  xun: {
    name: '巽',
    symbol: '☴',
    nature: '风',
    attribute: '入',
    element: 'wood',
    direction: '东南',
    family: '长女',
    bodyPart: '股',
    animal: '鸡',
  },
  kan: {
    name: '坎',
    symbol: '☵',
    nature: '水',
    attribute: '陷',
    element: 'water',
    direction: '北',
    family: '中男',
    bodyPart: '耳',
    animal: '猪',
  },
  li: {
    name: '离',
    symbol: '☲',
    nature: '火',
    attribute: '丽',
    element: 'fire',
    direction: '南',
    family: '中女',
    bodyPart: '目',
    animal: '雉',
  },
  gen: {
    name: '艮',
    symbol: '☶',
    nature: '山',
    attribute: '止',
    element: 'earth',
    direction: '东北',
    family: '少男',
    bodyPart: '手',
    animal: '狗',
  },
  dui: {
    name: '兑',
    symbol: '☱',
    nature: '泽',
    attribute: '悦',
    element: 'metal',
    direction: '西',
    family: '少女',
    bodyPart: '口',
    animal: '羊',
  },
};

// ==================== 六十四卦核心数据 (精选20卦) ====================

const HEXAGRAM_DATA: Hexagram[] = [
  {
    number: 1,
    name: '乾为天',
    upperTrigram: 'qian',
    lowerTrigram: 'qian',
    judgment: '元亨利贞',
    image: '天行健，君子以自强不息',
    meaning: '纯阳之卦，象征刚健进取、充满活力',
    advice: '此刻宇宙给你的讯息是：保持积极进取的态度，你拥有无限的潜能',
  },
  {
    number: 2,
    name: '坤为地',
    upperTrigram: 'kun',
    lowerTrigram: 'kun',
    judgment: '元亨，利牝马之贞',
    image: '地势坤，君子以厚德载物',
    meaning: '纯阴之卦，象征包容接纳、厚重稳定',
    advice: '此刻适合接纳与等待，用柔软的心承载生活中的一切',
  },
  {
    number: 11,
    name: '地天泰',
    upperTrigram: 'kun',
    lowerTrigram: 'qian',
    judgment: '小往大来，吉亨',
    image: '天地交泰，君子以裁成天地之道',
    meaning: '阴阳交泰，万物亨通',
    advice: '这是一个吉祥的时刻，天地和谐，万事顺遂的能量正在流向你',
  },
  {
    number: 12,
    name: '天地否',
    upperTrigram: 'qian',
    lowerTrigram: 'kun',
    judgment: '否之匪人，不利君子贞',
    image: '天地不交，君子以俭德辟难',
    meaning: '阴阳不交，闭塞不通',
    advice: '暂时的阻滞是为了更好的蓄势，守持正道，等待转机',
  },
  {
    number: 15,
    name: '地山谦',
    upperTrigram: 'kun',
    lowerTrigram: 'gen',
    judgment: '亨，君子有终',
    image: '地中有山，君子以裒多益寡',
    meaning: '谦虚谨慎，终能亨通',
    advice: '保持谦逊的心态，如同大地包容高山，你的美德终将得到回报',
  },
  {
    number: 22,
    name: '山火贲',
    upperTrigram: 'gen',
    lowerTrigram: 'li',
    judgment: '亨，小利有攸往',
    image: '山下有火，君子以明庶政',
    meaning: '文饰之象，内质外美',
    advice: '此刻适合展现你的才华，让内在的光芒自然流露',
  },
  {
    number: 24,
    name: '地雷复',
    upperTrigram: 'kun',
    lowerTrigram: 'zhen',
    judgment: '亨，出入无疾，朋来无咎',
    image: '雷在地中，君子以至日闭关',
    meaning: '一阳来复，生机重现',
    advice: '新的开始即将到来，如同冬至后的第一缕阳光，希望正在萌发',
  },
  {
    number: 29,
    name: '坎为水',
    upperTrigram: 'kan',
    lowerTrigram: 'kan',
    judgment: '习坎，有孚，维心亨',
    image: '水洊至，君子以常德行',
    meaning: '重重险阻，需要坚定信念',
    advice: '面对挑战时保持内心的平静，水能穿石，柔能克刚',
  },
  {
    number: 30,
    name: '离为火',
    upperTrigram: 'li',
    lowerTrigram: 'li',
    judgment: '利贞，亨，畜牝牛吉',
    image: '明两作，君子以继明照于四方',
    meaning: '光明附丽，智慧闪耀',
    advice: '让你内心的光芒照亮周围，同时保持柔顺，避免过于锋芒毕露',
  },
  {
    number: 31,
    name: '泽山咸',
    upperTrigram: 'dui',
    lowerTrigram: 'gen',
    judgment: '亨，利贞，取女吉',
    image: '山上有泽，君子以虚受人',
    meaning: '感应之卦，心灵相通',
    advice: '此刻你与宇宙有着特殊的感应，敞开心扉，感受来自天地的回响',
  },
  {
    number: 32,
    name: '雷风恒',
    upperTrigram: 'zhen',
    lowerTrigram: 'xun',
    judgment: '亨，无咎，利贞',
    image: '雷风，君子以立不易方',
    meaning: '恒久之道，坚定不移',
    advice: '持之以恒是成功的关键，找到你的方向，坚定地走下去',
  },
  {
    number: 35,
    name: '火地晋',
    upperTrigram: 'li',
    lowerTrigram: 'kun',
    judgment: '康侯用锡马蕃庶',
    image: '明出地上，君子以自昭明德',
    meaning: '光明上升，前途光明',
    advice: '太阳正在升起，你的才能将被看见，保持光明正大的态度',
  },
  {
    number: 42,
    name: '风雷益',
    upperTrigram: 'xun',
    lowerTrigram: 'zhen',
    judgment: '利有攸往，利涉大川',
    image: '风雷益，君子以见善则迁',
    meaning: '增益之象，利于行动',
    advice: '这是一个增益的时刻，勇敢地追求你想要的，宇宙支持你的成长',
  },
  {
    number: 46,
    name: '地风升',
    upperTrigram: 'kun',
    lowerTrigram: 'xun',
    judgment: '元亨，用见大人',
    image: '地中生木，君子以顺德积小以高大',
    meaning: '渐进上升，稳步发展',
    advice: '如同树木在土中生长，一步步向上，你的努力终将结出果实',
  },
  {
    number: 49,
    name: '泽火革',
    upperTrigram: 'dui',
    lowerTrigram: 'li',
    judgment: '己日乃孚，元亨利贞',
    image: '泽中有火，君子以治历明时',
    meaning: '变革之象，除旧布新',
    advice: '变化是生命的常态，勇敢地拥抱改变，让新的自己绽放',
  },
  {
    number: 50,
    name: '火风鼎',
    upperTrigram: 'li',
    lowerTrigram: 'xun',
    judgment: '元吉，亨',
    image: '木上有火，君子以正位凝命',
    meaning: '鼎新之象，养贤育德',
    advice: '此刻适合滋养自己，无论是身体还是心灵，都值得被好好对待',
  },
  {
    number: 52,
    name: '艮为山',
    upperTrigram: 'gen',
    lowerTrigram: 'gen',
    judgment: '艮其背，不获其身',
    image: '兼山，君子以思不出其位',
    meaning: '止而不动，静定安宁',
    advice: '此刻适合静下心来，如同巍然不动的山，在宁静中找到力量',
  },
  {
    number: 57,
    name: '巽为风',
    upperTrigram: 'xun',
    lowerTrigram: 'xun',
    judgment: '小亨，利有攸往',
    image: '随风，君子以申命行事',
    meaning: '柔顺渐进，无孔不入',
    advice: '像风一样柔软而有渗透力，温柔的坚持比强硬的推进更有效',
  },
  {
    number: 58,
    name: '兑为泽',
    upperTrigram: 'dui',
    lowerTrigram: 'dui',
    judgment: '亨，利贞',
    image: '丽泽，君子以朋友讲习',
    meaning: '喜悦之卦，和乐融融',
    advice: '喜悦是你此刻的能量，分享你的快乐，让幸福像涟漪一样扩散',
  },
  {
    number: 63,
    name: '水火既济',
    upperTrigram: 'kan',
    lowerTrigram: 'li',
    judgment: '亨小，利贞',
    image: '水在火上，君子以思患而预防之',
    meaning: '功成之象，阴阳调和',
    advice: '一切都在正确的位置上，享受这份和谐，同时为未来做好准备',
  },
];

// ==================== 卦象计算逻辑 ====================

/** 根据时间获取对应的八卦 */
function getTrigramFromTime(date: Date): string {
  const hour = date.getHours();
  const trigramOrder = ['kan', 'gen', 'zhen', 'xun', 'li', 'kun', 'dui', 'qian'];
  // 每3小时对应一卦
  const index = Math.floor(hour / 3) % 8;
  return trigramOrder[index];
}

/** 根据季节获取对应的八卦 */
function getTrigramFromSeason(season: string): string {
  const seasonMap: Record<string, string> = {
    spring: 'zhen', // 春 - 震
    summer: 'li',   // 夏 - 离
    autumn: 'dui',  // 秋 - 兑
    winter: 'kan',  // 冬 - 坎
  };
  return seasonMap[season] || 'kun';
}

/** 根据情绪获取对应的八卦 */
function getTrigramFromMood(moods: SelectedMood[]): string {
  if (moods.length === 0) return 'kun';

  const primaryMood = moods[0].mood;

  // 根据情绪类别和强度映射八卦
  if (primaryMood.category === 'positive') {
    if (primaryMood.intensity === 'strong') return 'qian'; // 强烈积极 - 乾
    if (primaryMood.intensity === 'moderate') return 'dui'; // 中等积极 - 兑
    return 'li'; // 轻微积极 - 离
  }

  if (primaryMood.category === 'negative') {
    if (primaryMood.intensity === 'strong') return 'kan'; // 强烈消极 - 坎
    if (primaryMood.intensity === 'moderate') return 'gen'; // 中等消极 - 艮
    return 'xun'; // 轻微消极 - 巽
  }

  // 中性情绪
  return primaryMood.intensity === 'strong' ? 'zhen' : 'kun';
}

/** 获取天气对应的八卦 */
function getTrigramFromWeather(weatherDesc: string): string {
  const lower = weatherDesc.toLowerCase();

  if (lower.includes('雷') || lower.includes('thunder')) return 'zhen';
  if (lower.includes('风') || lower.includes('wind')) return 'xun';
  if (lower.includes('雨') || lower.includes('rain') || lower.includes('水')) return 'kan';
  if (lower.includes('晴') || lower.includes('sun') || lower.includes('clear')) return 'li';
  if (lower.includes('雪') || lower.includes('snow') || lower.includes('冰')) return 'gen';
  if (lower.includes('雾') || lower.includes('fog') || lower.includes('阴') || lower.includes('cloud')) return 'kun';

  return 'qian';
}

/** 根据两个卦找到对应的六十四卦 */
function findHexagram(upper: string, lower: string): Hexagram {
  const found = HEXAGRAM_DATA.find(
    (h) => h.upperTrigram === upper && h.lowerTrigram === lower
  );

  // 如果找不到精确匹配，根据卦象特性选择最接近的
  if (!found) {
    // 根据上下卦的元素属性选择
    const upperTrigram = TRIGRAMS[upper];
    const lowerTrigram = TRIGRAMS[lower];

    // 选择基于元素相生相克的卦
    if (upperTrigram.element === lowerTrigram.element) {
      // 同元素，选择和谐之卦
      return HEXAGRAM_DATA[2]; // 泰卦
    }

    // 默认返回一个适合当前组合的卦
    return HEXAGRAM_DATA[Math.floor(Math.random() * HEXAGRAM_DATA.length)];
  }

  return found;
}

/** 计算变爻 */
function calculateChangingLines(timestamp: number, moodCount: number): number[] {
  const lines: number[] = [];
  const seed = timestamp % 1000000;

  // 根据时间和情绪数量决定变爻数量（0-2个）
  const changeCount = Math.min(moodCount, 2);

  for (let i = 0; i < changeCount; i++) {
    const line = ((seed >> (i * 3)) + i) % 6;
    if (!lines.includes(line)) {
      lines.push(line);
    }
  }

  return lines;
}

/** 生成解读文本 */
function generateInterpretation(
  hexagram: Hexagram,
  changingLines: number[],
  context: SpaceTimeContext,
  _moods: SelectedMood[]
): string {
  const upperTrigram = TRIGRAMS[hexagram.upperTrigram];
  const lowerTrigram = TRIGRAMS[hexagram.lowerTrigram];

  let interpretation = `在这个${context.timeOfDay === 'night' ? '夜晚' : context.timeOfDay === 'morning' ? '清晨' : '时刻'}，`;
  interpretation += `宇宙为你呈现了「${hexagram.name}」之卦。\n\n`;
  interpretation += `上卦为${upperTrigram.name}(${upperTrigram.symbol})，象征${upperTrigram.nature}，属性为${upperTrigram.attribute}；`;
  interpretation += `下卦为${lowerTrigram.name}(${lowerTrigram.symbol})，象征${lowerTrigram.nature}，属性为${lowerTrigram.attribute}。\n\n`;
  interpretation += `卦辞曰：「${hexagram.judgment}」\n`;
  interpretation += `象曰：「${hexagram.image}」\n\n`;
  interpretation += hexagram.meaning;

  if (changingLines.length > 0) {
    interpretation += `\n\n变爻在第${changingLines.map((l) => l + 1).join('、')}爻，`;
    interpretation += `提示着变化的可能性，保持灵活的心态。`;
  }

  return interpretation;
}

// ==================== 导出函数 ====================

/** 获取易经卦象解读 */
export function getIChingReading(
  context: SpaceTimeContext,
  moods: SelectedMood[]
): IChingReading {
  // 计算上卦（外卦）- 基于时间和天气
  const timeTrigram = getTrigramFromTime(context.time);
  const weatherTrigram = context.weather
    ? getTrigramFromWeather(context.weather.description)
    : 'qian';

  // 选择更显著的影响作为上卦
  const upperTrigram = context.weather ? weatherTrigram : timeTrigram;

  // 计算下卦（内卦）- 基于情绪和季节
  const moodTrigram = getTrigramFromMood(moods);
  const seasonTrigram = getTrigramFromSeason(context.season);

  // 内卦更多基于情绪
  const lowerTrigram = moods.length > 0 ? moodTrigram : seasonTrigram;

  // 找到对应的六十四卦
  const hexagram = findHexagram(upperTrigram, lowerTrigram);

  // 计算变爻
  const changingLines = calculateChangingLines(
    context.time.getTime(),
    moods.length
  );

  // 生成解读
  const interpretation = generateInterpretation(
    hexagram,
    changingLines,
    context,
    moods
  );

  return {
    hexagram,
    changingLines,
    interpretation,
    guidance: hexagram.advice,
  };
}

/** 获取八卦信息 */
export function getTrigramInfo(name: string): Trigram | undefined {
  return TRIGRAMS[name];
}

/** 获取卦象对应的五行 */
export function getHexagramElement(hexagram: Hexagram): FiveElement {
  const upperElement = TRIGRAMS[hexagram.upperTrigram].element;
  const lowerElement = TRIGRAMS[hexagram.lowerTrigram].element;

  // 如果两卦五行相同，返回该元素
  if (upperElement === lowerElement) return upperElement;

  // 否则返回上卦的元素（外在表现）
  return upperElement;
}
