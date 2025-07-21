// =====================================================================================
// 🤖 SIMPLIFIED AI SERVICE - GUARANTEED TO WORK
// =====================================================================================
// Reliable AI service with proper error handling and fallbacks

// Environment variables
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

console.log('🔑 AI Service API Keys Status:');
console.log('Groq:', GROQ_API_KEY ? '✅ LOADED' : '❌ MISSING');
console.log('Gemini:', GEMINI_API_KEY ? '✅ LOADED' : '❌ MISSING');
console.log('OpenRouter:', OPENROUTER_API_KEY ? '✅ LOADED' : '❌ MISSING');

// Coach Flex persona
const COACH_PERSONA = `You are Coach Flex, an energetic AI fitness coach. Keep responses SHORT (1-2 sentences) and motivating. Focus ONLY on fitness, exercise, nutrition, and motivation. Use emojis sparingly. Be encouraging but realistic.`;

class SimpleAIService {
  /**
   * Main method to get AI response - tries each provider until one works
   */
  async getAIResponse(message: string): Promise<string> {
    console.log('🤖 AI Service: Processing message:', message);
    
    if (!message?.trim()) {
      return "Hey there! What fitness goal can I help you crush today? 💪";
    }

    // Try Groq first (fastest)
    if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here') {
      try {
        console.log('🚀 Trying Groq API...');
        const response = await this.callGroq(message);
        if (response) {
          console.log('✅ Groq success!');
          return response;
        }
             } catch (error) {
         console.log('❌ Groq failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // Try Gemini second
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        console.log('🚀 Trying Gemini API...');
        const response = await this.callGemini(message);
        if (response) {
          console.log('✅ Gemini success!');
          return response;
        }
             } catch (error) {
         console.log('❌ Gemini failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // Try OpenRouter third
    if (OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') {
      try {
        console.log('🚀 Trying OpenRouter API...');
        const response = await this.callOpenRouter(message);
        if (response) {
          console.log('✅ OpenRouter success!');
          return response;
        }
             } catch (error) {
         console.log('❌ OpenRouter failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // If all APIs fail, return intelligent fallback
    console.log('⚠️ All APIs failed, using fallback');
    return this.getFallbackResponse(message);
  }

  /**
   * Call Groq API
   */
  private async callGroq(message: string): Promise<string | null> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: COACH_PERSONA },
          { role: 'user', content: message }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  }

  /**
   * Call Gemini API
   */
  private async callGemini(message: string): Promise<string | null> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${COACH_PERSONA}\n\nUser: ${message}\nCoach Flex:`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  }

  /**
   * Call OpenRouter API
   */
  private async callOpenRouter(message: string): Promise<string | null> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://voicefit.app',
        'X-Title': 'VoiceFit'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: COACH_PERSONA },
          { role: 'user', content: message }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  }

  /**
   * Smart fallback responses when APIs are unavailable
   */
  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
      const workoutResponses = [
        "Let's get that workout started! Focus on proper form and you'll see amazing results! 💪",
        "Every rep counts! What muscle group are we targeting today? 🔥",
        "Time to crush this workout! Remember, consistency beats perfection! ⚡",
        "Great choice to exercise! Your future self will thank you! 🏆"
      ];
      return workoutResponses[Math.floor(Math.random() * workoutResponses.length)];
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('tired') || lowerMessage.includes('give up')) {
      const motivationResponses = [
        "You're stronger than you think! Every champion was once a beginner! 💪",
        "The hardest part is showing up - and you're already here! Keep going! 🔥",
        "Progress isn't always visible, but it's happening! Trust the process! ⚡",
        "Champions are made when nobody's watching. You've got this! 🏆"
      ];
      return motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('nutrition') || lowerMessage.includes('eat')) {
      const nutritionResponses = [
        "Fuel your body like the machine it is! What's your nutrition goal? 🥗",
        "Great nutrition question! Remember: protein, veggies, and stay hydrated! 💧",
        "You can't out-train a bad diet, but you can fuel your success! 🔋",
        "Food is fuel for your fitness journey! Choose wisely! 🎯"
      ];
      return nutritionResponses[Math.floor(Math.random() * nutritionResponses.length)];
    }
    
    // Default responses
    const defaultResponses = [
      "I'm here to help you crush your fitness goals! What's on your mind? 💪",
      "Ready to level up your fitness game? Let's make it happen! 🔥",
      "Every day is a new opportunity to get stronger! What's your focus? ⚡",
      "Let's turn your fitness dreams into reality! How can I help? 🏆"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  /**
   * Get service status for debugging
   */
  getServiceStatus() {
    return {
      groqConfigured: !!GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here',
      geminiConfigured: !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here',
      openrouterConfigured: !!OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'your_openrouter_api_key_here'
    };
  }
}

// Create and export singleton instance
export const aiService = new SimpleAIService();

// Export for direct usage
export default SimpleAIService;
