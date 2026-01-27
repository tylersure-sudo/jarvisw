import { useState, useEffect, useRef } from 'react';
import { VoiceInput } from './VoiceInput';
import { VoiceOutput } from './VoiceOutput';
import type { CallMode } from './CallUniverse';
import type { EnergyBlock } from './EnergyBlocks';

interface Message {
  id: string;
  role: 'user' | 'universe';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

interface ConversationScreenProps {
  mode: CallMode;
  onClose: () => void;
  onGenerateResponse: (userInput: string, mode: CallMode, energies: EnergyBlock[]) => Promise<{ story: string; imageUrl?: string }>;
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

export function ConversationScreen({ mode, onClose, onGenerateResponse }: ConversationScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [collectedEnergies, setCollectedEnergies] = useState<EnergyBlock[]>([]);
  const [showEnergyHint, setShowEnergyHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化问候
  useEffect(() => {
    const greeting: Message = {
      id: 'greeting',
      role: 'universe',
      content: MODE_GREETINGS[mode],
      timestamp: new Date(),
    };
    setMessages([greeting]);

    // 如果是今日运势，自动开始生成
    if (mode === 'daily') {
      setTimeout(() => handleSubmit(''), 1500);
    }
  }, [mode]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 处理语音输入
  const handleVoiceTranscript = (text: string) => {
    setUserInput(text);
    // 自动提交
    setTimeout(() => handleSubmit(text), 500);
  };

  // 提交用户输入
  const handleSubmit = async (input: string) => {
    const trimmedInput = input.trim();

    // 如果有输入，添加用户消息
    if (trimmedInput) {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmedInput,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
    }

    setUserInput('');
    setIsGenerating(true);
    setShowEnergyHint(true);

    // 添加"正在生成"消息
    const thinkingMessage: Message = {
      id: 'thinking',
      role: 'universe',
      content: MODE_PROMPTS[mode],
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      // 等待用户收集能量
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowEnergyHint(false);

      // 生成回应
      const response = await onGenerateResponse(trimmedInput, mode, collectedEnergies);

      // 移除"正在生成"消息，添加真实回应
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'thinking');
        return [...filtered, {
          id: `universe-${Date.now()}`,
          role: 'universe',
          content: response.story,
          timestamp: new Date(),
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
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsGenerating(false);
      setCollectedEnergies([]);
    }
  };

  // 能量块点击
  const handleEnergyClick = (energy: EnergyBlock) => {
    if (!collectedEnergies.find(e => e.id === energy.id)) {
      setCollectedEnergies(prev => [...prev, energy]);
    }
  };

  // 简化版能量块
  const energyOptions: EnergyBlock[] = [
    { id: 'light', type: 'light', label: '光明', color: 'from-yellow-400 to-amber-500', glowColor: 'rgba(251, 191, 36, 0.6)', size: 'medium' },
    { id: 'wisdom', type: 'wisdom', label: '智慧', color: 'from-indigo-400 to-purple-500', glowColor: 'rgba(129, 140, 248, 0.6)', size: 'medium' },
    { id: 'peace', type: 'peace', label: '宁静', color: 'from-cyan-400 to-blue-500', glowColor: 'rgba(34, 211, 238, 0.6)', size: 'medium' },
    { id: 'strength', type: 'strength', label: '力量', color: 'from-emerald-400 to-teal-500', glowColor: 'rgba(52, 211, 153, 0.6)', size: 'medium' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-purple-950/30 to-gray-900 flex flex-col">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300 text-sm">与宇宙对话中</span>
        </div>
        <div className="w-10" />
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-purple-600/40 text-white'
                  : 'bg-white/5 text-gray-200'
              }`}
            >
              {message.role === 'universe' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                  <span className="text-lg">🌌</span>
                  <span className="text-purple-300 text-xs">宇宙</span>
                </div>
              )}

              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

              {/* 图片 */}
              {message.imageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden">
                  <img
                    src={message.imageUrl}
                    alt="宇宙回响"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* 语音播放 */}
              {message.role === 'universe' && message.id !== 'thinking' && message.id !== 'greeting' && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <VoiceOutput text={message.content} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 能量块提示 */}
        {showEnergyHint && (
          <div className="flex flex-col items-center py-4 animate-fadeIn">
            <p className="text-gray-400 text-xs mb-3">轻点能量块注入灵感</p>
            <div className="flex gap-2">
              {energyOptions.map((energy) => {
                const isCollected = collectedEnergies.find(e => e.id === energy.id);
                return (
                  <button
                    key={energy.id}
                    onClick={() => handleEnergyClick(energy)}
                    disabled={!!isCollected}
                    className={`px-3 py-2 rounded-full text-xs transition-all
                      ${isCollected
                        ? 'bg-white/10 text-gray-500'
                        : `bg-gradient-to-r ${energy.color} text-white hover:scale-105 active:scale-95`
                      }`}
                  >
                    {energy.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入区 */}
      <div className="border-t border-white/5 px-4 py-4 safe-bottom">
        {mode !== 'daily' && (
          <div className="flex items-center gap-3">
            {/* 文字输入 */}
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleSubmit(userInput)}
              placeholder={isGenerating ? '宇宙正在回应...' : '输入你想说的...'}
              disabled={isGenerating}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white text-sm
                placeholder:text-gray-500 focus:outline-none focus:border-purple-400/50 transition-colors
                disabled:opacity-50"
            />

            {/* 语音输入按钮 */}
            <button
              onClick={() => setIsListening(!isListening)}
              disabled={isGenerating}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                ${isListening
                  ? 'bg-purple-600 scale-110'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }
                disabled:opacity-50`}
            >
              <svg
                className={`w-5 h-5 ${isListening ? 'text-white' : 'text-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>

            {/* 发送按钮 */}
            <button
              onClick={() => handleSubmit(userInput)}
              disabled={isGenerating || !userInput.trim()}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600
                flex items-center justify-center transition-all hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:hover:scale-100"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        )}

        {/* 隐藏的语音输入组件 */}
        {isListening && (
          <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center z-10">
            <VoiceInput
              isActive={isListening}
              onTranscript={handleVoiceTranscript}
              onListeningChange={setIsListening}
            />
          </div>
        )}
      </div>
    </div>
  );
}
