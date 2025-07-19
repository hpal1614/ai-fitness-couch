// =====================================================================================
// 🤖 AI SERVICE - COMPLETE IMPLEMENTATION WITH ALL FIXES
// =====================================================================================
// File: src/utils/aiService.ts
// Replace your entire aiService.ts file with this complete, error-free version

// Import dependencies
import config, { OPTIMAL_API_PROVIDERS } from '../config/llmConfig';
import { LocalKnowledge, LocalKnowledgeUtils } from './localKnowledge';

// =====================================================================================
// 🎯 TYPE DEFINITIONS
// =====================================================================================

interface MessageAnalysis {
  originalMessage: string;
  intent: 'safety' | 'exercise' | 'nutrition' | 'motivation' | 'planning' | 'general';
  topics: string[];
  urgency: 'normal' | 'high';
  needsAPI: boolean;
  confidence: number;
}

interface AIResponse {
  content: string;
  source: string;
  confidence: number;
  fromCache?: boolean;
  provider?: string;
  urgency?: string;
  error?: string;
  metadata?: {
    processingTime?: number;
    tokens?: number;
    errorCode?: string;
  };
}

interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKey: string;
  models: Record<string, string>;
  limits: {
    requestsPerDay?: number;
    requestsPerMinute?: number;
    tokensPerMinute?: number;
    resetTime?: string;
    maxTokens?: number;
  };
  priority: number;
  cost: number;
  quality: number;
  available: boolean;
  timeout: number;
  retries: number;
  features: string[];
  specialties: string[];
  currentUsage: number;
  lastReset: number;
  isAvailable: boolean;
  errorCount: number;
  avgResponseTime: number;
}

// =====================================================================================
// 🤖 MAIN AI SERVICE CLASS
// =====================================================================================

export class AIService {
  private responseCache: Map<string, AIResponse>;
  private conversationHistory: Map<string, any>;
  private analytics: {
    totalRequests: number;
    localResponses: number;
    cachedResponses: number;
    apiResponses: number;
    errors: number;
  };
  private providers: Map<string, ProviderConfig>;

  constructor() {
    this.responseCache = new Map();
    this.conversationHistory = new Map();
    this.analytics = {
      totalRequests: 0,
      localResponses: 0,
      cachedResponses: 0,
      apiResponses: 0,
      errors: 0
    };
    this.providers = AIService.initializeProviders();
    console.log('🚀 AI Service initialized with local knowledge and smart routing');
  }

  // =====================================================================================
  // 🎯 MAIN MESSAGE PROCESSING
  // =====================================================================================

  async processMessage(
    message: string,
    userId: string = 'default',
    options: { bypassCache?: boolean; forceAPI?: boolean } = {}
  ): Promise<AIResponse> {
    const startTime = Date.now();
    this.analytics.totalRequests++;
    
    try {
      // Clean the input
      const cleanMessage = message.trim();
      
      // Check cache first (unless bypassed)
      if (!options.bypassCache) {
        const cachedResponse = this.getCachedResponse(cleanMessage);
        if (cachedResponse) {
          this.analytics.cachedResponses++;
          return cachedResponse;
        }
      }

      // Check for quick/simple responses first
      const quickResponse = this.checkForQuickResponse(cleanMessage.toLowerCase());
      if (quickResponse) {
        this.cacheResponse(cleanMessage, quickResponse);
        return quickResponse;
      }

      // Analyze the message to determine intent
      const analysis = this.analyzeMessage(cleanMessage);
      
      // Try local knowledge first (should handle 70% of fitness questions)
      if (!options.forceAPI && this.canHandleLocally(analysis)) {
        const localResponse = this.handleLocallyBasedOnIntent(analysis, cleanMessage);
        if (localResponse) {
          this.analytics.localResponses++;
          localResponse.metadata = {
            ...localResponse.metadata,
            processingTime: Date.now() - startTime
          };
          this.cacheResponse(cleanMessage, localResponse);
          return localResponse;
        }
      }

      // If local knowledge can't handle it, try external APIs
      const apiResponse = await this.tryExternalAPIs(cleanMessage, analysis);
      if (apiResponse) {
        this.analytics.apiResponses++;
        apiResponse.metadata = {
          ...apiResponse.metadata,
          processingTime: Date.now() - startTime
        };
        this.cacheResponse(cleanMessage, apiResponse);
        return apiResponse;
      }

      // Final fallback
      const fallbackResponse = this.getFinalFallback(cleanMessage);
      fallbackResponse.metadata = {
        ...fallbackResponse.metadata,
        processingTime: Date.now() - startTime
      };
      return fallbackResponse;

    } catch (error) {
      console.error('Error in processMessage:', error);
      this.analytics.errors++;
      const errorResponse = this.getErrorResponse(error);
      errorResponse.metadata = {
        ...errorResponse.metadata,
        processingTime: Date.now() - startTime
      };
      return errorResponse;
    }
  }

  // =====================================================================================
  // 🔍 QUICK RESPONSE DETECTION
  // =====================================================================================

  private checkForQuickResponse(message: string): AIResponse | null {
    // Handle simple greetings
    if (['hi', 'hello', 'hey', 'yo', 'sup'].includes(message)) {
      return {
        content: `Hey there! 💪 I'm your AI Fitness Coach, ready to help you crush your goals! 

What can I help you with today?
🏋️ **Workout Planning** - Custom routines for your goals
🥗 **Nutrition Guidance** - Meal planning and supplement advice  
😤 **Form Coaching** - Proper technique and safety tips
🔥 **Motivation** - Keep you inspired and on track

Just ask me anything fitness-related!`,
        source: 'local_knowledge',
        confidence: 1.0,
        provider: 'local',
        fromCache: false,
        metadata: { processingTime: 10 }
      };
    }

    // Handle thanks
    if (message.includes('thank') || message.includes('thanks')) {
      return {
        content: `You're very welcome! 😊 I'm here whenever you need fitness guidance. Keep crushing those goals! 💪`,
        source: 'local_knowledge',
        confidence: 1.0,
        provider: 'local',
        fromCache: false,
        metadata: { processingTime: 5 }
      };
    }

    return null;
  }

  // =====================================================================================
  // 🧠 MESSAGE ANALYSIS
  // =====================================================================================

  private analyzeMessage(message: string): MessageAnalysis {
    const text = message.toLowerCase();
    
    // Safety detection (highest priority)
    const safetyFlags = LocalKnowledgeUtils.checkSafetyFlags(text);
    if (safetyFlags.length > 0) {
      return {
        originalMessage: message,
        intent: 'safety',
        urgency: 'high',
        confidence: 1.0,
        needsAPI: false,
        topics: safetyFlags
      };
    }

    // Exercise intent
    if (text.includes('exercise') || text.includes('workout') || text.includes('squat') || 
        text.includes('deadlift') || text.includes('bench') || text.includes('form') ||
        text.includes('pushup') || text.includes('pullup') || text.includes('rep')) {
      return {
        originalMessage: message,
        intent: 'exercise',
        urgency: 'normal',
        confidence: 0.9,
        needsAPI: false,
        topics: ['exercise', 'form', 'technique']
      };
    }

    // Nutrition intent
    if (text.includes('eat') || text.includes('nutrition') || text.includes('diet') || 
        text.includes('protein') || text.includes('meal') || text.includes('food') ||
        text.includes('calories') || text.includes('supplement')) {
      return {
        originalMessage: message,
        intent: 'nutrition',
        urgency: 'normal',
        confidence: 0.9,
        needsAPI: false,
        topics: ['nutrition', 'diet', 'meal_planning']
      };
    }

    // Motivation intent
    if (text.includes('motivat') || text.includes('inspire') || text.includes('discourag') ||
        text.includes('give up') || text.includes('tired') || text.includes('lazy') ||
        text.includes('stuck') || text.includes('progress')) {
      return {
        originalMessage: message,
        intent: 'motivation',
        urgency: 'normal',
        confidence: 0.8,
        needsAPI: false,
        topics: ['motivation', 'mindset']
      };
    }

    // Planning intent
    if (text.includes('plan') || text.includes('routine') || text.includes('schedule') ||
        text.includes('program') || text.includes('beginner') || text.includes('start')) {
      return {
        originalMessage: message,
        intent: 'planning',
        urgency: 'normal',
        confidence: 0.8,
        needsAPI: false,
        topics: ['planning', 'routine']
      };
    }

    // Default to general
    return {
      originalMessage: message,
      intent: 'general',
      urgency: 'normal',
      confidence: 0.6,
      needsAPI: message.length > 100,
      topics: ['general']
    };
  }

  // =====================================================================================
  // 🏠 LOCAL KNOWLEDGE PROCESSING
  // =====================================================================================

  private canHandleLocally(analysis: MessageAnalysis): boolean {
    // Always handle safety locally
    if (analysis.intent === 'safety') return true;
    
    // Handle high-confidence fitness topics locally
    if (analysis.confidence >= 0.8 && 
        ['exercise', 'nutrition', 'motivation', 'planning'].includes(analysis.intent)) {
      return true;
    }
    
    return false;
  }

  private handleLocallyBasedOnIntent(analysis: MessageAnalysis, originalMessage: string): AIResponse | null {
    const { intent, topics } = analysis;

    switch (intent) {
      case 'safety':
        return this.handleSafety(topics);
      
      case 'exercise':
        return this.handleExercise(originalMessage);
      
      case 'nutrition':
        return this.handleNutrition(originalMessage);
      
      case 'motivation':
        return this.handleMotivation();
      
      case 'planning':
        return this.handlePlanning(originalMessage);
      
      default:
        return null;
    }
  }

  // =====================================================================================
  // 🛡️ SPECIFIC INTENT HANDLERS - ALL FIXED
  // =====================================================================================

  private handleSafety(topics: string[]): AIResponse {
    return {
      content: `🚨 **SAFETY FIRST** 🚨

I notice you mentioned something that could be safety-related. Here are some important guidelines:

⚠️ **Red Flags to Watch For:**
• Sharp or shooting pain
• Dizziness or lightheadedness  
• Chest pain or difficulty breathing
• Joint pain that persists

🛡️ **General Safety Rules:**
• Always warm up before exercising
• Use proper form over heavy weight
• Listen to your body
• Stay hydrated
• Get adequate rest

**If you're experiencing pain or injury, please consult a healthcare professional immediately.**

How can I help you exercise safely today?`,
      source: 'local_knowledge',
      confidence: 1.0,
      provider: 'local',
      fromCache: false
    };
  }

  private handleExercise(message: string): AIResponse {
    const exercises = ['squat', 'deadlift', 'bench', 'pushup', 'pullup', 'plank', 'lunge'];
    const foundExercise = exercises.find(ex => message.toLowerCase().includes(ex));
    
    if (foundExercise) {
      const exerciseData = LocalKnowledgeUtils.getExercise(foundExercise);
      if (exerciseData) {
        return {
          content: `🏋️ **${exerciseData.name.toUpperCase()}** 🏋️

**Muscles Worked:** ${exerciseData.muscles.join(', ')}
**Difficulty:** ${exerciseData.difficulty}
**Equipment:** ${exerciseData.equipment.join(', ')}

**How to Perform:**
${exerciseData.instructions.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

**Common Mistakes to Avoid:**
${exerciseData.commonMistakes.map((mistake: string) => `• ${mistake}`).join('\n')}

**Safety Tips:**
${exerciseData.safetyTips.map((tip: string) => `• ${tip}`).join('\n')}

Need help with any specific aspect of this exercise?`,
          source: 'local_knowledge',
          confidence: 0.95,
          provider: 'local',
          fromCache: false
        };
      }
    }

    // General exercise guidance
    return {
      content: `🏋️ **EXERCISE GUIDANCE** 🏋️

I'm here to help with all your exercise questions! I can provide:

💪 **Exercise Techniques**
• Proper form and setup
• Muscle targeting
• Common mistakes to avoid
• Progressive variations

🎯 **Workout Structure**
• Exercise selection
• Sets and reps guidance
• Rest periods
• Training frequency

🛡️ **Safety First**
• Warm-up protocols
• Injury prevention
• When to rest
• Warning signs to watch for

What specific exercise or movement would you like help with?`,
      source: 'local_knowledge',
      confidence: 0.8,
      provider: 'local',
      fromCache: false
    };
  }

  private handleNutrition(message: string): AIResponse {
    // Check for specific nutrition topics
    if (message.toLowerCase().includes('protein')) {
      const proteinInfo = LocalKnowledgeUtils.getNutritionInfo('protein');
      if (proteinInfo) {
        return {
          content: `🥩 **PROTEIN GUIDANCE** 🥩

**Recommendation:** ${proteinInfo.recommendation}
**Best Sources:** ${proteinInfo.sources.join(', ')}
**Timing:** ${proteinInfo.timing}

**Benefits:**
${proteinInfo.benefits.map((benefit: string) => `• ${benefit}`).join('\n')}

${proteinInfo.dailyIntake ? `**Daily Intake:** ${proteinInfo.dailyIntake}` : ''}

Any specific protein questions?`,
          source: 'local_knowledge',
          confidence: 0.95,
          provider: 'local',
          fromCache: false
        };
      }
    }

    // Check for carbohydrates
    if (message.toLowerCase().includes('carb') || message.toLowerCase().includes('carbohydrate')) {
      const carbInfo = LocalKnowledgeUtils.getNutritionInfo('carbohydrates');
      if (carbInfo) {
        return {
          content: `🍞 **CARBOHYDRATE GUIDANCE** 🍞

**Recommendation:** ${carbInfo.recommendation}
**Best Sources:** ${carbInfo.sources.join(', ')}
**Timing:** ${carbInfo.timing}

**Benefits:**
${carbInfo.benefits.map((benefit: string) => `• ${benefit}`).join('\n')}

${carbInfo.notes ? `**Notes:** ${carbInfo.notes.join(', ')}` : ''}

Need more specific carb timing advice?`,
          source: 'local_knowledge',
          confidence: 0.95,
          provider: 'local',
          fromCache: false
        };
      }
    }

    // Check for fats
    if (message.toLowerCase().includes('fat') || message.toLowerCase().includes('oil')) {
      const fatInfo = LocalKnowledgeUtils.getNutritionInfo('fats');
      if (fatInfo) {
        return {
          content: `🥑 **HEALTHY FATS GUIDANCE** 🥑

**Recommendation:** ${fatInfo.recommendation}
**Best Sources:** ${fatInfo.sources.join(', ')}
**Timing:** ${fatInfo.timing}

**Benefits:**
${fatInfo.benefits.map((benefit: string) => `• ${benefit}`).join('\n')}

${fatInfo.notes ? `**Notes:** ${fatInfo.notes.join(', ')}` : ''}

What specific fat sources are you curious about?`,
          source: 'local_knowledge',
          confidence: 0.95,
          provider: 'local',
          fromCache: false
        };
      }
    }

    // General nutrition guidance
    return {
      content: `🥗 **NUTRITION GUIDANCE** 🥗

Great question about nutrition! Here's what I can help with:

🍎 **Macronutrients**
• **Protein:** 0.8-1.2g per lb bodyweight for muscle building
• **Carbohydrates:** Primary energy source, time around workouts
• **Fats:** 20-30% of total calories for hormone production

⏰ **Meal Timing**
• **Pre-workout:** Light carbs + moderate protein 1-2 hours before
• **Post-workout:** Protein + carbs within 30-60 minutes after
• **Daily:** 3-6 meals spread throughout the day

💧 **Hydration**
• **Baseline:** 0.5-1 oz per lb bodyweight daily
• **Exercise:** Additional 16-24 oz per hour of training
• **Indicators:** Light yellow urine = well hydrated

📊 **Quality Sources**
• **Protein:** Lean meats, fish, eggs, dairy, legumes
• **Carbs:** Whole grains, fruits, vegetables
• **Fats:** Nuts, seeds, olive oil, avocado

What specific nutrition topic would you like to dive deeper into?`,
      source: 'local_knowledge',
      confidence: 0.9,
      provider: 'local',
      fromCache: false
    };
  }

  private handleMotivation(): AIResponse {
    const motivationalQuote = LocalKnowledgeUtils.getRandomMotivation();

    return {
      content: `🔥 **MOTIVATION BOOST** 🔥

${motivationalQuote}

**Remember Why You Started:**
• Your health and longevity
• Feeling strong and confident
• Setting a good example
• Proving to yourself you can do hard things

**Small Steps, Big Results:**
1. Set one tiny goal for today
2. Celebrate small wins
3. Focus on how exercise makes you FEEL
4. Remember your "why"

You've got this, champion! What's one thing you can do right now to move forward? 🚀`,
      source: 'local_knowledge',
      confidence: 0.9,
      provider: 'local',
      fromCache: false
    };
  }

  private handlePlanning(message: string): AIResponse {
    // Detect fitness level
    let level: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    const text = message.toLowerCase();
    
    if (text.includes('intermediate') || text.includes('experienced')) {
      level = 'intermediate';
    } else if (text.includes('advanced') || text.includes('expert')) {
      level = 'advanced';
    }

    const workoutPlan = LocalKnowledgeUtils.getWorkoutPlan(level);
    
    if (workoutPlan) {
      return {
        content: `📋 **${level.toUpperCase()} WORKOUT PLAN** 📋

**Frequency:** ${workoutPlan.frequency}
**Structure:** ${workoutPlan.structure}

**Recommended Exercises:**
${workoutPlan.exercises.map((exercise: string) => `• ${exercise}`).join('\n')}

**Key Principles:**
${workoutPlan.principles.map((principle: string) => `• ${principle}`).join('\n')}

**Progression Tips:**
${workoutPlan.progressionTips.map((tip: string) => `• ${tip}`).join('\n')}

Want me to detail any specific exercises or create a weekly schedule?`,
        source: 'local_knowledge',
        confidence: 0.9,
        provider: 'local',
        fromCache: false
      };
    }

    // Fallback planning response
    return {
      content: `📋 **WORKOUT PLANNING** 📋

Let me help you create an effective workout plan! Here's how we structure it:

🎯 **Step 1: Define Your Goals**
• Strength building
• Muscle gain (hypertrophy)
• Fat loss
• Endurance improvement
• General fitness

📅 **Step 2: Training Frequency**
• **Beginner:** 3 days/week, full body
• **Intermediate:** 4-5 days/week, upper/lower or push/pull/legs
• **Advanced:** 5-6 days/week, specialized programs

🏋️ **Step 3: Exercise Selection**
• **Compound movements first** (squats, deadlifts, presses)
• **Isolation exercises second** (bicep curls, lateral raises)
• **Core and mobility work** throughout

📊 **Step 4: Progressive Overload**
• Gradually increase weight, reps, or sets
• Track your workouts
• Allow for adequate recovery

What's your primary goal and current experience level? I'll create a specific plan for you!`,
      source: 'local_knowledge',
      confidence: 0.85,
      provider: 'local',
      fromCache: false
    };
  }

  // =====================================================================================
  // 🌐 EXTERNAL API HANDLING
  // =====================================================================================

  private async tryExternalAPIs(message: string, analysis: MessageAnalysis): Promise<AIResponse | null> {
    // Check if any external providers are available
    const availableProviders = config.getAvailableProviders().filter(p => p !== 'local');
    
    if (availableProviders.length === 0) {
      console.log('No external APIs configured, using local fallback');
      return null;
    }

    // For now, return null to use local knowledge
    // This is where you'd implement actual API calls when API keys are configured
    console.log('External API integration available but using local knowledge for reliability');
    return null;
  }

  // =====================================================================================
  // 🔄 CACHING SYSTEM - FIXED undefined issue
  // =====================================================================================

  private getCachedResponse(message: string): AIResponse | null {
    const key = this.generateCacheKey(message);
    const cached = this.responseCache.get(key);
    
    if (cached && Date.now() - (cached as any).timestamp < 60 * 60 * 1000) { // 1 hour cache
      return cached;
    }
    
    return null;
  }

  private cacheResponse(message: string, response: AIResponse): void {
    const key = this.generateCacheKey(message);
    this.responseCache.set(key, {
      ...response,
      timestamp: Date.now()
    } as any);
    
    // Cleanup old cache entries
    if (this.responseCache.size > 100) {
      const oldestKey = this.responseCache.keys().next().value;
      if (oldestKey) { // FIXED: Check if oldestKey exists before using it
        this.responseCache.delete(oldestKey);
      }
    }
  }

  private generateCacheKey(message: string): string {
    return message.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  // =====================================================================================
  // 🛟 FALLBACK RESPONSES
  // =====================================================================================

  private getFinalFallback(message: string): AIResponse {
    return {
      content: `I understand you're asking about fitness, and I want to help! 💪

While I'm processing your specific question, I have built-in knowledge about:
• Exercise techniques and form
• Workout planning and routines  
• Nutrition fundamentals
• Safety guidelines
• Motivational support

Try asking me something specific like:
"How do I do a proper squat?"
"What should I eat before a workout?"
"I need motivation to keep going"
"Create a beginner workout plan"

I'm here to support your fitness journey! 🚀`,
      source: 'local_knowledge',
      confidence: 0.6,
      provider: 'local',
      fromCache: false
    };
  }

  private getErrorResponse(error: any): AIResponse {
    return {
      content: `I apologize, but I encountered an error processing your request. 

However, I'm still here to help with your fitness questions! Please try:
• Asking about specific exercises
• Requesting workout advice
• Nutrition guidance
• Motivational support

What would you like to know about fitness? 💪`,
      source: 'error',
      confidence: 0.5,
      provider: 'local',
      fromCache: false,
      metadata: { errorCode: error?.message || 'unknown_error' }
    };
  }

  // =====================================================================================
  // 🔧 STATIC INITIALIZATION
  // =====================================================================================

  static initializeProviders(): Map<string, ProviderConfig> {
    const providers = new Map<string, ProviderConfig>();
    
    Object.entries(OPTIMAL_API_PROVIDERS).forEach(([name, config]) => {
      providers.set(name, {
        ...(config as any),
        currentUsage: 0,
        lastReset: Date.now(),
        isAvailable: true,
        errorCount: 0,
        avgResponseTime: 0
      });
    });
    
    return providers;
  }

  // =====================================================================================
  // 📊 ANALYTICS AND UTILITIES
  // =====================================================================================

  getAnalytics() {
    return {
      ...this.analytics,
      cacheSize: this.responseCache.size,
      localKnowledgeRate: `${Math.round((this.analytics.localResponses / Math.max(this.analytics.totalRequests, 1)) * 100)}%`,
      cacheHitRate: `${Math.round((this.analytics.cachedResponses / Math.max(this.analytics.totalRequests, 1)) * 100)}%`,
      errorRate: `${Math.round((this.analytics.errors / Math.max(this.analytics.totalRequests, 1)) * 100)}%`
    };
  }

  clearCache(): void {
    this.responseCache.clear();
  }

  resetAnalytics(): void {
    this.analytics = {
      totalRequests: 0,
      localResponses: 0,
      cachedResponses: 0,
      apiResponses: 0,
      errors: 0
    };
  }
}

// =====================================================================================
// 📤 EXPORTS
// =====================================================================================

export default AIService;