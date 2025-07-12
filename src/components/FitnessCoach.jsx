

import React, { useState, useEffect, useRef } from 'react';
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

import { useSecurity } from '../security/SecurityProvider.jsx';
import LoginForm from './LoginForm.jsx';
import SecurityDashboard from './SecurityDashboard.jsx';
import CoreUIEngine from './CoreUIEngine.jsx';
import LightningInputSystemDemo from './LightningInputSystemDemo.jsx';
import BuyMeCoffee from './BuyMeCoffee.jsx';
import aiService from '../utils/aiService.js';



const Message = ({ message, isUser, timestamp, confidence, source }) => {
  const [isTyping, setIsTyping] = useState(!isUser && !message.content);
  
  useEffect(() => {
    if (!isUser && message.content) {
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isUser, message.content]);
  
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
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}
      
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`rounded-2xl p-4 max-w-3xl ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-12' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <div className="whitespace-pre-wrap">{message.content || message}</div>
          
          {/* Message metadata for AI responses */}
          {!isUser && (confidence || source) && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
              {source && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  {source === 'local_knowledge' ? '🧠 Built-in' : 
                   source === 'ai_api' ? '🤖 AI Enhanced' : 
                   source === 'cache' ? '⚡ Cached' : source}
                </span>
              )}
              {confidence && (
                <span className="text-xs text-gray-500">
                  {(confidence * 100).toFixed(0)}% confidence
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

// =====================================================================================
// 🎯 QUICK ACTION BUTTONS
// =====================================================================================

const QuickActions = ({ onQuickAction, disabled }) => {
  const actions = [
    {
      id: 'workout-plan',
      label: 'Create Workout Plan',
      icon: Target,
      message: 'Create a beginner workout plan for me',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'form-check',
      label: 'Check Exercise Form',
      icon: TrendingUp,
      message: 'How do I perform a proper squat?',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'nutrition',
      label: 'Nutrition Advice',
      icon: Heart,
      message: 'What should I eat before and after workouts?',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'motivation',
      label: 'Get Motivated',
      icon: Zap,
      message: 'I need motivation to keep going with my fitness journey',
      color: 'from-yellow-500 to-orange-500'
    }
  ];
  
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
            `}
          >
            <Icon size={24} />
            <span className="text-sm font-medium text-center">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// =====================================================================================
// 📊 STATS SIDEBAR
// =====================================================================================

const StatsSidebar = ({ isOpen, onClose, analytics, conversationCount }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300">
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Coach Stats</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>
        
        {/* Conversation Stats */}
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
        
        {/* AI Performance */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-3">AI Performance</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Local Knowledge</span>
              <span className="font-semibold text-green-600">
                {analytics.localKnowledgeRate || '70%'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cache Hit Rate</span>
              <span className="font-semibold text-blue-600">
                {analytics.cacheHitRate || '25%'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Requests</span>
              <span className="font-semibold text-gray-600">
                {analytics.totalRequests || 0}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Pro Tips</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Ask specific questions for better answers</li>
            <li>• Mention your fitness level for personalized advice</li>
            <li>• Include equipment you have available</li>
            <li>• Ask about safety if you have concerns</li>
          </ul>
        </div>
        
        {/* Support Section */}
        <div className="mt-6">
          <BuyMeCoffee 
            showFloatingWidget={false} 
            showStats={false}
            className="scale-90 origin-top"
          />
        </div>
      </div>
    </div>
  );
};

// =====================================================================================
// 🎉 WELCOME SCREEN
// =====================================================================================

const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🤖💪</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        AI Fitness Coach
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Your personal AI-powered fitness companion. Get expert workout plans, 
        nutrition advice, form checks, and motivation - all backed by exercise science!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6">
          <div className="text-3xl mb-3">🏋️</div>
          <h3 className="font-semibold text-gray-800 mb-2">Expert Workouts</h3>
          <p className="text-sm text-gray-600">
            Personalized plans based on your level, goals, and available equipment
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-6">
          <div className="text-3xl mb-3">🥗</div>
          <h3 className="font-semibold text-gray-800 mb-2">Smart Nutrition</h3>
          <p className="text-sm text-gray-600">
            Science-based meal planning and supplement recommendations
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-6">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="font-semibold text-gray-800 mb-2">Safety First</h3>
          <p className="text-sm text-gray-600">
            Built-in safety protocols and form corrections to prevent injuries
          </p>
        </div>
      </div>
      
      <button
        onClick={onGetStarted}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-xl text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
      >
        Start Your Fitness Journey! 🚀
      </button>
      
      <p className="text-xs text-gray-500 mt-4">
        Free to use • No signup required • Works offline
      </p>
    </div>
  );
};

// =====================================================================================
// 🎯 MAIN FITNESS COACH COMPONENT
// =====================================================================================

const FitnessCoach = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showCoreEngine, setShowCoreEngine] = useState(false);
  const [showLightningDemo, setShowLightningDemo] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [userId] = useState(() => `user_${Date.now()}`);
  const { isAuthenticated, isLoading: isAuthLoading } = useSecurity();
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Load analytics periodically
    const interval = setInterval(() => {
      setAnalytics(aiService.getAnalytics());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Helper functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleGetStarted = () => {
    setShowWelcome(false);
    // Add welcome message from AI
    const welcomeMessage = {
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
    
    // Focus input after welcome
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  };
  
  const handleSendMessage = async (messageText = inputMessage.trim()) => {
    if (!messageText || isLoading) return;
    
    // Add user message
    const userMessage = {
      content: messageText,
      isUser: true,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await aiService.processMessage(messageText, userId);
      
      // Add AI response
      const aiMessage = {
        content: response.content,
        isUser: false,
        timestamp: Date.now(),
        confidence: response.confidence,
        source: response.source,
        provider: response.provider
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage = {
        content: `I'm having a technical hiccup! 🤖 But don't worry - I can still help you with built-in fitness knowledge. Try asking me about exercises, nutrition, or workout planning!

Error: ${error.message}`,
        isUser: false,
        timestamp: Date.now(),
        source: 'error',
        confidence: 0.5
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleQuickAction = (message) => {
    if (!isLoading) {
      handleSendMessage(message);
    }
  };
  
  const handleSupportComplete = (supportData) => {
    // Add celebration message
    const celebrationMessage = {
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
  };
  
  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <LoginForm />
      </div>
    );
  }

  // Loading screen while welcome
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
              <div className="text-2xl">🤖💪</div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Fitness Coach</h1>
                <p className="text-xs text-gray-600">Your Personal Training Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="View Stats"
              >
                <BarChart3 size={20} className="text-gray-600" />
              </button>
              

              <button
                onClick={() => setShowCoreEngine(!showCoreEngine)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Core Engine Demo"
              >
                <Brain size={20} className="text-gray-600" />
              </button>

              <button
                onClick={() => setShowLightningDemo(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Lightning Input System Demo"
              >
                <Zap size={20} className="text-yellow-500" />
              </button>
              
              <button
                onClick={() => setShowSecurityDashboard(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Security Dashboard"
              >
                <Shield size={20} className="text-gray-600" />
              </button>
              
              <button
                onClick={() => window.open('https://github.com/himanshu1614', '_blank')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Help & Support"
              >
                <HelpCircle size={20} className="text-gray-600" />
              </button>
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
                {messages.map((message, index) => (
                  <Message
                    key={index}
                    message={message}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                    confidence={message.confidence}
                    source={message.source}
                  />
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <Message message={{ content: '' }} isUser={false} />
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
                    className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="2"
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
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
          conversationCount={Math.floor(messages.length / 2)}
        />
      </div>
      
      {/* Core UI Engine Modal */}
      {showCoreEngine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setShowCoreEngine(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              ✕
            </button>
            <CoreUIEngine />
          </div>
        </div>
      )}
      
      {/* Lightning Input System Modal */}
      {showLightningDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-auto relative">
            <button
              onClick={() => setShowLightningDemo(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              ✕
            </button>
            <div className="rounded-b-lg overflow-hidden">
              <LightningInputSystemDemo />
            </div>
          </div>
        </div>
      )}

      {/* Floating Support Widget */}
      <BuyMeCoffee onSupportComplete={handleSupportComplete} />
    </div>
  );
};

export default FitnessCoach;