// =====================================================================================
// 🧠 COMPLETE LOCAL KNOWLEDGE BASE - TYPESCRIPT IMPLEMENTATION
// =====================================================================================
// File: src/utils/localKnowledge.ts
// Replace your current localKnowledge.ts with this complete version

// =====================================================================================
// 🎯 TYPE DEFINITIONS
// =====================================================================================

export interface ExerciseData {
  name: string;
  muscles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  description: string;
  instructions: string[];
  commonMistakes: string[];
  safetyTips: string[];
  variations?: string[];
  progressions?: string[];
}

export interface NutritionInfo {
  recommendation: string;
  sources: string[];
  timing: string;
  benefits: string[];
  dailyIntake?: string;
  notes?: string[];
}

export interface WorkoutPlan {
  level: 'beginner' | 'intermediate' | 'advanced';
  frequency: string;
  structure: string;
  exercises: string[];
  principles: string[];
  progressionTips: string[];
}

export interface MotivationalContent {
  encouragement: Record<string, string>;
  daily_quotes: string[];
  success_principles: string[];
  mindset_tips: string[];
}

// =====================================================================================
// 📊 EXERCISE DATABASE
// =====================================================================================

export const EXERCISE_DATABASE: Record<string, ExerciseData> = {
  squat: {
    name: 'Squat',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    difficulty: 'Beginner',
    equipment: ['Bodyweight', 'Barbell', 'Dumbbells'],
    description: 'The king of all exercises - a fundamental movement pattern that builds lower body strength and power.',
    instructions: [
      'Stand with feet shoulder-width apart, toes slightly pointed out',
      'Keep your chest up and core engaged',
      'Lower your body by pushing your hips back and bending your knees',
      'Descend until your thighs are parallel to the floor',
      'Drive through your heels to return to the starting position',
      'Keep your knees tracking over your toes throughout the movement'
    ],
    commonMistakes: [
      'Knees caving inward',
      'Not going deep enough',
      'Leaning too far forward',
      'Rising up on toes',
      'Not engaging the core'
    ],
    safetyTips: [
      'Always warm up before squatting',
      'Start with bodyweight before adding weight',
      'Keep your core tight throughout',
      'Don\'t let your knees cave inward',
      'Stop if you feel sharp pain'
    ]
  },

  deadlift: {
    name: 'Deadlift',
    muscles: ['Hamstrings', 'Glutes', 'Erector Spinae', 'Traps', 'Lats'],
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Dumbbells'],
    description: 'A compound movement that works the entire posterior chain and builds total-body strength.',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at hips and knees, grip the bar with hands just outside legs',
      'Keep chest up and shoulders back',
      'Drive through heels and extend hips and knees simultaneously',
      'Keep the bar close to your body throughout the movement',
      'Stand tall at the top, then reverse the movement'
    ],
    commonMistakes: [
      'Bar drifting away from the body',
      'Rounding the back',
      'Hyperextending at the top',
      'Using arms to lift instead of legs and hips',
      'Looking up instead of keeping neutral neck'
    ],
    safetyTips: [
      'Master the hip hinge movement first',
      'Keep your back neutral throughout',
      'Start with light weight to learn proper form',
      'Use proper footwear with flat soles',
      'Don\'t deadlift if you have lower back pain'
    ]
  },

  pushup: {
    name: 'Push-up',
    muscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    difficulty: 'Beginner',
    equipment: ['Bodyweight'],
    description: 'A classic bodyweight exercise that builds upper body and core strength.',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Keep your body in a straight line from head to heels',
      'Lower your chest toward the floor by bending your elbows',
      'Push back up to the starting position',
      'Keep your core tight throughout the movement'
    ],
    commonMistakes: [
      'Sagging hips',
      'Flaring elbows too wide',
      'Not going through full range of motion',
      'Looking up instead of keeping neutral neck',
      'Rushing the movement'
    ],
    safetyTips: [
      'Modify on knees if needed',
      'Keep wrists aligned under shoulders',
      'Engage your core to protect your lower back',
      'Progress gradually',
      'Stop if you feel wrist or shoulder pain'
    ]
  },

  pullup: {
    name: 'Pull-up',
    muscles: ['Lats', 'Rhomboids', 'Biceps', 'Rear Delts'],
    difficulty: 'Advanced',
    equipment: ['Pull-up bar'],
    description: 'An excellent upper body pulling exercise that builds back and arm strength.',
    instructions: [
      'Hang from the bar with palms facing away, hands shoulder-width apart',
      'Start with arms fully extended',
      'Pull your body up until your chin clears the bar',
      'Lower yourself back down with control',
      'Keep your core engaged throughout'
    ],
    commonMistakes: [
      'Using momentum to swing up',
      'Not going through full range of motion',
      'Shrugging shoulders at the top',
      'Crossing legs or kicking',
      'Gripping too wide or too narrow'
    ],
    safetyTips: [
      'Build up to pull-ups with assisted variations',
      'Use proper grip to avoid slipping',
      'Don\'t drop down quickly - control the descent',
      'Warm up shoulders and arms first',
      'Progress gradually'
    ]
  },

  plank: {
    name: 'Plank',
    muscles: ['Core', 'Shoulders', 'Glutes'],
    difficulty: 'Beginner',
    equipment: ['Bodyweight'],
    description: 'An isometric core exercise that builds stability and endurance.',
    instructions: [
      'Start in a push-up position',
      'Lower down to your forearms',
      'Keep your body in a straight line from head to heels',
      'Hold this position while breathing normally',
      'Keep your core tight and glutes engaged'
    ],
    commonMistakes: [
      'Sagging hips',
      'Raising hips too high',
      'Holding breath',
      'Looking up instead of down',
      'Placing forearms too wide'
    ],
    safetyTips: [
      'Start with shorter holds and build up',
      'Keep breathing throughout',
      'Stop if you feel lower back pain',
      'Modify on knees if needed',
      'Focus on quality over duration'
    ]
  }
};

// =====================================================================================
// 🥗 NUTRITION DATABASE
// =====================================================================================

export const NUTRITION_DATABASE: Record<string, NutritionInfo> = {
  protein: {
    recommendation: 'Consume 0.8-1.2g per pound of bodyweight daily for muscle building and recovery',
    sources: ['Lean meats', 'Fish', 'Eggs', 'Dairy', 'Legumes', 'Protein powder'],
    timing: 'Spread throughout the day, with emphasis post-workout',
    benefits: [
      'Muscle protein synthesis',
      'Tissue repair and recovery',
      'Satiety and appetite control',
      'Metabolic boost'
    ],
    dailyIntake: '0.8-1.2g per lb bodyweight',
    notes: ['Quality matters - choose complete proteins when possible']
  },

  carbohydrates: {
    recommendation: 'Primary energy source - time around workouts for optimal performance',
    sources: ['Whole grains', 'Fruits', 'Vegetables', 'Sweet potatoes', 'Oats'],
    timing: 'Pre and post-workout, moderate throughout the day',
    benefits: [
      'Primary fuel for workouts',
      'Glycogen replenishment',
      'Brain function',
      'Recovery enhancement'
    ],
    notes: ['Choose complex carbs over simple sugars for sustained energy']
  },

  fats: {
    recommendation: '20-30% of total daily calories from healthy fat sources',
    sources: ['Nuts', 'Seeds', 'Olive oil', 'Avocado', 'Fatty fish', 'Coconut oil'],
    timing: 'Throughout the day, avoid immediately pre-workout',
    benefits: [
      'Hormone production',
      'Vitamin absorption',
      'Satiety',
      'Brain health'
    ],
    notes: ['Focus on unsaturated fats, limit trans fats']
  }
};

// =====================================================================================
// 🏋️ WORKOUT PLANS DATABASE
// =====================================================================================

export const WORKOUT_PLANS: Record<string, WorkoutPlan> = {
  beginner: {
    level: 'beginner',
    frequency: '3 days per week (Monday, Wednesday, Friday)',
    structure: 'Full body workouts focusing on fundamental movement patterns',
    exercises: [
      'Bodyweight squats',
      'Push-ups (modified as needed)',
      'Planks',
      'Walking or light cardio',
      'Basic stretching routine'
    ],
    principles: [
      'Focus on learning proper form over intensity',
      'Start with bodyweight movements',
      'Build consistency and routine first',
      'Progress gradually - add reps before adding weight',
      'Listen to your body and rest when needed'
    ],
    progressionTips: [
      'Master bodyweight before adding external resistance',
      'Increase reps and sets before increasing difficulty',
      'Focus on mind-muscle connection',
      'Track your workouts to monitor progress'
    ]
  },

  intermediate: {
    level: 'intermediate',
    frequency: '4-5 days per week',
    structure: 'Upper/lower split or push/pull/legs routine',
    exercises: [
      'Goblet squats or barbell squats',
      'Deadlifts (Romanian or conventional)',
      'Bench press or push-ups',
      'Rows (dumbbell or barbell)',
      'Overhead press',
      'Pull-ups or lat pulldowns'
    ],
    principles: [
      'Add progressive overload through weight, reps, or sets',
      'Include compound movements as the foundation',
      'Track your lifts and aim for consistent progression',
      'Incorporate both strength and endurance training',
      'Focus on proper form while challenging yourself'
    ],
    progressionTips: [
      'Increase weight by 2.5-5lbs when you can complete all sets with good form',
      'Add variety to prevent plateaus',
      'Consider working with a trainer for technique refinement',
      'Implement periodization in your training'
    ]
  },

  advanced: {
    level: 'advanced',
    frequency: '5-6 days per week',
    structure: 'Specialized programs with periodization and specific goals',
    exercises: [
      'Competition lifts (squat, bench, deadlift)',
      'Olympic lifts or derivatives',
      'Advanced movement patterns',
      'Accessory work targeting weak points',
      'Sport-specific training'
    ],
    principles: [
      'Use periodization strategies (linear, undulating, block)',
      'Focus on specific goals (strength, power, aesthetics)',
      'Include advanced techniques (drop sets, clusters, etc.)',
      'Monitor recovery carefully and adjust accordingly',
      'Regularly assess and adjust your program'
    ],
    progressionTips: [
      'Work with experienced coaches for program design',
      'Use objective measures to track progress',
      'Implement deload weeks regularly',
      'Consider specialized programs for specific goals'
    ]
  }
};

// =====================================================================================
// 💪 MOTIVATIONAL CONTENT
// =====================================================================================

export const MOTIVATIONAL_CONTENT: MotivationalContent = {
  encouragement: {
    general: 'Every step forward is progress, no matter how small. You\'re building the foundation for a stronger, healthier you!',
    struggling: 'Every champion was once a beginner who refused to give up. Your struggles today are building the mental and physical strength you\'ll need for tomorrow.',
    plateau: 'Plateaus aren\'t roadblocks - they\'re launching pads! Your body has adapted to your current routine, which means it\'s time to challenge yourself in new ways.',
    comeback: 'Comebacks are always stronger than setbacks. You have experience now that you didn\'t have before. Use that knowledge and be patient with your body.',
    beginner: 'Welcome to the beginning of an amazing journey! Every expert was once a beginner. Focus on building habits, not perfection.',
    advanced: 'Your dedication has brought you this far! Remember that even at your level, the fundamentals matter most.'
  },

  daily_quotes: [
    'The only bad workout is the one that didn\'t happen.',
    'Your body can do it. It\'s your mind you need to convince.',
    'Progress, not perfection, is the goal.',
    'Strong is the new skinny.',
    'You are your only limit.',
    'The pain you feel today will be the strength you feel tomorrow.',
    'Champions train, losers complain.',
    'Your future self will thank you.',
    'Consistency is the mother of mastery.',
    'Every rep counts, every day matters.',
    'Discipline is choosing between what you want now and what you want most.',
    'The hardest part is showing up.'
  ],

  success_principles: [
    'Consistency beats perfection every time',
    'Focus on systems and habits, not just goals',
    'Progress is not always linear - expect ups and downs',
    'Small improvements compound over time',
    'Listen to your body and rest when needed'
  ],

  mindset_tips: [
    'View challenges as opportunities to grow stronger',
    'Compare yourself to who you were yesterday, not to others',
    'Focus on what your body can do, not just how it looks',
    'Treat setbacks as learning experiences',
    'Remember that discipline is self-love in action'
  ]
};

// =====================================================================================
// 🔧 COMPLETE UTILITY FUNCTIONS
// =====================================================================================

export class LocalKnowledgeUtils {
  static checkSafetyFlags(message: string): string[] {
    const redFlags = [
      'chest pain', 'severe shortness of breath', 'dizziness', 'fainting', 
      'severe joint pain', 'sharp pain', 'numbness', 'tingling'
    ];
    const normalizedMessage = message.toLowerCase();
    return redFlags.filter(flag => normalizedMessage.includes(flag));
  }

  static getExercise(name: string): ExerciseData | null {
    const normalizedName = name.toLowerCase().trim();
    return EXERCISE_DATABASE[normalizedName] || null;
  }

  static findExercisesByMuscle(muscle: string): ExerciseData[] {
    const normalizedMuscle = muscle.toLowerCase();
    return Object.values(EXERCISE_DATABASE).filter(exercise =>
      exercise.muscles.some(m => m.toLowerCase().includes(normalizedMuscle))
    );
  }

  static getNutritionInfo(macronutrient: string): NutritionInfo | null {
    const normalizedMacro = macronutrient.toLowerCase();
    return NUTRITION_DATABASE[normalizedMacro] || null;
  }

  static getRandomMotivation(): string {
    const quotes = MOTIVATIONAL_CONTENT.daily_quotes;
    return quotes[Math.floor(Math.random() * quotes.length)] || 'Keep pushing forward! 💪';
  }

  static getMotivationByState(state: string): string {
    const normalizedState = state.toLowerCase();
    const encouragement = MOTIVATIONAL_CONTENT.encouragement[normalizedState];
    return encouragement || MOTIVATIONAL_CONTENT.encouragement.general;
  }

  static getWorkoutPlan(level: string): WorkoutPlan | null {
    const normalizedLevel = level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
    return WORKOUT_PLANS[normalizedLevel] || null;
  }

  static validateInput(input: string): { isValid: boolean; message?: string } {
    if (!input || input.trim().length === 0) {
      return { isValid: false, message: 'Input cannot be empty' };
    }
    
    if (input.length > 5000) {
      return { isValid: false, message: 'Input is too long' };
    }
    
    // Check for potential harmful content
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i
    ];
    
    if (dangerousPatterns.some(pattern => pattern.test(input))) {
      return { isValid: false, message: 'Input contains potentially harmful content' };
    }
    
    return { isValid: true };
  }

  // Additional utility methods for comprehensive functionality
  static getAllExercises(): ExerciseData[] {
    return Object.values(EXERCISE_DATABASE);
  }

  static getExercisesByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): ExerciseData[] {
    return Object.values(EXERCISE_DATABASE).filter(exercise => exercise.difficulty === difficulty);
  }

  static searchExercises(query: string): ExerciseData[] {
    const normalizedQuery = query.toLowerCase();
    return Object.values(EXERCISE_DATABASE).filter(exercise =>
      exercise.name.toLowerCase().includes(normalizedQuery) ||
      exercise.muscles.some(muscle => muscle.toLowerCase().includes(normalizedQuery)) ||
      exercise.equipment.some(equipment => equipment.toLowerCase().includes(normalizedQuery))
    );
  }

  static getRandomWorkoutTip(): string {
    const tips = [
      'Remember to warm up before every workout!',
      'Proper form is more important than heavy weight.',
      'Stay hydrated throughout your workout.',
      'Don\'t forget to cool down and stretch after exercising.',
      'Listen to your body - rest when you need it.',
      'Progressive overload is key to continuous improvement.',
      'Compound movements give you the most bang for your buck.',
      'Consistency beats intensity every time.'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }
}

// =====================================================================================
// 📤 EXPORTS
// =====================================================================================

export const LocalKnowledge = {
  EXERCISE_DATABASE,
  NUTRITION_DATABASE,
  WORKOUT_PLANS,
  MOTIVATIONAL_CONTENT,
  utils: LocalKnowledgeUtils
};

export const utils = LocalKnowledgeUtils;
export default LocalKnowledge;