import type { WeatherInfo, LocationInfo } from '../types';

// 使用免费的 Open-Meteo API
export async function getWeather(location: LocationInfo): Promise<WeatherInfo> {
  const { latitude, longitude } = location;

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
  );

  if (!response.ok) {
    throw new Error('获取天气信息失败');
  }

  const data = await response.json();
  const current = data.current;

  return {
    temperature: Math.round(current.temperature_2m),
    description: getWeatherDescription(current.weather_code),
    icon: getWeatherIcon(current.weather_code),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
  };
}

// WMO 天气代码转描述
function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: '晴朗',
    1: '大部晴朗',
    2: '局部多云',
    3: '阴天',
    45: '有雾',
    48: '霜雾',
    51: '小毛毛雨',
    53: '毛毛雨',
    55: '大毛毛雨',
    56: '冻毛毛雨',
    57: '大冻毛毛雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    66: '冻雨',
    67: '大冻雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    77: '雪粒',
    80: '小阵雨',
    81: '阵雨',
    82: '大阵雨',
    85: '小阵雪',
    86: '大阵雪',
    95: '雷暴',
    96: '雷暴伴小冰雹',
    99: '雷暴伴大冰雹',
  };

  return descriptions[code] || '未知天气';
}

// 天气代码转图标
function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌧️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}
