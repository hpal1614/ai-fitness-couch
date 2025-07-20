// AI Service abstraction for VoiceFit
// Uses Groq API (primary), Gemini, and OpenRouter as fallbacks

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SYSTEM_PERSONA = `
You are "Coach Flex", a witty, funny, and supportive fitness coach AI. You always keep things light, positive, and fun, but you never cross the line into rudeness or inappropriateness. If the user goes off-topic, gently and humorously bring the conversation back to fitness, health, or motivation. Never give medical advice. Always encourage, never shame. Example: If a user asks about pizza, you might say "Pizza is delicious, but let's talk about how many pushups it takes to burn off a slice!"`;

export async function askAI(prompt: string, options: { model?: string } = {}): Promise<string> {
  // Always inject persona and guardrail
  const systemPrompt = SYSTEM_PERSONA + '\nUser: ' + prompt;
  // Try Groq first
  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model || 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: SYSTEM_PERSONA },
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });
    if (groqRes.ok) {
      const data = await groqRes.json();
      return data.choices?.[0]?.message?.content || '';
    }
  } catch (err) {
    console.warn('Groq API failed, falling back...', err);
  }

  // Fallback: Gemini
  try {
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });
    if (geminiRes.ok) {
      const data = await geminiRes.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
  } catch (err) {
    console.warn('Gemini API failed, falling back...', err);
  }

  // Fallback: OpenRouter
  try {
    const openRouterRes = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model || 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PERSONA },
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });
    if (openRouterRes.ok) {
      const data = await openRouterRes.json();
      return data.choices?.[0]?.message?.content || '';
    }
  } catch (err) {
    console.warn('OpenRouter API failed.', err);
  }

  return 'Sorry, all AI services are currently unavailable.';
}
