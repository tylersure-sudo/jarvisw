/**
 * 图标和背景图生成器
 * 使用 Gemini Imagen API 生成自定义图标和背景
 */

const GEMINI_API_KEY = 'AIzaSyAfTKruCoNpOOqHItV_JDq-nonl9Y4j6l8';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// 图标缓存
const iconCache = new Map<string, string>();

// 预设图标提示词
export const ICON_PROMPTS = {
  // 功能模块图标
  daily: 'A mystical golden sun with cosmic rays, spiritual energy, minimalist icon style, dark purple background, glowing effect, 3D rendered',
  mood: 'A swirling galaxy spiral with purple and blue nebula, emotional energy waves, minimalist icon style, dark background, ethereal glow',
  dream: 'A crescent moon with starry night sky inside, dreamy clouds, minimalist icon style, deep blue and silver, mystical atmosphere',
  question: 'A sparkling cosmic star cluster forming a question mark shape, golden and white light, minimalist icon style, dark space background',

  // 心情图标
  joyful: 'A radiant warm sun with golden light rays, happiness energy, minimalist circular icon, warm colors, glowing center',
  peaceful: 'Calm ocean waves under moonlight, serene blue tones, minimalist circular icon, gentle ripples, peaceful atmosphere',
  melancholy: 'Soft rain drops on glass with blurred city lights, melancholic blue and gray, minimalist circular icon, contemplative mood',
  anxious: 'A swirling vortex of energy in purple and blue, dynamic movement, minimalist circular icon, intense but controlled',
  hopeful: 'A bright star rising above clouds, dawn colors pink and gold, minimalist circular icon, inspiring and uplifting',

  // UI图标
  universe: 'A spiral galaxy with colorful nebula, cosmic energy, minimalist icon, purple and blue tones, mystical and vast',
  call: 'Cosmic connection symbol, two energy waves meeting, purple and cyan, minimalist icon, spiritual connection',
  voice: 'Sound waves emanating from cosmic source, purple gradients, minimalist icon, ethereal and flowing',
  back: 'Elegant arrow pointing left with cosmic trail, purple glow, minimalist icon, smooth and modern',
  send: 'Cosmic light beam shooting upward, energy trail, purple and gold, minimalist icon, dynamic movement',

  // 能量块图标
  light: 'Pure golden light orb with radiating rays, warm energy, 3D sphere, glowing effect, spiritual power',
  warmth: 'Warm orange and red energy sphere, comforting glow, 3D orb, fire-like but gentle, nurturing energy',
  wisdom: 'Deep purple and indigo crystal orb, ancient knowledge, 3D sphere, mystical patterns, enlightenment',
  strength: 'Emerald green power sphere, nature energy, 3D orb, strong and grounded, vitality',
  peace: 'Serene cyan and blue calm sphere, tranquil waters, 3D orb, meditative energy, harmony',
  mystery: 'Violet and magenta mystic orb, unknown depths, 3D sphere, swirling patterns, enigmatic',
} as const;

// 背景图提示词
export const BACKGROUND_PROMPTS = {
  main: 'Deep space cosmic background, purple and blue nebula, distant stars, peaceful and vast, high quality, 4K',
  conversation: 'Ethereal space atmosphere, soft purple gradient, subtle star field, calming cosmic scene, high quality',
  generating: 'Cosmic energy waves, flowing aurora-like patterns, purple and cyan, mystical atmosphere, dynamic but serene',
};

/**
 * 使用 Gemini Imagen 生成图像
 */
export async function generateImage(prompt: string, aspectRatio: string = '1:1'): Promise<string> {
  // 检查缓存
  const cacheKey = `${prompt}-${aspectRatio}`;
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!;
  }

  try {
    const url = `${GEMINI_API_BASE}/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio,
          personGeneration: 'dont_allow',
          safetyFilterLevel: 'block_few',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const imageData = data.predictions?.[0]?.bytesBase64Encoded;

    if (imageData) {
      const dataUrl = `data:image/png;base64,${imageData}`;
      iconCache.set(cacheKey, dataUrl);
      return dataUrl;
    }

    throw new Error('No image data returned');
  } catch (error) {
    console.error('Image generation failed:', error);
    // 返回占位符
    return getPlaceholderIcon(prompt);
  }
}

/**
 * 生成图标
 */
export async function generateIcon(type: keyof typeof ICON_PROMPTS): Promise<string> {
  const prompt = ICON_PROMPTS[type];
  return generateImage(prompt, '1:1');
}

/**
 * 生成背景图
 */
export async function generateBackground(type: keyof typeof BACKGROUND_PROMPTS): Promise<string> {
  const prompt = BACKGROUND_PROMPTS[type];
  return generateImage(prompt, '9:16');
}

/**
 * 批量预生成图标
 */
export async function preloadIcons(types: (keyof typeof ICON_PROMPTS)[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (const type of types) {
    try {
      const url = await generateIcon(type);
      results.set(type, url);
    } catch (error) {
      console.error(`Failed to generate icon: ${type}`, error);
      results.set(type, getPlaceholderIcon(type));
    }
  }

  return results;
}

/**
 * 获取占位符图标（SVG 格式）
 */
function getPlaceholderIcon(type: string): string {
  // 根据类型返回简单的 SVG 占位符
  const colors: Record<string, { primary: string; secondary: string }> = {
    daily: { primary: '#F59E0B', secondary: '#D97706' },
    mood: { primary: '#8B5CF6', secondary: '#6D28D9' },
    dream: { primary: '#3B82F6', secondary: '#1D4ED8' },
    question: { primary: '#EC4899', secondary: '#DB2777' },
    joyful: { primary: '#FBBF24', secondary: '#F59E0B' },
    peaceful: { primary: '#06B6D4', secondary: '#0891B2' },
    melancholy: { primary: '#6B7280', secondary: '#4B5563' },
    anxious: { primary: '#8B5CF6', secondary: '#7C3AED' },
    hopeful: { primary: '#F472B6', secondary: '#EC4899' },
    universe: { primary: '#6366F1', secondary: '#4F46E5' },
    light: { primary: '#FCD34D', secondary: '#FBBF24' },
    warmth: { primary: '#FB923C', secondary: '#F97316' },
    wisdom: { primary: '#A78BFA', secondary: '#8B5CF6' },
    strength: { primary: '#34D399', secondary: '#10B981' },
    peace: { primary: '#22D3EE', secondary: '#06B6D4' },
    mystery: { primary: '#C084FC', secondary: '#A855F7' },
  };

  const color = colors[type] || { primary: '#8B5CF6', secondary: '#6D28D9' };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="grad-${type}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${color.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color.secondary};stop-opacity:1" />
        </radialGradient>
        <filter id="glow-${type}">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#grad-${type})" filter="url(#glow-${type})"/>
      <circle cx="50" cy="50" r="30" fill="${color.primary}" opacity="0.3"/>
      <circle cx="40" cy="40" r="8" fill="white" opacity="0.4"/>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * 图标管理器 - 单例模式
 */
class IconManager {
  private static instance: IconManager;
  private icons: Map<string, string> = new Map();
  private loading: Map<string, Promise<string>> = new Map();

  static getInstance(): IconManager {
    if (!IconManager.instance) {
      IconManager.instance = new IconManager();
    }
    return IconManager.instance;
  }

  async getIcon(type: keyof typeof ICON_PROMPTS): Promise<string> {
    // 已有缓存
    if (this.icons.has(type)) {
      return this.icons.get(type)!;
    }

    // 正在加载
    if (this.loading.has(type)) {
      return this.loading.get(type)!;
    }

    // 开始加载
    const loadPromise = generateIcon(type).then((url) => {
      this.icons.set(type, url);
      this.loading.delete(type);
      return url;
    });

    this.loading.set(type, loadPromise);
    return loadPromise;
  }

  // 获取同步版本（使用占位符）
  getIconSync(type: keyof typeof ICON_PROMPTS): string {
    if (this.icons.has(type)) {
      return this.icons.get(type)!;
    }

    // 触发异步加载
    this.getIcon(type);

    // 返回占位符
    return getPlaceholderIcon(type);
  }
}

export const iconManager = IconManager.getInstance();
