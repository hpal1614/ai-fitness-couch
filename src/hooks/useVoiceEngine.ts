import { useState, useRef, useCallback } from 'react';

// @ts-ignore
type SpeechRecognition = any;
// @ts-ignore
type SpeechRecognitionEvent = any;

export function useVoiceEngine({ onResult, enabled }: { onResult: (text: string) => void, enabled: boolean }) {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef(window.speechSynthesis);

  // Start listening for voice input
  const startListening = useCallback(() => {
    if (!enabled || listening) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, [enabled, listening, onResult]);

  // Stop listening
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  // Speak text aloud
  const speak = useCallback((text: string) => {
    if (!enabled || speaking) return;
    setSpeaking(true);
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.onend = () => setSpeaking(false);
    synthRef.current.speak(utter);
  }, [enabled, speaking]);

  return {
    listening,
    speaking,
    startListening,
    stopListening,
    speak,
  };
} 