// 🔧 API CONFIGURATION - ALL FREE PROVIDERS
// Created by Himanshu (himanshu1614)
// Manages all API providers with smart routing and fallbacks

// =====================================================================================
// 🏆 FREE API PROVIDERS CONFIGURATION
// =====================================================================================

export const API_PROVIDERS = {
  // PRIMARY: OpenRouter - Access to DeepSeek R1 (671B params) for FREE
  openRouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    models: {
      // Best free models available
      deepseekR1: 'deepseek/deepseek-r1:free',           // Reasoning model (GPT-4 level)
      deepseekV3: 'deepseek/deepseek-v3:free',           // Chat model (685B params)
      mistralSmall: 'mistralai/mistral-small-3.1:free',  // 24B params, multimodal
      llamaMaverick: 'meta-llama/llama-4-maverick:free', // 400B params MoE
      optimusAlpha: 'openrouter/optimus-alpha:free'      // OpenRouter's own model
    },
    limits: {
      requestsPerMinute: 20,
      requestsPerDay: 200,
      resetTime: 'daily'
    },
    priority: 1,
    cost: 0,
    quality: 5,
    description: 'Best free models including DeepSeek R1'
  },

  // SECONDARY: Groq - Ultra-fast inference with LPU technology
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    models: {
      mixtral: 'mixtral-8x7b-32768',    // 8x7B MoE, 32K context
      llama3: 'llama3-70b-8192',        // 70B params, 8K context
      llama3_8b: 'llama3-8b-8192'       // 8B params, faster
    },
    limits: {
      requestsPerDay: 1000,
      tokensPerMinute: 6000,
      resetTime: 'daily'
    },
    priority: 2,
    cost: 0,
    quality: 4,
    description: 'Ultra-fast inference (18x faster than GPUs)'
  },

  // TERTIARY: Google AI Studio - High volume backup
  googleAI: {
    name: 'GoogleAI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: import.meta.env.VITE_GOOGLE_AI_KEY,
    models: {
      geminiFlash: 'gemini-1.5-flash',     // Fast and efficient
      geminiPro: 'gemini-1.5-pro'         // More capable
    },
    limits: {
      tokensPerMinute: 1000000,  // 1M tokens!
      requestsPerDay: 1500,
      resetTime: 'daily'
    },
    priority: 3,
    cost: 0,
    quality: 4,
    description: 'High token limits for heavy usage'
  }
}

// =====================================================================================
// 🎯 SMART ROUTING RULES
// =====================================================================================

export const ROUTING_RULES = {
  // Route different request types to optimal models
  exercise_form: 'deepseekR1',      // Best reasoning for form analysis
  workout_planning: 'deepseekV3',   // Best for structured planning
  motivation: 'mistralSmall',       // Good for emotional content
  nutrition: 'deepseekV3',          // Science-based nutrition advice
  emergency: 'mixtral',             // Fastest response for safety
  injury_assessment: 'deepseekR1',  // Reasoning for injury analysis
  progress_tracking: 'deepseekV3',  // Data analysis and insights
  general: 'deepseekV3',            // Default for general questions
  
  // Fallback chain when primary model unavailable
  fallback_chain: ['deepseekR1', 'deepseekV3', 'mixtral', 'geminiFlash']
}

// =====================================================================================
// 🛡️ SAFETY AND ERROR HANDLING
// =====================================================================================

export const ERROR_MESSAGES = {
  // User-friendly error messages
  API_KEY_MISSING: 'AI features need API keys. The coach works great with built-in knowledge too!',
  RATE_LIMIT: 'Taking a quick break to avoid rate limits. Try again in a moment! ⏰',
  NETWORK_ERROR: 'Connection hiccup! Using built-in knowledge instead. 🏠',
  UNKNOWN_ERROR: 'Something unexpected happened, but your built-in coach is still here! 🤖',
  MODEL_OVERLOADED: 'AI model is busy. Switching to backup system... 🔄',
  INVALID_RESPONSE: 'Got a weird response from AI. Let me try that again! 🔄',
  CONTEXT_TOO_LONG: 'Message too long! Try breaking it into smaller questions. ✂️'
}

export const SAFETY_KEYWORDS = {
  // Medical emergency keywords that trigger immediate safety protocols
  emergency: [
    'chest pain', 'heart attack', 'can\'t breathe', 'severe pain',
    'unconscious', 'bleeding heavily', 'broken bone', 'emergency'
  ],
  
  // Injury-related keywords requiring caution
  injury: [
    'sharp pain', 'sudden pain', 'swelling', 'can\'t move',
    'numbness', 'tingling', 'dizzy', 'nauseous'
  ],
  
  // Medical conditions requiring special consideration
  medical_conditions: [
    'diabetes', 'heart condition', 'high blood pressure', 'pregnancy',
    'surgery', 'medication', 'doctor said', 'physical therapy'
  ]
}

// =====================================================================================
// 🎯 MODEL SELECTION LOGIC
// =====================================================================================

export const MODEL_SELECTION = {
  // Criteria for selecting the best model for each task
  criteria: {
    speed: ['mixtral', 'llama3_8b', 'geminiFlash'],
    reasoning: ['deepseekR1', 'deepseekV3', 'geminiPro'],
    creativity: ['mistralSmall', 'deepseekV3', 'geminiPro'],
    factual: ['deepseekV3', 'geminiPro', 'mixtral'],
    safety: ['deepseekR1', 'geminiPro', 'deepseekV3']
  },
  
  // Context length requirements
  context_requirements: {
    short: ['llama3_8b', 'mixtral'],      // < 2K tokens
    medium: ['deepseekV3', 'geminiFlash'], // 2K-8K tokens  
    long: ['mixtral', 'geminiPro']         // > 8K tokens
  }
}

// =====================================================================================
// 📊 ANALYTICS AND MONITORING
// =====================================================================================

export const ANALYTICS_CONFIG = {
  // Track API usage and performance
  track_events: [
    'api_call_success',
    'api_call_failure', 
    'model_switch',
    'rate_limit_hit',
    'emergency_detected',
    'user_satisfaction'
  ],
  
  // Performance thresholds
  performance_thresholds: {
    response_time_warning: 5000,    // 5 seconds
    response_time_critical: 10000,  // 10 seconds
    error_rate_warning: 0.05,       // 5%
    error_rate_critical: 0.1        // 10%
  }
}

// =====================================================================================
// 🔄 RETRY AND FALLBACK LOGIC
// =====================================================================================

export const RETRY_CONFIG = {
  // How many times to retry failed requests
  max_retries: 3,
  
  // Delay between retries (exponential backoff)
  retry_delays: [1000, 2000, 4000], // 1s, 2s, 4s
  
  // Which errors are worth retrying
  retryable_errors: [
    'network_error',
    'timeout', 
    'rate_limit',
    'server_error'
  ],
  
  // Which errors should immediately fallback to local
  immediate_fallback_errors: [
    'api_key_invalid',
    'model_not_found',
    'context_too_long'
  ]
}

// =====================================================================================
// 🎨 PROMPT OPTIMIZATION
// =====================================================================================

export const PROMPT_TEMPLATES = {
  // Optimized system prompts for different providers
  openrouter: {
    fitness_coach: 'You are an expert fitness coach. Provide safe, evidence-based advice with enthusiasm.',
    form_analyst: 'You are a biomechanics expert. Analyze exercise form with precision and safety focus.',
    motivator: 'You are an inspiring fitness motivator. Be encouraging and help users stay committed.',
    nutritionist: 'You are a registered dietitian. Provide science-based nutrition guidance.'
  },
  
  groq: {
    // Shorter prompts for faster inference
    fitness_coach: 'Expert fitness coach. Safe, practical advice.',
    form_analyst: 'Biomechanics expert. Form analysis and safety.',
    motivator: 'Fitness motivator. Encourage and inspire.',
    nutritionist: 'Dietitian. Evidence-based nutrition advice.'
  },
  
  google: {
    // More detailed prompts for Google's models
    fitness_coach: 'You are a certified personal trainer with expertise in exercise science, nutrition, and motivational coaching. Provide comprehensive, safe, and evidence-based fitness guidance.',
    form_analyst: 'You are a movement specialist with deep knowledge of biomechanics and injury prevention. Analyze exercise form with detailed safety considerations.',
    motivator: 'You are a sports psychologist specializing in fitness motivation. Help users overcome barriers and maintain consistency.',
    nutritionist: 'You are a registered dietitian with specialization in sports nutrition. Provide detailed, science-based dietary guidance.'
  }
}

// =====================================================================================
// 🌍 ENVIRONMENT CONFIGURATION
// =====================================================================================

export const ENVIRONMENT_CONFIG = {
  // Different configs for development vs production
  development: {
    debug_mode: true,
    verbose_logging: true,
    api_timeout: 30000,
    cache_duration: 300000 // 5 minutes
  },
  
  production: {
    debug_mode: false,
    verbose_logging: false,
    api_timeout: 10000,
    cache_duration: 3600000 // 1 hour
  },
  
  // Feature flags
  features: {
    voice_integration: false,        // Future feature
    image_analysis: false,           // Future feature
    advanced_analytics: true,
    emergency_protocols: true,
    buy_me_coffee: true
  }
}

// =====================================================================================
// 🚀 EXPORT CONFIGURATION
// =====================================================================================

// Helper function to get current environment config
export const getEnvironmentConfig = () => {
  const env = import.meta.env.MODE || 'development'
  return ENVIRONMENT_CONFIG[env] || ENVIRONMENT_CONFIG.development
}

// Helper function to check if feature is enabled
export const isFeatureEnabled = (feature) => {
  return ENVIRONMENT_CONFIG.features[feature] || false
}

// Helper function to get optimal model for request type
export const getOptimalModel = (requestType, provider = 'openRouter') => {
  const modelKey = ROUTING_RULES[requestType] || ROUTING_RULES.general
  const providerConfig = API_PROVIDERS[provider]
  
  if (!providerConfig || !providerConfig.models[modelKey]) {
    // Fallback to first available model
    return Object.values(providerConfig?.models || {})[0] || 'deepseek/deepseek-v3:free'
  }
  
  return providerConfig.models[modelKey]
}

// Helper function to validate API configuration
export const validateAPIConfig = () => {
  const issues = []
  
  // Check if at least one API key is configured
  const hasAPIKey = Object.values(API_PROVIDERS).some(provider => provider.apiKey)
  
  if (!hasAPIKey) {
    issues.push('No API keys configured - app will run in local-only mode')
  }
  
  // Check individual providers
  Object.entries(API_PROVIDERS).forEach(([name, config]) => {
    if (!config.apiKey) {
      issues.push(`${name} API key not configured`)
    }
    
    if (!config.models || Object.keys(config.models).length === 0) {
      issues.push(`${name} has no models configured`)
    }
  })
  
  return {
    isValid: issues.length === 0,
    issues,
    hasPartialConfig: hasAPIKey
  }
}

// Export everything
export default {
  API_PROVIDERS,
  ROUTING_RULES,
  ERROR_MESSAGES,
  SAFETY_KEYWORDS,
  MODEL_SELECTION,
  ANALYTICS_CONFIG,
  RETRY_CONFIG,
  PROMPT_TEMPLATES,
  ENVIRONMENT_CONFIG,
  getEnvironmentConfig,
  isFeatureEnabled,
  getOptimalModel,
  validateAPIConfig
}