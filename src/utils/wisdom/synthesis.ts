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
  const userContext = {
    time: `${getTimeOfDayLabel(context.timeOfDay)} (${context.time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })})`,
    season: getSeasonLabel(context.season),
    weather: context.weather?.description || '未知',
    location: context.location?.city || '某个角落',
    moods: moods.map((m) => `${m.mood.emoji} ${m.mood.label}`),
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

/** 生成故事提示词 */
export function generateStoryPrompt(data: PromptData): string {
  return `你是一位融合东西方智慧的灵性向导。请基于以下信息，为用户创作一段温暖而有深度的个人化故事（300-500字）。

## 用户当前状态
- 时间：${data.userContext.time}
- 季节：${data.userContext.season}
- 天气：${data.userContext.weather}
- 位置：${data.userContext.location}
- 此刻心情：${data.userContext.moods.join('、')}

## 文化智慧背景
### 易经
- 卦象：${data.culturalReferences.hexagramName}
- 含义：${data.culturalReferences.hexagramMeaning}

### 五行
- 主导元素：${data.culturalReferences.dominantElement}
- 建议：${data.culturalReferences.elementAdvice}

### 心理原型
- 原型：${data.culturalReferences.archetype}
- 描述：${data.culturalReferences.archetypeDescription}

## 创作要求
1. 以第二人称"你"来写，让读者有沉浸感
2. 巧妙融入以上文化元素，但不要生硬罗列
3. 故事要有诗意和画面感，像是来自宇宙的轻声细语
4. 结尾给予温暖的力量和希望
5. 语言风格：温柔、深邃、富有哲理
6. 避免说教，通过意象和隐喻传达智慧

## 综合主题
${data.wisdomAnalysis.synthesis.theme}

请创作故事：`;
}

/** 生成图片提示词 */
export function generateImagePrompt(data: PromptData): string {
  const { userContext, culturalReferences, wisdomAnalysis } = data;

  // 基于文化元素构建视觉意象
  const elementVisuals: Record<string, string> = {
    '木': 'ancient forest, green energy, growing trees, spring vitality',
    '火': 'warm golden light, sunrise, flames, passionate energy',
    '土': 'mountains, earth tones, grounded landscape, nurturing nature',
    '金': 'silver moonlight, autumn leaves, crystalline structures, clarity',
    '水': 'flowing water, deep ocean, starry reflection, mysterious depth',
  };

  const archetypeVisuals: Record<string, string> = {
    '英雄': 'heroic figure, dawn light, mountain peak',
    '导师': 'wise sage, ancient library, glowing wisdom',
    '探索者': 'vast horizon, unknown path, adventure calling',
    '反叛者': 'breaking chains, transformation, phoenix rising',
    '恋人': 'warm embrace, blooming flowers, heart energy',
    '创造者': 'cosmic creation, artistic swirls, birth of stars',
    '小丑': 'playful light, colorful joy, dancing spirits',
    '智者': 'contemplative figure, cosmic knowledge, starlit meditation',
    '天真者': 'pure light, dewdrops, innocent morning',
    '凡人': 'peaceful community, gentle connection, everyday magic',
    '照顾者': 'nurturing light, protective embrace, healing energy',
    '统治者': 'majestic presence, ordered cosmos, golden crown',
  };

  const elementVisual = elementVisuals[culturalReferences.dominantElement] || elementVisuals['土'];
  const archetypeVisual = archetypeVisuals[culturalReferences.archetype] || 'spiritual journey';

  // 时间和季节影响
  const timeVisual = userContext.time.includes('夜') ? 'night sky, stars, moon' :
    userContext.time.includes('晨') ? 'sunrise, dawn, fresh beginning' :
      userContext.time.includes('午') ? 'golden hour, warm sunlight' :
        'sunset, dusk, twilight transition';

  const seasonVisual = userContext.season === '春' ? 'spring blossoms, renewal' :
    userContext.season === '夏' ? 'summer vibrance, full bloom' :
      userContext.season === '秋' ? 'autumn colors, harvest moon' :
        'winter serenity, crystalline beauty';

  // 情绪色调
  let moodTone = 'peaceful, balanced';
  if (wisdomAnalysis.psychology.emotionalState.pleasure > 0.3) {
    moodTone = 'joyful, radiant, warm colors';
  } else if (wisdomAnalysis.psychology.emotionalState.pleasure < -0.3) {
    moodTone = 'contemplative, transformative, deep blues and purples';
  }

  return `A mystical, ethereal digital artwork in cosmic spiritual style:
${elementVisual}, ${archetypeVisual}, ${timeVisual}, ${seasonVisual},
Mood: ${moodTone},
Style: dreamy, luminous, high quality, 8k, cinematic lighting, digital painting,
A single human figure in meditation or contemplation, cosmic background,
Chinese philosophy meets Western psychology, spiritual awakening,
NOT photorealistic, artistic interpretation, emotional depth`;
}

// Functions are already exported inline above
