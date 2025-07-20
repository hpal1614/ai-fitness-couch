import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as annyang from 'annyang';

// Command handler stubs (to be implemented elsewhere and imported)
const logExercise = (...args: any[]) => {};
const startRestTimer = (...args: any[]) => {};
const addWeight = (...args: any[]) => {};
const removeWeight = (...args: any[]) => {};
const nextExercise = () => {};
const previousExercise = () => {};
const getPersonalRecord = (...args: any[]) => {};
const showProgress = () => {};
const getWeeklyStats = () => {};
const showExerciseForm = (...args: any[]) => {};
const findExercisesByBodyPart = (...args: any[]) => {};
const searchExercise = (...args: any[]) => {};
const getMotivation = () => {};
const getProgressSummary = () => {};
const createWorkoutPlan = () => {};
const finishWorkout = () => {};
const pauseWorkout = () => {};
const cancelWorkout = () => {};

const VoiceCommands: Record<string, any> = {
  // Exercise logging
  'log *exercise *sets *reps *weight': logExercise,
  'I did *sets sets of *exercise at *weight pounds': logExercise,
  'bench press *weight for *reps reps': (weight: string, reps: string) => logExercise('bench press', 1, reps, weight),

  // Workout control
  'start rest timer': startRestTimer,
  'start *seconds second timer': (seconds: string) => startRestTimer(parseInt(seconds)),
  'add *amount pounds': addWeight,
  'remove *amount pounds': removeWeight,
  'next exercise': nextExercise,
  'previous exercise': previousExercise,

  // Progress queries
  'what is my PR for *exercise': getPersonalRecord,
  'show my progress': showProgress,
  'how many workouts this week': getWeeklyStats,

  // Exercise library
  'show *exercise form': showExerciseForm,
  'find *bodypart exercises': findExercisesByBodyPart,
  'search for *exercise': searchExercise,

  // Motivation & AI
  'motivate me': getMotivation,
  'how am I doing': getProgressSummary,
  'create workout plan': createWorkoutPlan,

  // App control
  'finish workout': finishWorkout,
  'pause workout': pauseWorkout,
  'cancel workout': cancelWorkout
};

let isAnnyangAvailable = false;

// Voice status context
interface VoiceStatusContextType {
  listening: boolean;
  transcript: string;
  setListening: (v: boolean) => void;
  setTranscript: (t: string) => void;
}
const VoiceStatusContext = createContext<VoiceStatusContextType | undefined>(undefined);

export function VoiceStatusProvider({ children }: { children: ReactNode }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (annyang) {
      isAnnyangAvailable = true;
      (annyang as any).addCommands(VoiceCommands);
      (annyang as any).addCallback('soundstart', () => setListening(true));
      (annyang as any).addCallback('end', () => setListening(false));
      (annyang as any).addCallback('result', (phrases: string[]) => {
        setTranscript(phrases[0] || '');
      });
      (annyang as any).start({ autoRestart: true, continuous: true });
    } else if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[event.resultIndex][0].transcript.trim();
        setTranscript(transcript);
      };
      recognition.start();
    }
  }, []);

  return (
    <VoiceStatusContext.Provider value={{ listening, transcript, setListening, setTranscript }}>
      {children}
    </VoiceStatusContext.Provider>
  );
}

export function useVoiceStatus() {
  const ctx = useContext(VoiceStatusContext);
  if (!ctx) throw new Error('useVoiceStatus must be used within VoiceStatusProvider');
  return ctx;
}

export function initVoiceEngine() {
  if (annyang) {
    isAnnyangAvailable = true;
    (annyang as any).addCommands(VoiceCommands);
    (annyang as any).start({ autoRestart: true, continuous: true });
    console.log('Annyang voice engine started.');
  } else if ('webkitSpeechRecognition' in window) {
    // Fallback: Web Speech API (basic)
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      // TODO: Map transcript to commands (simple matching)
      console.log('Voice transcript:', transcript);
    };
    recognition.start();
    console.log('Web Speech API fallback started.');
  } else {
    console.warn('No voice recognition available.');
  }
}

export function stopVoiceEngine() {
  if (isAnnyangAvailable && annyang) {
    (annyang as any).abort();
  }
  // TODO: Stop Web Speech API if used
}
