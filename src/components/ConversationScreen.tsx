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

// 能量块配置 - 带有丰富视觉效果
interface EnergyOption extends EnergyBlock {
  gradient: string;
  icon: React.ReactNode;
  pattern: 'rays' | 'stars' | 'waves' | 'crystals';
}

const ENERGY_OPTIONS: EnergyOption[] = [
  {
    id: 'light',
    type: 'light',
    label: '光明',
    color: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    size: 'medium',
    gradient: 'from-yellow-500 via-amber-400 to-orange-500',
    pattern: 'rays',
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="10" fill="url(#lightG)" />
        {[...Array(8)].map((_, i) => (
          <line key={i} x1="20" y1="6" x2="20" y2="2" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i * 45} 20 20)`} />
        ))}
        <circle cx="16" cy="16" r="3" fill="white" opacity="0.5" />
        <defs>
          <radialGradient id="lightG" cx="40%" cy="40%"><stop offset="0%" stopColor="#FEF3C7" /><stop offset="100%" stopColor="#F59E0B" /></radialGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'wisdom',
    type: 'wisdom',
    label: '智慧',
    color: 'from-indigo-400 to-purple-500',
    glowColor: 'rgba(129, 140, 248, 0.6)',
    size: 'medium',
    gradient: 'from-indigo-500 via-purple-500 to-violet-600',
    pattern: 'stars',
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <polygon points="20,4 23,15 34,15 25,22 28,33 20,26 12,33 15,22 6,15 17,15" fill="url(#wisdomG)" />
        <polygon points="20,10 21.5,16 28,16 23,20 25,26 20,22 15,26 17,20 12,16 18.5,16" fill="#EDE9FE" opacity="0.5" />
        <defs>
          <linearGradient id="wisdomG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#C4B5FD" /><stop offset="100%" stopColor="#7C3AED" /></linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'peace',
    type: 'peace',
    label: '宁静',
    color: 'from-cyan-400 to-blue-500',
    glowColor: 'rgba(34, 211, 238, 0.6)',
    size: 'medium',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    pattern: 'waves',
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <ellipse cx="20" cy="28" rx="16" ry="6" fill="url(#peaceG)" opacity="0.8" />
        <ellipse cx="20" cy="24" rx="12" ry="4" fill="#67E8F9" opacity="0.6" />
        <circle cx="20" cy="12" r="6" fill="#ECFEFF" />
        <circle cx="18" cy="10" r="2" fill="white" opacity="0.7" />
        <defs>
          <linearGradient id="peaceG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#0891B2" /></linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'strength',
    type: 'strength',
    label: '力量',
    color: 'from-emerald-400 to-teal-500',
    glowColor: 'rgba(52, 211, 153, 0.6)',
    size: 'medium',
    gradient: 'from-emerald-500 via-teal-500 to-green-600',
    pattern: 'crystals',
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <polygon points="20,4 30,16 26,36 14,36 10,16" fill="url(#strengthG)" />
        <polygon points="20,4 26,16 20,32 14,16" fill="#D1FAE5" opacity="0.4" />
        <polygon points="16,12 20,6 22,18 18,20" fill="white" opacity="0.5" />
        <defs>
          <linearGradient id="strengthG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#A7F3D0" /><stop offset="100%" stopColor="#059669" /></linearGradient>
        </defs>
      </svg>
    ),
  },
];

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

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-purple-950/30 to-gray-900 flex flex-col">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors group"
        >
          <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="relative w-2.5 h-2.5">
            <div className="absolute inset-0 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-gray-300 text-sm font-light tracking-wide">与宇宙对话中</span>
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
                  {/* 宇宙图标 */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="3" />
                      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                    </svg>
                  </div>
                  <span className="text-purple-300 text-xs font-medium">宇宙</span>
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

        {/* 能量块提示 - 带丰富视觉效果 */}
        {showEnergyHint && (
          <div className="flex flex-col items-center py-6 animate-fadeIn">
            <p className="text-gray-300 text-sm mb-4 font-light tracking-wide">轻点能量块注入灵感</p>
            <div className="flex gap-4">
              {ENERGY_OPTIONS.map((energy) => {
                const isCollected = collectedEnergies.find(e => e.id === energy.id);
                return (
                  <button
                    key={energy.id}
                    onClick={() => handleEnergyClick(energy)}
                    disabled={!!isCollected}
                    className={`relative flex flex-col items-center transition-all duration-300
                      ${isCollected
                        ? 'opacity-30 scale-90'
                        : 'hover:scale-110 active:scale-95'
                      }`}
                  >
                    {/* 能量块主体 */}
                    <div
                      className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${energy.gradient}
                        overflow-hidden shadow-lg`}
                      style={{
                        boxShadow: isCollected ? 'none' : `0 0 20px ${energy.glowColor}, 0 8px 20px rgba(0,0,0,0.3)`,
                      }}
                    >
                      {/* 背景图案 */}
                      <div className="absolute inset-0 opacity-30">
                        {energy.pattern === 'rays' && (
                          <div className="absolute inset-0">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="absolute top-1/2 left-1/2 w-px h-full bg-white/40 origin-bottom" style={{ transform: `rotate(${i * 30}deg)` }} />
                            ))}
                          </div>
                        )}
                        {energy.pattern === 'stars' && (
                          [...Array(5)].map((_, i) => (
                            <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ left: `${20 + i * 15}%`, top: `${15 + i * 12}%`, animationDelay: `${i * 0.2}s` }} />
                          ))
                        )}
                        {energy.pattern === 'waves' && (
                          <svg className="w-full h-full" viewBox="0 0 64 64">
                            <path d="M0 50 Q16 40 32 50 T64 50 V64 H0 Z" fill="white" opacity="0.3" />
                            <path d="M0 55 Q16 45 32 55 T64 55 V64 H0 Z" fill="white" opacity="0.2" />
                          </svg>
                        )}
                        {energy.pattern === 'crystals' && (
                          [...Array(3)].map((_, i) => (
                            <div key={i} className="absolute border border-white/30" style={{ width: 8 + i * 6, height: 12 + i * 8, left: `${20 + i * 20}%`, top: `${30 + i * 10}%`, transform: 'rotate(15deg)' }} />
                          ))
                        )}
                      </div>

                      {/* 光泽效果 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20" />

                      {/* 图标 */}
                      <div className="absolute inset-0 flex items-center justify-center p-3">
                        {energy.icon}
                      </div>

                      {/* 边框 */}
                      <div className="absolute inset-0 rounded-2xl border border-white/20" />
                    </div>

                    {/* 标签 */}
                    <span className={`text-xs mt-2 font-medium tracking-wide ${isCollected ? 'text-gray-600' : 'text-gray-300'}`}>
                      {energy.label}
                    </span>

                    {/* 已收集标记 */}
                    {isCollected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 已收集能量提示 */}
            {collectedEnergies.length > 0 && (
              <p className="text-purple-300/70 text-xs mt-3">
                已注入 {collectedEnergies.length} 种能量
              </p>
            )}
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
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all
                ${isListening
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600 scale-110 shadow-lg'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400/30'
                }
                disabled:opacity-50`}
              style={{
                boxShadow: isListening ? '0 0 20px rgba(139, 92, 246, 0.5)' : undefined,
              }}
            >
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
              )}
              <svg className={`w-5 h-5 ${isListening ? 'text-white' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>

            {/* 发送按钮 */}
            <button
              onClick={() => handleSubmit(userInput)}
              disabled={isGenerating || !userInput.trim()}
              className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-violet-600
                flex items-center justify-center transition-all hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
              style={{
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.4), 0 4px 15px rgba(0,0,0,0.2)',
              }}
            >
              {/* 光泽 */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
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
