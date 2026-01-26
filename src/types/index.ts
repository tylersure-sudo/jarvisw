// 位置信息
export interface LocationInfo {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

// 天气信息
export interface WeatherInfo {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

// 情绪选项
export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  intensity: 'light' | 'moderate' | 'strong';
  category: 'positive' | 'neutral' | 'negative';
}

// 用户选择的情绪
export interface SelectedMood {
  mood: MoodOption;
  customNote?: string;
}

// 时空状态
export interface SpaceTimeContext {
  location: LocationInfo | null;
  weather: WeatherInfo | null;
  time: Date;
  timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

// AI 生成的回响
export interface EchoResponse {
  story: string;
  imageUrl: string;
  generatedAt: Date;
}

// 应用状态
export type AppPhase = 'collecting' | 'listening' | 'responding' | 'complete';
