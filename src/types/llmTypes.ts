// File: src/types/llmTypes.ts

// =====================================================================================
// 🏷️ AI FITNESS COACH - LLM TYPES DEFINITIONS
// =====================================================================================
// All TypeScript type definitions for the LLM configuration system

// =====================================================================================
// 🎯 CORE PROVIDER TYPES
// =====================================================================================

export type ProviderName = 
  | 'openRouter' 
  | 'groq' 
  | 'googleAI' 
  | 'local' 
  | 'openai' 
  | 'anthropic';

export type MessageType = 
  | 'exercise_form' 
  | 'workout_planning' 
  | 'nutrition' 
  | 'motivation' 
  | 'injury_prevention' 
  | 'progress_tracking' 
  | 'emergency' 
  | 'general' 
  | 'creative' 
  | 'scientific';

export type Environment = 'development' | 'staging' | 'production';

export type ConfigStatus = 'initializing' | 'ready' | 'error' | 'degraded';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type CacheStrategy = 'lru' | 'lfu' | 'ttl' | 'none';

export type RetryStrategy = 'exponential' | 'linear' | 'fixed' | 'none';

// =====================================================================================
// 🏗️ PROVIDER CONFIGURATION INTERFACES
// =====================================================================================

export interface Provider {
  name: string;
  apiKey: string;
  baseUrl: string;
  models: Record<string, string>;
  limits: {
    requestsPerMinute?: number;
    requestsPerDay?: number;
    tokensPerMinute?: number;
    maxTokens?: number;
  };
  priority: number;
  cost: number;
  quality: number;
  available: boolean;
  timeout?: number;
  retries?: number;
  features?: string[];
  specialties?: string[];
}

export interface ApiProviders {
  [key: string]: Provider;
}

export interface RoutingStrategy {
  exercise_form: ProviderName;
  workout_planning: ProviderName;
  nutrition: ProviderName;
  motivation: ProviderName;
  injury_prevention: ProviderName;
  progress_tracking: ProviderName;
  emergency: ProviderName;
  general: ProviderName;
  creative: ProviderName;
  scientific: ProviderName;
  fallbackChain: ProviderName[];
}

// =====================================================================================
// 🔒 SECURITY CONFIGURATION INTERFACES
// =====================================================================================

export interface SecurityConfig {
  inputValidation: {
    maxLength: number;
    minLength: number;
    blockedPatterns: RegExp[];
    allowedLanguages: string[];
    sanitizeInput: boolean;
    trimWhitespace: boolean;
  };
  outputFiltering: {
    removePersonalInfo: boolean;
    filterMedicalAdvice: boolean;
    blockInappropriate: boolean;
    maxResponseLength: number;
    includeDisclaimer: boolean;
  };
  rateLimit: {
    perUser: number;
    perIP: number;
    burstLimit: number;
    windowMs: number;
    skipLocal: boolean;
  };
  apiSafety: {
    validateApiKeys: boolean;
    maskApiKeys: boolean;
    encryptStorage: boolean;
    logRequests: boolean;
    timeoutMs: number;
  };
}

// =====================================================================================
// ⚡ PERFORMANCE CONFIGURATION INTERFACES
// =====================================================================================

export interface PerformanceConfig {
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
    compression: boolean;
    strategy: string;
    keyPrefix: string;
  };
  optimization: {
    smartRouting: boolean;
    loadBalancing: boolean;
    circuitBreaker: boolean;
    adaptiveTimeout: boolean;
    priorityQueuing: boolean;
    retry: {
      maxAttempts: number;
      backoffMultiplier: number;
      baseDelay: number;
      maxDelay: number;
      jitter: boolean;
    };
  };
  monitoring: {
    trackResponseTime: boolean;
    trackSuccess: boolean;
    trackErrors: boolean;
    trackProviderUsage: boolean;
    healthChecks: boolean;
    metrics: {
      responseTime: boolean;
      successRate: boolean;
      errorRate: boolean;
      providerAvailability: boolean;
    };
  };
}

// =====================================================================================
// 🌍 ENVIRONMENT CONFIGURATION INTERFACES
// =====================================================================================

export interface EnvironmentConfig {
  development: {
    debug: boolean;
    verbose: boolean;
    mockResponses: boolean;
    logLevel: string;
    showApiKeys: boolean;
    enableTesting: boolean;
  };
  staging: {
    debug: boolean;
    verbose: boolean;
    mockResponses: boolean;
    logLevel: string;
    showApiKeys: boolean;
    enableTesting: boolean;
  };
  production: {
    debug: boolean;
    verbose: boolean;
    mockResponses: boolean;
    logLevel: string;
    showApiKeys: boolean;
    enableTesting: boolean;
  };
}

// =====================================================================================
// 📊 METRICS AND MONITORING INTERFACES
// =====================================================================================

export interface ConfigManagerMetrics {
  requestCount: number;
  errorCount: number;
  successCount: number;
  startTime: number;
  providerUsage: Record<ProviderName, number>;
  responseTime: {
    total: number;
    count: number;
    average: number;
  };
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  details: {
    initialized: boolean;
    availableProviders: ProviderName[];
    hasExternalAPIs: boolean;
    uptime: number;
  };
}

// =====================================================================================
// 🎛️ CONFIGURATION AND INITIALIZATION INTERFACES
// =====================================================================================

export interface InitializationOptions {
  skipValidation?: boolean;
  mockMode?: boolean;
  customProviders?: Partial<ApiProviders>;
  overrideEnvironment?: Environment;
}

export interface ValidationContext {
  userMessage: string;
  messageType: MessageType;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  sanitizedMessage?: string;
  errors: string[];
  warnings: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

// =====================================================================================
// 💬 CONVERSATION AND RESPONSE INTERFACES
// =====================================================================================

export interface ConversationResponse {
  content: string;
  provider: ProviderName;
  messageType: MessageType;
  confidence: number;
  source: 'api' | 'cache' | 'local' | 'fallback';
  processingTime: number;
  tokensUsed?: number;
  cost?: number;
  metadata?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    finishReason?: string;
    safety?: {
      filtered: boolean;
      categories: string[];
    };
  };
}

export interface ConversationContext {
  userId: string;
  sessionId: string;
  messageHistory: ConversationMessage[];
  userPreferences?: {
    fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
    goals?: string[];
    equipment?: string[];
    injuries?: string[];
    preferredStyle?: 'encouraging' | 'direct' | 'scientific';
  };
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  messageType?: MessageType;
  metadata?: {
    provider?: ProviderName;
    confidence?: number;
    processingTime?: number;
  };
}

// =====================================================================================
// 🎯 MAIN LLM CONFIGURATION INTERFACE
// =====================================================================================

export interface LLMConfig {
  routing: RoutingStrategy;
  providers: ApiProviders;
  fallbacks: ProviderName[];
  caching: PerformanceConfig['caching'];
  security: SecurityConfig;
  analytics: Record<string, any>;
  performance: PerformanceConfig;
  environment: EnvironmentConfig;
}

// =====================================================================================
// 🔧 API REQUEST AND RESPONSE INTERFACES
// =====================================================================================

export interface APIRequest {
  provider: ProviderName;
  model: string;
  messages: ConversationMessage[];
  options: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
  };
  metadata: {
    messageType: MessageType;
    userId: string;
    sessionId: string;
    timestamp: number;
  };
}

export interface APIResponse {
  content: string;
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: ProviderName;
  processingTime: number;
  metadata?: {
    safety?: {
      filtered: boolean;
      categories: string[];
    };
    quality?: {
      coherence: number;
      relevance: number;
      safety: number;
    };
  };
}

// =====================================================================================
// 🛡️ ERROR HANDLING INTERFACES
// =====================================================================================

export interface LLMError {
  code: string;
  message: string;
  provider?: ProviderName;
  type: 'api_error' | 'network_error' | 'rate_limit' | 'invalid_input' | 'configuration_error';
  retryable: boolean;
  details?: {
    statusCode?: number;
    originalError?: string;
    suggestedAction?: string;
  };
}

export interface FallbackResponse {
  content: string;
  source: 'local_knowledge' | 'template' | 'error_message';
  confidence: number;
  messageType: MessageType;
  metadata: {
    fallbackReason: string;
    originalError?: LLMError;
    timestamp: number;
  };
}

// =====================================================================================
// 📈 ANALYTICS AND REPORTING INTERFACES
// =====================================================================================

export interface UsageMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  providerDistribution: Record<ProviderName, number>;
  messageTypeDistribution: Record<MessageType, number>;
  errorDistribution: Record<string, number>;
  costTracking: {
    totalCost: number;
    costByProvider: Record<ProviderName, number>;
  };
  qualityMetrics: {
    averageConfidence: number;
    userSatisfactionRate?: number;
    fallbackRate: number;
  };
}

export interface PerformanceReport {
  timeRange: {
    start: number;
    end: number;
  };
  summary: UsageMetrics;
  trends: {
    requestVolume: Array<{ timestamp: number; count: number }>;
    responseTime: Array<{ timestamp: number; avgTime: number }>;
    errorRate: Array<{ timestamp: number; rate: number }>;
  };
  recommendations: {
    type: 'optimization' | 'cost_saving' | 'reliability';
    description: string;
    priority: 'low' | 'medium' | 'high';
    action: string;
  }[];
}

// =====================================================================================
// 🔄 PROVIDER-SPECIFIC INTERFACES
// =====================================================================================

export interface OpenRouterConfig extends Provider {
  models: {
    primary: string;
    reasoning: string;
    fast: string;
    creative: string;
  };
  features: ['reasoning', 'planning', 'analysis', 'creativity'];
}

export interface GroqConfig extends Provider {
  models: {
    primary: string;
    fast: string;
    reasoning: string;
  };
  features: ['speed', 'real-time', 'form-analysis'];
}

export interface GoogleAIConfig extends Provider {
  models: {
    primary: string;
    reasoning: string;
    creative: string;
  };
  features: ['conversation', 'creativity', 'motivation', 'multimodal'];
}

export interface LocalConfig extends Provider {
  models: {
    primary: string;
    fallback: string;
  };
  features: ['offline', 'privacy', 'instant', 'reliable'];
}

// =====================================================================================
// 📦 CONFIGURATION MANAGER INTERFACE
// =====================================================================================

export interface IFitnessLLMConfigManager {
  // Core methods
  init(options?: InitializationOptions): Promise<boolean>;
  getProvider(name: ProviderName): Provider | null;
  getAvailableProviders(): ProviderName[];
  getPrimaryProvider(): Provider | null;
  getOptimalProvider(messageType: MessageType): ProviderName;
  getFallbackChain(excludeProvider?: ProviderName): ProviderName[];
  
  // Status and health
  isConfigured(): boolean;
  getStatus(): ConfigStatus;
  healthCheck(): HealthCheckResult;
  
  // Metrics and monitoring
  recordRequest(provider: ProviderName, responseTime?: number, success?: boolean): void;
  getMetrics(): ConfigManagerMetrics;
  generateReport(): PerformanceReport;
  
  // Configuration management
  updateProvider(name: ProviderName, config: Partial<Provider>): boolean;
  addProvider(name: string, config: Provider): boolean;
  removeProvider(name: ProviderName): boolean;
  
  // Utilities
  debug(): void;
  validateConfiguration(): ValidationResult;
  resetMetrics(): void;
}

// =====================================================================================
// 🚀 CONSTANTS FOR RUNTIME USE
// =====================================================================================

export const PROVIDER_NAMES = [
  'openRouter',
  'groq', 
  'googleAI',
  'local',
  'openai',
  'anthropic'
] as const;

export const MESSAGE_TYPES = [
  'exercise_form',
  'workout_planning',
  'nutrition',
  'motivation',
  'injury_prevention',
  'progress_tracking',
  'emergency',
  'general',
  'creative',
  'scientific'
] as const;

export const ENVIRONMENTS = [
  'development',
  'staging', 
  'production'
] as const;

export const CONFIG_STATUSES = [
  'initializing',
  'ready',
  'error',
  'degraded'
] as const;

export const LOG_LEVELS = [
  'debug',
  'info',
  'warn',
  'error'
] as const;

export const CACHE_STRATEGIES = [
  'lru',
  'lfu',
  'ttl',
  'none'
] as const;

export const RETRY_STRATEGIES = [
  'exponential',
  'linear',
  'fixed',
  'none'
] as const;

// =====================================================================================
// 🎯 DEFAULT CONFIGURATIONS
// =====================================================================================

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  inputValidation: {
    maxLength: 4000,
    minLength: 1,
    blockedPatterns: [/\b(admin|password|secret)\b/gi],
    allowedLanguages: ['en', 'es', 'fr', 'de'],
    sanitizeInput: true,
    trimWhitespace: true,
  },
  outputFiltering: {
    removePersonalInfo: true,
    filterMedicalAdvice: true,
    blockInappropriate: true,
    maxResponseLength: 8000,
    includeDisclaimer: true,
  },
  rateLimit: {
    perUser: 100,
    perIP: 500,
    burstLimit: 10,
    windowMs: 900000, // 15 minutes
    skipLocal: true,
  },
  apiSafety: {
    validateApiKeys: true,
    maskApiKeys: true,
    encryptStorage: true,
    logRequests: false,
    timeoutMs: 30000,
  },
};

export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  caching: {
    enabled: true,
    ttl: 3600000, // 1 hour
    maxSize: 1000,
    compression: true,
    strategy: 'lru',
    keyPrefix: 'fitness_coach_',
  },
  optimization: {
    smartRouting: true,
    loadBalancing: true,
    circuitBreaker: true,
    adaptiveTimeout: true,
    priorityQueuing: true,
    retry: {
      maxAttempts: 3,
      backoffMultiplier: 2,
      baseDelay: 1000,
      maxDelay: 10000,
      jitter: true,
    },
  },
  monitoring: {
    trackResponseTime: true,
    trackSuccess: true,
    trackErrors: true,
    trackProviderUsage: true,
    healthChecks: true,
    metrics: {
      responseTime: true,
      successRate: true,
      errorRate: true,
      providerAvailability: true,
    },
  },
};

// =====================================================================================
// 🔧 TYPE UTILITIES
// =====================================================================================

export type PartialLLMConfig = Partial<LLMConfig>;

export type ProviderConfigUpdate = Partial<Provider>;

export type MetricsSnapshot = Pick<ConfigManagerMetrics, 'requestCount' | 'errorCount' | 'successCount'>;

export type HealthStatus = HealthCheckResult['status'];

export type ValidationLevel = ValidationResult['riskLevel'];

// =====================================================================================
// 🎯 UTILITY TYPE GUARDS
// =====================================================================================

export const isProviderName = (value: string): value is ProviderName => {
  return PROVIDER_NAMES.includes(value as ProviderName);
};

export const isMessageType = (value: string): value is MessageType => {
  return MESSAGE_TYPES.includes(value as MessageType);
};

export const isEnvironment = (value: string): value is Environment => {
  return ENVIRONMENTS.includes(value as Environment);
};

export const isConfigStatus = (value: string): value is ConfigStatus => {
  return CONFIG_STATUSES.includes(value as ConfigStatus);
};

// =====================================================================================
// 🚀 ALL TYPES AND CONSTANTS EXPORTED ABOVE
// =====================================================================================

// All types, interfaces, constants, and utilities are already exported above.
// No additional exports needed to avoid conflicts.