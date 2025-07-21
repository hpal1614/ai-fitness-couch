// =====================================================================================
// 🤖 AI SERVICE WRAPPER - SIMPLIFIED
// =====================================================================================
// Simple wrapper for the AI service

import { aiService } from '../ai/AiService';

// Main function for backward compatibility
export async function askCoachFlex(userInput: string): Promise<string> {
  try {
    console.log('🎯 askCoachFlex called with:', userInput);
    const response = await aiService.getAIResponse(userInput);
    console.log('✅ AI response:', response);
    return response;
  } catch (error) {
    console.error('❌ AI Service error:', error);
    
    // Simple fallback based on input
    const input = userInput.toLowerCase();
    
    if (input.includes('workout') || input.includes('exercise')) {
      return "Let's crush this workout! What exercise are you focusing on today? 💪";
    } else if (input.includes('motivate') || input.includes('help')) {
      return "You've got this! Every rep gets you closer to your goals! 🔥";
    } else if (input.includes('nutrition') || input.includes('food')) {
      return "Fuel your body for success! What's your nutrition goal? 🥗";
    } else {
      return "I'm here to help you reach your fitness goals! What can we work on together? ⚡";
    }
  }
}

// Export the main AI service
export { aiService } from '../ai/AiService';