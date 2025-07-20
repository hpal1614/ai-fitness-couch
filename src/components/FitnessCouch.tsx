// =====================================================================================
// 🎯 COMPLETE FITNESS COACH COMPONENT WITH PROPER EXPORTS
// =====================================================================================
// File: src/components/FitnessCoach.tsx

import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo, 
  memo
} from 'react';
import {
  Send,
  User,
  Bot,
  Loader,
  Heart,
  Target,
  Zap,
  Trophy,
  BarChart3,
  Brain,
  type LucideIcon
} from 'lucide-react';
import { useVoiceStatus } from '../voice/VoiceEngine';

// =====================================================================================
// 🎯 TYPE DEFINITIONS
// =====================================================================================

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  confidence?: number;
  source?: MessageSource;
  provider?: string;
  metadata?: MessageMetadata;
}

export type MessageSource = 'local_knowledge' | 'ai_api' | 'cache' | 'welcome' | 'error' | 'celebration';

export interface MessageMetadata {
  tokens?: number;
  processingTime?: number;
  errorCode?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  message: string;
  color: string;
  category: 'workout' | 'nutrition' | 'form' | 'motivation';
}

// =====================================================================================
// 🎯 MOCK AI SERVICE - BUILT-IN LOCAL KNOWLEDGE
// =====================================================================================

interface LocalResponse {
  content: string;
  confidence: number;
  source: MessageSource;
}

class LocalFitnessKnowledge {
  private knowledge = [
    {
      patterns: ['squat', 'squats', 'squatting', 'proper squat'],
      response: `🏋️ **Perfect Squat Form Guide:**

**Setup:**
• Stand with feet shoulder-width apart
• Toes slightly pointed outward (15-30°)
• Keep your chest up and core engaged

**Movement:**
• Push your hips back like sitting in a chair
• Keep knees aligned with your toes
• Lower until thighs are parallel to ground
• Drive through your heels to return to standing

**Common Mistakes to Avoid:**
❌ Knees caving inward
❌ Leaning too far forward
❌ Not going deep enough
❌ Lifting heels off the ground

**Pro Tip:** Practice bodyweight squats first to master the movement pattern!`,
      confidence: 0.95,
      category: 'form'
    },
    {
      patterns: ['pushup', 'push-up', 'push up', 'pushups'],
      response: `💪 **Perfect Push-Up Form Guide:**

**Setup:**
• Start in plank position
• Hands slightly wider than shoulders
• Body in straight line from head to heels

**Movement:**
• Lower until chest nearly touches ground
• Keep elbows at 45° angle to your body
• Push through palms to return to start
• Maintain tight core throughout

**Progressions:**
📈 Beginner: Wall → Incline → Knee → Full push-ups
📈 Advanced: Diamond → Archer → One-arm push-ups

**Common Mistakes:**
❌ Sagging hips
❌ Flaring elbows too wide
❌ Partial range of motion`,
      confidence: 0.95,
      category: 'form'
    },
    {
      patterns: ['motivation', 'motivated', 'give up', 'quit', 'discouraged'],
      response: `🔥 **Motivation Boost Incoming!**

**Remember Why You Started:**
💪 You're stronger than you think
🎯 Every workout is progress, no matter how small
🏆 Consistency beats perfection every time
⭐ You're building a better version of yourself

**When Motivation Fails, Discipline Saves You:**
📅 Schedule workouts like important appointments
📝 Track your progress (you're doing better than you think!)
👥 Find an accountability partner
🎵 Create an energizing playlist

**Quick Motivation Hack:** Do just 5 minutes. Often, starting is the hardest part!

**You've got this!** 💪✨`,
      confidence: 0.9,
      category: 'motivation'
    },
    {
      patterns: ['workout plan', 'beginner workout', 'start working out', 'exercise routine'],
      response: `🌟 **Beginner's Workout Plan:**

**Schedule:** 3-4 days per week, rest days between workouts

**Full Body Workout A:**
• Bodyweight Squats: 2 sets × 8-12 reps
• Push-ups (modified if needed): 2 sets × 5-10 reps
• Plank: 2 sets × 15-30 seconds
• Walking: 10-15 minutes

**Full Body Workout B:**
• Glute Bridges: 2 sets × 10-15 reps
• Wall Push-ups: 2 sets × 8-12 reps
• Dead Bug: 2 sets × 5 each side
• Stairs/Step-ups: 10-15 minutes

**Golden Rules:**
✅ Quality over quantity
✅ Listen to your body
✅ Progress gradually
✅ Celebrate small wins!`,
      confidence: 0.9,
      category: 'workout'
    },
    {
      patterns: ['nutrition', 'what to eat', 'diet', 'pre workout food', 'post workout'],
      response: `🥗 **Nutrition Essentials:**

**Pre-Workout (30-60 mins before):**
• Banana with almond butter
• Oatmeal with berries
• Toast with honey

**Post-Workout (within 60 mins):**
• Protein shake with banana
• Greek yogurt with granola
• Chicken and sweet potato

**Daily Nutrition Tips:**
💧 Stay hydrated (half your body weight in oz)
🥩 Include protein with every meal
🥬 Fill half your plate with vegetables
🌾 Time carbs around workouts for energy

**Remember:** Consistency matters more than perfection!`,
      confidence: 0.85,
      category: 'nutrition'
    }
  ];

  findResponse(message: string): LocalResponse {
    const messageWords = message.toLowerCase().split(/\s+/);
    let bestMatch = null;
    let highestScore = 0;

    for (const item of this.knowledge) {
      let score = 0;
      
      for (const pattern of item.patterns) {
        if (message.toLowerCase().includes(pattern.toLowerCase())) {
          score += item.confidence * 2;
        }
        
        const patternWords = pattern.toLowerCase().split(/\s+/);
        const matchCount = patternWords.filter(patternWord =>
          messageWords.some(messageWord => 
            messageWord.includes(patternWord) || patternWord.includes(messageWord)
          )
        ).length;
        
        const overlapRatio = matchCount / patternWords.length;
        score += overlapRatio * item.confidence;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore > 0.3) {
      return {
        content: bestMatch.response,
        confidence: Math.min(highestScore, 1.0),
        source: 'local_knowledge'
      };
    }

    return {
      content: `I'm here to help with your fitness journey! I can assist with:

🎯 **What I specialize in:**
- Exercise form and technique
- Workout planning and routines  
- Nutrition guidance and meal planning
- Motivation and goal setting
- Beginner-friendly advice

Try asking me about specific exercises (like "how to do squats"), workout plans, nutrition tips, or if you need some motivation!`,
      confidence: 0.7,
      source: 'local_knowledge'
    };
  }
}

// =====================================================================================
// 🎯 HOOKS
// =====================================================================================

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// =====================================================================================
// 🎯 WELCOME SCREEN COMPONENT
// =====================================================================================

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = memo<WelcomeScreenProps>(({ onGetStarted }) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="text-6xl mb-4 animate-bounce">🤖💪</div>
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          AI Fitness Coach
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Your intelligent fitness companion powered by local knowledge
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {[
          { icon: <Target size={24} />, title: 'Smart Planning', desc: 'Personalized workout routines' },
          { icon: <Heart size={24} />, title: 'Health Focus', desc: 'Science-based nutrition advice' },
          { icon: <Brain size={24} />, title: 'AI Powered', desc: 'Intelligent form coaching' },
          { icon: <Trophy size={24} />, title: 'Goal Achievement', desc: 'Track and celebrate progress' }
        ].map((feature, index) => (
          <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-purple-500 mb-3">{feature.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onGetStarted}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full text-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        Start Your Fitness Journey 🚀
      </button>
      
      <p className="text-xs text-gray-500 mt-4">
        Free to use • No signup required • Works offline
      </p>
    </div>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

// =====================================================================================
// 🎯 MESSAGE COMPONENT
// =====================================================================================

interface MessageProps {
  message: Message;
}

const MessageComponent = memo<MessageProps>(({ message }) => {
  return (
    <div className={`flex gap-3 mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      {!message.isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div className={`flex-1 ${message.isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-2xl max-w-3xl ${
          message.isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            : message.source === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-white text-gray-800 shadow-sm border border-gray-100'
        }`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          <div className="text-xs opacity-70 mt-2 flex items-center gap-2">
            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            {message.confidence && (
              <span>• {Math.round(message.confidence * 100)}% confidence</span>
            )}
            {message.source && (
              <span>• {message.source.replace('_', ' ')}</span>
            )}
          </div>
        </div>
      </div>
      {message.isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
});

MessageComponent.displayName = 'MessageComponent';

// =====================================================================================
// 🎯 MAIN COMPONENT
// =====================================================================================

const FitnessCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [showStats, setShowStats] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const localKnowledge = useMemo(() => new LocalFitnessKnowledge(), []);
  const [requestCount, setRequestCount] = useLocalStorage('fitness-requests', 0);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  const handleGetStarted = useCallback(() => {
    setShowWelcome(false);
    const welcomeMessage: Message = {
      id: `msg_${Date.now()}`,
      content: `Hello! I'm your AI Fitness Coach! 💪🤖

I'm here to help you with:
🏋️ **Workout Planning** - Custom routines for your goals
🥗 **Nutrition Guidance** - Meal planning and supplement advice  
🎯 **Form Coaching** - Proper technique and safety tips
🔥 **Motivation** - Keep you inspired and on track

What would you like to start with today?`,
      isUser: false,
      timestamp: Date.now(),
      source: 'welcome',
      confidence: 1.0
    };
    
    setMessages([welcomeMessage]);
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);
  
  const handleSendMessage = useCallback(async (messageText: string = inputMessage.trim()) => {
    if (!messageText || isLoading) return;
    
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      content: messageText,
      isUser: true,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setRequestCount(prev => prev + 1);
    
    try {
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const response = localKnowledge.findResponse(messageText);
      
      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        content: response.content,
        isUser: false,
        timestamp: Date.now(),
        confidence: response.confidence,
        source: response.source,
        provider: 'local_knowledge'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        content: `I'm having a technical hiccup! 🤖 But I'm still here to help with fitness advice. Try asking me about exercises, nutrition, or workout planning!`,
        isUser: false,
        timestamp: Date.now(),
        source: 'error',
        confidence: 0.5
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, localKnowledge, setRequestCount]);
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  const handleQuickAction = useCallback((message: string) => {
    if (!isLoading) {
      handleSendMessage(message);
    }
  }, [isLoading, handleSendMessage]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);
  
  const quickActions: QuickAction[] = useMemo(() => [
    { id: '1', label: 'Plan Workout', icon: Target, message: 'Create a workout plan for me', color: 'purple', category: 'workout' },
    { id: '2', label: 'Check Form', icon: Brain, message: 'How do I do a proper squat?', color: 'blue', category: 'form' },
    { id: '3', label: 'Nutrition Help', icon: Heart, message: 'What should I eat before a workout?', color: 'green', category: 'nutrition' },
    { id: '4', label: 'Motivation', icon: Zap, message: 'I need motivation to keep going', color: 'orange', category: 'motivation' }
  ], []);

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <WelcomeScreen onGetStarted={handleGetStarted} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl" role="img" aria-label="AI Fitness Coach">🤖💪</div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Fitness Coach</h1>
                <p className="text-xs text-gray-600">Your Personal Training Assistant</p>
                <p className="text-xs text-green-600">📚 Local Knowledge Active</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Analytics"
              >
                <BarChart3 size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Bot size={48} className="mx-auto mb-4 text-purple-500" />
                <h3 className="text-lg font-semibold mb-2">Ready to get started?</h3>
                <p>Ask me anything about fitness, nutrition, or training!</p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageComponent key={message.id} message={message} />
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl p-4 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <Loader size={16} className="animate-spin text-purple-500" />
                      <span className="text-gray-600">AI Coach is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Try these quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action.message)}
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 text-white rounded-lg text-sm hover:from-${action.color}-600 hover:to-${action.color}-700 disabled:opacity-50 transition-all duration-200`}
                      >
                        <IconComponent size={16} />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about workouts, nutrition, form, motivation... anything fitness!"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={1}
                disabled={isLoading}
                style={{ minHeight: '50px', maxHeight: '120px' }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Analytics Panel */}
      {showStats && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="container mx-auto max-w-4xl">
            <h3 className="font-bold text-gray-800 mb-3">Performance Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Local Knowledge</div>
                <div className="font-bold text-green-600">100%</div>
              </div>
              <div>
                <div className="text-gray-600">Total Requests</div>
                <div className="font-bold text-purple-600">{requestCount}</div>
              </div>
              <div>
                <div className="text-gray-600">Response Time</div>
                <div className="font-bold text-orange-600">~1000ms</div>
              </div>
              <div>
                <div className="text-gray-600">Satisfaction</div>
                <div className="font-bold text-yellow-600">4.8/5</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function VoiceStatusWidget() {
  const { listening, transcript } = useVoiceStatus();
  if (!listening && !transcript) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }} className="bg-white shadow-lg rounded-full flex items-center px-4 py-2 gap-2 border border-gray-200 animate-fade-in">
      <span className={listening ? 'text-green-600' : 'text-gray-400'}>
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><circle cx="12" cy="10" r="4"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="23"/><line x1="8" x2="16" y1="23" y2="23"/></svg>
      </span>
      <span className="text-sm font-medium text-gray-800 max-w-xs truncate" title={transcript}>{transcript || (listening ? 'Listening...' : '')}</span>
    </div>
  );
}

// =====================================================================================
// 🎯 CRUCIAL EXPORT - THIS IS WHAT WAS MISSING!
// =====================================================================================

export default FitnessCoach;