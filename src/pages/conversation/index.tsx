import { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { generateEcho } from '../../utils/echoGenerator';
import type { SpaceTimeContext, SelectedMood } from '../../types';
import './index.css';

type CallMode = 'daily' | 'mood' | 'dream' | 'question';

interface Message {
  id: string;
  role: 'user' | 'universe';
  content: string;
  timestamp: number;
  imageUrl?: string;
}

interface EnergyBlock {
  id: string;
  type: string;
  label: string;
  color: string;
  glowColor: string;
  size: string;
}

const MODE_GREETINGS: Record<CallMode, string> = {
  daily: '你好，让我感应一下今天的宇宙能量...',
  mood: '我在这里聆听。告诉我，你此刻的感受是什么？',
  dream: '梦境是潜意识的窗口。请描述你的梦，我来帮你解读。',
  question: '宇宙准备好回答你的问题了。你想问什么？',
};

const MODE_PROMPTS: Record<CallMode, string> = {
  daily: '正在为你解读今日运势...',
  mood: '正在感应你的情绪能量...',
  dream: '正在解析梦境的象征意义...',
  question: '正在向宇宙寻找答案...',
};

const ENERGY_OPTIONS: Array<EnergyBlock & { emoji: string; gradient: string }> = [
  { id: 'light', type: 'light', label: '光明', color: '', glowColor: 'rgba(251,191,36,0.6)', size: 'medium', emoji: '☀️', gradient: 'energy-light' },
  { id: 'wisdom', type: 'wisdom', label: '智慧', color: '', glowColor: 'rgba(129,140,248,0.6)', size: 'medium', emoji: '⭐', gradient: 'energy-wisdom' },
  { id: 'peace', type: 'peace', label: '宁静', color: '', glowColor: 'rgba(34,211,238,0.6)', size: 'medium', emoji: '💧', gradient: 'energy-peace' },
  { id: 'strength', type: 'strength', label: '力量', color: '', glowColor: 'rgba(52,211,153,0.6)', size: 'medium', emoji: '💎', gradient: 'energy-strength' },
];

export default function ConversationPage() {
  const router = useRouter();
  const mode = (router.params.mode || 'daily') as CallMode;
  const contextJson = router.params.contextJson;

  const [context] = useState<SpaceTimeContext>(() => {
    try {
      return JSON.parse(decodeURIComponent(contextJson || '{}'));
    } catch {
      return { time: new Date(), timeOfDay: 'afternoon', season: 'spring', location: null, weather: null };
    }
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [collectedEnergies, setCollectedEnergies] = useState<EnergyBlock[]>([]);
  const [showEnergyHint, setShowEnergyHint] = useState(false);
  const [scrollIntoView, setScrollIntoView] = useState('');

  // 初始化问候
  useEffect(() => {
    const greeting: Message = {
      id: 'greeting',
      role: 'universe',
      content: MODE_GREETINGS[mode],
      timestamp: Date.now(),
    };
    setMessages([greeting]);

    if (mode === 'daily') {
      setTimeout(() => handleSubmit(''), 1500);
    }
  }, [mode]);

  // 滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      setScrollIntoView(`msg-${messages[messages.length - 1].id}`);
    }
  }, [messages]);

  // 生成回应
  const handleGenerateResponse = async (userInput: string, energies: EnergyBlock[]) => {
    const moodMap: Record<CallMode, { id: string; label: string; emoji: string }> = {
      daily: { id: 'hopeful', label: '期待', emoji: '🌟' },
      mood: { id: 'peaceful', label: '平和', emoji: '🌊' },
      dream: { id: 'mysterious', label: '神秘', emoji: '🌙' },
      question: { id: 'curious', label: '好奇', emoji: '✨' },
    };

    const selectedMood: SelectedMood = {
      mood: {
        ...moodMap[mode],
        intensity: 'moderate' as const,
        category: 'neutral' as const,
      },
      customNote: userInput || undefined,
    };

    // context.time needs to be a Date object for generateEcho
    const contextWithDate = {
      ...context,
      time: new Date(context.time),
    };

    const response = await generateEcho(contextWithDate, [selectedMood], energies);
    return { story: response.story, imageUrl: response.imageUrl };
  };

  // 提交输入
  const handleSubmit = async (input: string) => {
    const trimmedInput = input.trim();

    if (trimmedInput) {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmedInput,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, userMessage]);
    }

    setUserInput('');
    setIsGenerating(true);
    setShowEnergyHint(true);

    const thinkingMessage: Message = {
      id: 'thinking',
      role: 'universe',
      content: MODE_PROMPTS[mode],
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowEnergyHint(false);

      const response = await handleGenerateResponse(trimmedInput, collectedEnergies);

      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'thinking');
        return [...filtered, {
          id: `universe-${Date.now()}`,
          role: 'universe',
          content: response.story,
          timestamp: Date.now(),
          imageUrl: response.imageUrl,
        }];
      });
    } catch (error) {
      console.error('生成回应失败:', error);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'thinking');
        return [...filtered, {
          id: `error-${Date.now()}`,
          role: 'universe',
          content: '抱歉，宇宙信号暂时中断了。请稍后再试。',
          timestamp: Date.now(),
        }];
      });
    } finally {
      setIsGenerating(false);
      setCollectedEnergies([]);
    }
  };

  // 能量收集
  const handleEnergyClick = (energy: EnergyBlock) => {
    if (!collectedEnergies.find(e => e.id === energy.id)) {
      setCollectedEnergies(prev => [...prev, energy]);
      Taro.vibrateShort({ type: 'light' });
    }
  };

  return (
    <View className="conversation-page">
      {/* 顶部栏 */}
      <View className="top-bar">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <Text className="back-arrow">‹</Text>
          <Text className="back-label">返回</Text>
        </View>
        <View className="status-badge">
          <View className="status-dot" />
          <Text className="status-text">对话中</Text>
        </View>
        <View className="placeholder" />
      </View>

      {/* 消息列表 */}
      <ScrollView
        className="message-list"
        scrollY
        scrollIntoView={scrollIntoView}
        scrollWithAnimation
      >
        {messages.map((message) => (
          <View
            key={message.id}
            id={`msg-${message.id}`}
            className={`message-row ${message.role === 'user' ? 'message-right' : 'message-left'}`}
          >
            <View className={`message-bubble ${message.role === 'user' ? 'bubble-user' : 'bubble-universe'}`}>
              {message.role === 'universe' && (
                <View className="universe-header">
                  <View className="universe-avatar">
                    <Text className="universe-avatar-icon">✦</Text>
                  </View>
                  <Text className="universe-name">宇宙</Text>
                </View>
              )}
              <Text className="message-text">{message.content}</Text>
              {message.imageUrl && (
                <View className="message-image-wrap">
                  <Image
                    className="message-image"
                    src={message.imageUrl}
                    mode="widthFix"
                    showMenuByLongpress
                  />
                </View>
              )}
            </View>
          </View>
        ))}

        {/* 能量块区域 */}
        {showEnergyHint && (
          <View className="energy-section">
            <View className="energy-badge">
              <View className="energy-pulse-dot" />
              <Text className="energy-badge-text">能量注入中</Text>
            </View>
            <Text className="energy-hint">✦ 轻点能量块为回响注入灵感 ✦</Text>
            <View className="energy-grid">
              {ENERGY_OPTIONS.map((energy) => {
                const isCollected = !!collectedEnergies.find(e => e.id === energy.id);
                return (
                  <View
                    key={energy.id}
                    className={`energy-item ${isCollected ? 'collected' : ''}`}
                    onClick={() => handleEnergyClick(energy)}
                  >
                    <View className={`energy-block ${energy.gradient}`}>
                      <Text className="energy-emoji">{energy.emoji}</Text>
                      {isCollected && (
                        <View className="energy-check">
                          <Text className="check-icon">✓</Text>
                        </View>
                      )}
                    </View>
                    <Text className={`energy-label ${isCollected ? 'label-dim' : ''}`}>{energy.label}</Text>
                  </View>
                );
              })}
            </View>
            {collectedEnergies.length > 0 && (
              <Text className="energy-count">已注入 {collectedEnergies.length} 种能量</Text>
            )}
          </View>
        )}

        <View style={{ height: '20rpx' }} />
      </ScrollView>

      {/* 底部输入区 */}
      {mode !== 'daily' && (
        <View className="input-bar">
          <Input
            className="text-input"
            value={userInput}
            onInput={(e) => setUserInput(e.detail.value)}
            onConfirm={() => !isGenerating && handleSubmit(userInput)}
            placeholder={isGenerating ? '宇宙正在回应...' : '输入你想说的...'}
            disabled={isGenerating}
            confirmType="send"
            placeholderClass="input-placeholder"
          />
          <View
            className={`send-btn ${isGenerating || !userInput.trim() ? 'disabled' : ''}`}
            onClick={() => !isGenerating && userInput.trim() && handleSubmit(userInput)}
          >
            <Text className="send-icon">↑</Text>
          </View>
        </View>
      )}
    </View>
  );
}
