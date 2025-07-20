// =====================================================================================
// 🎤 BATTLE-TESTED VOICE ENGINE WITH ANNYANG + WEB SPEECH API
// =====================================================================================
// Using Annyang.js (6,000+ GitHub stars) with Web Speech API fallback

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { aiService } from '../ai/AiService';
import { exerciseService } from '../data/ExerciseService';

// Dynamically import annyang to handle SSR and optional loading
let annyang: any = null;

// Try to load annyang
const loadAnnyang = async () => {
  try {
    if (typeof window !== 'undefined') {
      const annyangModule = await import('annyang');
      annyang = annyangModule.default;
      return true;
    }
  } catch (error) {
    console.log('Annyang not available, will use Web Speech API fallback');
    return false;
  }
  return false;
};

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
  // Legacy support for existing components
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

// Voice Provider Component
export const VoiceStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Core state
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  
  // Statistics
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
    let mounted = true;

    const initializeVoice = async () => {
      // Try to load annyang first
      const annyangLoaded = await loadAnnyang();
      
      if (annyangLoaded && annyang) {
        console.log('✅ Annyang loaded successfully');
        initializeAnnyang();
      } else {
        console.log('🔄 Falling back to Web Speech API');
        initializeWebSpeechAPI();
      }
    };

    if (mounted) {
      initializeVoice();
    }

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  // Initialize Annyang (preferred)
  const initializeAnnyang = useCallback(() => {
    if (!annyang) return;

    // Set language
    annyang.setLanguage('en-US');

    // Add debug event listeners
    annyang.addCallback('start', () => {
      console.log('🎤 Annyang: Listening started');
      setIsListening(true);
      setError(null);
    });

    annyang.addCallback('end', () => {
      console.log('🎤 Annyang: Listening ended');
      setIsListening(false);
    });

    annyang.addCallback('result', (phrases: string[]) => {
      if (phrases && phrases.length > 0) {
        const bestPhrase = phrases[0];
        console.log('🎤 Annyang Result:', bestPhrase);
        setTranscript(bestPhrase);
        setConfidence(0.8); // Annyang doesn't provide confidence scores
        setLastCommand(bestPhrase);
        handleVoiceCommand(bestPhrase);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalCommands: prev.totalCommands + 1,
          successfulCommands: prev.successfulCommands + 1,
          accuracy: ((prev.successfulCommands + 1) / (prev.totalCommands + 1)) * 100,
          sessionDuration: Date.now() - sessionStartRef.current
        }));
      }
    });

    annyang.addCallback('error', (err: any) => {
      console.error('🎤 Annyang Error:', err);
      setError(err.error || 'Speech recognition error');
      setIsListening(false);
    });

    setIsSupported(true);
  }, []);

  // Initialize Web Speech API (fallback)
  const initializeWebSpeechAPI = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('❌ Speech Recognition not supported');
      setError('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('🎤 Web Speech API: Listening started');
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      console.log('🎤 Web Speech API: Listening ended');
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
          setConfidence(result[0].confidence || 0.8);
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        console.log('🎤 Final transcript:', finalTranscript);
        setTranscript(finalTranscript);
        setLastCommand(finalTranscript);
        handleVoiceCommand(finalTranscript);

        // Update stats
        setStats(prev => ({
          ...prev,
          totalCommands: prev.totalCommands + 1,
          successfulCommands: prev.successfulCommands + 1,
          accuracy: ((prev.successfulCommands + 1) / (prev.totalCommands + 1)) * 100,
          sessionDuration: Date.now() - sessionStartRef.current
        }));
      } else if (interimTranscript) {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('🎤 Web Speech API Error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);
  }, []);

  // Handle voice commands
  const handleVoiceCommand = useCallback(async (command: string) => {
    const cleanCommand = command.toLowerCase().trim();
    
    // Fitness-specific command processing
    try {
      let response = '';

      // Quick exercise lookups
      if (cleanCommand.includes('show me') && cleanCommand.includes('exercise')) {
        const exerciseName = cleanCommand.replace(/show me|exercise|for/g, '').trim();
        const exercises = await exerciseService.searchByVoice(exerciseName);
        if (exercises.exercises.length > 0) {
          response = `Here's how to do ${exercises.exercises[0].name}: ${exercises.exercises[0].instructions.join('. ')}`;
        } else {
          response = `I couldn't find an exercise called "${exerciseName}". Try asking for squats, push-ups, or planks!`;
        }
      }
      // General fitness advice
      else {
        response = await aiService.getAIResponse(command);
      }

      if (response) {
        speak(response);
      }
    } catch (error) {
      console.error('Command processing error:', error);
      speak('Sorry, I had trouble processing that command. Please try again.');
    }
  }, []);

  // Start listening function
  const startListening = useCallback(() => {
    if (annyang) {
      annyang.start();
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setError('Could not start voice recognition');
      }
    }
  }, []);

  // Stop listening function
  const stopListening = useCallback(() => {
    if (annyang) {
      annyang.abort();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Text-to-speech function
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Get statistics
  const getStats = useCallback((): VoiceStats => ({
    ...stats,
    sessionDuration: Date.now() - sessionStartRef.current
  }), [stats]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (annyang) {
      annyang.abort();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Context value
  const contextValue: VoiceStatusContextType = {
    // New interface
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    speak,
    // Legacy interface for backward compatibility
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
