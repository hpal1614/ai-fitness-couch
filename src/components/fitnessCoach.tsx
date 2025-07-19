// File: src/components/FitnessCoach.tsx

import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo, 
  memo,
  lazy,
  Suspense,
  Component,
  ErrorInfo,
  ReactNode
} from 'react';
import {
  Send,
  User,
  Bot,
  Loader,
  Settings,
  Coffee,
  Heart,
  TrendingUp,
  Target,
  Zap,
  Trophy,
  MessageSquare,
  BarChart3,
  HelpCircle,
  Shield,
  LogOut,
  Brain
} from 'lucide-react';

// =====================================================================================
// 🎯 TYPE DEFINITIONS - STRICT TYPESCRIPT
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

export interface Analytics {
  localKnowledgeRate: string;
  cacheHitRate: string;
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  userSatisfactionScore: number;
}

export interface AIResponse {
  content: string;
  source: MessageSource;
  confidence: number;
  provider: string;
  fromCache: boolean;
  metadata: MessageMetadata;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  message: string;
  color: string;
  category: 'workout' | 'nutrition' | 'form' | 'motivation';
}

export interface SupportData {
  variant: 'coffee' | 'donation';
  amount: string;
  timestamp: number;
}

export interface LLMStatus {
  hasExternalAPIs: boolean;
  availableProviders: string[];
  isConfigured: boolean;
  performance: {
    averageLatency: number;
    successRate: number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  autoSave: boolean;
}

// Component prop interfaces
interface CoreUIEngineProps {
  onClose: () => void;
  defaultTab?: string;
}

interface SecurityDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BuyMeCoffeeProps {
  onSupportComplete?: (data: SupportData) => void;
  showFloatingWidget?: boolean;
  showStats?: boolean;
  className?: string;
}

interface LightningInputSystemDemoProps {
  // Add props as needed
}

// =====================================================================================
// 🎯 CUSTOM HOOKS - PERFORMANCE & REUSABILITY
// =====================================================================================

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

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

const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    localKnowledgeRate: '0%',
    cacheHitRate: '0%',
    totalRequests: 0,
    averageResponseTime: 0,
    errorRate: 0,
    userSatisfactionScore: 0
  });

  const updateAnalytics = useCallback(async () => {
    try {
      // Simulated analytics service call
      const data = await aiService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }, []);

  useEffect(() => {
    updateAnalytics();
    const interval = setInterval(updateAnalytics, 30000); // Optimized to 30s
    return () => clearInterval(interval);
  }, [updateAnalytics]);

  return analytics;
};

// =====================================================================================
// 🎯 LAZY LOADED COMPONENTS - PERFORMANCE OPTIMIZATION
// =====================================================================================

const CoreUIEngine = lazy(() => import('./CoreUIEngine') as Promise<{ default: React.ComponentType<CoreUIEngineProps> }>);
const SecurityDashboard = lazy(() => import('./SecurityDashboard') as Promise<{ default: React.ComponentType<SecurityDashboardProps> }>);
const LightningInputSystemDemo = lazy(() => import('./LightningInputSystemDemo') as Promise<{ default: React.ComponentType<LightningInputSystemDemoProps> }>);
const BuyMeCoffee = lazy(() => import('./BuyMeCoffee') as Promise<{ default: React.ComponentType<BuyMeCoffeeProps> }>);

// =====================================================================================
// 🎯 CUSTOM ERROR BOUNDARY - RESILIENCE
// =====================================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class FitnessCoachErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FitnessCoach Error:', error, errorInfo);
    // Could send to error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🚨</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              The AI Fitness Coach encountered an error. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// =====================================================================================
// 🎯 OPTIMIZED COMPONENTS - MEMOIZATION
// =====================================================================================

interface MessageProps {
  message: Message;
}

const MessageComponent = memo<MessageProps>(({ message }) => {
  const [isTyping, setIsTyping] = useState(!message.isUser && !message.content);
  
  useEffect(() => {
    if (!message.isUser && message.content) {
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [message.isUser, message.content]);
  
  if (isTyping) {
    return (
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
    );
  }
  
  return (
    <div className={`flex gap-3 mb-4 ${message.isUser ? 'justify-end' : ''}`}>
      {!message.isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}
      
      <div className={`flex-1 ${message.isUser ? 'flex justify-end' : ''}`}>
        <div className={`rounded-2xl p-4 max-w-3xl ${
          message.isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-12' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {!message.isUser && (message.confidence || message.source) && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
              {message.source && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  {message.source === 'local_knowledge' ? '🧠 Built-in' : 
                   message.source === 'ai_api' ? '🤖 AI Enhanced' : 
                   message.source === 'cache' ? '⚡ Cached' : message.source}
                </span>
              )}
              {message.confidence && (
                <span className="text-xs text-gray-500">
                  {(message.confidence * 100).toFixed(0)}% confidence
                </span>
              )}
            </div>
          )}
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

MessageComponent.displayName = 'Message';

interface QuickActionsProps {
  onQuickAction: (message: string) => void;
  disabled: boolean;
}

const QuickActions = memo<QuickActionsProps>(({ onQuickAction, disabled }) => {
  const actions: QuickAction[] = useMemo(() => [
    {
      id: 'workout-plan',
      label: 'Create Workout Plan',
      icon: Target,
      message: 'Create a beginner workout plan for me',
      color: 'from-green-500 to-emerald-500',
      category: 'workout'
    },
    {
      id: 'form-check',
      label: 'Check Exercise Form',
      icon: TrendingUp,
      message: 'How do I perform a proper squat?',
      color: 'from-blue-500 to-indigo-500',
      category: 'form'
    },
    {
      id: 'nutrition',
      label: 'Nutrition Advice',
      icon: Heart,
      message: 'What should I eat before and after workouts?',
      color: 'from-red-500 to-pink-500',
      category: 'nutrition'
    },
    {
      id: 'motivation',
      label: 'Get Motivated',
      icon: Zap,
      message: 'I need motivation to keep going with my fitness journey',
      color: 'from-yellow-500 to-orange-500',
      category: 'motivation'
    }
  ], []);
  
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {actions.map(action => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onQuickAction(action.message)}
            disabled={disabled}
            className={`
              bg-gradient-to-r ${action.color}
              text-white p-4 rounded-xl
              flex flex-col items-center gap-2
              hover:shadow-lg transform hover:scale-105
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:scale-100 disabled:hover:shadow-none
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
            `}
          >
            <Icon size={24} />
            <span className="text-sm font-medium text-center">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

interface StatsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: Analytics;
  conversationCount: number;
}

const StatsSidebar = memo<StatsSidebarProps>(({ isOpen, onClose, analytics, conversationCount }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300"
      role="dialog"
      aria-label="Statistics sidebar"
    >
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Coach Stats</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close statistics"
          >
            ✕
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Your Progress</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{conversationCount}</div>
              <div className="text-xs text-gray-600">Conversations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">
                {Math.floor(conversationCount * 2.3)}
              </div>
              <div className="text-xs text-gray-600">Questions Asked</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-3">AI Performance</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Local Knowledge</span>
              <span className="font-semibold text-green-600">
                {analytics.localKnowledgeRate}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cache Hit Rate</span>
              <span className="font-semibold text-blue-600">
                {analytics.cacheHitRate}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Requests</span>
              <span className="font-semibold text-gray-600">
                {analytics.totalRequests}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Pro Tips</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Ask specific questions for better answers</li>
            <li>• Mention your fitness level for personalized advice</li>
            <li>• Include equipment you have available</li>
            <li>• Ask about safety if you have concerns</li>
          </ul>
        </div>
        
        <div className="mt-6">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-20 rounded"></div>}>
            <BuyMeCoffee 
              showFloatingWidget={false} 
              showStats={false}
              className="scale-90 origin-top"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
});

StatsSidebar.displayName = 'StatsSidebar';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = memo<WelcomeScreenProps>(({ onGetStarted }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6" role="img" aria-label="Robot and muscle emoji">🤖💪</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        AI Fitness Coach
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Your personal AI-powered fitness companion. Get expert workout plans, 
        nutrition advice, form checks, and motivation - all backed by exercise science!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6">
          <div className="text-3xl mb-3" role="img" aria-label="Weight lifting emoji">🏋️</div>
          <h3 className="font-semibold text-gray-800 mb-2">Expert Workouts</h3>
          <p className="text-sm text-gray-600">
            Personalized plans based on your level, goals, and available equipment
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-6">
          <div className="text-3xl mb-3" role="img" aria-label="Salad emoji">🥗</div>
          <h3 className="font-semibold text-gray-800 mb-2">Smart Nutrition</h3>
          <p className="text-sm text-gray-600">
            Science-based meal planning and supplement recommendations
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-6">
          <div className="text-3xl mb-3" role="img" aria-label="Shield emoji">🛡️</div>
          <h3 className="font-semibold text-gray-800 mb-2">Safety First</h3>
          <p className="text-sm text-gray-600">
            Built-in safety protocols and form corrections to prevent injuries
          </p>
        </div>
      </div>
      
      <button
        onClick={onGetStarted}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-xl text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Start Your Fitness Journey! 🚀
      </button>
      
      <p className="text-xs text-gray-500 mt-4">
        Free to use • No signup required • Works offline
      </p>
    </div>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

// =====================================================================================
// 🎯 MOCK SERVICES - REPLACE WITH REAL IMPLEMENTATIONS
// =====================================================================================

// Mock imports (would be real in actual implementation)
const useSecurity = () => ({ 
  isAuthenticated: true, 
  isLoading: false 
});

const LoginForm = () => <div>Login Form</div>;

const aiService = {
  processMessage: async (message: string, userId: string): Promise<AIResponse> => ({
    content: `Mock response to: ${message}`,
    source: 'ai_api' as MessageSource,
    confidence: 0.95,
    provider: 'OpenAI',
    fromCache: false,
    metadata: { tokens: 150, processingTime: 1200 }
  }),
  getAnalytics: async (): Promise<Analytics> => ({
    localKnowledgeRate: '75%',
    cacheHitRate: '30%',
    totalRequests: 142,
    averageResponseTime: 850,
    errorRate: 0.02,
    userSatisfactionScore: 4.8
  })
};

const config = {
  isConfigured: () => true,
  getStatus: (): LLMStatus => ({
    hasExternalAPIs: true,
    availableProviders: ['OpenAI', 'Anthropic'],
    isConfigured: true,
    performance: { averageLatency: 850, successRate: 0.98 }
  })
};

// =====================================================================================
// 🎯 MAIN COMPONENT - PERFORMANCE OPTIMIZED
// =====================================================================================

const FitnessCoach: React.FC = () => {
  // =====================================================================================
  // 🎯 STATE MANAGEMENT - OPTIMIZED
  // =====================================================================================
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showCoreEngine, setShowCoreEngine] = useState<boolean>(false);
  const [showLightningDemo, setShowLightningDemo] = useState<boolean>(false);
  const [showSecurityDashboard, setShowSecurityDashboard] = useState<boolean>(false);
  const [llmStatus, setLlmStatus] = useState<LLMStatus | null>(null);
  
  // Custom hooks
  const analytics = useAnalytics();
  const [userPreferences] = useLocalStorage<UserPreferences>('fitness-coach-preferences', {
    theme: 'light',
    language: 'en',
    notifications: true,
    autoSave: true
  });
  
  const { isAuthenticated, isLoading: isAuthLoading } = useSecurity();
  const debouncedInputMessage = useDebounce(inputMessage, 300);
  
  // =====================================================================================
  // 🎯 REFS & MEMOIZED VALUES
  // =====================================================================================
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const userId = useMemo(() => `user_${Date.now()}`, []);
  
  const conversationCount = useMemo(() => 
    Math.floor(messages.filter(m => !m.isUser).length), 
    [messages]
  );
  
  // =====================================================================================
  // 🎯 CALLBACKS - PERFORMANCE OPTIMIZED
  // =====================================================================================
  
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
    
    try {
      const response = await aiService.processMessage(messageText, userId);
      
      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        content: response.content,
        isUser: false,
        timestamp: Date.now(),
        confidence: response.confidence,
        source: response.source,
        provider: response.provider,
        metadata: response.metadata
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        content: `I'm having a technical hiccup! 🤖 But don't worry - I can still help you with built-in fitness knowledge. Try asking me about exercises, nutrition, or workout planning!

Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isUser: false,
        timestamp: Date.now(),
        source: 'error',
        confidence: 0.5
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, userId]);
  
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
  
  const handleSupportComplete = useCallback((supportData: SupportData) => {
    const celebrationMessage: Message = {
      id: `msg_${Date.now()}_celebration`,
      content: `🎉 Thank you so much for your support! 🎉

Your ${supportData.variant === 'coffee' ? 'coffee' : 'contribution'} of ${supportData.amount} means the world! It helps keep this AI coach free and constantly improving.

You're not just supporting an app - you're supporting everyone's fitness journey! 💪

Now, let's get back to crushing those fitness goals! What would you like to work on next?`,
      isUser: false,
      timestamp: Date.now(),
      source: 'celebration',
      confidence: 1.0
    };
    
    setMessages(prev => [...prev, celebrationMessage]);
  }, []);
  
  // =====================================================================================
  // 🎯 EFFECTS - OPTIMIZED
  // =====================================================================================
  
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);
  
  useEffect(() => {
    if (config.isConfigured()) {
      setLlmStatus(config.getStatus());
    }
  }, []);
  
  // =====================================================================================
  // 🎯 RENDER CONDITIONS
  // =====================================================================================
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <LoginForm />
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <WelcomeScreen onGetStarted={handleGetStarted} />
        </div>
      </div>
    );
  }
  
  // =====================================================================================
  // 🎯 MAIN RENDER - OPTIMIZED STRUCTURE
  // =====================================================================================
  
  return (
    <FitnessCoachErrorBoundary>
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
                  
                  {llmStatus && (
                    <p className="text-xs text-green-600">
                      {llmStatus.hasExternalAPIs ? '🤖 AI Enhanced' : '📚 Local Mode'} 
                      • {llmStatus.availableProviders.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {[
                  { icon: BarChart3, onClick: () => setShowStats(!showStats), title: "View Stats" },
                  { icon: Brain, onClick: () => setShowCoreEngine(true), title: "Core Engine Demo" },
                  { icon: Zap, onClick: () => setShowLightningDemo(true), title: "Lightning Input System Demo" },
                  { icon: Shield, onClick: () => setShowSecurityDashboard(true), title: "Security Dashboard" },
                  { icon: HelpCircle, onClick: () => window.open('https://github.com/himanshu1614', '_blank'), title: "Help & Support" }
                ].map(({ icon: Icon, onClick, title }) => (
                  <button
                    key={title}
                    onClick={onClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    title={title}
                  >
                    <Icon size={20} className="text-gray-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 flex relative">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Quick Actions - Show when no messages or few messages */}
                {messages.length <= 1 && (
                  <QuickActions 
                    onQuickAction={handleQuickAction}
                    disabled={isLoading}
                  />
                )}
                
                {/* Messages */}
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageComponent
                      key={message.id}
                      message={message}
                    />
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <MessageComponent 
                      message={{
                        id: 'loading',
                        content: '',
                        isUser: false,
                        timestamp: Date.now()
                      }}
                    />
                  )}
                </div>
                
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="container mx-auto max-w-4xl">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about workouts, nutrition, form, motivation... anything fitness!"
                      className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      rows={2}
                      disabled={isLoading}
                      aria-label="Message input"
                    />
                  </div>
                  
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send • Shift+Enter for new line • Built-in knowledge + AI enhanced
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Sidebar */}
          <StatsSidebar
            isOpen={showStats}
            onClose={() => setShowStats(false)}
            analytics={analytics}
            conversationCount={conversationCount}
          />
        </div>
        
        {/* Modal Components - Lazy Loaded */}
        {showCoreEngine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto relative">
              <button
                onClick={() => setShowCoreEngine(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                aria-label="Close core engine demo"
              >
                ✕
              </button>
              <Suspense fallback={
                <div className="flex items-center justify-center h-96">
                  <Loader className="animate-spin text-purple-500" size={32} />
                </div>
              }>
                <CoreUIEngine onClose={() => setShowCoreEngine(false)} />
              </Suspense>
            </div>
          </div>
        )}
        
        {showLightningDemo && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-auto relative">
              <button
                onClick={() => setShowLightningDemo(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                aria-label="Close lightning demo"
              >
                ✕
              </button>
              <div className="rounded-b-lg overflow-hidden">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-96">
                    <Loader className="animate-spin text-purple-500" size={32} />
                  </div>
                }>
                  <LightningInputSystemDemo />
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {showSecurityDashboard && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-auto relative">
              <button
                onClick={() => setShowSecurityDashboard(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                aria-label="Close security dashboard"
              >
                ✕
              </button>
              <div className="rounded-b-lg overflow-hidden">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-96">
                    <Loader className="animate-spin text-purple-500" size={32} />
                  </div>
                }>
                  <SecurityDashboard 
                    isOpen={true} 
                    onClose={() => setShowSecurityDashboard(false)} 
                  />
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {/* Floating Support Widget */}
        <Suspense fallback={null}>
          <BuyMeCoffee onSupportComplete={handleSupportComplete} />
        </Suspense>
      </div>
    </FitnessCoachErrorBoundary>
  );
};

export default FitnessCoach;

// =====================================================================================
// 🎯 PERFORMANCE MONITORING & ANALYTICS
// =====================================================================================

// Performance observer for Core Web Vitals
if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'measure') {
        console.debug(`Performance: ${entry.name} took ${entry.duration}ms`);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
}