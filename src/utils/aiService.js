// =====================================================================================
// 🤖 AI SERVICE - SMART ROUTING & API MANAGEMENT
// =====================================================================================
// Created by Himanshu (himanshu1614)
// Handles: API calling, smart routing, local knowledge integration, caching
// Features: Cost optimization, fallback systems, intelligent responses
// FILE LOCATION: src/utils/aiService.js

// Add global error handler for debugging white screen issues
if (typeof window !== 'undefined') {
  window.addEventListener('error', function (event) {
    console.error('Global JS Error:', event.message, event.filename, event.lineno, event.colno, event.error);
    // Optionally, show a visible error overlay for debugging
    if (!document.getElementById('global-js-error-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'global-js-error-overlay';
      overlay.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,0,0,0.1);color:#b91c1c;z-index:99999;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-family:monospace;';
      overlay.innerText = 'A JavaScript error occurred: ' + event.message;
      document.body.appendChild(overlay);
    }
  });
  window.addEventListener('unhandledrejection', function (event) {
    console.error('Global Unhandled Promise Rejection:', event.reason);
    if (!document.getElementById('global-js-error-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'global-js-error-overlay';
      overlay.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,0,0,0.1);color:#b91c1c;z-index:99999;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-family:monospace;';
      overlay.innerText = 'A JS promise error occurred: ' + event.reason;
      document.body.appendChild(overlay);
    }
  });
}

import { API_PROVIDERS, ROUTING_RULES, ERROR_MESSAGES, RETRY_CONFIG } from '../config/apiConfig.js';
import LocalKnowledge, { LocalKnowledgeUtils } from './localKnowledge.js';

// =====================================================================================
// 🧠 MAIN AI SERVICE CLASS
// =====================================================================================

export class AIService {
  // =====================================================================================
  // 🎯 MAIN MESSAGE PROCESSING (SMART ROUTING)
  // =====================================================================================
  async processMessage(message, userId = 'default', options = {}) {
    this.analytics.totalRequests++;
    try {
      // Step 1: Analyze the message
      const messageAnalysis = this.analyzeMessage(message);

      // Step 2: Check cache first
      const cached = this.getCachedResponse(message);
      if (cached && !options.bypassCache) {
        this.analytics.cachedResponses++;
        return {
          content: cached.content,
          source: 'cache',
          fromCache: true,
          confidence: cached.confidence
        };
      }

      // Step 3: Try local knowledge first (70% of requests)
      if (this.canHandleLocally(messageAnalysis)) {
        const localResponse = await this.handleWithLocalKnowledge(messageAnalysis);
        if (localResponse && localResponse.confidence > 0.7) {
          this.analytics.localResponses++;
          this.cacheResponse(message, localResponse);
          return localResponse;
        }
      }

      // Step 4: Use AI API if needed (30% of requests)
      const aiResponse = await this.handleWithAI(messageAnalysis, userId, options);
      this.analytics.apiResponses++;
      this.cacheResponse(message, aiResponse);
      return aiResponse;

    } catch (error) {
      this.analytics.errors++;
      console.error('AI Service error:', error);
      return this.getFallbackResponse(message, error);
    }
  }

  // =====================================================================================
  // 📊 MESSAGE ANALYSIS (INTENT DETECTION)
  // =====================================================================================
  analyzeMessage(message) {
    const text = message.toLowerCase();
    const analysis = {
      originalMessage: message,
      intent: 'general',
      topics: [],
      urgency: 'normal',
      needsAPI: false,
      confidence: 0
    };

    // Safety keywords (highest priority)
    const safetyKeywords = ['pain', 'chest pain', 'dizzy', 'faint', 'injury', 'hurt', 'emergency'];
    if (safetyKeywords.some(keyword => text.includes(keyword))) {
      analysis.intent = 'safety';
      analysis.urgency = 'high';
      analysis.confidence = 0.9;
      return analysis;
    }

    // Exercise-related intents
    const exerciseKeywords = ['exercise', 'workout', 'training', 'lift', 'squat', 'deadlift', 'bench press', 'form', 'technique'];
    if (exerciseKeywords.some(keyword => text.includes(keyword))) {
      analysis.intent = 'exercise';
      analysis.topics.push('exercise');
      analysis.confidence = 0.8;
    }

    // Nutrition-related intents
    const nutritionKeywords = ['nutrition', 'diet', 'protein', 'carbs', 'calories', 'meal', 'supplement', 'eating'];
    if (nutritionKeywords.some(keyword => text.includes(keyword))) {
      analysis.intent = 'nutrition';
      analysis.topics.push('nutrition');
      analysis.confidence = 0.8;
    }

    // Motivation-related intents
    const motivationKeywords = ['motivation', 'struggling', 'discouraged', 'plateau', 'give up', 'hard', 'difficult'];
    if (motivationKeywords.some(keyword => text.includes(keyword))) {
      analysis.intent = 'motivation';
      analysis.topics.push('motivation');
      analysis.confidence = 0.8;
    }

    // Planning-related intents
    const planningKeywords = ['plan', 'routine', 'schedule', 'program', 'beginner', 'start'];
    if (planningKeywords.some(keyword => text.includes(keyword))) {
      analysis.intent = 'planning';
      analysis.topics.push('planning');
      analysis.confidence = 0.7;
    }

    // Check if API is needed
    const complexKeywords = ['research', 'study', 'science', 'why does', 'explain how', 'mechanism'];
    analysis.needsAPI = complexKeywords.some(keyword => text.includes(keyword)) ||
      text.length > 200 ||
      analysis.confidence < 0.6;

    return analysis;
  }
  constructor() {
    this.localKnowledge = LocalKnowledge;
    this.utils = LocalKnowledgeUtils;
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
  // 🔧 PROVIDER INITIALIZATION (STATIC)
  // =====================================================================================
  static initializeProviders() {
    const providers = new Map();
    Object.entries(API_PROVIDERS).forEach(([name, config]) => {
      providers.set(name, {
        ...config,
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
  // 🏠 LOCAL KNOWLEDGE HANDLING (70% of requests)
  // =====================================================================================

  canHandleLocally(analysis) {
    // Always handle safety locally for immediate response
    if (analysis.intent === 'safety') return true;
    
    // Handle if confidence is high and we have local data
    if (analysis.confidence >= 0.7) {
      return ['exercise', 'nutrition', 'motivation', 'planning'].includes(analysis.intent);
    }
    
    // Handle simple questions locally
    const simplePatterns = [
      /how many (sets|reps)/i,
      /what (exercises?|muscles?)/i,
      /how (much|often|long)/i,
      /(best|good) (exercise|food|protein)/i
    ];
    
    return simplePatterns.some(pattern => pattern.test(analysis.originalMessage));
  }

  async handleWithLocalKnowledge(analysis) {
    const { intent, originalMessage } = analysis;
    
    try {
      switch (intent) {
        case 'safety':
          return this.handleSafety(originalMessage);
          
        case 'exercise':
          return this.handleExercise(originalMessage);
          
        case 'nutrition':
          return this.handleNutrition(originalMessage);
          
        case 'motivation':
          return this.handleMotivation(originalMessage);
          
        case 'planning':
          return this.handlePlanning(originalMessage);
          
        default:
          return this.handleGeneral(originalMessage);
      }
    } catch (error) {
      console.error('Local knowledge error:', error);
      return null;
    }
  }

  // =====================================================================================
  // 🛡️ SAFETY HANDLER (IMMEDIATE RESPONSE)
  // =====================================================================================

  handleSafety(message) {
    const redFlags = this.utils.checkSafetyFlags(message);
    
    if (redFlags.length > 0) {
      return {
        content: `⚠️ **IMPORTANT SAFETY ALERT** ⚠️

I notice you mentioned: ${redFlags.join(', ')}

**IMMEDIATE ACTION REQUIRED:**
🚨 Stop exercising immediately
🏥 If experiencing chest pain, severe shortness of breath, or fainting - seek emergency medical attention
📞 Contact your healthcare provider for persistent pain or concerning symptoms

**Your safety is the top priority.** No fitness goal is worth risking your health.

Once cleared by a medical professional, I'm here to help you exercise safely! 💙`,
        source: 'safety_protocol',
        confidence: 0.95,
        urgency: 'emergency'
      };
    }
    
    return {
      content: `I'm here to help you exercise safely! 🛡️

**General Safety Reminders:**
• Listen to your body - discomfort is normal, pain is not
• Warm up before intense exercise
• Progress gradually (5-10% increases weekly)
• Stay hydrated and get adequate rest
• Use proper form over heavy weight

What specific safety questions can I help you with?`,
      source: 'safety_guidance',
      confidence: 0.8
    };
  }

  // =====================================================================================
  // 💪 EXERCISE HANDLER
  // =====================================================================================

  handleExercise(message) {
    const text = message.toLowerCase();
    
    // Check for specific exercise names
    const exerciseMatch = this.findExerciseInMessage(text);
    if (exerciseMatch) {
      return this.getExerciseDetails(exerciseMatch);
    }
    
    // Check for muscle group requests
    const muscleGroups = ['chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'glutes', 'biceps', 'triceps'];
    const targetMuscle = muscleGroups.find(muscle => text.includes(muscle));
    
    if (targetMuscle) {
      return this.getExercisesForMuscle(targetMuscle);
    }
    
    // Check for form/technique questions
    if (text.includes('form') || text.includes('technique') || text.includes('how to')) {
      return this.getFormGuidance(text);
    }
    
    // General exercise advice
    return {
      content: `💪 **Exercise Guidance** 💪

**Popular Compound Movements:**
🏋️ **Squat** - King of lower body exercises
🏋️ **Deadlift** - Ultimate posterior chain builder  
🏋️ **Bench Press** - Premier upper body pushing exercise

**Key Principles:**
• Quality over quantity always
• Progressive overload for growth
• Full range of motion
• Control both lifting and lowering phases

What specific exercise would you like help with? Just ask about any movement!`,
      source: 'exercise_database',
      confidence: 0.85
    };
  }

  findExerciseInMessage(text) {
    const exerciseNames = ['squat', 'deadlift', 'bench press', 'bicep curl', 'tricep extension', 'plank'];
    return exerciseNames.find(exercise => text.includes(exercise.replace(' ', ' ')));
  }

  getExerciseDetails(exerciseName) {
    const exercise = this.utils.getExercise(exerciseName);
    
    if (!exercise) {
      return {
        content: `I don't have specific details for "${exerciseName}" yet, but I can help with many other exercises! Try asking about squats, deadlifts, bench press, or other common movements.`,
        source: 'exercise_database',
        confidence: 0.5
      };
    }
    
    return {
      content: `💪 **${exercise.name}** 💪

**Primary Muscles:** ${exercise.muscles.join(', ')}
**Difficulty:** ${exercise.difficulty}
**Equipment:** ${exercise.equipment.join(', ')}

**Description:** ${exercise.description}

**Instructions:**
${exercise.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

**Common Mistakes to Avoid:**
${exercise.commonMistakes.map(mistake => `❌ ${mistake}`).join('\n')}

**Safety Tips:**
${exercise.safetyTips.map(tip => `✅ ${tip}`).join('\n')}

Need help with progressions or modifications? Just ask! 🚀`,
      source: 'exercise_database',
      confidence: 0.9
    };
  }

  getExercisesForMuscle(muscle) {
    const exercises = this.utils.findExercisesByMuscle(muscle);
    
    if (exercises.length === 0) {
      return {
        content: `I don't have specific exercises for ${muscle} in my current database, but I can help with compound movements that work multiple muscle groups!`,
        source: 'exercise_database',
        confidence: 0.5
      };
    }
    
    const exerciseList = exercises.slice(0, 3).map(ex => `**${ex.name}** - ${ex.description}`).join('\n\n');
    
    return {
      content: `💪 **Best Exercises for ${muscle.toUpperCase()}** 💪

${exerciseList}

Want detailed instructions for any of these? Just ask about the specific exercise!`,
      source: 'exercise_database',
      confidence: 0.85
    };
  }

  getFormGuidance(text) {
    return {
      content: `🎯 **Perfect Form Guidelines** 🎯

**Universal Form Principles:**
✅ **Control** - Move with intention, not momentum
✅ **Range of Motion** - Full ROM for maximum benefit
✅ **Breathing** - Never hold your breath during movement
✅ **Neutral Spine** - Protect your back in all movements
✅ **Core Engagement** - Stable core = safe movement

**Progressive Learning:**
1. **Master bodyweight** first
2. **Add light resistance** to practice
3. **Focus on feeling** the right muscles
4. **Gradually increase** intensity

Which specific exercise form would you like me to break down in detail?`,
      source: 'form_guidance',
      confidence: 0.8
    };
  }

  // =====================================================================================
  // 🥗 NUTRITION HANDLER
  // =====================================================================================

  handleNutrition(message) {
    const text = message.toLowerCase();
    
    // Check for specific macronutrients
    if (text.includes('protein')) {
      return this.getNutritionDetails('protein');
    }
    if (text.includes('carb') || text.includes('carbohydrate')) {
      return this.getNutritionDetails('carbohydrates');
    }
    if (text.includes('fat')) {
      return this.getNutritionDetails('fats');
    }
    
    // Check for timing questions
    if (text.includes('pre workout') || text.includes('before')) {
      return this.getMealTimingAdvice('pre_workout');
    }
    if (text.includes('post workout') || text.includes('after')) {
      return this.getMealTimingAdvice('post_workout');
    }
    
    // Check for hydration
    if (text.includes('water') || text.includes('hydration')) {
      return this.getHydrationAdvice();
    }
    
    // Check for supplements
    if (text.includes('supplement')) {
      return this.getSupplementAdvice();
    }
    
    // General nutrition advice
    return {
      content: `🥗 **Nutrition Fundamentals** 🥗

**Macronutrient Targets:**
🥩 **Protein:** 1.6-2.2g per kg bodyweight
🍞 **Carbs:** 3-7g per kg based on activity
🥑 **Fats:** 0.8-1.2g per kg bodyweight

**Key Principles:**
• Eat whole, minimally processed foods
• Time carbs around workouts
• Distribute protein throughout the day
• Stay consistently hydrated

**Questions I can answer:**
• Specific macronutrient needs
• Pre/post workout nutrition
• Supplement recommendations
• Hydration guidelines

What specific nutrition topic interests you?`,
      source: 'nutrition_database',
      confidence: 0.85
    };
  }

  getNutritionDetails(macronutrient) {
    const info = this.utils.getNutritionInfo(macronutrient);
    
    if (!info) {
      return {
        content: `I don't have specific information about ${macronutrient}, but I can help with protein, carbohydrates, and fats!`,
        source: 'nutrition_database',
        confidence: 0.5
      };
    }
    
    return {
      content: `🥗 **${macronutrient.toUpperCase()} GUIDE** 🥗

**Daily Recommendation:** ${info.recommendation}

**Best Sources:**
${info.sources.map(source => `• ${source}`).join('\n')}

**Optimal Timing:** ${info.timing}

**Key Benefits:**
${info.benefits.map(benefit => `✅ ${benefit}`).join('\n')}

Need help planning meals around this? Just ask! 🍽️`,
      source: 'nutrition_database',
      confidence: 0.9
    };
  }

  getMealTimingAdvice(timing) {
    const timingInfo = this.localKnowledge.NUTRITION_DATABASE.meal_timing[timing];
    
    return {
      content: `⏰ **${timing.replace('_', ' ').toUpperCase()} NUTRITION** ⏰

**Timing:** ${timingInfo.timing}
**Focus:** ${timingInfo.focus}

**Great Options:**
${timingInfo.examples.map(example => `• ${example}`).join('\n')}

${timingInfo.avoid ? `**Avoid:** ${timingInfo.avoid}` : ''}
${timingInfo.ratio ? `**Optimal Ratio:** ${timingInfo.ratio}` : ''}

This will optimize your energy and recovery! 🚀`,
      source: 'nutrition_timing',
      confidence: 0.9
    };
  }

  getHydrationAdvice() {
    const hydration = this.localKnowledge.NUTRITION_DATABASE.hydration;
    
    return {
      content: `💧 **HYDRATION GUIDE** 💧

**Daily Baseline:** ${hydration.baseline}
**During Exercise:** ${hydration.exercise}

**Hydration Indicators:**
${hydration.indicators.map(indicator => `• ${indicator}`).join('\n')}

**Electrolyte Notes:**
• **Sodium:** ${hydration.electrolytes.sodium}
• **Potassium:** ${hydration.electrolytes.potassium}
• **Magnesium:** ${hydration.electrolytes.magnesium}

Stay hydrated for optimal performance! 💪`,
      source: 'hydration_guide',
      confidence: 0.9
    };
  }

  getSupplementAdvice() {
    const supplements = this.localKnowledge.NUTRITION_DATABASE.supplementation;
    
    return {
      content: `💊 **SUPPLEMENT GUIDANCE** 💊

**Evidence-Based Supplements:**
${Object.entries(supplements.evidence_based).map(([name, info]) => 
  `**${name.replace('_', ' ').toUpperCase()}**\n• Dosage: ${info.dosage}\n• Benefits: ${info.benefits}\n• Timing: ${info.timing}`
).join('\n\n')}

**NOT Recommended:**
${supplements.not_recommended.map(item => `❌ ${item}`).join('\n')}

**Remember:** Supplements supplement a good diet, they don't replace it! Focus on whole foods first. 🥗`,
      source: 'supplement_guide',
      confidence: 0.9
    };
  }

  // =====================================================================================
  // 🔥 MOTIVATION HANDLER
  // =====================================================================================

  handleMotivation(message) {
    const text = message.toLowerCase();
    
    // Detect emotional state
    let emotionalState = 'general';
    if (text.includes('struggling') || text.includes('hard') || text.includes('difficult')) {
      emotionalState = 'struggling';
    } else if (text.includes('plateau') || text.includes('stuck') || text.includes('progress')) {
      emotionalState = 'plateau';
    } else if (text.includes('restart') || text.includes('back') || text.includes('again')) {
      emotionalState = 'comeback';
    }
    
    // Get specific motivation
    const specificMotivation = this.localKnowledge.MOTIVATIONAL_CONTENT.encouragement[emotionalState] || 
                              this.localKnowledge.MOTIVATIONAL_CONTENT.daily_quotes;
    
    const motivation = Array.isArray(specificMotivation) ? 
                      specificMotivation[Math.floor(Math.random() * specificMotivation.length)] :
                      specificMotivation;
    
    return {
      content: `🔥 **MOTIVATION BOOST** 🔥

${motivation}

**Remember:**
💪 Every workout counts, no matter how small
🎯 Progress isn't always visible, but it's always happening
🏆 You're building more than muscle - you're building character
⭐ Your future self will thank you for not giving up

**Action Steps:**
1. Set one tiny goal for today
2. Celebrate small wins
3. Focus on how exercise makes you FEEL
4. Remember your "why"

You've got this, champion! What's one thing you can do right now to move forward? 🚀`,
      source: 'motivational_content',
      confidence: 0.9
    };
  }

  // =====================================================================================
  // 📋 PLANNING HANDLER
  // =====================================================================================

  handlePlanning(message) {
    const text = message.toLowerCase();
    
    // Detect fitness level
    let level = 'beginner';
    if (text.includes('intermediate') || text.includes('experienced')) {
      level = 'intermediate';
    } else if (text.includes('advanced') || text.includes('expert')) {
      level = 'advanced';
    }
    
    // Detect goal
    let goal = 'general fitness';
    if (text.includes('strength')) {
      goal = 'strength';
    } else if (text.includes('muscle') || text.includes('gain')) {
      goal = 'muscle_gain';
    } else if (text.includes('lose') || text.includes('weight')) {
      goal = 'weight_loss';
    } else if (text.includes('cardio') || text.includes('endurance')) {
      goal = 'endurance';
    }
    
    return this.generateWorkoutPlan(level, goal);
  }

  generateWorkoutPlan(level, goal) {
    const plans = {
      beginner: {
        frequency: '3 days per week',
        structure: 'Full body workouts',
        exercises: ['Bodyweight squats', 'Push-ups', 'Planks', 'Walking/light cardio']
      },
      intermediate: {
        frequency: '4-5 days per week',
        structure: 'Upper/lower split or push/pull/legs',
        exercises: ['Goblet squats', 'Dumbbell exercises', 'More challenging progressions']
      },
      advanced: {
        frequency: '5-6 days per week',
        structure: 'Specialized programs with periodization',
        exercises: ['Barbell movements', 'Olympic lifts', 'Advanced techniques']
      }
    };
    
    const plan = plans[level];
    
    return {
      content: `📋 **${level.toUpperCase()} WORKOUT PLAN** 📋

**Goal:** ${goal.replace('_', ' ')}
**Frequency:** ${plan.frequency}
**Structure:** ${plan.structure}

**Recommended Exercises:**
${plan.exercises.map(exercise => `• ${exercise}`).join('\n')}

**Key Principles for ${level}s:**
${level === 'beginner' ? 
  '• Focus on learning proper form\n• Start with bodyweight movements\n• Build consistency first\n• Progress gradually' :
  level === 'intermediate' ?
  '• Add more training volume\n• Include compound movements\n• Track progressive overload\n• Consider split routines' :
  '• Use periodization strategies\n• Focus on specific goals\n• Include advanced techniques\n• Monitor recovery carefully'
}

Want me to detail any specific exercises or create a weekly schedule? 💪`,
      source: 'workout_planning',
      confidence: 0.85
    };
  }

  // =====================================================================================
  // 🌐 AI API HANDLING (30% of requests)
  // =====================================================================================

  async handleWithAI(analysis, userId, options = {}) {
    const { intent, originalMessage, needsAPI } = analysis;
    
    if (!needsAPI) {
      // Try local one more time with lower threshold
      const localResponse = await this.handleWithLocalKnowledge(analysis);
      if (localResponse) return localResponse;
    }
    
    try {
      const provider = await this.selectBestProvider(intent);
      
      if (provider === 'local_fallback') {
        return this.getLocalFallbackResponse(originalMessage);
      }
      
      const prompt = this.createPrompt(intent, originalMessage);
      const response = await this.callAPI(provider, prompt, options);
      
      return {
        content: response.content,
        source: 'ai_api',
        provider: provider.name,
        confidence: 0.9
      };
      
    } catch (error) {
      console.error('AI API error:', error);
      return this.getLocalFallbackResponse(originalMessage);
    }
  }

  async selectBestProvider(intent) {
    // Check each provider's availability
    for (const [name, provider] of this.providers) {
      if (this.isProviderAvailable(provider)) {
        return provider;
      }
    }
    
    return 'local_fallback';
  }

  isProviderAvailable(provider) {
    if (!provider.apiKey || provider.apiKey.includes('your_')) {
      return false;
    }
    
    const now = Date.now();
    
    // Reset usage counters if needed
    if (now - provider.lastReset > 24 * 60 * 60 * 1000) { // 24 hours
      provider.currentUsage = 0;
      provider.lastReset = now;
    }
    
    // Check rate limits
    return provider.currentUsage < (provider.limits.requestsPerDay || 1000);
  }

  createPrompt(intent, message) {
    const basePrompt = `You are an expert fitness coach with deep knowledge of exercise science, nutrition, and motivation. 
    
Provide helpful, safe, and evidence-based advice. Keep responses practical and actionable.
    
User question: ${message}`;
    
    const intentPrompts = {
      exercise: basePrompt + '\n\nFocus on exercise technique, programming, and safety.',
      nutrition: basePrompt + '\n\nFocus on nutrition science and practical meal planning.',
      motivation: basePrompt + '\n\nProvide encouraging and motivational guidance.',
      planning: basePrompt + '\n\nHelp create structured workout plans and routines.'
    };
    
    return intentPrompts[intent] || basePrompt;
  }

  async callAPI(provider, prompt, options = {}) {
    try {
      provider.currentUsage++;
      
      const response = await fetch(provider.baseUrl + '/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: Object.values(provider.models)[0], // Use first available model
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        provider: provider.name
      };
      
    } catch (error) {
      console.error(`API call failed for ${provider.name}:`, error);
      throw error;
    }
  }

  // =====================================================================================
  // 🔄 CACHING SYSTEM
  // =====================================================================================

  getCachedResponse(message) {
    const key = this.generateCacheKey(message);
    const cached = this.responseCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < 60 * 60 * 1000) { // 1 hour cache
      return cached;
    }
    
    return null;
  }

  cacheResponse(message, response) {
    const key = this.generateCacheKey(message);
    this.responseCache.set(key, {
      ...response,
      timestamp: Date.now()
    });
    
    // Cleanup old cache entries
    if (this.responseCache.size > 100) {
      const oldestKey = this.responseCache.keys().next().value;
      this.responseCache.delete(oldestKey);
    }
  }

  generateCacheKey(message) {
    return message.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  // =====================================================================================
  // 🛟 FALLBACK RESPONSES
  // =====================================================================================

  getLocalFallbackResponse(message) {
    return {
      content: `I understand you're asking about fitness, and I want to help! 💪

While I can't connect to AI services right now, I have built-in knowledge about:
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
      source: 'local_fallback',
      confidence: 0.6
    };
  }

  getFallbackResponse(message, error) {
    return {
      content: `I'm having a technical hiccup, but don't worry! 🤖

I can still help you with:
✅ Exercise form and techniques
✅ Workout planning  
✅ Nutrition basics
✅ Safety guidelines
✅ Motivation and support

Try rephrasing your question or ask me something specific about fitness. I'm still here to help you crush your goals! 💪

${this.utils.getRandomMotivation()}`,
      source: 'error_fallback',
      confidence: 0.5,
      error: error.message
    };
  }

  // =====================================================================================
  // 📊 ANALYTICS & UTILITIES
  // =====================================================================================

  getAnalytics() {
    return {
      ...this.analytics,
      cacheSize: this.responseCache.size,
      localKnowledgeRate: (this.analytics.localResponses / this.analytics.totalRequests * 100).toFixed(1) + '%',
      cacheHitRate: (this.analytics.cachedResponses / this.analytics.totalRequests * 100).toFixed(1) + '%'
    };
  }

  clearCache() {
    this.responseCache.clear();
    console.log('Response cache cleared');
  }

  handleGeneral(message) {
    return {
      content: `Hi there! I'm your AI Fitness Coach! 🤖💪

I'm here to help you with:
🏋️ **Exercise** - Form, techniques, workout plans
🥗 **Nutrition** - Meal planning, macros, supplements  
🔥 **Motivation** - Keep you inspired and on track
🛡️ **Safety** - Ensure you exercise safely
📋 **Planning** - Create structured routines

What would you like to know about fitness today?

${this.utils.getRandomMotivation()}`,
      source: 'general_welcome',
      confidence: 0.7
    };
  }
}


// =====================================================================================
// 📤 EXPORT DEFAULT INSTANCE
// =====================================================================================
const aiServiceInstance = new AIService();
export default aiServiceInstance;

