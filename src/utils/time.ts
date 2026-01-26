import type { SpaceTimeContext, LocationInfo, WeatherInfo } from '../types';

export function getTimeOfDay(hour: number): SpaceTimeContext['timeOfDay'] {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

export function getSeason(month: number, latitude: number): SpaceTimeContext['season'] {
  // 根据月份和纬度判断季节
  const isNorthernHemisphere = latitude >= 0;

  // 北半球季节
  let season: SpaceTimeContext['season'];
  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else if (month >= 9 && month <= 11) season = 'autumn';
  else season = 'winter';

  // 南半球季节相反
  if (!isNorthernHemisphere) {
    const opposites: Record<SpaceTimeContext['season'], SpaceTimeContext['season']> = {
      spring: 'autumn',
      summer: 'winter',
      autumn: 'spring',
      winter: 'summer',
    };
    season = opposites[season];
  }

  return season;
}

export function getTimeOfDayLabel(timeOfDay: SpaceTimeContext['timeOfDay']): string {
  const labels: Record<SpaceTimeContext['timeOfDay'], string> = {
    dawn: '黎明',
    morning: '上午',
    afternoon: '下午',
    evening: '傍晚',
    night: '夜晚',
  };
  return labels[timeOfDay];
}

export function getSeasonLabel(season: SpaceTimeContext['season']): string {
  const labels: Record<SpaceTimeContext['season'], string> = {
    spring: '春',
    summer: '夏',
    autumn: '秋',
    winter: '冬',
  };
  return labels[season];
}

export function buildSpaceTimeContext(
  location: LocationInfo | null,
  weather: WeatherInfo | null
): SpaceTimeContext {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  const latitude = location?.latitude ?? 39.9; // 默认北京

  return {
    location,
    weather,
    time: now,
    timeOfDay: getTimeOfDay(hour),
    season: getSeason(month, latitude),
  };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}
