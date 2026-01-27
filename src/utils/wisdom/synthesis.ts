/**
 * 文化智慧综合模块 - Synthesis & AI Prompt Generation
 * 整合易经、六爻、五行、心理学，生成AI提示词
 */

import type { SpaceTimeContext, SelectedMood } from '../../types';
import type { WisdomAnalysis, PromptData } from './types';
import { getIChingReading } from './iching';
import { getSixLinesPrediction } from './sixlines';
import { getHuangdiAnalysis, getElementChineseName } from './fiveelements';
import { getPsychologyAnalysis, getArchetypeInfo } from './psychology';
import { getTimeOfDayLabel, getSeasonLabel } from '../time';

// ==================== 综合分析 ====================

/** 获取完整的文化智慧分析 */
export function getWisdomAnalysis(
  context: SpaceTimeContext,
  moods: SelectedMood[]
): WisdomAnalysis {
  // 获取各模块分析
  const iChing = getIChingReading(context, moods);
  const sixLines = getSixLinesPrediction(context, moods);
  const huangdi = getHuangdiAnalysis(context, moods);
  const psychology = getPsychologyAnalysis(context, moods);

  // 生成综合解读
  const synthesis = generateSynthesis(iChing, sixLines, huangdi, psychology, context, moods);

  return {
    iChing,
    sixLines,
    huangdi,
    psychology,
    synthesis,
  };
}

/** 生成综合解读 */
function generateSynthesis(
  iChing: WisdomAnalysis['iChing'],
  sixLines: WisdomAnalysis['sixLines'],
  huangdi: WisdomAnalysis['huangdi'],
  psychology: WisdomAnalysis['psychology'],
  context: SpaceTimeContext,
  moods: SelectedMood[]
): WisdomAnalysis['synthesis'] {
  // 核心主题
  const theme = extractTheme(iChing, psychology, moods);

  // 东西方智慧桥接
  const eastWestBridge = bridgeEastWest(iChing, huangdi, psychology);

  // 实践建议
  const practicalAdvice = synthesizeAdvice(iChing, sixLines, huangdi, psychology);

  // 冥想指引
  const meditation = generateMeditation(huangdi, psychology, context);

  // 肯定语句
  const affirmation = combineAffirmations(iChing, psychology);

  return {
    theme,
    eastWestBridge,
    practicalAdvice,
    meditation,
    affirmation,
  };
}

/** 提取核心主题 */
function extractTheme(
  iChing: WisdomAnalysis['iChing'],
  psychology: WisdomAnalysis['psychology'],
  moods: SelectedMood[]
): string {
  const hexagramName = iChing.hexagram.name;
  const archetype = getArchetypeInfo(psychology.archetype);

  // 根据情绪类别确定基调
  let emotionalTone = '平和';
  if (moods.length > 0) {
    const primary = moods[0].mood;
    if (primary.category === 'positive') {
      emotionalTone = primary.intensity === 'strong' ? '光明与喜悦' : '温暖与希望';
    } else if (primary.category === 'negative') {
      emotionalTone = primary.intensity === 'strong' ? '转化与重生' : '静默与疗愈';
    } else {
      emotionalTone = '平衡与觉察';
    }
  }

  return `${emotionalTone}——${hexagramName}的智慧遇见${archetype.chineseName}的旅程`;
}

/** 桥接东西方智慧 */
function bridgeEastWest(
  iChing: WisdomAnalysis['iChing'],
  huangdi: WisdomAnalysis['huangdi'],
  psychology: WisdomAnalysis['psychology']
): string {
  const element = getElementChineseName(huangdi.dominantElement);
  const archetype = getArchetypeInfo(psychology.archetype);

  let bridge = `东方智慧认为，此刻${element}气主导，${iChing.hexagram.image}。`;
  bridge += `\n\n西方心理学则指出，你的内在呈现「${archetype.chineseName}」原型，${archetype.description}`;
  bridge += `\n\n两种智慧交汇于一点：`;

  // 找到东西方的共通点
  const elementArchetypeMap: Record<string, string[]> = {
    '木': ['explorer', 'rebel', 'hero'],
    '火': ['hero', 'creator', 'lover'],
    '土': ['caregiver', 'ruler', 'orphan'],
    '金': ['mentor', 'sage', 'ruler'],
    '水': ['sage', 'innocent', 'explorer'],
  };

  const relatedArchetypes = elementArchetypeMap[element] || [];
  if (relatedArchetypes.includes(psychology.archetype)) {
    bridge += `${element}之性与「${archetype.chineseName}」天然相合，你正处于身心合一的状态。`;
  } else {
    bridge += `${element}的能量与「${archetype.chineseName}」的追求可以相互补充，在动静之间找到平衡。`;
  }

  return bridge;
}

/** 综合建议 */
function synthesizeAdvice(
  iChing: WisdomAnalysis['iChing'],
  sixLines: WisdomAnalysis['sixLines'],
  huangdi: WisdomAnalysis['huangdi'],
  psychology: WisdomAnalysis['psychology']
): string {
  let advice = '基于东西方智慧的综合建议：\n\n';

  // 从易经取行动指南
  advice += `【行动】${iChing.guidance}\n\n`;

  // 从六爻取时机判断
  advice += `【时机】${sixLines.shortTerm}\n\n`;

  // 从五行取养生建议
  advice += `【养生】${huangdi.lifestyleAdvice.split('\n\n')[0]}\n\n`;

  // 从心理学取心灵成长
  advice += `【成长】${psychology.growthOpportunity.split('\n\n')[0]}`;

  return advice;
}

/** 生成冥想指引 */
function generateMeditation(
  huangdi: WisdomAnalysis['huangdi'],
  psychology: WisdomAnalysis['psychology'],
  _context: SpaceTimeContext
): string {
  const element = getElementChineseName(huangdi.dominantElement);
  const emotion = psychology.emotionalState;

  let meditation = '冥想指引：\n\n';
  meditation += '找一个安静的地方，舒适地坐下或躺下。\n';
  meditation += '闭上眼睛，深呼吸三次...\n\n';

  // 根据五行设计观想
  const elementVisualization: Record<string, string> = {
    '木': '想象你是一棵参天大树，根深深扎入大地，枝叶在阳光中舒展。生命的能量从大地流入你的身体，向上升腾...',
    '火': '想象温暖的金色光芒从你的心中升起，如同朝阳，照亮你的全身，温暖流向四肢百骸...',
    '土': '想象你坐在广袤的大地上，稳固而安宁。大地母亲的能量托举着你，你是安全的，被支持的...',
    '金': '想象清澈的白色光芒环绕你的身体，如同秋日的晨露，净化你的每一次呼吸...',
    '水': '想象你在宁静的深蓝色海洋中漂浮，海水包裹着你，你随着波浪轻轻起伏，无比放松...',
  };

  meditation += elementVisualization[element] || elementVisualization['土'];

  // 根据情绪状态调整
  if (emotion.arousal > 0.5) {
    meditation += '\n\n慢慢地，感受每一次呼吸，让内心的波动渐渐平息...';
  } else if (emotion.pleasure < -0.3) {
    meditation += '\n\n让这份宁静抚慰你的心灵，你是被宇宙爱着的...';
  }

  meditation += '\n\n当你准备好了，轻轻睁开眼睛，带着这份平静回到当下。';

  return meditation;
}

/** 组合肯定语句 */
function combineAffirmations(
  iChing: WisdomAnalysis['iChing'],
  psychology: WisdomAnalysis['psychology']
): string {
  const psychAffirmation = psychology.affirmation;

  // 将易经的卦辞转化为肯定语
  const hexagramAffirmation = transformHexagramToAffirmation(iChing.hexagram.name);

  return `${psychAffirmation}\n\n${hexagramAffirmation}`;
}

/** 将卦名转化为肯定语 */
function transformHexagramToAffirmation(hexagramName: string): string {
  const affirmationMap: Record<string, string> = {
    '乾为天': '我拥有无限的创造力和可能性。',
    '坤为地': '我包容接纳，在柔软中蕴含力量。',
    '地天泰': '和谐与繁荣正流向我的生命。',
    '天地否': '我在等待中积蓄力量，转机即将到来。',
    '地山谦': '我以谦逊的心获得更大的成就。',
    '山火贲': '我的内在美自然绽放，不需刻意。',
    '地雷复': '新的开始已经在我生命中萌发。',
    '坎为水': '我像水一样，柔软而有力，能穿越任何障碍。',
    '离为火': '我的光芒照亮自己，也温暖他人。',
    '泽山咸': '我与宇宙的连接是真实而深刻的。',
    '雷风恒': '我坚定地走在自己的道路上。',
    '火地晋': '我的才能正在被看见和认可。',
    '风雷益': '丰盛和增益正来到我的生命中。',
    '地风升': '我一步步稳健地向上成长。',
    '泽火革': '我勇敢地拥抱改变，蜕变成更好的自己。',
    '火风鼎': '我值得被滋养，身心都在变得更好。',
    '艮为山': '在宁静中，我找到了内在的力量。',
    '巽为风': '我温柔而有渗透力，影响无处不在。',
    '兑为泽': '我选择喜悦，幸福如涟漪般扩散。',
    '水火既济': '一切都在恰到好处的位置上。',
  };

  return affirmationMap[hexagramName] || '宇宙的智慧正在引导我走向最好的方向。';
}

// ==================== AI 提示词生成 ====================

/** 准备AI提示词数据 */
export function preparePromptData(
  context: SpaceTimeContext,
  moods: SelectedMood[],
  analysis: WisdomAnalysis
): PromptData {
  // 时间氛围映射
  const timeAtmosphere: Record<string, string> = {
    dawn: '晨曦微露的清澈',
    morning: '阳光温柔的明朗',
    afternoon: '午后慵懒的温暖',
    evening: '黄昏柔软的余晖',
    night: '深夜静谧的神秘',
  };

  // 季节气息映射
  const seasonFeeling: Record<string, string> = {
    spring: '春天萌动的生机',
    summer: '夏日热烈的奔放',
    autumn: '秋意沉淀的从容',
    winter: '冬雪内敛的宁静',
  };

  // 情绪基调
  let moodTone = '平静如水';
  let moodVisual = 'serene, calm';
  if (moods.length > 0) {
    const primary = moods[0].mood;
    if (primary.category === 'positive') {
      moodTone = primary.intensity === 'strong' ? '光芒四射的喜悦' : '温暖轻柔的愉悦';
      moodVisual = 'warm, joyful, radiant light';
    } else if (primary.category === 'negative') {
      moodTone = primary.intensity === 'strong' ? '深沉内省的蜕变' : '细雨轻愁的沉思';
      moodVisual = 'contemplative, moody, soft shadows';
    } else {
      moodTone = '波澜不惊的平衡';
      moodVisual = 'balanced, peaceful, neutral tones';
    }
  }

  const userContext = {
    time: `${getTimeOfDayLabel(context.timeOfDay)} (${context.time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })})`,
    season: getSeasonLabel(context.season),
    weather: context.weather?.description || '未知',
    location: context.location?.city || '某个角落',
    moods: moods.map((m) => `${m.mood.emoji} ${m.mood.label}`),
    // 新增：用于画面描述的氛围词
    timeAtmosphere: timeAtmosphere[context.timeOfDay] || '时光流转的瞬间',
    seasonFeeling: seasonFeeling[context.season] || '季节更迭的痕迹',
    moodTone,
    moodVisual,
  };

  const culturalReferences = {
    hexagramName: analysis.iChing.hexagram.name,
    hexagramMeaning: analysis.iChing.hexagram.meaning,
    dominantElement: getElementChineseName(analysis.huangdi.dominantElement),
    elementAdvice: analysis.huangdi.emotionAdvice.split('\n')[0],
    archetype: getArchetypeInfo(analysis.psychology.archetype).chineseName,
    archetypeDescription: analysis.psychology.archetypeDescription,
  };

  return {
    wisdomAnalysis: analysis,
    userContext,
    culturalReferences,
  };
}

/** 生成故事提示词 - 画面描述风格 */
export function generateStoryPrompt(data: PromptData): string {
  return `你是一位诗意的画面描述者。请基于以下隐含的时空能量，创作一个简短的、富有画面感的场景描述。

【隐含的时空能量】
这些信息不要在文字中直接提及，而是让它们自然地影响场景的氛围和意境：
- 时间氛围: ${data.userContext.timeAtmosphere}
- 季节气息: ${data.userContext.seasonFeeling}
- 天气触感: ${data.userContext.weather}
- 情绪基调: ${data.userContext.moodTone}

【创作要求】
1. 描绘一个具体的、静止的画面场景（像一幅画的文字说明）
2. 包含：一个主体（可以是人、物、或自然元素）、一个环境、一种光线、一种情绪
3. 用感官细节：看到什么颜色、听到什么声音、感受到什么温度
4. 100-150字，简洁而富有意境
5. 不要说教，不要解读，不要提及易经、五行等概念，只描绘画面
6. 结尾留一个意象或细微的动作，有余韵
7. 用第二人称"你"来写，让读者有身临其境的感觉

【输出】
直接输出画面描述，不要任何前缀、标题或解释。`;
}

/** 生成图片提示词 - 基于画面描述 */
export function generateImagePrompt(data: PromptData): string {
  const { userContext, culturalReferences, wisdomAnalysis } = data;

  // 五行对应的视觉风格
  const elementStyles: Record<string, { palette: string; elements: string; style: string }> = {
    '木': {
      palette: 'emerald green, sage, fresh mint, warm wood tones',
      elements: 'bamboo, leaves, growing plants, forest light',
      style: 'organic, flowing, natural',
    },
    '火': {
      palette: 'warm amber, golden orange, soft coral, candlelight yellow',
      elements: 'warm glow, sunrise colors, gentle flames, lantern light',
      style: 'warm, radiant, inviting',
    },
    '土': {
      palette: 'earthy ochre, warm beige, terracotta, soft brown',
      elements: 'mountains, stones, pottery, grounded landscape',
      style: 'stable, nurturing, grounded',
    },
    '金': {
      palette: 'silver white, pale gold, cream, misty gray',
      elements: 'moonlight, autumn mist, delicate metal, crystal clarity',
      style: 'refined, elegant, minimal',
    },
    '水': {
      palette: 'deep indigo, midnight blue, soft teal, pearl gray',
      elements: 'still water, rain drops, flowing streams, starry reflection',
      style: 'mysterious, deep, fluid',
    },
  };

  // 时间对应的光线
  const timeLighting: Record<string, string> = {
    dawn: 'soft pink and gold dawn light, gentle first rays',
    morning: 'clear bright morning light, fresh and crisp',
    afternoon: 'warm golden hour light, long soft shadows',
    evening: 'amber sunset glow, purple twilight edges',
    night: 'cool moonlight, soft starlight, ambient darkness',
  };

  // 季节对应的氛围
  const seasonMood: Record<string, string> = {
    spring: 'fresh, renewal, delicate blossoms, soft rain',
    summer: 'lush, vibrant, full bloom, warm breeze',
    autumn: 'contemplative, harvest colors, falling leaves, crisp air',
    winter: 'serene, minimal, frost crystals, quiet stillness',
  };

  const element = culturalReferences.dominantElement;
  const elementStyle = elementStyles[element] || elementStyles['土'];
  const lighting = timeLighting[wisdomAnalysis.iChing.hexagram.name.includes('夜') ? 'night' :
    data.userContext.time.includes('晨') ? 'dawn' :
    data.userContext.time.includes('午') ? 'afternoon' : 'evening'];
  const season = seasonMood[data.userContext.season === '春' ? 'spring' :
    data.userContext.season === '夏' ? 'summer' :
    data.userContext.season === '秋' ? 'autumn' : 'winter'];

  return `Artistic illustration in soft watercolor and digital art blend style,
${elementStyle.style} composition, ${elementStyle.elements},
Color palette: ${elementStyle.palette},
Lighting: ${lighting},
Atmosphere: ${season}, ${userContext.moodVisual},
A contemplative scene with subtle Eastern aesthetic influence,
Soft dreamy quality, painterly brushstrokes, gentle gradients,
High quality, artistic, emotional depth, poetic mood,
NO text, NO words, NO letters, clean composition`;
}

// Functions are already exported inline above
