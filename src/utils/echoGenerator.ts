import type { SpaceTimeContext, SelectedMood, EchoResponse } from '../types';
import { getTimeOfDayLabel, getSeasonLabel } from './time';

// 模拟 AI 生成故事和图片
// 在实际应用中，这里会调用 OpenAI 或其他 AI API
export async function generateEcho(
  context: SpaceTimeContext,
  moods: SelectedMood[],
  customNote?: string
): Promise<EchoResponse> {
  // 模拟 API 调用延迟 (15-30秒)
  const delay = 15000 + Math.random() * 15000;

  await new Promise((resolve) => setTimeout(resolve, delay));

  // 构建故事元素
  const timeOfDayLabel = getTimeOfDayLabel(context.timeOfDay);
  const seasonLabel = getSeasonLabel(context.season);
  const city = context.location?.city || '远方';
  const weather = context.weather?.description || '未知的天气';
  const temperature = context.weather?.temperature;

  // 获取主要情绪
  const primaryMood = moods[0]?.mood;
  const moodLabels = moods.map((m) => m.mood.label).join('、');

  // 生成故事（这里是模拟，实际会调用 AI）
  const story = generateStory({
    timeOfDay: timeOfDayLabel,
    season: seasonLabel,
    city,
    weather,
    temperature,
    moodLabels,
    primaryMood: primaryMood?.label,
    primaryCategory: primaryMood?.category,
    customNote,
  });

  // 生成图片 URL（使用 Unsplash 随机图片作为占位）
  const imageKeywords = getImageKeywords(context, moods);
  const imageUrl = `https://source.unsplash.com/800x600/?${imageKeywords}`;

  return {
    story,
    imageUrl,
    generatedAt: new Date(),
  };
}

interface StoryParams {
  timeOfDay: string;
  season: string;
  city: string;
  weather: string;
  temperature?: number;
  moodLabels: string;
  primaryMood?: string;
  primaryCategory?: 'positive' | 'neutral' | 'negative';
  customNote?: string;
}

function generateStory(params: StoryParams): string {
  const { timeOfDay, season, city, weather, temperature, moodLabels, primaryCategory, customNote } =
    params;

  // 故事模板库
  const storyTemplates = getStoryTemplates(primaryCategory || 'neutral');

  // 随机选择一个模板
  const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];

  // 替换占位符
  let story = template
    .replace(/{timeOfDay}/g, timeOfDay)
    .replace(/{season}/g, season)
    .replace(/{city}/g, city)
    .replace(/{weather}/g, weather)
    .replace(/{temperature}/g, temperature !== undefined ? `${temperature}°C` : '适宜的温度')
    .replace(/{moodLabels}/g, moodLabels);

  // 如果有自定义备注，添加个性化内容
  if (customNote) {
    story += `\n\n你轻声说："${customNote}"——宇宙听到了，风轻轻回应着你。`;
  }

  return story;
}

function getStoryTemplates(category: 'positive' | 'neutral' | 'negative'): string[] {
  const templates: Record<string, string[]> = {
    positive: [
      `此刻是{city}的{timeOfDay}，{season}天的{weather}轻柔地包裹着这座城市。温度停留在{temperature}，恰到好处。

你感到{moodLabels}。这种感觉像是清晨第一缕阳光穿过窗帘的缝隙，温暖而不刺眼。

宇宙在这一刻似乎放慢了脚步，只为倾听你心中那份美好。有一只蝴蝶正在某处振动翅膀，而你的微笑，正在改变着某个遥远角落的气流。

记住这一刻。它会成为你未来某个困难时刻的锚点，提醒你：美好一直都在。`,

      `{season}的{timeOfDay}，{city}的天空正{weather}。{temperature}的空气中飘散着属于这个季节的气息。

你此刻感到{moodLabels}——这是宇宙给你的礼物。

有人说，每一个快乐的瞬间都会变成一颗星星，悬挂在你生命的夜空中。今天，你又为自己点亮了一颗。

当你回望的时候，会发现这些星星串成了独属于你的星座，讲述着你独一无二的故事。`,

      `在{city}的这个{season}{timeOfDay}，{weather}，温度刚好是{temperature}。

你的心里有{moodLabels}。这份情绪像是水面上的涟漪，一圈一圈向外扩散，温柔地触碰着周围的一切。

宇宙感应到了你的频率，它轻轻点头，仿佛在说：很好，继续这样。

此刻的你，正站在人生的某个交叉点上。而你选择了微笑。这个选择，正在改写着某些故事的结局。`,
    ],

    neutral: [
      `{city}的{timeOfDay}，{season}天，{weather}。温度表显示{temperature}。

你感到{moodLabels}。这是一种说不清道不明的状态，像是静止的湖水，平静中藏着深邃。

宇宙并不总是波澜壮阔的，更多时候，它是这样——安静地存在着，安静地运转着，安静地等待着。

或许，平静本身就是一种力量。在这份平静中，新的想法正在酝酿，新的可能正在萌芽。给自己一些时间，答案会自己浮现。`,

      `现在是{city}的{timeOfDay}，{season}的{weather}在窗外轻轻流淌。气温是{temperature}。

你此刻的感受是{moodLabels}。不算特别好，也不算特别坏。

有时候，我们就是处于这样的间隙中——前一个故事已经结束，下一个故事还未开始。这是休止符，不是终点。

宇宙在这样的时刻会悄悄为你准备一些什么。保持开放，保持好奇。惊喜往往在你最不经意的时候出现。`,

      `{season}的{timeOfDay}在{city}静静展开，{weather}，{temperature}。

你说你感到{moodLabels}。宇宙点点头，它理解这种感觉。

不是每一刻都需要定义。不是每一种情绪都需要名字。有时候，只是存在着，只是呼吸着，只是感受着——这本身就已经是全部的意义。

深呼吸。让这一刻完整地属于你。`,
    ],

    negative: [
      `{city}的{season}{timeOfDay}，{weather}。温度是{temperature}，但你的心里似乎有一片小小的阴云。

你感到{moodLabels}。这种感觉很真实，请不要否认它。

宇宙想要告诉你：每一朵云都有它的意义。雨水滋润大地，阴影让光明更加珍贵。你现在的感受，是你完整生命体验的一部分。

如果可以的话，对自己温柔一点。就像对待一个受伤的朋友那样对待自己。这片阴云终会散去，而你会因为经历过它而变得更加深厚。`,

      `此刻是{city}的{timeOfDay}，{season}天的{weather}在窗外。{temperature}。

你心中有{moodLabels}的情绪在轻轻流淌。宇宙感应到了，它没有急着给你建议或者安慰。它只是在这里，陪着你。

有一个古老的说法：每一滴眼泪都会变成一颗种子，埋在心灵的土壤里。总有一天，它们会开出意想不到的花。

现在，你不需要做任何事。只需要知道：你不是一个人。整个宇宙都在以自己的方式拥抱着你。`,

      `{weather}的{season}{timeOfDay}，{city}的街道上人来人往。气温{temperature}。

你告诉宇宙，你感到{moodLabels}。

宇宙沉默了一会儿，然后说：亲爱的，人生就像潮水，有涨有落。你现在可能正在低潮期，但这恰恰意味着涨潮正在路上。

每一个困难的时刻都在塑造着你的故事。多年后回望，你会发现，正是这些时刻让你成为了那个独特而闪亮的自己。

现在，请允许自己慢下来。休息也是前行的一部分。`,
    ],
  };

  return templates[category];
}

function getImageKeywords(context: SpaceTimeContext, moods: SelectedMood[]): string {
  const keywords: string[] = [];

  // 时间相关
  const timeKeywords: Record<string, string> = {
    dawn: 'sunrise,dawn,morning-glow',
    morning: 'morning,sunlight,bright',
    afternoon: 'afternoon,golden-hour,warm',
    evening: 'sunset,dusk,evening',
    night: 'night,stars,moonlight',
  };
  keywords.push(timeKeywords[context.timeOfDay] || 'sky');

  // 季节相关
  const seasonKeywords: Record<string, string> = {
    spring: 'spring,flowers,bloom',
    summer: 'summer,warm,vibrant',
    autumn: 'autumn,leaves,golden',
    winter: 'winter,snow,peaceful',
  };
  keywords.push(seasonKeywords[context.season] || 'nature');

  // 情绪相关
  const primaryMood = moods[0]?.mood;
  if (primaryMood) {
    const moodKeywords: Record<string, string> = {
      positive: 'peaceful,serene,beautiful',
      neutral: 'calm,minimal,contemplative',
      negative: 'dramatic,moody,atmospheric',
    };
    keywords.push(moodKeywords[primaryMood.category] || 'landscape');
  }

  return keywords.join(',');
}
