import { useState, useEffect, useCallback } from 'react';
import type { SpaceTimeContext, LocationInfo, WeatherInfo } from '../types';
import { getCurrentLocation } from '../utils/location';
import { getWeather } from '../utils/weather';
import { buildSpaceTimeContext } from '../utils/time';

export function useSpaceTime() {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaceTime = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 获取位置
      const loc = await getCurrentLocation();
      setLocation(loc);

      // 获取天气
      const weatherData = await getWeather(loc);
      setWeather(weatherData);
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取信息失败';
      setError(message);

      // 即使失败也设置默认位置
      setLocation({
        latitude: 39.9,
        longitude: 116.4,
        city: '未知城市',
        country: '未知国家',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpaceTime();
  }, [fetchSpaceTime]);

  const context: SpaceTimeContext = buildSpaceTimeContext(location, weather);

  return {
    context,
    loading,
    error,
    refresh: fetchSpaceTime,
  };
}
