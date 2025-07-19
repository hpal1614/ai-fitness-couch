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

// ...add other type definitions as needed
