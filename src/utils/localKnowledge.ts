// =====================================================================================
// 🧠 LOCAL KNOWLEDGE BASE FOR OFFLINE FITNESS RESPONSES
// =====================================================================================
// Provides intelligent fallback responses when AI services are unavailable

export interface KnowledgeItem {
  patterns: string[];
  response: string;
  confidence: number;
  category: string;
}

export class LocalKnowledge {
  private knowledgeBase: KnowledgeItem[] = [
    // Exercise Form & Technique
    {
      patterns: ['form', 'technique', 'how to do', 'proper way', 'correct form'],
      response: `Focus on proper form first! 💪 
      
Key principles:
• Controlled movements (2 seconds down, 1 second up)
• Full range of motion
• Engage your core
• Breathe properly (exhale on exertion)
• Start with lighter weights to master the movement`,
      confidence: 0.9,
      category: 'technique'
    },

    // Motivation & Mental Health
    {
      patterns: ['motivate', 'give up', 'tired', 'discouraged', 'lazy', 'unmotivated'],
      response: `You've got this! 🔥 Remember why you started:
      
• Every workout makes you stronger mentally and physically
• Progress isn't always visible but it's always happening
• The hardest part is showing up - you're already here!
• Your future self will thank you for not giving up today
• Champions are made when nobody's watching`,
      confidence: 0.95,
      category: 'motivation'
    },

    // Workout Planning
    {
      patterns: ['workout plan', 'routine', 'program', 'schedule', 'how often'],
      response: `Great question! Here's a solid foundation: 🎯
      
**Beginner Plan (3x/week):**
• Full body workouts every other day
• 45-60 minutes per session
• Focus on compound movements

**Intermediate Plan (4-5x/week):**
• Upper/Lower split or Push/Pull/Legs
• 60-75 minutes per session
• Mix strength and cardio

**Key:** Consistency beats perfection! Start where you are, be consistent for 2-3 weeks, then progress.`,
      confidence: 0.85,
      category: 'planning'
    },

    // Exercise Selection
    {
      patterns: ['best exercise', 'what exercise', 'exercise for', 'muscle building'],
      response: `The best exercises are compound movements that work multiple muscles! 💪
      
**Top Compound Exercises:**
• Squats (legs, glutes, core)
• Deadlifts (full body)
• Push-ups/Bench Press (chest, shoulders, triceps)
• Pull-ups/Rows (back, biceps)
• Overhead Press (shoulders, core)

These give you the most bang for your buck! Start with bodyweight versions and progress from there.`,
      confidence: 0.8,
      category: 'exercise'
    },

    // Nutrition Basics
    {
      patterns: ['nutrition', 'diet', 'food', 'eating', 'protein', 'meal prep'],
      response: `Nutrition is 80% of your results! 🥗 Here are the fundamentals:
      
**The Basics:**
• Protein: 0.8-1g per lb body weight daily
• Eat protein with every meal
• Include vegetables with most meals
• Drink half your body weight in ounces of water
• Time carbs around workouts for energy

**Simple rule:** If it comes from the ground or had a face, it's probably good for you!`,
      confidence: 0.85,
      category: 'nutrition'
    },

    // Rest & Recovery
    {
      patterns: ['rest', 'recovery', 'sleep', 'tired', 'sore', 'overtraining'],
      response: `Recovery is where the magic happens! 🌙 Your muscles grow during rest, not during workouts.
      
**Recovery Essentials:**
• 7-9 hours of quality sleep
• Rest days are NOT optional (at least 1-2 per week)
• Light activity on rest days (walking, stretching)
• Proper hydration and nutrition
• Listen to your body - soreness is normal, pain is not

Remember: You get stronger during recovery, not during the workout!`,
      confidence: 0.9,
      category: 'recovery'
    },

    // Safety & Injury Prevention
    {
      patterns: ['pain', 'hurt', 'injury', 'safety', 'warm up', 'sore'],
      response: `Safety first! ⚠️ Let's keep you healthy and strong:
      
**If you're in pain:**
• Stop the exercise immediately
• Ice if there's swelling, heat if it's muscle tightness
• See a healthcare professional for persistent pain

**Prevention:**
• Always warm up (5-10 minutes light cardio + dynamic stretching)
• Start with lighter weights and progress gradually
• Focus on form over weight
• Cool down and stretch after workouts

Pain is your body's warning system - listen to it!`,
      confidence: 0.95,
      category: 'safety'
    },

    // Beginner Guidance
    {
      patterns: ['beginner', 'start', 'new', 'first time', 'never worked out'],
      response: `Welcome to your fitness journey! 🎉 Everyone starts somewhere, and you're taking the best first step.
      
**Beginner Roadmap:**
1. Start with bodyweight exercises (squats, push-ups, planks)
2. Focus on learning proper form first
3. Aim for 2-3 workouts per week
4. Be consistent for 2-3 weeks before changing anything
5. Track your progress (reps, time, how you feel)

**Remember:** The goal is progress, not perfection. You've got this! 💪`,
      confidence: 0.9,
      category: 'beginner'
    },

    // Progress Tracking
    {
      patterns: ['progress', 'track', 'measure', 'improvement', 'results'],
      response: `Tracking progress is crucial for staying motivated! 📈 Here's what to monitor:
      
**Track These:**
• Workout consistency (most important!)
• Strength improvements (more weight, reps, or better form)
• Energy levels throughout the day
• Sleep quality
• How clothes fit
• Progress photos (weekly)

**Don't rely only on the scale** - your body composition changes as you build muscle and lose fat.

Small improvements daily = massive results over time!`,
      confidence: 0.85,
      category: 'progress'
    },

    // Equipment & Gym
    {
      patterns: ['equipment', 'gym', 'home workout', 'no equipment', 'bodyweight'],
      response: `You don't need a fancy gym to get fit! 🏠 Here are your options:
      
**Bodyweight Only:**
• Push-ups, squats, lunges, planks, burpees
• Mountain climbers, jumping jacks
• Use stairs for cardio and step-ups

**Minimal Equipment:**
• Resistance bands (portable and versatile)
• Dumbbells or kettlebells
• Pull-up bar

**Gym Access:**
• Barbells for heavy compound lifts
• Variety of machines and weights
• Social motivation

Start where you are with what you have. Consistency > Equipment!`,
      confidence: 0.8,
      category: 'equipment'
    }
  ];

  /**
   * Find the best response for a given message
   */
  async findResponse(message: string): Promise<{ content: string; confidence: number }> {
    const cleanMessage = message.toLowerCase().trim();
    
    let bestMatch: KnowledgeItem | null = null;
    let bestScore = 0;

    for (const item of this.knowledgeBase) {
      const score = this.calculateRelevanceScore(cleanMessage, item);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && bestScore > 0.3) {
      return {
        content: bestMatch.response,
        confidence: bestScore * bestMatch.confidence
      };
    }

    // Default motivational response
    return {
      content: `I'm here to help you crush your fitness goals! 💪 Ask me about workouts, nutrition, form, motivation, or anything fitness-related. Let's make today count! 🔥`,
      confidence: 0.5
    };
  }

  /**
   * Calculate relevance score between message and knowledge item
   */
  private calculateRelevanceScore(message: string, item: KnowledgeItem): number {
    let score = 0;
    const words = message.split(' ');

    for (const pattern of item.patterns) {
      const patternWords = pattern.toLowerCase().split(' ');
      
      // Check for exact pattern match
      if (message.includes(pattern.toLowerCase())) {
        score += 0.8;
        continue;
      }

      // Check for word overlap
      let wordMatches = 0;
      for (const word of words) {
        if (patternWords.some(pw => pw.includes(word) || word.includes(pw))) {
          wordMatches++;
        }
      }

      const wordScore = wordMatches / Math.max(words.length, patternWords.length);
      score += wordScore * 0.5;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Add new knowledge item
   */
  addKnowledgeItem(item: KnowledgeItem): void {
    this.knowledgeBase.push(item);
  }

  /**
   * Get total number of knowledge items
   */
  getKnowledgeCount(): number {
    return this.knowledgeBase.length;
  }

  /**
   * Get knowledge items by category
   */
  getKnowledgeByCategory(category: string): KnowledgeItem[] {
    return this.knowledgeBase.filter(item => item.category === category);
  }

  /**
   * Get all available categories
   */
  getCategories(): string[] {
    return [...new Set(this.knowledgeBase.map(item => item.category))];
  }
}