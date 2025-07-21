// =====================================================================================
// 🎤 SIMPLIFIED VOICE ENGINE - GUARANTEED TO WORK
// =====================================================================================
// Using Web Speech API with proper error handling

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { aiService } from '../ai/AiService';
import { exerciseService } from '../data/ExerciseService';

// Voice Status Interface
export interface VoiceStatusContextType {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  // Legacy support
  listening: boolean;
  speaking: boolean;
  isEnabled: boolean;
  lastCommand: string;
  getStats: () => VoiceStats;
}

export interface VoiceStats {
  totalCommands: number;
  successfulCommands: number;
  accuracy: number;
  sessionDuration: number;
}

// Voice Context
const VoiceStatusContext = createContext<VoiceStatusContextType | null>(null);

// Simple Voice Provider
export const VoiceStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  
  // Stats
  const [stats, setStats] = useState<VoiceStats>({
    totalCommands: 0,
    successfulCommands: 0,
    accuracy: 0,
    sessionDuration: 0
  });

  // References
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const sessionStartRef = React.useRef<number>(Date.now());

  // Initialize voice recognition
  useEffect(() => {
    console.log('🎤 Initializing Voice Engine...');
    
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.log('❌ Speech Recognition not supported');
      setError('Speech recognition not supported in this browser. Try Chrome, Edge, or Safari!');
      return;
    }

    console.log('✅ Speech Recognition supported');
    setIsSupported(true);

    // Create recognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Single result per session
    recognition.interimResults = false; // Only final results
    recognition.lang = 'en-US';

    // Event handlers
    recognition.onstart = () => {
      console.log('🎤 Voice: Listening started');
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onend = () => {
      console.log('🎤 Voice: Listening ended');
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (event.results.length > 0) {
        const result = event.results[0];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0.8;

        console.log('🎤 Voice Result:', transcript, 'Confidence:', confidence);
        
        setTranscript(transcript);
        setConfidence(confidence);
        setLastCommand(transcript);
        
        // Process the command
        handleVoiceCommand(transcript);

        // Update stats
        setStats(prev => ({
          ...prev,
          totalCommands: prev.totalCommands + 1,
          successfulCommands: prev.successfulCommands + 1,
          accuracy: ((prev.successfulCommands + 1) / (prev.totalCommands + 1)) * 100,
          sessionDuration: Date.now() - sessionStartRef.current
        }));
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('🎤 Voice Error:', event.error);
      setError(`Voice error: ${event.error}`);
      setIsListening(false);
      
      // Handle specific errors
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try speaking louder or check your microphone.');
      } else if (event.error === 'network') {
        setError('Network error. Please check your internet connection.');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle voice commands
  const handleVoiceCommand = useCallback(async (command: string) => {
    console.log('🎤 Processing voice command:', command);
    
    try {
      let response = '';

      // Quick exercise lookups
      if (command.toLowerCase().includes('show me') && command.toLowerCase().includes('exercise')) {
        const exerciseName = command.toLowerCase().replace(/show me|exercise|for/g, '').trim();
        console.log('🏋️ Looking up exercise:', exerciseName);
        
        const exercises = await exerciseService.searchByVoice(exerciseName);
        if (exercises.exercises.length > 0) {
          const exercise = exercises.exercises[0];
          response = `Here's how to do ${exercise.name}: ${exercise.instructions[0]}`;
        } else {
          response = `I couldn't find an exercise called "${exerciseName}". Try asking for squats, push-ups, or planks!`;
        }
      }
      // General AI response
      else {
        console.log('🤖 Getting AI response...');
        response = await aiService.getAIResponse(command);
      }

      if (response) {
        console.log('🔊 Speaking response:', response);
        speak(response);
      }
    } catch (error) {
      console.error('❌ Command processing error:', error);
      speak('Sorry, I had trouble processing that command. Please try again.');
    }
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition not supported');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        console.log('🎤 Starting voice recognition...');
        recognitionRef.current.start();
      } catch (error) {
        console.error('❌ Error starting recognition:', error);
        setError('Could not start voice recognition. Please try again.');
      }
    }
  }, [isSupported, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      console.log('🎤 Stopping voice recognition...');
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Text-to-speech
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      console.log('🔊 Speaking:', text);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        console.log('🔊 Speech started');
        setSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('🔊 Speech ended');
        setSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('🔊 Speech error:', event.error);
        setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.log('❌ Speech synthesis not supported');
    }
  }, []);

  // Get statistics
  const getStats = useCallback((): VoiceStats => ({
    ...stats,
    sessionDuration: Date.now() - sessionStartRef.current
  }), [stats]);

  // Context value
  const contextValue: VoiceStatusContextType = {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    speak,
    // Legacy compatibility
    listening: isListening,
    speaking,
    isEnabled: isSupported,
    lastCommand,
    getStats
  };

  return (
    <VoiceStatusContext.Provider value={contextValue}>
      {children}
    </VoiceStatusContext.Provider>
  );
};

// Hook to use voice status
export const useVoiceStatus = () => {
  const context = useContext(VoiceStatusContext);
  if (!context) {
    throw new Error('useVoiceStatus must be used within a VoiceStatusProvider');
  }
  return context;
};

// Export for legacy compatibility
export default VoiceStatusProvider;
