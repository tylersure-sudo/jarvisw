/**
 * 回响生成器 - Echo Generator
 * 整合文化智慧模块，生成故事和图片
 * 支持 Gemini API
 */

import type { SpaceTimeContext, SelectedMood, EchoResponse } from '../types';
import {
  getWisdomAnalysis,
  preparePromptData,
  generateStoryPrompt,
  generateImagePrompt,
  getElementChineseName,
  getArchetypeInfo,
  type WisdomAnalysis,
} from './wisdom';

// ==================== 配置 ====================

export type AIProvider = 'gemini' | 'openai' | 'custom';

export interface AIConfig {
  enabled: boolean;
  provider: AIProvider;
  geminiApiKey?: string;
  storyApiEndpoint?: string;
  storyApiKey?: string;
  imageApiEndpoint?: string;
  imageApiKey?: string;
}

// 默认配置 - 使用 Gemini
const defaultConfig: AIConfig = {
  enabled: true,
  provider: 'gemini',
  geminiApiKey: 'AIzaSyAfTKruCoNpOOqHItV_JDq-nonl9Y4j6l8',
};

let currentConfig = { ...defaultConfig };

/** 设置AI配置 */
export function setAIConfig(config: Partial<AIConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/** 获取当前配置 */
export function getAIConfig(): AIConfig {
  return { ...currentConfig };
}

// ==================== Gemini API ====================

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/** 使用 Gemini 生成故事 */
async function generateStoryWithGemini(prompt: string): Promise<string> {
  if (!currentConfig.geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  const url = `${GEMINI_API_BASE}/gemini-2.0-flash:generateContent?key=${currentConfig.geminiApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();

  // 提取生成的文本
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No content generated from Gemini');
  }

  return text;
}

// ==================== 主生成函数 ====================

/**
 * 生成回响（故事+图片）
 * 优先使用 Gemini API，失败时回退到本地模板
 */
export async function generateEcho(
  context: SpaceTimeContext,
  moods: SelectedMood[]
): Promise<EchoResponse> {
  // 获取文化智慧分析
  const wisdomAnalysis = getWisdomAnalysis(context, moods);
  const promptData = preparePromptData(context, moods, wisdomAnalysis);

  let story: string;
  let imageUrl: string;

  // 尝试使用 AI 生成故事
  if (currentConfig.enabled) {
    try {
      console.log('正在使用 Gemini 生成故事...');
      const prompt = generateStoryPrompt(promptData);

      if (currentConfig.provider === 'gemini' && currentConfig.geminiApiKey) {
        story = await generateStoryWithGemini(prompt);
        console.log('Gemini 故事生成成功');
      } else if (currentConfig.provider === 'custom' && currentConfig.storyApiEndpoint) {
        story = await generateStoryWithCustomAPI(promptData);
      } else {
        throw new Error('No valid AI provider configured');
      }
    } catch (error) {
      console.error('AI故事生成失败，使用本地模板:', error);
      story = generateLocalStory(wisdomAnalysis, context, moods);
    }
  } else {
    // 离线模式
    story = generateLocalStory(wisdomAnalysis, context, moods);
  }

  // 图片暂时使用占位图（可以后续接入图像生成API）
  imageUrl = getPlaceholderImage(wisdomAnalysis, context, moods);

  return {
    story,
    imageUrl,
    generatedAt: new Date(),
  };
}

// ==================== 自定义 API 支持 ====================

/** 使用自定义API生成故事 */
async function generateStoryWithCustomAPI(promptData: ReturnType<typeof preparePromptData>): Promise<string> {
  const prompt = generateStoryPrompt(promptData);

  if (!currentConfig.storyApiEndpoint) {
    throw new Error('Story API endpoint not configured');
  }

  const response = await fetch(currentConfig.storyApiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(currentConfig.storyApiKey && {
        Authorization: `Bearer ${currentConfig.storyApiKey}`,
      }),
    },
    body: JSON.stringify({
      prompt,
      max_tokens: 1000,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content || data.text || data.choices?.[0]?.message?.content || '';
}

// ==================== 本地生成函数 ====================

/** 本地生成故事（基于智慧模块） */
function generateLocalStory(
  analysis: WisdomAnalysis,
  context: SpaceTimeContext,
  moods: SelectedMood[]
): string {
  const { iChing, sixLines, huangdi, psychology } = analysis;
  const archetype = getArchetypeInfo(psychology.archetype);
  const element = getElementChineseName(huangdi.dominantElement);

  // 获取时间描述
  const timeDesc = context.timeOfDay === 'night' ? '夜幕低垂' :
    context.timeOfDay === 'dawn' ? '晨曦微露' :
      context.timeOfDay === 'morning' ? '阳光正好' :
        context.timeOfDay === 'afternoon' ? '午后时光' :
          '暮色渐浓';

  // 获取季节描述
  const seasonDesc = context.season === 'spring' ? '春风轻拂' :
    context.season === 'summer' ? '夏日炎炎' :
      context.season === 'autumn' ? '秋意渐浓' :
        '冬雪飘零';

  // 获取情绪描述
  let moodDesc = '平静如水';
  if (moods.length > 0) {
    const primary = moods[0].mood;
    moodDesc = `${primary.emoji} ${primary.label}`;
  }

  // 天气描述
  const weatherDesc = context.weather?.description || '天气变幻';

  // 构建故事
  let story = `${timeDesc}，${seasonDesc}的${context.location?.city || '这座城市'}，${weatherDesc}。`;
  story += `你正感受着「${moodDesc}」的情绪波动。\n\n`;

  // 融入易经智慧
  story += `宇宙为你呈现了「${iChing.hexagram.name}」的卦象——${iChing.hexagram.image}\n\n`;
  story += `${iChing.hexagram.meaning}\n\n`;

  // 融入五行分析
  story += `此刻，${element}气在你的能量场中流转。`;
  const emotionPart = huangdi.emotionAdvice.split('\n\n')[0];
  if (emotionPart) {
    story += emotionPart.replace(/从情志角度来看，[^。]+。/, '');
  }
  story += '\n\n';

  // 融入心理学分析
  story += `你的内心深处，住着一位「${archetype.chineseName}」——${archetype.description}\n\n`;

  // 融入六爻预测
  story += `${sixLines.shortTerm}\n\n`;

  // 宇宙的建议
  story += `来自宇宙的声音轻轻说道：\n"${iChing.guidance}"\n\n`;

  // 肯定语
  story += `✨ ${psychology.affirmation}`;

  return story;
}

/** 获取占位图片（基于Unsplash） */
function getPlaceholderImage(
  analysis: WisdomAnalysis,
  context: SpaceTimeContext,
  moods: SelectedMood[]
): string {
  const keywords: string[] = [];

  // 时间关键词
  const timeKeywords: Record<string, string> = {
    dawn: 'sunrise,dawn',
    morning: 'morning,sunlight',
    afternoon: 'golden-hour',
    evening: 'sunset,dusk',
    night: 'night,stars,moon',
  };
  keywords.push(timeKeywords[context.timeOfDay] || 'sky');

  // 季节关键词
  const seasonKeywords: Record<string, string> = {
    spring: 'spring,flowers',
    summer: 'summer,warm',
    autumn: 'autumn,leaves',
    winter: 'winter,snow',
  };
  keywords.push(seasonKeywords[context.season] || 'nature');

  // 五行关键词
  const elementKeywords: Record<string, string> = {
    wood: 'forest,green',
    fire: 'fire,warmth',
    earth: 'mountain,earth',
    metal: 'crystal,silver',
    water: 'water,ocean',
  };
  keywords.push(elementKeywords[analysis.huangdi.dominantElement] || 'cosmic');

  // 情绪关键词
  if (moods.length > 0) {
    const primaryMood = moods[0].mood;
    if (primaryMood.category === 'positive') {
      keywords.push('peaceful,serene');
    } else if (primaryMood.category === 'negative') {
      keywords.push('contemplative,moody');
    } else {
      keywords.push('calm,minimal');
    }
  }

  // 添加统一的主题关键词
  keywords.push('spiritual,meditation');

  return `https://source.unsplash.com/800x1200/?${keywords.join(',')}`;
}

// ==================== 调试和导出 ====================

/** 获取调试信息（用于开发） */
export function getDebugInfo(
  context: SpaceTimeContext,
  moods: SelectedMood[]
): object {
  const analysis = getWisdomAnalysis(context, moods);
  const promptData = preparePromptData(context, moods, analysis);

  return {
    config: { ...currentConfig, geminiApiKey: '***hidden***' },
    analysis,
    storyPrompt: generateStoryPrompt(promptData),
    imagePrompt: generateImagePrompt(promptData),
  };
}

export { generateStoryPrompt, generateImagePrompt };
