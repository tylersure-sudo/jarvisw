import { useState, useEffect, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { generateEcho } from '../../utils/echoGenerator';
import { getCurrentLocation } from '../../utils/location';
import { getWeather } from '../../utils/weather';
import { buildSpaceTimeContext } from '../../utils/time';
import { getShiChen, getSolarTerm, getLunarDateDisplay } from '../../utils/easternTime';
import type { SpaceTimeContext, LocationInfo, WeatherInfo } from '../../types';
import type { EnergyBlock } from '../../components/EnergyBlocks';
import './index.css';

type CallMode = 'daily' | 'mood' | 'dream' | 'question';

const CALL_MODES: Array<{
  id: CallMode;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
}> = [
  { id: 'daily', title: '今日运势', subtitle: '感应宇宙能量', emoji: '☀️', gradient: 'mode-daily' },
  { id: 'mood', title: '心情回响', subtitle: '与星河共鸣', emoji: '🌌', gradient: 'mode-mood' },
  { id: 'dream', title: '梦境解析', subtitle: '探索潜意识', emoji: '🌙', gradient: 'mode-dream' },
  { id: 'question', title: '问问宇宙', subtitle: '寻找答案', emoji: '✨', gradient: 'mode-question' },
];

export default function IndexPage() {
  const [spaceTimeReady, setSpaceTimeReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModes, setShowModes] = useState(false);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [context, setContext] = useState<SpaceTimeContext>(() => buildSpaceTimeContext(null, null));

  // 更新时空上下文
  useEffect(() => {
    setContext(buildSpaceTimeContext(location, weather));
  }, [location, weather]);

  // 获取时空信息
  const handleGetSpaceTime = useCallback(async () => {
    if (spaceTimeReady || loading) return;
    setLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      const weatherData = await getWeather(loc);
      setWeather(weatherData);
      setSpaceTimeReady(true);
    } catch (error) {
      console.error('获取位置或天气失败:', error);
      setLocation({
        latitude: 39.9,
        longitude: 116.4,
        city: '未知城市',
        country: '未知国家',
      });
      setSpaceTimeReady(true);
    } finally {
      setLoading(false);
    }
  }, [spaceTimeReady, loading]);

  // 开始对话
  const handleStartCall = (mode: CallMode) => {
    setShowModes(false);
    Taro.navigateTo({
      url: `/pages/conversation/index?mode=${mode}&contextJson=${encodeURIComponent(JSON.stringify(context))}`,
    });
  };

  // 时空信息
  const shichen = getShiChen(context.time.getHours());
  const solarTerm = getSolarTerm(context.time);
  const lunarDate = getLunarDateDisplay(context.time);

  return (
    <View className="page">
      {/* 背景星点 */}
      <View className="stars-bg">
        {Array.from({ length: 30 }).map((_, i) => (
          <View
            key={i}
            className="star"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              opacity: 0.3 + (i % 5) * 0.1,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </View>

      {/* 时空信息背景 */}
      {spaceTimeReady && (
        <View className="spacetime-bg">
          <View className="spacetime-top">
            <Text className="shichen-text">{shichen.name}</Text>
          </View>
          <View className="spacetime-left">
            <Text className="vertical-text">{lunarDate}</Text>
          </View>
          <View className="spacetime-right">
            <Text className="vertical-text">{solarTerm.name}</Text>
          </View>
          <View className="spacetime-bottom">
            <Text className="city-text">{context.location?.city || ''}</Text>
          </View>
        </View>
      )}

      {/* 中央区域 */}
      <View className="main-area">
        {!spaceTimeReady ? (
          /* 感应时空按钮 */
          <View className="sense-section">
            <View className="sense-glow" />
            <View
              className={`sense-btn ${loading ? 'loading' : ''}`}
              onClick={handleGetSpaceTime}
            >
              <View className="sense-shine" />
              {loading ? (
                <View className="spinner" />
              ) : (
                <View className="sense-content">
                  <Text className="sense-icon">☀</Text>
                  <Text className="sense-label">感应时空</Text>
                </View>
              )}
            </View>
            <Text className="sense-hint">
              {loading ? '正在感应天地能量...' : '轻触开启时空感应'}
            </Text>
          </View>
        ) : !showModes ? (
          /* 呼叫宇宙按钮 */
          <View className="call-section">
            <View className="connect-status">
              <View className="connect-dot" />
              <View className="connect-ping" />
              <Text className="connect-text">宇宙频道已连接</Text>
            </View>

            <View className="call-glow-outer" />
            <View className="call-glow-inner" />
            <View
              className="call-btn"
              onClick={() => setShowModes(true)}
            >
              <View className="call-shine" />
              <View className="call-orbit orbit-1" />
              <View className="call-orbit orbit-2" />
              <View className="call-core" />
              <Text className="call-title">呼叫宇宙</Text>
              <Text className="call-subtitle">开始对话</Text>
            </View>
          </View>
        ) : (
          /* 模式选择 */
          <View className="modes-section">
            <View className="modes-grid">
              {CALL_MODES.map((mode) => (
                <View
                  key={mode.id}
                  className={`mode-card ${mode.gradient}`}
                  onClick={() => handleStartCall(mode.id)}
                >
                  <Text className="mode-emoji">{mode.emoji}</Text>
                  <Text className="mode-title">{mode.title}</Text>
                  <Text className="mode-subtitle">{mode.subtitle}</Text>
                </View>
              ))}
            </View>
            <View className="back-btn" onClick={() => setShowModes(false)}>
              <Text className="back-text">收起</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
