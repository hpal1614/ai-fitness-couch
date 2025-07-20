// =====================================================================================
// 🏋️ VOICEFIT COACH - BATTLE-TESTED FITNESS AI WITH VOICE COMMANDS
// =====================================================================================
// Complete ChatGPT/Claude-like experience with voice-first interaction

import React, { useState, useEffect, useRef } from 'react';
import { useVoiceStatus } from '../voice/VoiceEngine';
import { askCoachFlex } from '../utils/aiService';
import { exerciseService } from '../data/ExerciseService';
import BuyMeCoffeeWidget, { useAchievementDonation } from './BuyMeCoffee';
import { 
  Mic, 
  MicOff, 
  Send, 
  Loader, 
  User, 
  Bot, 
  Dumbbell, 
  Heart, 
  Target,
  Zap,
  TrendingUp,
  Settings
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  isVoice?: boolean;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  sessionStats: {
    messagesCount: number;
    workoutsPlanned: number;
    motivationBoosts: number;
  };
}

const FitnessCoach: React.FC = () => {
  // Component state
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    sessionStats: {
      messagesCount: 0,
      workoutsPlanned: 0,
      motivationBoosts: 0
    }
  });
  
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  // Hooks
  const voiceStatus = useVoiceStatus();
  const { 
    showDonationPrompt, 
    currentAchievement, 
    triggerAchievementDonation, 
    dismissDonationPrompt 
  } = useAchievementDonation();
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  // Handle voice transcript
  useEffect(() => {
    if (voiceStatus.transcript && isVoiceMode && !voiceStatus.isListening) {
      handleSendMessage(voiceStatus.transcript, true);
      setInputText(''); // Clear input after voice message
    }
  }, [voiceStatus.transcript, isVoiceMode, voiceStatus.isListening]);

  // Welcome message
  useEffect(() => {
    setChatState(prev => ({
      ...prev,
      messages: [{
        id: 'welcome',
        content: `Hey there, fitness warrior! 💪 I'm Coach Flex, your AI-powered fitness companion powered by battle-tested tech!

🎤 **Voice Commands:** Click the mic and say things like:
• "Plan me a beginner workout"
• "How do I do push-ups properly?"
• "I need motivation"
• "Show me leg exercises"

💬 **Text Chat:** Type any fitness question and I'll help you crush your goals!

What's your fitness goal today? Let's make it happen! 🔥`,
        sender: 'coach',
        timestamp: new Date()
      }]
    }));
  }, []);

  // Handle sending messages
  const handleSendMessage = async (content: string = inputText, isVoice: boolean = false) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      isVoice
    };

    // Add user message
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
      sessionStats: {
        ...prev.sessionStats,
        messagesCount: prev.sessionStats.messagesCount + 1
      }
    }));

    // Clear input
    setInputText('');

    try {
      // Get AI response
      const aiResponse = await askCoachFlex(content);
      
      // Check for achievements
      checkForAchievements(content, aiResponse);
      
      // Add coach response
      const coachMessage: Message = {
        id: `coach-${Date.now()}`,
        content: aiResponse,
        sender: 'coach',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, coachMessage],
        isTyping: false
      }));

      // Speak response if in voice mode
      if (isVoice && voiceStatus.speak) {
        // Extract first paragraph for speaking (avoid speaking too much)
        const speakableText = aiResponse.split('\n')[0];
        voiceStatus.speak(speakableText);
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Oops! I had trouble processing that. The AI services might be temporarily unavailable. Don't worry though - I've got some built-in fitness knowledge to help you out! Try asking about basic exercises, form tips, or motivation. 💪",
        sender: 'coach',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false
      }));
    }
  };

  // Check for achievements and trigger donation prompts
  const checkForAchievements = (userInput: string, coachResponse: string) => {
    const input = userInput.toLowerCase();
    
    // Achievement triggers
    if (input.includes('first') && input.includes('workout')) {
      triggerAchievementDonation('First workout planned! 🎉');
    } else if (input.includes('week') && (input.includes('plan') || input.includes('routine'))) {
      triggerAchievementDonation('Weekly workout routine created! 📅');
    } else if (chatState.sessionStats.messagesCount >= 10) {
      triggerAchievementDonation('Deep fitness conversation - 10+ messages! 💬');
    } else if (input.includes('motivation') || input.includes('inspire')) {
      setChatState(prev => ({
        ...prev,
        sessionStats: {
          ...prev.sessionStats,
          motivationBoosts: prev.sessionStats.motivationBoosts + 1
        }
      }));
      
      if (chatState.sessionStats.motivationBoosts >= 3) {
        triggerAchievementDonation('Motivation seeker - you\'re dedicated! 🔥');
      }
    }
  };

  // Toggle voice mode
  const toggleVoiceMode = () => {
    if (isVoiceMode) {
      voiceStatus.stopListening();
      setIsVoiceMode(false);
    } else {
      if (voiceStatus.isSupported) {
        voiceStatus.startListening();
        setIsVoiceMode(true);
      } else {
        alert('Voice recognition is not supported in your browser. Try Chrome, Edge, or Safari!');
      }
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">VoiceFit Coach</h1>
              <p className="text-sm opacity-90">AI-Powered Fitness Assistant</p>
            </div>
          </div>
          
          {/* Session Stats */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{chatState.sessionStats.messagesCount} messages</span>
            </div>
            {voiceStatus.isSupported && (
              <div className={`flex items-center gap-1 ${voiceStatus.isListening ? 'animate-pulse' : ''}`}>
                <Mic className="w-4 h-4" />
                <span>{voiceStatus.isListening ? 'Listening...' : 'Voice Ready'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'coach' && (
              <div className="bg-orange-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] md:max-w-[60%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-md border'
              }`}
            >
              {message.isVoice && (
                <div className="flex items-center gap-1 text-xs opacity-75 mb-1">
                  <Mic className="w-3 h-3" />
                  <span>Voice message</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-1 opacity-75`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {message.sender === 'user' && (
              <div className="bg-blue-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {chatState.isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="bg-orange-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white text-gray-800 shadow-md border p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isVoiceMode ? "Voice mode active - speak your message..." : "Ask about workouts, nutrition, form, motivation..."}
              className={`w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isVoiceMode ? 'bg-orange-50 border-orange-300' : ''
              }`}
              disabled={isVoiceMode && voiceStatus.isListening}
            />
            
            {/* Voice status indicator */}
            {isVoiceMode && voiceStatus.isListening && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-red-500 rounded animate-pulse"></div>
                  <div className="w-1 h-3 bg-red-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-5 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Voice Toggle Button */}
          {voiceStatus.isSupported && (
            <button
              onClick={toggleVoiceMode}
              className={`p-3 rounded-lg transition-all duration-200 ${
                isVoiceMode
                  ? voiceStatus.isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={isVoiceMode ? 'Stop voice mode' : 'Start voice mode'}
            >
              {isVoiceMode ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || chatState.isTyping}
            className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            {chatState.isTyping ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        {/* Voice Mode Help */}
        {isVoiceMode && (
          <div className="mt-2 text-sm text-gray-600 bg-orange-50 p-2 rounded">
            🎤 Voice mode active! {voiceStatus.isListening ? 'Listening...' : 'Click send to start listening'}
            <br />
            Try saying: "Plan me a workout" or "How do I do squats?"
          </div>
        )}

        {/* Voice Error */}
        {voiceStatus.error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            Voice Error: {voiceStatus.error}
          </div>
        )}
      </div>

      {/* Buy Me Coffee Widget */}
      <BuyMeCoffeeWidget 
        showPrompt={showDonationPrompt} 
        achievementText={currentAchievement}
      />
    </div>
  );
};

export default FitnessCoach;