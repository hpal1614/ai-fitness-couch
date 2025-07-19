// =====================================================================================
// 📚 COMPLETE LOCAL KNOWLEDGE IMPLEMENTATION - FIXED ALL MISSING METHODS
// =====================================================================================
// File: src/utils/localKnowledge.ts

export interface KnowledgeItem {
  patterns: string[];
  response: string;
  confidence: number;
  category: string;
  id?: string;
  tags?: string[];
  lastUsed?: number;
  useCount?: number;
}

export interface LocalResponse {
  content: string;
  confidence: number;
  category: string;
  source?: string;
}

export class LocalKnowledge {
  private knowledgeBase: KnowledgeItem[];
  private categories: Set<string>;

  constructor() {
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.categories = new Set();
    this.updateCategories();
  }

  private initializeKnowledgeBase(): KnowledgeItem[] {
    return [
      // Exercise Form Knowledge
      {
        id: 'squat-form',
        patterns: ['squat', 'squats', 'squatting', 'proper squat', 'squat form'],
        response: `🏋️ **Perfect Squat Form Guide:**

**Setup:**
• Stand with feet shoulder-width apart
• Toes slightly pointed outward (15-30°)
• Keep your chest up and core engaged

**Movement:**
• Push your hips back like sitting in a chair
• Keep knees aligned with your toes
• Lower until thighs are parallel to ground
• Drive through your heels to return to standing

**Common Mistakes to Avoid:**
❌ Knees caving inward
❌ Leaning too far forward
❌ Not going deep enough
❌ Lifting heels off the ground

**Pro Tip:** Practice bodyweight squats first to master the movement pattern!`,
        confidence: 0.95,
        category: 'exercise_form',
        tags: ['legs', 'strength', 'compound', 'beginner'],
        useCount: 0
      },
      
      {
        id: 'pushup-form',
        patterns: ['pushup', 'push-up', 'push up', 'pushups', 'proper pushup'],
        response: `💪 **Perfect Push-Up Form Guide:**

**Setup:**
• Start in plank position
• Hands slightly wider than shoulders
• Fingers spread wide for stability
• Body in straight line from head to heels

**Movement:**
• Lower your body until chest nearly touches ground
• Keep elbows at 45° angle to your body
• Push through palms to return to start
• Maintain tight core throughout

**Progressions:**
📈 **Beginner:** Wall push-ups → Incline push-ups → Knee push-ups → Full push-ups
📈 **Advanced:** Diamond push-ups → Archer push-ups → One-arm push-ups

**Common Mistakes:**
❌ Sagging hips
❌ Flaring elbows too wide
❌ Partial range of motion
❌ Holding breath`,
        confidence: 0.95,
        category: 'exercise_form',
        tags: ['chest', 'arms', 'bodyweight', 'beginner'],
        useCount: 0
      },

      {
        id: 'deadlift-form',
        patterns: ['deadlift', 'deadlifts', 'deadlifting', 'proper deadlift'],
        response: `⚡ **Perfect Deadlift Form Guide:**

**Setup:**
• Bar over mid-foot, close to shins
• Feet hip-width apart
• Grip bar with hands just outside legs
• Shoulders over the bar

**Movement:**
• Drive through heels and push floor away
• Keep bar close to your body
• Hips and shoulders rise together
• Stand tall with shoulders back

**Key Points:**
✅ Neutral spine throughout
✅ Chest up, shoulders back
✅ Core braced like someone's going to punch you
✅ Controlled descent

**Safety First:**
⚠️ Start with light weight to master form
⚠️ Never round your back
⚠️ If form breaks down, stop the set`,
        confidence: 0.95,
        category: 'exercise_form',
        tags: ['back', 'legs', 'strength', 'compound'],
        useCount: 0
      },

      // Nutrition Knowledge
      {
        id: 'pre-workout-nutrition',
        patterns: ['pre workout food', 'what to eat before workout', 'pre-workout meal', 'food before exercise'],
        response: `🍎 **Pre-Workout Nutrition Guide:**

**Timing Matters:**
• **2-3 hours before:** Full meal with carbs + protein
• **30-60 minutes before:** Light snack, mostly carbs

**Best Pre-Workout Foods:**
🥖 **Carbs for Energy:**
• Banana with a small amount of nut butter
• Oatmeal with berries
• Toast with honey
• Apple slices

🥛 **Light Protein Options:**
• Greek yogurt
• Small protein shake
• Handful of nuts

**What to Avoid:**
❌ High fat/fiber foods (slow digestion)
❌ Large meals right before training
❌ Foods that cause stomach upset
❌ Too much caffeine on empty stomach

**Hydration:** Drink 16-20oz water 2-3 hours before, then 8oz 15-20 minutes before exercise.`,
        confidence: 0.9,
        category: 'nutrition',
        tags: ['pre-workout', 'meal-timing', 'energy'],
        useCount: 0
      },

      {
        id: 'post-workout-nutrition',
        patterns: ['post workout food', 'what to eat after workout', 'post-workout meal', 'recovery food'],
        response: `🥗 **Post-Workout Recovery Nutrition:**

**The Golden Window:** 30-60 minutes post-workout for optimal recovery

**Recovery Formula:**
🔥 **Protein (20-40g):** Repair and build muscle
🔥 **Carbs (30-60g):** Replenish energy stores
🔥 **Fluids:** Replace sweat losses

**Great Post-Workout Meals:**
• Protein shake with banana
• Greek yogurt with berries and granola
• Chicken and sweet potato
• Tuna and crackers
• Chocolate milk (seriously!)
• Quinoa bowl with vegetables and protein

**Hydration Recovery:**
💧 Drink 16-24oz fluid for every pound lost during exercise
💧 Include electrolytes if you sweat heavily
💧 Monitor urine color (pale yellow = good hydration)

**Pro Tip:** Don't stress if you can't eat immediately - focus on getting quality nutrition within 2 hours!`,
        confidence: 0.9,
        category: 'nutrition',
        tags: ['post-workout', 'recovery', 'protein'],
        useCount: 0
      },

      // Motivation and Mental Health
      {
        id: 'motivation-general',
        patterns: ['motivation', 'motivated', 'give up', 'quit', 'discouraged', 'not motivated'],
        response: `🔥 **Motivation Boost Incoming!**

**Remember Why You Started:**
💪 You're stronger than you think
🎯 Every workout is progress, no matter how small
🏆 Consistency beats perfection every time
⭐ You're building a better version of yourself

**When Motivation Fails, Discipline Saves You:**
📅 Schedule workouts like important appointments
📝 Track your progress (you're doing better than you think!)
👥 Find an accountability partner
🎵 Create an energizing playlist

**Reframe Your Mindset:**
• "I don't have time" → "I haven't made it a priority"
• "I'm not good at this" → "I'm still learning"
• "I'll start Monday" → "I'll start with 10 minutes right now"

**Quick Motivation Hack:** Do just 5 minutes. Often, starting is the hardest part!

**You've got this!** 💪✨`,
        confidence: 0.85,
        category: 'motivation',
        tags: ['mindset', 'discipline', 'consistency'],
        useCount: 0
      },

      // Workout Planning
      {
        id: 'beginner-workout-plan',
        patterns: ['beginner workout', 'start working out', 'workout plan', 'new to fitness'],
        response: `🌟 **Beginner's Workout Plan - Week 1-4:**

**Schedule:** 3-4 days per week, rest days between workouts

**Full Body Workout A:**
• Bodyweight Squats: 2 sets × 8-12 reps
• Push-ups (modified if needed): 2 sets × 5-10 reps
• Plank: 2 sets × 15-30 seconds
• Walking/Marching: 10-15 minutes

**Full Body Workout B:**
• Glute Bridges: 2 sets × 10-15 reps
• Wall Push-ups: 2 sets × 8-12 reps
• Dead Bug: 2 sets × 5 each side
• Stairs/Step-ups: 10-15 minutes

**Week 1-2:** Focus on form, take your time
**Week 3-4:** Increase reps or add 1 more set

**Golden Rules:**
✅ Quality over quantity
✅ Listen to your body
✅ Progress gradually
✅ Celebrate small wins!

Ready to level up from here? Let me know!`,
        confidence: 0.9,
        category: 'workout_planning',
        tags: ['beginner', 'full-body', 'bodyweight'],
        useCount: 0
      },

      // Safety and Injury Prevention
      {
        id: 'workout-safety',
        patterns: ['safety', 'injury', 'hurt', 'pain', 'safe workout'],
        response: `⚠️ **Workout Safety First!**

**Before You Start:**
🔥 Always warm up (5-10 minutes light activity)
🎯 Learn proper form before adding weight
💧 Stay hydrated throughout
👂 Listen to your body

**Red Flags - Stop Immediately:**
❌ Sharp, shooting pain
❌ Pain that gets worse during exercise
❌ Dizziness or nausea
❌ Chest pain or trouble breathing

**Good Pain vs. Bad Pain:**
✅ **Good:** Muscle burn, mild soreness next day
❌ **Bad:** Joint pain, sharp pain, persistent pain

**Injury Prevention:**
• Progress gradually (10% rule)
• Include rest days
• Focus on mobility and flexibility
• Get adequate sleep and nutrition

**When in Doubt:** Consult a healthcare provider or certified trainer.

**Remember:** It's better to take a day off than to take weeks off due to injury!`,
        confidence: 0.95,
        category: 'safety',
        tags: ['injury-prevention', 'pain', 'emergency'],
        useCount: 0
      }
    ];
  }

  private updateCategories(): void {
    this.categories.clear();
    this.knowledgeBase.forEach(item => {
      this.categories.add(item.category);
    });
  }

  async findResponse(message: string): Promise<LocalResponse> {
    const messageWords = message.toLowerCase().split(/\s+/);
    let bestMatch: KnowledgeItem | null = null;
    let highestScore = 0;

    for (const item of this.knowledgeBase) {
      let score = 0;
      
      // Check pattern matches
      for (const pattern of item.patterns) {
        const patternWords = pattern.toLowerCase().split(/\s+/);
        
        // Exact phrase match (higher score)
        if (message.toLowerCase().includes(pattern.toLowerCase())) {
          score += item.confidence * 2;
        }
        
        // Word overlap scoring
        const matchCount = patternWords.filter(patternWord =>
          messageWords.some(messageWord => 
            messageWord.includes(patternWord) || patternWord.includes(messageWord)
          )
        ).length;
        
        const overlapRatio = matchCount / patternWords.length;
        score += overlapRatio * item.confidence;
      }

      // Boost score for high-priority categories
      if (item.category === 'safety' && score > 0) {
        score *= 1.5;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore > 0.3) {
      // Update usage statistics
      bestMatch.useCount = (bestMatch.useCount || 0) + 1;
      bestMatch.lastUsed = Date.now();

      return {
        content: bestMatch.response,
        confidence: Math.min(highestScore, 1.0),
        category: bestMatch.category,
        source: 'local_knowledge'
      };
    }

    return {
      content: '',
      confidence: 0,
      category: 'unknown',
      source: 'local_knowledge'
    };
  }

  getKnowledgeCount(): number {
    return this.knowledgeBase.length;
  }

  getCategories(): string[] {
    return Array.from(this.categories);
  }

  addKnowledgeItem(item: Omit<KnowledgeItem, 'id' | 'useCount' | 'lastUsed'>): void {
    const newItem: KnowledgeItem = {
      ...item,
      id: `custom_${Date.now()}`,
      useCount: 0,
      lastUsed: undefined
    };
    
    this.knowledgeBase.push(newItem);
    this.updateCategories();
  }

  updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>): boolean {
    const index = this.knowledgeBase.findIndex(item => item.id === id);
    if (index !== -1) {
      this.knowledgeBase[index] = { ...this.knowledgeBase[index], ...updates };
      this.updateCategories();
      return true;
    }
    return false;
  }

  removeKnowledgeItem(id: string): boolean {
    const index = this.knowledgeBase.findIndex(item => item.id === id);
    if (index !== -1) {
      this.knowledgeBase.splice(index, 1);
      this.updateCategories();
      return true;
    }
    return false;
  }

  searchKnowledge(query: string, category?: string): KnowledgeItem[] {
    const results = this.knowledgeBase.filter(item => {
      const matchesCategory = !category || item.category === category;
      const matchesQuery = item.patterns.some(pattern =>
        pattern.toLowerCase().includes(query.toLowerCase())
      ) || item.response.toLowerCase().includes(query.toLowerCase());
      
      return matchesCategory && matchesQuery;
    });

    return results.sort((a, b) => (b.useCount || 0) - (a.useCount || 0));
  }

  getStatistics() {
    const totalItems = this.knowledgeBase.length;
    const categoryCounts = new Map<string, number>();
    let totalUsage = 0;

    this.knowledgeBase.forEach(item => {
      const count = categoryCounts.get(item.category) || 0;
      categoryCounts.set(item.category, count + 1);
      totalUsage += item.useCount || 0;
    });

    const mostUsedItems = this.knowledgeBase
      .filter(item => (item.useCount || 0) > 0)
      .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
      .slice(0, 5);

    return {
      totalItems,
      categoryCounts: Object.fromEntries(categoryCounts),
      totalUsage,
      mostUsedItems: mostUsedItems.map(item => ({
        id: item.id,
        category: item.category,
        useCount: item.useCount,
        patterns: item.patterns.slice(0, 2) // First 2 patterns only
      }))
    };
  }

  exportKnowledge(): string {
    return JSON.stringify(this.knowledgeBase, null, 2);
  }

  importKnowledge(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        this.knowledgeBase = imported;
        this.updateCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import knowledge:', error);
      return false;
    }
  }
}

export const LocalKnowledgeUtils = {
  addKnowledge: (knowledge: LocalKnowledge, item: Omit<KnowledgeItem, 'id' | 'useCount' | 'lastUsed'>) => {
    knowledge.addKnowledgeItem(item);
  },
  
  updateKnowledge: (knowledge: LocalKnowledge, id: string, item: Partial<KnowledgeItem>) => {
    return knowledge.updateKnowledgeItem(id, item);
  },

  searchByCategory: (knowledge: LocalKnowledge, category: string) => {
    return knowledge.searchKnowledge('', category);
  },

  getPopularKnowledge: (knowledge: LocalKnowledge, limit: number = 10) => {
    return knowledge.searchKnowledge('').slice(0, limit);
  }
};