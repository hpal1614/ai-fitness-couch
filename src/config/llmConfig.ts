// =====================================================================================
// 🔧 AI FITNESS COACH - PRODUCTION TYPESCRIPT LLM CONFIGURATION
// =====================================================================================

import type {
  ProviderName,
  MessageType,
  Environment,
  Provider,
  ApiProviders,
  RoutingStrategy,
  SecurityConfig,
  PerformanceConfig,
  EnvironmentConfig,
  ConfigManagerMetrics,
  ConversationResponse,
  ValidationResult,
  HealthCheckResult,
  InitializationOptions,
  ValidationContext,
  LLMConfig
} from '../types/llmTypes';

// =====================================================================================
// 🌍 SAFE ENVIRONMENT ACCESS
// =====================================================================================

interface ViteImportMetaEnv {
  readonly [key: string]: string | undefined;
}

interface ViteImportMeta {
  readonly env: ViteImportMetaEnv;
}

const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as unknown as ViteImportMeta).env) {
      return (import.meta as unknown as ViteImportMeta).env[key] || '';
    }
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
    return '';
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return '';
  }
};

// =====================================================================================
// 🎯 ROUTING STRATEGY
// =====================================================================================

const ROUTING_STRATEGY: RoutingStrategy = {
  exercise_form: 'groq',
  workout_planning: 'openRouter',
  nutrition: 'openRouter',
  motivation: 'googleAI',
  injury_prevention: 'groq',
  progress_tracking: 'openRouter',
  emergency: 'groq',
  general: 'openRouter',
  creative: 'googleAI',
  scientific: 'openRouter',
  fallbackChain: ['openRouter', 'groq', 'googleAI', 'local']
};

// =====================================================================================
// 🏗️ PROVIDER CONFIGURATIONS
// =====================================================================================

const OPTIMAL_API_PROVIDERS: ApiProviders = {
  openRouter: {
    name: 'OpenRouter',
    apiKey: getEnvVar('VITE_OPENROUTER_API_KEY'),
    baseUrl: 'https://openrouter.ai/api/v1',
    models: {
      primary: 'deepseek/deepseek-v3:free',
      reasoning: 'deepseek/deepseek-r1:free',
      fast: 'google/gemma-2-9b-it:free',
      creative: 'meta-llama/llama-3.2-3b-instruct:free'
    },
    limits: {
      requestsPerMinute: 200,
      requestsPerDay: 50000,
      tokensPerMinute: 100000,
      maxTokens: 4096
    },
    priority: 1,
    cost: 0.0,
    quality: 0.90,
    available: Boolean(getEnvVar('VITE_OPENROUTER_API_KEY')),
    timeout: 30000,
    retries: 3,
    features: ['reasoning', 'planning', 'analysis', 'creativity'],
    specialties: ['workout_planning', 'nutrition', 'scientific', 'progress_tracking']
  },

  groq: {
    name: 'Groq',
    apiKey: getEnvVar('VITE_GROQ_API_KEY'),
    baseUrl: 'https://api.groq.com/openai/v1',
    models: {
      primary: 'mixtral-8x7b-32768',
      fast: 'llama-3.1-8b-instant',
      reasoning: 'llama-3.1-70b-versatile'
    },
    limits: {
      requestsPerMinute: 30,
      requestsPerDay: 14400,
      tokensPerMinute: 6000,
      maxTokens: 8192
    },
    priority: 2,
    cost: 0.0,
    quality: 0.85,
    available: Boolean(getEnvVar('VITE_GROQ_API_KEY')),
    timeout: 15000,
    retries: 2,
    features: ['speed', 'real-time', 'form-analysis'],
    specialties: ['exercise_form', 'emergency', 'injury_prevention']
  },

  googleAI: {
    name: 'Google AI',
    apiKey: getEnvVar('VITE_GOOGLE_AI_API_KEY'),
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: {
      primary: 'gemini-1.5-flash',
      reasoning: 'gemini-1.5-pro',
      creative: 'gemini-1.5-flash'
    },
    limits: {
      requestsPerMinute: 15,
      requestsPerDay: 1500,
      tokensPerMinute: 32000,
      maxTokens: 8192
    },
    priority: 3,
    cost: 0.0,
    quality: 0.82,
    available: Boolean(getEnvVar('VITE_GOOGLE_AI_API_KEY')),
    timeout: 25000,
    retries: 2,
    features: ['conversation', 'creativity', 'motivation', 'multimodal'],
    specialties: ['motivation', 'creative']
  },

  local: {
    name: 'Local Fitness Knowledge',
    apiKey: 'built-in',
    baseUrl: '',
    models: {
      primary: 'local-fitness-database',
      fallback: 'basic-responses'
    },
    limits: {
      requestsPerMinute: 1000,
      requestsPerDay: 100000,
      tokensPerMinute: 1000000,
      maxTokens: 2048
    },
    priority: 9,
    cost: 0.0,
    quality: 0.70,
    available: true,
    timeout: 1000,
    retries: 1,
    features: ['offline', 'privacy', 'instant', 'reliable'],
    specialties: ['general']
  },

  // Optional providers for future expansion
  openai: {
    name: 'OpenAI',
    apiKey: getEnvVar('VITE_OPENAI_API_KEY'),
    baseUrl: 'https://api.openai.com/v1',
    models: { primary: 'gpt-4-turbo-preview' },
    limits: { 
      requestsPerMinute: 60, 
      requestsPerDay: 10000, 
      tokensPerMinute: 40000,
      maxTokens: 4096 
    },
    priority: 1,
    cost: 0.06,
    quality: 0.95,
    available: Boolean(getEnvVar('VITE_OPENAI_API_KEY')),
    timeout: 30000,
    retries: 3,
    features: ['reasoning', 'analysis'],
    specialties: ['general']
  },

  anthropic: {
    name: 'Anthropic',
    apiKey: getEnvVar('VITE_ANTHROPIC_API_KEY'),
    baseUrl: 'https://api.anthropic.com',
    models: { primary: 'claude-3-sonnet-20240229' },
    limits: { 
      requestsPerMinute: 50, 
      requestsPerDay: 5000, 
      tokensPerMinute: 20000,
      maxTokens: 4096 
    },
    priority: 2,
    cost: 0.015,
    quality: 0.92,
    available: Boolean(getEnvVar('VITE_ANTHROPIC_API_KEY')),
    timeout: 30000,
    retries: 3,
    features: ['reasoning', 'analysis'],
    specialties: ['general']
  }
};

// =====================================================================================
// 🔒 SECURITY CONFIGURATION
// =====================================================================================

const SECURITY_CONFIG: SecurityConfig = {
  inputValidation: {
    maxLength: 4000,
    minLength: 1,
    blockedPatterns: [
      /(<script|javascript:|data:)/i,
      /(union|select|insert|delete|drop|create|alter)/i,
      /(eval|function|constructor|onclick)/i,
      /(document\.|window\.|localStorage)/i
    ],
    allowedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi'],
    sanitizeInput: true,
    trimWhitespace: true
  },
  outputFiltering: {
    removePersonalInfo: true,
    filterMedicalAdvice: true,
    blockInappropriate: true,
    maxResponseLength: 8000,
    includeDisclaimer: true
  },
  rateLimit: {
    perUser: 100,
    perIP: 200,
    burstLimit: 10,
    windowMs: 900000,
    skipLocal: true
  },
  apiSafety: {
    validateApiKeys: true,
    maskApiKeys: true,
    encryptStorage: false,
    logRequests: false,
    timeoutMs: 30000
  }
};

// =====================================================================================
// ⚡ PERFORMANCE CONFIGURATION
// =====================================================================================

const PERFORMANCE_CONFIG: PerformanceConfig = {
  caching: {
    enabled: true,
    ttl: 3600000,
    maxSize: 1000,
    compression: false,
    strategy: 'lru',
    keyPrefix: 'fitness_llm_'
  },
  optimization: {
    smartRouting: true,
    loadBalancing: true,
    circuitBreaker: true,
    adaptiveTimeout: true,
    priorityQueuing: false,
    retry: {
      maxAttempts: 3,
      backoffMultiplier: 2,
      baseDelay: 1000,
      maxDelay: 10000,
      jitter: true
    }
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
      providerAvailability: true
    }
  }
};

// =====================================================================================
// 🌍 ENVIRONMENT CONFIGURATION
// =====================================================================================

const ENVIRONMENT_CONFIG: EnvironmentConfig = {
  development: {
    debug: true,
    verbose: true,
    mockResponses: false,
    logLevel: 'debug',
    showApiKeys: false,
    enableTesting: true
  },
  staging: {
    debug: false,
    verbose: true,
    mockResponses: false,
    logLevel: 'info',
    showApiKeys: false,
    enableTesting: false
  },
  production: {
    debug: false,
    verbose: false,
    mockResponses: false,
    logLevel: 'error',
    showApiKeys: false,
    enableTesting: false
  }
};

// =====================================================================================
// 🎛️ CONFIGURATION MANAGER CLASS
// =====================================================================================

class FitnessLLMConfigManager {
  private initialized: boolean = false;
  private environment: Environment;
  private availableProviders: ProviderName[] = [];
  private primaryProvider: ProviderName | null = null;
  private metrics: ConfigManagerMetrics;

  constructor() {
    this.environment = this.detectEnvironment();
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      successCount: 0,
      startTime: Date.now(),
      providerUsage: {} as Record<ProviderName, number>,
      responseTime: {
        total: 0,
        count: 0,
        average: 0
      }
    };
    
    // Auto-initialize
    this.init();
  }

  private detectEnvironment(): Environment {
    try {
      const nodeEnv = getEnvVar('NODE_ENV') as Environment;
      const viteMode = getEnvVar('MODE') as Environment;
      const mode = nodeEnv || viteMode || 'development';
      
      return ['development', 'staging', 'production'].includes(mode) 
        ? mode as Environment
        : 'development';
    } catch {
      return 'development';
    }
  }

  public async init(options: InitializationOptions = {}): Promise<boolean> {
    try {
      const startTime = Date.now();
      console.log('🤖 Initializing AI Fitness Coach Configuration...');
      
      // Validate and setup providers
      this.validateProviders();
      this.setPrimaryProvider();
      this.applyEnvironmentConfig();
      this.setupMetrics();
      
      this.initialized = true;
      const initTime = Date.now() - startTime;
      
      console.log(`✅ Configuration initialized successfully in ${initTime}ms`);
      console.log(`🌍 Environment: ${this.environment}`);
      console.log(`🔗 Available providers: ${this.availableProviders.join(', ')}`);
      console.log(`⭐ Primary provider: ${this.primaryProvider}`);
      
      this.showSetupGuidance();
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize LLM configuration:', error);
      this.initialized = false;
      this.primaryProvider = 'local';
      this.availableProviders = ['local'];
      return false;
    }
  }

  private validateProviders(): boolean {
    this.availableProviders = [];
    let hasValidApiKey = false;
    
    for (const [name, provider] of Object.entries(OPTIMAL_API_PROVIDERS)) {
      const providerName = name as ProviderName;
      const isLocal = providerName === 'local';
      const hasApiKey = provider.apiKey && provider.apiKey.length > 5;
      
      if (isLocal || hasApiKey) {
        this.availableProviders.push(providerName);
        
        if (hasApiKey && !isLocal) {
          hasValidApiKey = true;
          console.log(`✅ ${provider.name}: Connected`);
        } else if (isLocal) {
          console.log(`✅ ${provider.name}: Always available`);
        }
      } else {
        console.log(`⚠️ ${provider.name}: No API key found`);
      }
    }

    if (!hasValidApiKey) {
      console.warn('⚠️ No external API providers configured. Using local knowledge only.');
    }
    
    return this.availableProviders.length > 0;
  }

  private setPrimaryProvider(): void {
    const priorityOrder: ProviderName[] = ['openRouter', 'groq', 'googleAI', 'local'];
    
    for (const providerName of priorityOrder) {
      if (this.availableProviders.includes(providerName)) {
        this.primaryProvider = providerName;
        break;
      }
    }
    
    if (!this.primaryProvider) {
      this.primaryProvider = 'local';
    }
  }

  private applyEnvironmentConfig(): void {
    const envConfig = ENVIRONMENT_CONFIG[this.environment];
    
    if (envConfig.debug) {
      console.log('🔍 Debug mode enabled');
      if (typeof window !== 'undefined') {
        (window as any).fitnessLLMDebug = true;
      }
    }
    
    if (envConfig.verbose) {
      console.log('📝 Verbose logging enabled');
    }
  }

  private setupMetrics(): void {
    // Initialize provider usage tracking
    for (const provider of this.availableProviders) {
      this.metrics.providerUsage[provider] = 0;
    }
  }

  private showSetupGuidance(): void {
    const hasExternalProvider = this.availableProviders.some(p => p !== 'local');
    
    if (!hasExternalProvider && this.environment === 'development') {
      console.log(
        '\n🔑 FREE API SETUP GUIDE:\n' +
        '1. Get OpenRouter API key: https://openrouter.ai/keys (Recommended)\n' +
        '2. Get Groq API key: https://console.groq.com/keys (Fastest)\n' +
        '3. Get Google AI key: https://makersuite.google.com/app/apikey\n\n' +
        'Add to your .env file:\n' +
        'VITE_OPENROUTER_API_KEY=your_key_here\n' +
        'VITE_GROQ_API_KEY=your_key_here\n' +
        'VITE_GOOGLE_AI_API_KEY=your_key_here\n'
      );
    }
  }

  // =====================================================================================
  // 🔧 PUBLIC API METHODS
  // =====================================================================================

  public getProvider(name: ProviderName): Provider | null {
    return OPTIMAL_API_PROVIDERS[name] || null;
  }

  public getAvailableProviders(): ProviderName[] {
    return [...this.availableProviders];
  }

  public getPrimaryProvider(): Provider | null {
    return this.primaryProvider ? this.getProvider(this.primaryProvider) : null;
  }

  public getOptimalProvider(messageType: MessageType): ProviderName {
    const preferredProvider = ROUTING_STRATEGY[messageType] as ProviderName || ROUTING_STRATEGY.general as ProviderName;
    
    // Check if preferred provider is available
    if (this.availableProviders.includes(preferredProvider)) {
      return preferredProvider;
    }
    
    // Fallback to primary provider
    if (this.primaryProvider && this.availableProviders.includes(this.primaryProvider)) {
      return this.primaryProvider;
    }
    
    // Last resort - return first available
    return this.availableProviders[0] || 'local';
  }

  public getFallbackChain(excludeProvider?: ProviderName): ProviderName[] {
    return ROUTING_STRATEGY.fallbackChain
      .filter((provider: ProviderName) => 
        this.availableProviders.includes(provider) && 
        provider !== excludeProvider
      );
  }

  public isConfigured(): boolean {
    return this.initialized && this.availableProviders.length > 0;
  }

  public getStatus() {
    return {
      initialized: this.initialized,
      environment: this.environment,
      availableProviders: this.availableProviders,
      primaryProvider: this.primaryProvider,
      hasExternalAPIs: this.availableProviders.some(p => p !== 'local'),
      metrics: { ...this.metrics },
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.metrics.startTime
    };
  }

  // Metrics tracking
  public recordRequest(provider: ProviderName, responseTime?: number, success: boolean = true): void {
    this.metrics.requestCount++;
    
    if (success) {
      this.metrics.successCount++;
    } else {
      this.metrics.errorCount++;
    }
    
    if (this.metrics.providerUsage[provider] !== undefined) {
      this.metrics.providerUsage[provider]++;
    }
    
    if (responseTime) {
      this.metrics.responseTime.total += responseTime;
      this.metrics.responseTime.count++;
      this.metrics.responseTime.average = 
        this.metrics.responseTime.total / this.metrics.responseTime.count;
    }
  }

  // Health check
  public healthCheck(): HealthCheckResult {
    const status = this.getStatus();
    const isHealthy = status.initialized && status.availableProviders.length > 0;
    
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      details: {
        initialized: status.initialized,
        availableProviders: status.availableProviders,
        hasExternalAPIs: status.hasExternalAPIs,
        uptime: status.uptime
      }
    };
  }

  // Debug information
  public debug(): void {
    console.group('🔍 Fitness LLM Configuration Debug');
    console.table(this.getStatus());
    console.table(
      this.availableProviders.map(name => ({
        provider: name,
        priority: OPTIMAL_API_PROVIDERS[name]?.priority || 0,
        quality: OPTIMAL_API_PROVIDERS[name]?.quality || 0,
        available: OPTIMAL_API_PROVIDERS[name]?.available || false,
        usage: this.metrics.providerUsage[name] || 0
      }))
    );
    console.groupEnd();
  }

  // Getters for private properties
  public get Environment(): Environment {
    return this.environment;
  }

  public get IsInitialized(): boolean {
    return this.initialized;
  }

  public get Metrics(): ConfigManagerMetrics {
    return { ...this.metrics };
  }
}

// =====================================================================================
// 🚀 CREATE SINGLETON INSTANCE
// =====================================================================================

const configManager = new FitnessLLMConfigManager();

// =====================================================================================
// 🛡️ MAIN CONFIG EXPORT
// =====================================================================================

const config: LLMConfig & {
  manager: FitnessLLMConfigManager;
  getProvider: (name: ProviderName) => Provider | null;
  getAvailableProviders: () => ProviderName[];
  getPrimaryProvider: () => Provider | null;
  getOptimalProvider: (type: MessageType) => ProviderName;
  getFallbackChain: (exclude?: ProviderName) => ProviderName[];
  isConfigured: () => boolean;
  getStatus: () => ReturnType<FitnessLLMConfigManager['getStatus']>;
  healthCheck: () => HealthCheckResult;
  debug: () => void;
  hasApiKey: (provider: ProviderName) => boolean;
  canUseProvider: (provider: ProviderName) => boolean;
  recordRequest: (provider: ProviderName, responseTime?: number, success?: boolean) => void;
  isDevelopment: () => boolean;
  isProduction: () => boolean;
} = {
  // Core configurations
  routing: ROUTING_STRATEGY,
  providers: OPTIMAL_API_PROVIDERS,
  fallbacks: ROUTING_STRATEGY.fallbackChain,
  caching: PERFORMANCE_CONFIG.caching,
  security: SECURITY_CONFIG,
  analytics: {},
  performance: PERFORMANCE_CONFIG,
  environment: ENVIRONMENT_CONFIG,
  
  // Manager instance
  manager: configManager,
  
  // Convenience methods for easy access
  getProvider: (name: ProviderName) => configManager.getProvider(name),
  getAvailableProviders: () => configManager.getAvailableProviders(),
  getPrimaryProvider: () => configManager.getPrimaryProvider(),
  getOptimalProvider: (type: MessageType) => configManager.getOptimalProvider(type),
  getFallbackChain: (exclude?: ProviderName) => configManager.getFallbackChain(exclude),
  isConfigured: () => configManager.isConfigured(),
  getStatus: () => configManager.getStatus(),
  healthCheck: () => configManager.healthCheck(),
  debug: () => configManager.debug(),
  
  // Validation helpers
  hasApiKey: (provider: ProviderName) => {
    const p = OPTIMAL_API_PROVIDERS[provider];
    return p && (Boolean(p.apiKey) || provider === 'local');
  },
  
  canUseProvider: (provider: ProviderName) => {
    return configManager.getAvailableProviders().includes(provider);
  },
  
  // Metrics
  recordRequest: (provider: ProviderName, responseTime?: number, success?: boolean) => 
    configManager.recordRequest(provider, responseTime, success),
  
  // Environment helpers
  isDevelopment: () => configManager.Environment === 'development',
  isProduction: () => configManager.Environment === 'production'
};

// Make config available globally for debugging in development
if (typeof window !== 'undefined' && configManager.Environment === 'development') {
  (window as any).fitnessLLMConfig = config;
}

// =====================================================================================
// 🎯 INITIALIZATION COMPLETE MESSAGE
// =====================================================================================

// Show final status after a short delay to ensure all setup is complete
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const status = config.getStatus();
    
    if (status.initialized) {
      console.log('🚀 AI Fitness Coach LLM Configuration Ready!');
      
      if (status.hasExternalAPIs) {
        console.log('✨ External AI providers configured - full functionality available');
      } else {
        console.log('📚 Running with local knowledge - add API keys for enhanced responses');
      }
    } else {
      console.error('❌ Configuration failed to initialize properly');
    }
  }, 100);
}

// =====================================================================================
// 🚀 EXPORTS
// =====================================================================================

// Default export
export default config;

// Named exports
export {
  configManager,
  FitnessLLMConfigManager,
  ROUTING_STRATEGY,
  OPTIMAL_API_PROVIDERS,
  SECURITY_CONFIG,
  PERFORMANCE_CONFIG,
  ENVIRONMENT_CONFIG
};

// Re-export types for convenience
export type {
  ProviderName,
  MessageType,
  Environment,
  Provider,
  ApiProviders,
  RoutingStrategy,
  SecurityConfig,
  PerformanceConfig,
  EnvironmentConfig,
  ConfigManagerMetrics,
  HealthCheckResult,
  InitializationOptions,
  LLMConfig
} from '../types/llmTypes';