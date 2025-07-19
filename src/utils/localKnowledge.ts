// =====================================================================================
// 🧠 LOCAL KNOWLEDGE BASE - TYPESCRIPT IMPLEMENTATION
// =====================================================================================
// Created by Himanshu (himanshu1614)
// Complete fitness knowledge database with type safety
// FILE LOCATION: src/utils/localKnowledge.ts

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

export interface MealTimingInfo {
  timing: string;
  focus: string;
  examples: string[];
  avoid?: string;
  ratio?: string;
  notes?: string[];
}

export interface HydrationInfo {
  baseline: string;
  exercise: string;
  indicators: string[];
  electrolytes: {
    sodium: string;
    potassium: string;
    magnesium: string;
  };
  tips: string[];
}

export interface SupplementInfo {
  evidence_based: Record<string, {
    dosage: string;
    benefits: string;
    timing: string;
    notes?: string;
  }>;
  not_recommended: string[];
  general_advice: string[];
}

export interface WorkoutPlan {
  level: 'beginner' | 'intermediate' | 'advanced';
  frequency: string;
  structure: string;
  exercises: string[];
  principles: string[];
  progressionTips: string[];
}

export interface SafetyProtocol {
  redFlags: string[];
  emergencyResponse: string;
  generalGuidelines: string[];
  warningMessages: Record<string, string>;
}

export interface MotivationalContent {
  encouragement: Record<string, string | string[]>;
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
    equipment: ['Bodyweight', 'Barbell', 'Dumbbells', 'Goblet'],
    description: 'The king of all exercises - a fundamental movement pattern that builds lower body strength and power.',
    instructions: [
      'Stand with feet shoulder-width apart, toes slightly pointed out',
      'Keep your chest up and core engaged throughout the movement',
      'Initiate the movement by pushing your hips back and bending your knees',
      'Lower until your thighs are parallel to the ground (or as low as mobility allows)',
      'Drive through your heels to return to the starting position',
      'Keep your knees tracking in line with your toes'
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse)',
      'Forward lean with chest dropping',
      'Not going deep enough (partial range of motion)',
      'Weight shifting to toes instead of heels',
      'Rounding the lower back at the bottom'
    ],
    safetyTips: [
      'Always warm up with bodyweight squats first',
      'Focus on mobility before adding weight',
      'Start with bodyweight and progress gradually',
      'Keep your core tight throughout the movement',
      'Don\'t sacrifice form for deeper range of motion'
    ],
    variations: [
      'Goblet Squat (beginner-friendly)',
      'Front Squat (quad emphasis)',
      'Bulgarian Split Squat (unilateral)',
      'Jump Squat (explosive power)'
    ],
    progressions: [
      'Bodyweight squat → Goblet squat → Barbell back squat',
      'Box squat for learning proper depth',
      'Wall squat for form practice'
    ]
  },

  deadlift: {
    name: 'Deadlift',
    muscles: ['Hamstrings', 'Glutes', 'Erector Spinae', 'Trapezius', 'Forearms'],
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Dumbbells', 'Kettlebell'],
    description: 'The ultimate posterior chain exercise that builds total-body strength and power.',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Hinge at the hips and grab the bar with hands just outside your legs',
      'Keep your chest up and shoulders back',
      'Drive through your heels and squeeze your glutes to lift the bar',
      'Keep the bar close to your body throughout the movement',
      'Stand tall at the top, then reverse the movement to lower'
    ],
    commonMistakes: [
      'Rounding the back (especially lower back)',
      'Bar drifting away from the body',
      'Not engaging the lats to keep bar close',
      'Hyperextending at the top',
      'Not hinging at the hips properly'
    ],
    safetyTips: [
      'Master the hip hinge pattern first',
      'Start with light weight and focus on form',
      'Keep your core braced throughout',
      'Don\'t look up - maintain neutral neck',
      'Use proper footwear (flat, stable shoes)'
    ]
  },

  'bench press': {
    name: 'Bench Press',
    muscles: ['Pectorals', 'Anterior Deltoids', 'Triceps'],
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Bench', 'Dumbbells'],
    description: 'The premier upper body pushing exercise for building chest, shoulder, and tricep strength.',
    instructions: [
      'Lie on the bench with eyes under the barbell',
      'Plant your feet firmly on the ground',
      'Grab the bar with hands slightly wider than shoulder-width',
      'Create a slight arch in your back and squeeze your shoulder blades',
      'Lower the bar to your chest with control',
      'Press the bar back up in a straight line'
    ],
    commonMistakes: [
      'Bouncing the bar off the chest',
      'Flaring elbows too wide (90+ degrees)',
      'Not using leg drive',
      'Lifting feet off the ground',
      'Not retracting shoulder blades'
    ],
    safetyTips: [
      'Always use a spotter when lifting heavy',
      'Set safety bars at appropriate height',
      'Warm up thoroughly before heavy sets',
      'Don\'t train to failure without a spotter',
      'Keep wrists straight and strong'
    ]
  },

  plank: {
    name: 'Plank',
    muscles: ['Core', 'Shoulders', 'Glutes'],
    difficulty: 'Beginner',
    equipment: ['Bodyweight'],
    description: 'A fundamental core stability exercise that builds strength and endurance.',
    instructions: [
      'Start in a push-up position with forearms on the ground',
      'Keep your body in a straight line from head to heels',
      'Engage your core and squeeze your glutes',
      'Breathe normally while holding the position',
      'Focus on quality over duration'
    ],
    commonMistakes: [
      'Letting hips sag or pike up',
      'Holding breath',
      'Looking up instead of down',
      'Not engaging glutes',
      'Putting too much weight on forearms'
    ],
    safetyTips: [
      'Start with shorter holds and build up',
      'Focus on perfect form over time',
      'Stop if you feel lower back pain',
      'Keep breathing throughout the hold'
    ]
  }
};

// =====================================================================================
// 🥗 NUTRITION DATABASE
// =====================================================================================

export const NUTRITION_DATABASE = {
  macronutrients: {
    protein: {
      recommendation: '1.6-2.2g per kg bodyweight for active individuals',
      sources: [
        'Lean chicken breast',
        'Fish (salmon, tuna, cod)',
        'Eggs and egg whites',
        'Greek yogurt',
        'Cottage cheese',
        'Lean beef',
        'Legumes (beans, lentils)',
        'Tofu and tempeh',
        'Protein powder (whey, casein, plant-based)'
      ],
      timing: 'Distribute evenly throughout the day, with emphasis post-workout',
      benefits: [
        'Muscle protein synthesis',
        'Increased satiety',
        'Metabolic boost (thermic effect)',
        'Muscle preservation during weight loss',
        'Improved recovery from exercise'
      ],
      dailyIntake: 'Aim for 20-40g per meal',
      notes: [
        'Complete proteins contain all essential amino acids',
        'Plant proteins should be varied for complete amino acid profile',
        'Post-workout protein within 2 hours is optimal'
      ]
    },

    carbohydrates: {
      recommendation: '3-7g per kg bodyweight depending on activity level',
      sources: [
        'Whole grains (oats, brown rice, quinoa)',
        'Fruits (bananas, berries, apples)',
        'Vegetables (sweet potatoes, regular potatoes)',
        'Legumes (beans, lentils)',
        'Whole grain bread and pasta'
      ],
      timing: 'Focus around workouts for energy and recovery',
      benefits: [
        'Primary energy source for high-intensity exercise',
        'Glycogen replenishment',
        'Brain function support',
        'Protein sparing effect',
        'Improved workout performance'
      ],
      dailyIntake: 'Varies greatly based on activity level and goals'
    },

    fats: {
      recommendation: '0.8-1.2g per kg bodyweight (20-35% of total calories)',
      sources: [
        'Avocados',
        'Nuts and seeds',
        'Olive oil and olives',
        'Fatty fish (salmon, mackerel)',
        'Coconut oil',
        'Grass-fed butter',
        'Dark chocolate (85%+ cacao)'
      ],
      timing: 'Throughout the day, but limit close to workouts',
      benefits: [
        'Hormone production support',
        'Vitamin absorption (A, D, E, K)',
        'Satiety and meal satisfaction',
        'Essential fatty acid provision',
        'Anti-inflammatory effects (omega-3s)'
      ]
    }
  },

  meal_timing: {
    pre_workout: {
      timing: '30-90 minutes before exercise',
      focus: 'Easy-to-digest carbs with moderate protein, minimal fat and fiber',
      examples: [
        'Banana with a small amount of almond butter',
        'Oatmeal with berries',
        'Greek yogurt with honey',
        'Toast with jam',
        'Apple with a small piece of cheese',
        'Sports drink for workouts >90 minutes'
      ],
      avoid: 'High fiber, high fat, or very large meals',
      ratio: '3:1 or 4:1 carbs to protein',
      notes: [
        'Closer to workout = simpler carbs',
        'Individual tolerance varies greatly',
        'Hydrate well before training'
      ]
    },

    post_workout: {
      timing: 'Within 30-120 minutes after exercise',
      focus: 'Protein for recovery, carbs to replenish glycogen',
      examples: [
        'Protein shake with banana',
        'Chocolate milk',
        'Greek yogurt with granola',
        'Chicken and rice',
        'Tuna sandwich',
        'Eggs with toast'
      ],
      ratio: '3:1 carbs to protein for endurance, 1:1 for strength training',
      notes: [
        'Window is longer than previously thought',
        'Total daily intake matters more than timing',
        'Whole foods are preferred when possible'
      ]
    },

    throughout_day: {
      timing: 'Every 3-4 hours',
      focus: 'Balanced meals with all macronutrients',
      examples: [
        'Balanced breakfast with protein, carbs, and healthy fats',
        'Lunch with lean protein, complex carbs, and vegetables',
        'Healthy snacks between meals',
        'Dinner focusing on protein and vegetables'
      ]
    }
  },

  hydration: {
    baseline: '35ml per kg bodyweight daily (about 8-10 glasses)',
    exercise: 'Additional 500-750ml per hour of intense exercise',
    indicators: [
      'Pale yellow urine (like lemonade)',
      'Minimal thirst throughout the day',
      'Good energy levels',
      'Skin elasticity (pinch test)',
      'Moist mouth and lips'
    ],
    electrolytes: {
      sodium: '200-400mg per hour during exercise lasting >60 minutes',
      potassium: 'Focus on fruits and vegetables for natural sources',
      magnesium: '400mg daily for optimal muscle and nerve function'
    },
    tips: [
      'Start hydrating early in the day',
      'Monitor urine color as a hydration gauge',
      'Increase intake in hot weather or during illness',
      'Don\'t wait until you\'re thirsty to drink'
    ]
  },

  supplementation: {
    evidence_based: {
      creatine: {
        dosage: '3-5g daily (loading phase not necessary)',
        benefits: 'Increased power output, muscle mass, and exercise performance',
        timing: 'Anytime - consistency matters more than timing',
        notes: 'One of the most researched and effective supplements'
      },
      protein_powder: {
        dosage: '20-40g per serving as needed',
        benefits: 'Convenient protein source, muscle building support',
        timing: 'Post-workout or between meals when whole foods aren\'t available',
        notes: 'Not necessary if meeting protein needs through whole foods'
      },
      vitamin_d: {
        dosage: '1000-4000 IU daily (depending on blood levels)',
        benefits: 'Bone health, immune function, mood support',
        timing: 'With fat-containing meal for better absorption',
        notes: 'Many people are deficient, especially in winter months'
      },
      omega_3: {
        dosage: '1-3g daily (EPA + DHA combined)',
        benefits: 'Anti-inflammatory effects, heart health, brain function',
        timing: 'With meals to reduce fishy aftertaste',
        notes: 'Focus on EPA and DHA from fish oil or algae'
      }
    },
    not_recommended: [
      'Fat burners (most are ineffective or unsafe)',
      'Testosterone boosters (minimal evidence)',
      'Detox teas and cleanses',
      'Mega-dose vitamins (unless deficient)',
      'Expensive proprietary blends'
    ],
    general_advice: [
      'Supplements supplement a good diet, they don\'t replace it',
      'Focus on whole foods first',
      'Buy from reputable companies with third-party testing',
      'Consult healthcare providers before starting new supplements'
    ]
  }
};

// =====================================================================================
// 💪 MOTIVATIONAL CONTENT
// =====================================================================================

export const MOTIVATIONAL_CONTENT: MotivationalContent = {
  encouragement: {
    general: 'Every step forward is progress, no matter how small. You\'re building the foundation for a stronger, healthier you!',
    
    struggling: 'Every champion was once a beginner who refused to give up. Your struggles today are building the mental and physical strength you\'ll need for tomorrow. Each rep, each workout, each healthy choice is an investment in your future self.',
    
    plateau: 'Plateaus aren\'t roadblocks - they\'re launching pads! Your body has adapted to your current routine, which means it\'s time to challenge yourself in new ways. This is where real growth happens. Trust the process and embrace the challenge.',
    
    comeback: 'Comebacks are always stronger than setbacks. You have experience now that you didn\'t have before. Use that knowledge, be patient with your body, and remember that consistency beats perfection every single time.',
    
    beginner: 'Welcome to the beginning of an amazing journey! Every expert was once a beginner. Focus on building habits, not perfection. Celebrate every small win - they add up to incredible transformations.',
    
    advanced: 'Your dedication has brought you this far, and that\'s incredible! Remember that even at your level, the fundamentals matter most. Keep challenging yourself while staying true to what got you here.'
  },

  daily_quotes: [
    'The only bad workout is the one that didn\'t happen.',
    'Your body can do it. It\'s your mind you need to convince.',
    'Progress, not perfection, is the goal.',
    'Strong is the new skinny.',
    'You are your only limit.',
    'Fall seven times, get up eight.',
    'The pain you feel today will be the strength you feel tomorrow.',
    'Champions train, losers complain.',
    'Your future self will thank you.',
    'Consistency is the mother of mastery.',
    'The hardest lift is lifting yourself off the couch.',
    'Sweat is just fat crying.',
    'Make yourself proud.',
    'You don\'t have to be great to get started, but you have to get started to be great.',
    'The body achieves what the mind believes.'
  ],

  success_principles: [
    'Consistency beats perfection every time',
    'Focus on systems and habits, not just goals',
    'Progress is not always linear - expect ups and downs',
    'Small improvements compound over time',
    'Listen to your body and rest when needed',
    'Celebrate small victories along the way',
    'The journey is just as important as the destination'
  ],

  mindset_tips: [
    'View challenges as opportunities to grow stronger',
    'Compare yourself to who you were yesterday, not to others',
    'Focus on what your body can do, not just how it looks',
    'Treat setbacks as learning experiences',
    'Remember that discipline is self-love in action',
    'Visualize your success and work backwards from there',
    'Surround yourself with people who support your goals'
  ]
};

// =====================================================================================
// 🛡️ SAFETY PROTOCOLS
// =====================================================================================

export const SAFETY_PROTOCOLS: SafetyProtocol = {
  redFlags: [
    'chest pain',
    'severe shortness of breath',
    'dizziness or fainting',
    'nausea or vomiting during exercise',
    'severe joint pain',
    'sharp or shooting pains',
    'numbness or tingling',
    'irregular heartbeat',
    'excessive fatigue'
  ],

  emergencyResponse: `🚨 IMMEDIATE ACTION REQUIRED:
1. Stop all physical activity immediately
2. Seek emergency medical attention if experiencing:
   - Chest pain or pressure
   - Severe difficulty breathing
   - Fainting or near-fainting
   - Severe nausea or vomiting
3. Call emergency services (911) if symptoms are severe
4. Contact your healthcare provider for any concerning symptoms`,

  generalGuidelines: [
    'Always warm up before intense exercise',
    'Cool down and stretch after workouts',
    'Stay hydrated before, during, and after exercise',
    'Listen to your body - pain is different from discomfort',
    'Progress gradually - increase intensity by no more than 10% per week',
    'Get adequate rest and recovery between sessions',
    'Use proper form over lifting heavy weights',
    'Consult a healthcare provider before starting a new exercise program'
  ],

  warningMessages: {
    pain: 'Pain is your body\'s warning signal. Stop the exercise and assess the situation.',
    fatigue: 'Excessive fatigue may indicate overtraining. Consider reducing intensity or taking extra rest.',
    injury: 'Any acute injury should be evaluated by a healthcare professional.',
    breathing: 'Difficulty breathing during exercise may indicate a serious condition requiring immediate attention.',
    heart: 'Irregular heartbeat or chest pain requires immediate medical evaluation.'
  }
};

// =====================================================================================
// 🏋️ WORKOUT PLANNING DATABASE
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
      'Basic stretching routine',
      'Glute bridges',
      'Wall sits',
      'Incline push-ups'
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
      'Pull-ups or lat pulldowns',
      'Lunges or step-ups',
      'Planks and core variations'
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
      'Sport-specific training',
      'Advanced core and stability work',
      'Plyometric exercises',
      'Complex training methods'
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
// 🔧 UTILITY FUNCTIONS
// =====================================================================================

export class LocalKnowledgeUtils {
  static checkSafetyFlags(message: string): string[] {
    const normalizedMessage = message.toLowerCase();
    return SAFETY_PROTOCOLS.redFlags.filter(flag => 
      normalizedMessage.includes(flag)
    );
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
    return NUTRITION_DATABASE.macronutrients[normalizedMacro as keyof typeof NUTRITION_DATABASE.macronutrients] || null;
  }

  static getRandomMotivation(): string {
    const quotes = MOTIVATIONAL_CONTENT.daily_quotes;
    return quotes[Math.floor(Math.random() * quotes.length)] || 'Keep pushing forward! 💪';
  }

  static getMotivationByState(state: string): string {
    const normalizedState = state.toLowerCase();
    const encouragement = MOTIVATIONAL_CONTENT.encouragement[normalizedState];
    
    if (typeof encouragement === 'string') {
      return encouragement;
    } else if (Array.isArray(encouragement)) {
      return encouragement[Math.floor(Math.random() * encouragement.length)] || '';
    }
    
    return MOTIVATIONAL_CONTENT.encouragement.general;
  }

  static getWorkoutPlan(level: string): WorkoutPlan | null {
    const normalizedLevel = level.toLowerCase();
    return WORKOUT_PLANS[normalizedLevel] || null;
  }

  static getMealTiming(timing: string): MealTimingInfo | null {
    const normalizedTiming = timing.toLowerCase();
    return NUTRITION_DATABASE.meal_timing[normalizedTiming as keyof typeof NUTRITION_DATABASE.meal_timing] || null;
  }

  static getSupplementInfo(): SupplementInfo {
    return NUTRITION_DATABASE.supplementation;
  }

  static getHydrationInfo(): HydrationInfo {
    return NUTRITION_DATABASE.hydration;
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
}

// =====================================================================================
// 📤 EXPORTS
// =====================================================================================

// Main knowledge database
export const LocalKnowledge = {
  EXERCISE_DATABASE,
  NUTRITION_DATABASE,
  MOTIVATIONAL_CONTENT,
  SAFETY_PROTOCOLS,
  WORKOUT_PLANS,
  utils: LocalKnowledgeUtils
};

// Utility functions
export const utils = LocalKnowledgeUtils;

// Default export
export default LocalKnowledge;