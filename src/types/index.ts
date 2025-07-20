export interface RoutingStrategy {
  exercise_form: string;
  workout_planning: string;
  motivation: string;
  emergency: string;
  high_volume: string;
  fallbackChain: string[];
}

export interface ApiProviders {
  [key: string]: {
    name: string;
    apiKey: string;
    baseUrl: string;
    models: Record<string, string>;
    limits: {
      requestsPerMinute?: number;
      requestsPerDay?: number;
      tokensPerMinute?: number;
    };
    priority: number;
    cost: number;
    quality: number;
  };
}

// Web Speech API typings for cross-browser support
// These are available in lib.dom.d.ts, but for stricter TS, we redeclare for safety
// @ts-ignore
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}
// @ts-ignore
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    SpeechRecognition: any; // Use 'any' to avoid TS2693 error, as the constructor is not globally available in TS
    webkitSpeechRecognition: any;
  }
}
