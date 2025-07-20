// =====================================================================================
// 🤖 BATTLE-TESTED AI SERVICE WITH MULTIPLE FREE PROVIDERS
// =====================================================================================
// Using production-ready fallback system with Groq, Gemini, and OpenRouter

import { GoogleGenerativeAI } from '@google/generative-ai';

// API Configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Environment variables
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Coach Flex persona - witty, supportive fitness coach
const COACH_FLEX_PERSONA = `You are Coach Flex, an energetic, witty, and supportive AI fitness coach. You:
- Keep responses brief (1-3 sentences max) for voice interaction
- Use motivational but not cheesy language
- Focus ONLY on fitness, exercise, nutrition, and motivation
- Never give medical advice - always suggest consulting professionals for injuries
- If users ask non-fitness questions, gently redirect: "Let's keep our focus on crushing those fitness goals! 💪"
- Use emojis sparingly but effectively
- Be encouraging but realistic

Example responses:
- "Great job logging that workout! Your consistency is going to pay off big time 🔥"
- "Sounds like you're ready to level up! Let's add 5 more pounds to that bench press"
- "Rest days are when the magic happens - your muscles are getting stronger right now!"`;

// Provider configuration with rate limits and availability tracking
interface AIProvider {
  name: string;
  available: boolean;
  rateLimit: number;
  lastUsed: number;
  consecutiveFailures: number;
}

class AIService {
  private providers: Record<string, AIProvider> = {
    groq: { name: 'Groq', available: true, rateLimit: 100, lastUsed: 0, consecutiveFailures: 0 },
    gemini: { name: 'Gemini', available: true, rateLimit: 15, lastUsed: 0, consecutiveFailures: 0 },
    openrouter: { name: 'OpenRouter', available: true, rateLimit: 50, lastUsed: 0, consecutiveFailures: 0 }
  };

  private geminiClient: GoogleGenerativeAI | null = null;

  constructor() {
    // Initialize Gemini client if API key is available
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      this.geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
    }
  }

  /**
   * Main method to get AI response with fallback system
   */
  async getAIResponse(message: string, context: any = {}): Promise<string> {
    // Clean and validate input
    if (!message?.trim()) {
      return "I'm here to help! What fitness question do you have for me? 💪";
    }

    const cleanMessage = message.trim();
    const providers = this.getAvailableProviders();

    // Try each provider in order of preference
    for (const providerName of providers) {
      try {
        console.log(`Trying ${providerName} for AI response...`);
        const response = await this.callProvider(providerName, cleanMessage, context);
        
        if (response) {
          this.providers[providerName].consecutiveFailures = 0;
          this.providers[providerName].lastUsed = Date.now();
          console.log(`✅ Success with ${providerName}`);
          return this.validateAndCleanResponse(response);
        }
      } catch (error) {
        console.warn(`❌ ${providerName} failed:`, error);
        this.handleProviderFailure(providerName);
      }
    }

    // Ultimate fallback: intelligent local responses
    return this.getIntelligentFallback(cleanMessage);
  }

  /**
   * Call specific AI provider
   */
  private async callProvider(providerName: string, message: string, context: any): Promise<string | null> {
    switch (providerName) {
      case 'groq':
        return await this.callGroq(message, context);
      case 'gemini':
        return await this.callGemini(message, context);
      case 'openrouter':
        return await this.callOpenRouter(message, context);
      default:
        return null;
    }
  }

  /**
   * Groq API call - Lightning fast responses
   */
  private async callGroq(message: string, context: any): Promise<string | null> {
    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
      throw new Error('Groq API key not configured');
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Fast model for real-time responses
        messages: [
          { role: 'system', content: COACH_FLEX_PERSONA },
          { role: 'user', content: message }
        ],
        max_tokens: 150, // Keep responses concise for voice
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  }

  /**
   * Google Gemini API call - Advanced reasoning
   */
  private async callGemini(message: string, context: any): Promise<string | null> {
    if (!this.geminiClient) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const model = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `${COACH_FLEX_PERSONA}\n\nUser: ${message}\nCoach Flex:`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text?.trim() || null;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  /**
   * OpenRouter API call - Backup models
   */
  private async callOpenRouter(message: string, context: any): Promise<string | null> {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://voicefit.app',
        'X-Title': 'VoiceFit'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free', // Free model
        messages: [
          { role: 'system', content: COACH_FLEX_PERSONA },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  }

  /**
   * Get available providers based on rate limits and failures
   */
  private getAvailableProviders(): string[] {
    const now = Date.now();
    const availableProviders = [];

    for (const [name, provider] of Object.entries(this.providers)) {
      // Check if provider is available and not rate limited
      if (provider.available && provider.consecutiveFailures < 3) {
        // Simple rate limiting check (1 request per minute per provider)
        if (now - provider.lastUsed > 60000) {
          availableProviders.push(name);
        }
      }
    }

    // Prefer Groq for speed, then Gemini for quality, then OpenRouter
    return availableProviders.sort((a, b) => {
      const order = { groq: 0, gemini: 1, openrouter: 2 };
      return (order[a as keyof typeof order] || 999) - (order[b as keyof typeof order] || 999);
    });
  }

  /**
   * Handle provider failures and implement backoff
   */
  private handleProviderFailure(providerName: string): void {
    const provider = this.providers[providerName];
    if (provider) {
      provider.consecutiveFailures++;
      
      // Disable provider temporarily if it fails too much
      if (provider.consecutiveFailures >= 3) {
        provider.available = false;
        
        // Re-enable after 5 minutes
        setTimeout(() => {
          provider.available = true;
          provider.consecutiveFailures = 0;
        }, 5 * 60 * 1000);
      }
    }
  }

  /**
   * Validate and clean AI responses
   */
  private validateAndCleanResponse(response: string): string {
    if (!response?.trim()) {
      return "Let's keep crushing those fitness goals! What's your next move? 💪";
    }

    let cleaned = response.trim();
    
    // Remove any markdown formatting for voice responses
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
    
    // Ensure response ends properly
    if (!/[.!?]$/.test(cleaned)) {
      cleaned += '!';
    }
    
    // Keep responses concise for voice (max 200 chars)
    if (cleaned.length > 200) {
      const sentences = cleaned.split(/[.!?]+/);
      cleaned = sentences[0] + (sentences[0].endsWith('.') ? '' : '!');
    }
    
    return cleaned;
  }

  /**
   * Intelligent fallback responses when all AI providers fail
   */
  private getIntelligentFallback(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Workout-related responses
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
      const workoutResponses = [
        "Every workout is a step closer to your best self! What exercise are you working on? 💪",
        "Let's make this workout count! Focus on form over speed 🔥",
        "You've got this! Remember, consistency beats perfection every time!",
        "Great choice to work out! Your future self will thank you 💯"
      ];
      return workoutResponses[Math.floor(Math.random() * workoutResponses.length)];
    }
    
    // Motivation-related
    if (lowerMessage.includes('motivate') || lowerMessage.includes('give up') || lowerMessage.includes('tired')) {
      const motivationResponses = [
        "The only bad workout is the one you didn't do! You've got this 🔥",
        "Champions are made when nobody's watching. Keep going! 💪",
        "Every rep counts, every step matters. You're stronger than you think!",
        "Progress isn't always visible, but it's always happening. Trust the process! ⚡"
      ];
      return motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
    }
    
    // Nutrition-related
    if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('nutrition')) {
      const nutritionResponses = [
        "Fuel your body like the machine it is! What's your nutrition goal? 🥗",
        "You can't out-train a bad diet, but you can definitely fuel your success! 💪",
        "Great nutrition question! Remember: protein, veggies, and stay hydrated! 💧",
        "Food is fuel! Choose options that power your performance 🔋"
      ];
      return nutritionResponses[Math.floor(Math.random() * nutritionResponses.length)];
    }
    
    // Default encouraging response
    const defaultResponses = [
      "I'm here to help you crush your fitness goals! What can we work on? 💪",
      "Let's make today count! What fitness challenge are you tackling? 🔥",
      "Ready to level up your fitness game? I'm here to help! ⚡",
      "Every day is a new opportunity to get stronger! What's your focus today? 💯"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  /**
   * Get service status for debugging
   */
  getServiceStatus() {
    return {
      providers: this.providers,
      apiKeys: {
        groq: !!GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here',
        gemini: !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here',
        openrouter: !!OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'your_openrouter_api_key_here'
      }
    };
  }
}

// Legacy function for backward compatibility
export async function askAI(prompt: string, options: { model?: string } = {}): Promise<string> {
  const aiService = new AIService();
  return await aiService.getAIResponse(prompt, options);
}

// Export both the class and a singleton instance
export const aiService = new AIService();
export default AIService;
