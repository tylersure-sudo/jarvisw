/**
 * 回响生成器 - Echo Generator
 * 整合文化智慧模块，生成故事和图片
 * 支持 Gemini API (文字 + 图片)
 */

import type { SpaceTimeContext, SelectedMood, EchoResponse } from '../types';
import type { EnergyBlock } from '../components/EnergyBlocks';
import {
  getWisdomAnalysis,
  preparePromptData,
  generateStoryPrompt,
  generateImagePrompt,
  type WisdomAnalysis,
} from './wisdom';

// ==================== 配置 ====================

export type AIProvider = 'gemini' | 'openai' | 'custom';

export interface AIConfig {
  enabled: boolean;
  provider: AIProvider;
  geminiApiKey?: string;
  enableImageGen: boolean;
  storyApiEndpoint?: string;
  storyApiKey?: string;
  imageApiEndpoint?: string;
  imageApiKey?: string;
}

// 默认配置 - 使用 Gemini
// 注意: Imagen API 需要 Vertex AI 认证，不支持简单 API key
// 因此默认禁用图片生成，使用 Unsplash 作为替代
const defaultConfig: AIConfig = {
  enabled: true,
  provider: 'gemini',
  geminiApiKey: 'AIzaSyAfTKruCoNpOOqHItV_JDq-nonl9Y4j6l8',
  enableImageGen: false, // Imagen 需要 Vertex AI，这里禁用
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
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No content generated from Gemini');
  }

  return text;
}

/** 使用 Gemini Imagen 生成图片 */
async function generateImageWithGemini(prompt: string): Promise<string> {
  if (!currentConfig.geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  // 使用 Imagen 3 模型生成图片
  const url = `${GEMINI_API_BASE}/imagen-3.0-generate-002:predict?key=${currentConfig.geminiApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [
        {
          prompt: prompt,
        },
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: '3:4',
        personGeneration: 'dont_allow',
        safetyFilterLevel: 'block_few',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini Imagen API error:', errorText);
    throw new Error(`Gemini Imagen API error: ${response.status}`);
  }

  const data = await response.json();

  // Imagen 返回 base64 编码的图片
  const imageData = data.predictions?.[0]?.bytesBase64Encoded;
  if (imageData) {
    return `data:image/png;base64,${imageData}`;
  }

  // 如果返回的是 URL
  const imageUrl = data.predictions?.[0]?.uri;
  if (imageUrl) {
    return imageUrl;
  }

  throw new Error('No image generated from Gemini Imagen');
}

// ==================== 主生成函数 ====================

/**
 * 生成回响（故事+图片）
 * 优先使用 Gemini API，失败时回退到本地模板
 * @param energies 用户在生成过程中收集的能量块，会影响生成结果
 */
export async function generateEcho(
  context: SpaceTimeContext,
  moods: SelectedMood[],
  energies: EnergyBlock[] = []
): Promise<EchoResponse> {
  // 获取文化智慧分析
  const wisdomAnalysis = getWisdomAnalysis(context, moods);
  const promptData = preparePromptData(context, moods, wisdomAnalysis);

  // 添加能量块影响 - 转化为氛围词
  const energyAtmosphere = energies.length > 0
    ? `\n- 特别氛围: ${energies.map(e => {
        const atmosphereMap: Record<string, string> = {
          'light': '光芒穿透的明亮感',
          'warmth': '被温柔包裹的暖意',
          'wisdom': '沉静深邃的智性',
          'strength': '坚定有力的生命力',
          'peace': '波澜不惊的宁静',
          'mystery': '朦胧神秘的梦幻',
        };
        return atmosphereMap[e.type] || e.label;
      }).join('、')}`
    : '';

  let story: string;
  let imageUrl: string;

  // 尝试使用 AI 生成故事
  if (currentConfig.enabled) {
    try {
      console.log('正在使用 Gemini 生成故事...');
      const basePrompt = generateStoryPrompt(promptData);
      // 如果有能量，将其插入到提示词的【隐含的时空能量】部分
      const prompt = energyAtmosphere
        ? basePrompt.replace('- 情绪基调:', `${energyAtmosphere}\n- 情绪基调:`)
        : basePrompt;

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
    story = generateLocalStory(wisdomAnalysis, context, moods);
  }

  // 尝试使用 Gemini 生成图片
  if (currentConfig.enabled && currentConfig.enableImageGen && currentConfig.geminiApiKey) {
    try {
      console.log('正在使用 Gemini Imagen 生成图片...');
      let imagePrompt = generateImagePrompt(promptData);
      // 添加能量块对图片的影响
      if (energies.length > 0) {
        const energyVisuals = energies.map(e => {
          const visualMap: Record<string, string> = {
            'light': 'radiant golden light rays',
            'warmth': 'warm orange glow',
            'wisdom': 'mystical purple aura',
            'strength': 'powerful emerald energy',
            'peace': 'serene blue atmosphere',
            'mystery': 'ethereal violet mist',
          };
          return visualMap[e.type] || e.label;
        });
        imagePrompt += `, ${energyVisuals.join(', ')}`;
      }
      imageUrl = await generateImageWithGemini(imagePrompt);
      console.log('Gemini 图片生成成功');
    } catch (error) {
      console.error('AI图片生成失败，使用占位图:', error);
      imageUrl = getPlaceholderImage(wisdomAnalysis, context, moods);
    }
  } else {
    imageUrl = getPlaceholderImage(wisdomAnalysis, context, moods);
  }

  return {
    story,
    imageUrl,
    generatedAt: new Date(),
  };
}

// ==================== 自定义 API 支持 ====================

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

function generateLocalStory(
  analysis: WisdomAnalysis,
  context: SpaceTimeContext,
  moods: SelectedMood[]
): string {
  // 时间场景
  const timeScenes: Record<string, string> = {
    dawn: '天边泛起淡淡的粉色，第一缕晨光穿过薄雾，落在窗台上。',
    morning: '阳光从窗帘缝隙洒进来，在地板上画出一道道金色的光带。',
    afternoon: '午后的阳光变得柔软，影子拉得很长，空气里有慵懒的味道。',
    evening: '天空渐渐染上橙红，最后一抹余晖温柔地照在旧物上。',
    night: '夜色如墨，窗外星光点点，世界安静得只剩下呼吸的声音。',
  };

  // 季节元素
  const seasonElements: Record<string, string> = {
    spring: '窗外的枝头，不知何时冒出了新绿。',
    summer: '蝉鸣从远处传来，空气里有青草的气息。',
    autumn: '一片落叶飘过窗前，带着些许金黄。',
    winter: '玻璃上凝结着薄薄的霜花，勾勒出细密的纹路。',
  };

  // 五行意象
  const elementImages: Record<string, string> = {
    wood: '桌上的绿植轻轻摇曳，仿佛在呼应着什么。',
    fire: '一盏暖灯亮着，光晕在墙上晕开柔和的圆。',
    earth: '手边的陶杯温热，杯中茶叶缓缓沉淀。',
    metal: '窗外月光如水，在地上铺开一层银白。',
    water: '雨滴顺着玻璃滑落，汇成细细的水流。',
  };

  // 情绪氛围
  let moodAtmosphere = '你静静地坐着，感受着这一刻的宁静。';
  if (moods.length > 0) {
    const primary = moods[0].mood;
    if (primary.category === 'positive') {
      moodAtmosphere = '心里涌起一股莫名的温暖，嘴角不自觉地上扬。';
    } else if (primary.category === 'negative') {
      moodAtmosphere = '思绪像水一样流淌，带着淡淡的忧伤，却也有奇异的平静。';
    }
  }

  // 结尾意象
  const endings = [
    '远处传来一声鸟鸣，然后一切又归于寂静。',
    '风轻轻掀起书页，又轻轻放下。',
    '时间仿佛在这一刻停住了，只有光影在缓缓移动。',
    '你深吸一口气，感受着此刻的存在。',
    '某个角落里，有什么在悄悄生长。',
  ];

  const timeScene = timeScenes[context.timeOfDay] || timeScenes.afternoon;
  const seasonElement = seasonElements[context.season] || seasonElements.autumn;
  const elementImage = elementImages[analysis.huangdi.dominantElement] || elementImages.earth;
  const ending = endings[Math.floor(Math.random() * endings.length)];

  return `${timeScene}${seasonElement}\n\n${elementImage}${moodAtmosphere}\n\n${ending}`;
}

function getPlaceholderImage(
  analysis: WisdomAnalysis,
  context: SpaceTimeContext,
  moods: SelectedMood[]
): string {
  // 五行对应的视觉关键词
  const elementKeywords: Record<string, string> = {
    wood: 'bamboo,forest,green-leaves,nature',
    fire: 'warm-light,golden-hour,sunset,amber',
    earth: 'mountains,stones,earth-tones,landscape',
    metal: 'moonlight,silver,minimal,misty',
    water: 'water,rain,reflection,deep-blue',
  };

  // 时间对应的光线关键词
  const timeKeywords: Record<string, string> = {
    dawn: 'sunrise,dawn,pink-sky,morning-light',
    morning: 'bright,fresh,clear-sky,morning',
    afternoon: 'golden-hour,warm-light,afternoon',
    evening: 'sunset,twilight,purple-sky,dusk',
    night: 'night,stars,moon,dark-blue',
  };

  // 季节对应的氛围关键词
  const seasonKeywords: Record<string, string> = {
    spring: 'spring,blossoms,fresh,renewal',
    summer: 'summer,lush,vibrant,green',
    autumn: 'autumn,fall-leaves,warm-colors,harvest',
    winter: 'winter,frost,minimal,serene',
  };

  // 情绪对应的风格关键词
  let moodKeyword = 'peaceful,calm';
  if (moods.length > 0) {
    const primary = moods[0].mood;
    if (primary.category === 'positive') {
      moodKeyword = 'joyful,bright,warm';
    } else if (primary.category === 'negative') {
      moodKeyword = 'contemplative,moody,quiet';
    }
  }

  const keywords = [
    elementKeywords[analysis.huangdi.dominantElement] || 'nature',
    timeKeywords[context.timeOfDay] || 'sky',
    seasonKeywords[context.season] || 'landscape',
    moodKeyword,
    'artistic,aesthetic,dreamy',
  ];

  return `https://source.unsplash.com/800x1200/?${keywords.join(',')}`;
}

// ==================== 调试和导出 ====================

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
