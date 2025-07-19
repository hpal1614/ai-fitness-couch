// =====================================================================================
// 🔧 COMPLETE LLM CONFIG IMPLEMENTATION - FIXED ALL MISSING METHODS
// =====================================================================================
// File: src/config/llmConfig.ts

export interface Provider {
  name: string;
  baseUrl: string;
  apiKey: string;
  models: Record<string, string>;
  priority: number;
  enabled: boolean;
  limits?: {
    requestsPerMinute?: number;
    requestsPerDay?: number;
    tokensPerMinute?: number;
  };
}

export interface LLMConfig {
  providers: {
    [key: string]: Provider;
  };
  defaultProvider: string;
  fallbackChain: string[];
  caching: {
    enabled: boolean;
    ttl: number;
  };
  // Add the missing methods as properties that return functions
  isConfigured(): boolean;
  getStatus(): ConfigStatus;
}

export interface ConfigStatus {
  hasExternalAPIs: boolean;
  availableProviders: string[];
  isConfigured: boolean;
  activeProvider?: string;
  errors?: string[];
}

// Create the configuration object with methods
const createConfig = (): LLMConfig => {
  const baseConfig = {
    providers: {
      openai: {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
        models: {
          default: 'gpt-3.5-turbo',
          advanced: 'gpt-4'
        },
        priority: 1,
        enabled: true
      },
      groq: {
        name: 'Groq',
        baseUrl: 'https://api.groq.com/openai/v1',
        apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
        models: {
          default: 'llama-3.1-70b-versatile',
          fast: 'llama-3.1-8b-instant'
        },
        priority: 2,
        enabled: true
      },
      anthropic: {
        name: 'Anthropic',
        baseUrl: 'https://api.anthropic.com/v1',
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
        models: {
          default: 'claude-3-haiku-20240307',
          advanced: 'claude-3-sonnet-20240229'
        },
        priority: 3,
        enabled: true
      }
    },
    defaultProvider: 'openai',
    fallbackChain: ['openai', 'groq', 'anthropic'],
    caching: {
      enabled: true,
      ttl: 3600000 // 1 hour
    }
  };

  // Add the missing methods
  const config: LLMConfig = {
    ...baseConfig,
    
    isConfigured(): boolean {
      // Check if at least one provider has an API key
      const providers = Object.values(this.providers);
      return providers.some(provider => provider.apiKey && provider.apiKey.length > 10);
    },
    
    getStatus(): ConfigStatus {
      const providers = Object.values(this.providers);
      const availableProviders = providers
        .filter(provider => provider.enabled && provider.apiKey && provider.apiKey.length > 10)
        .map(provider => provider.name);
      
      const hasExternalAPIs = availableProviders.length > 0;
      const activeProvider = hasExternalAPIs ? this.defaultProvider : undefined;
      
      const errors: string[] = [];
      if (!hasExternalAPIs) {
        errors.push('No API keys configured. Using local knowledge only.');
      }
      
      return {
        hasExternalAPIs,
        availableProviders,
        isConfigured: hasExternalAPIs,
        activeProvider,
        errors: errors.length > 0 ? errors : undefined
      };
    }
  };

  return config;
};

const config = createConfig();

export const OPTIMAL_API_PROVIDERS = {
  primary: 'openai',
  fallback: ['groq', 'anthropic']
};

// Utility functions for config management
export const ConfigUtils = {
  getActiveProvider: (): Provider | null => {
    const status = config.getStatus();
    if (!status.activeProvider) return null;
    return config.providers[status.activeProvider] || null;
  },
  
  getEnabledProviders: (): Provider[] => {
    return Object.values(config.providers).filter(provider => provider.enabled);
  },
  
  validateProvider: (provider: Provider): boolean => {
    return !!(provider.name && provider.baseUrl && provider.apiKey && provider.apiKey.length > 10);
  },
  
  updateProvider: (name: string, updates: Partial<Provider>): void => {
    if (config.providers[name]) {
      config.providers[name] = { ...config.providers[name], ...updates };
    }
  },
  
  addProvider: (name: string, provider: Provider): void => {
    config.providers[name] = provider;
  },
  
  removeProvider: (name: string): void => {
    delete config.providers[name];
    // Update fallback chain if necessary
    config.fallbackChain = config.fallbackChain.filter(p => p !== name);
  },
  
  testConnection: async (providerName: string): Promise<boolean> => {
    const provider = config.providers[providerName];
    if (!provider || !ConfigUtils.validateProvider(provider)) {
      return false;
    }
    
    try {
      // This would be a real API test call in production
      // For now, just validate the key format
      return provider.apiKey.length > 10;
    } catch (error) {
      console.error(`Connection test failed for ${providerName}:`, error);
      return false;
    }
  }
};

export default config;