// =====================================================================================
// 🧠 LOCAL KNOWLEDGE BASE - AI FITNESS COACH
// =====================================================================================
// Created by Himanshu (himanshu1614)
// Contains: Exercise database, nutrition data, safety guidelines, motivational content
// Purpose: Provides intelligent responses WITHOUT requiring API calls
// FILE LOCATION: src/utils/localKnowledge.js

// =====================================================================================
// 💪 COMPREHENSIVE EXERCISE DATABASE
// =====================================================================================

export const EXERCISE_DATABASE = {
  // COMPOUND MOVEMENTS (Foundation exercises)
  compound: {
    squat: {
      name: 'Squat',
      category: 'compound',
      muscles: ['quadriceps', 'glutes', 'hamstrings', 'core', 'calves'],
      equipment: ['bodyweight', 'barbell', 'dumbbell', 'kettlebell'],
      difficulty: 'intermediate',
      description: 'King of lower body exercises. Functional movement that builds total-body strength.',
      instructions: [
        'Stand with feet slightly wider than hip-width apart',
        'Keep chest up and core engaged throughout movement',
        'Initiate by pushing hips back, then bending knees',
        'Lower until thighs are parallel to floor',
        'Drive through heels to return to starting position'
      ],
      commonMistakes: [
        'Knees caving inward',
        'Forward lean of torso',
        'Not reaching proper depth',
        'Rising onto toes'
      ],
      progressions: ['bodyweight squat', 'goblet squat', 'front squat', 'back squat'],
      regressions: ['box squat', 'assisted squat', 'quarter squat'],
      safetyTips: [
        'Never let knees cave inward',
        'Keep heels on ground throughout movement',
        'Stop if you feel knee or back pain'
      ]
    },
    
    deadlift: {
      name: 'Deadlift',
      category: 'compound',
      muscles: ['hamstrings', 'glutes', 'erector spinae', 'lats', 'traps', 'forearms'],
      equipment: ['barbell', 'dumbbell', 'kettlebell'],
      difficulty: 'advanced',
      description: 'The ultimate posterior chain builder. Develops raw strength and power.',
      instructions: [
        'Stand with feet hip-width apart, bar over mid-foot',
        'Bend at hips and knees to grip bar with hands just outside legs',
        'Keep chest up, shoulders back, core tight',
        'Drive through heels and extend hips to lift bar',
        'Stand tall with shoulders back, then reverse the movement'
      ],
      commonMistakes: [
        'Rounding the back',
        'Bar drifting away from body',
        'Hyperextending at the top',
        'Using arms to pull'
      ],
      progressions: ['trap bar deadlift', 'sumo deadlift', 'Romanian deadlift', 'conventional deadlift'],
      regressions: ['rack pull', 'elevated deadlift', 'resistance band deadlift'],
      safetyTips: [
        'Always maintain neutral spine',
        'Keep bar close to body throughout lift',
        'Start with light weight to master form'
      ]
    },
    
    bench_press: {
      name: 'Bench Press',
      category: 'compound',
      muscles: ['pectorals', 'anterior deltoids', 'triceps', 'serratus anterior'],
      equipment: ['barbell', 'dumbbell'],
      difficulty: 'intermediate',
      description: 'Premier upper body pushing exercise. Builds chest, shoulders, and triceps.',
      instructions: [
        'Lie on bench with eyes under the bar',
        'Grip bar with hands slightly wider than shoulder-width',
        'Plant feet firmly on ground, engage core',
        'Lower bar to chest with control',
        'Press bar up and slightly back toward face'
      ],
      commonMistakes: [
        'Bouncing bar off chest',
        'Flaring elbows too wide',
        'Lifting hips off bench',
        'Using too wide a grip'
      ],
      progressions: ['push-up', 'incline press', 'flat bench', 'decline press'],
      regressions: ['incline push-up', 'knee push-up', 'wall push-up'],
      safetyTips: [
        'Always use a spotter with heavy weight',
        'Don\'t bounce the bar off your chest',
        'Keep wrists straight and strong'
      ]
    }
  },
  
  // UPPER BODY ISOLATION
  isolation_upper: {
    bicep_curl: {
      name: 'Bicep Curl',
      category: 'isolation',
      muscles: ['biceps brachii', 'brachialis', 'brachioradialis'],
      equipment: ['dumbbell', 'barbell', 'cable', 'resistance band'],
      difficulty: 'beginner',
      description: 'Classic arm builder targeting the biceps.',
      instructions: [
        'Stand with feet hip-width apart, holding weights',
        'Keep elbows close to torso throughout movement',
        'Curl weights up by flexing biceps',
        'Squeeze at the top, then lower with control',
        'Don\'t swing or use momentum'
      ],
      variations: ['hammer curl', 'preacher curl', 'concentration curl', 'cable curl'],
      tips: [
        'Focus on the eccentric (lowering) portion',
        'Don\'t fully extend arms at bottom',
        'Keep wrists neutral'
      ]
    },
    
    tricep_extension: {
      name: 'Tricep Extension',
      category: 'isolation',
      muscles: ['triceps brachii'],
      equipment: ['dumbbell', 'cable', 'resistance band'],
      difficulty: 'beginner',
      description: 'Builds the back of the arms for balanced arm development.',
      instructions: [
        'Hold weight overhead with both hands',
        'Keep elbows stationary and pointing forward',
        'Lower weight behind head by bending elbows',
        'Extend arms to return to starting position',
        'Control the movement throughout'
      ],
      variations: ['overhead extension', 'lying extension', 'kickback', 'close-grip push-up'],
      tips: [
        'Keep elbows from flaring out',
        'Don\'t go too heavy initially',
        'Feel the stretch at the bottom'
      ]
    }
  },
  
  // CARDIO EXERCISES
  cardio: {
    running: {
      name: 'Running',
      category: 'cardio',
      muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'core'],
      equipment: ['none', 'treadmill'],
      difficulty: 'beginner',
      description: 'Excellent cardiovascular exercise that burns calories and improves endurance.',
      benefits: [
        'Improves cardiovascular health',
        'Burns significant calories',
        'Strengthens lower body',
        'Releases endorphins',
        'Improves mental health'
      ],
      tips: [
        'Start with run/walk intervals',
        'Land on midfoot, not heel',
        'Maintain upright posture',
        'Breathe rhythmically'
      ],
      progressions: ['walk', 'walk/jog', 'continuous jog', 'running', 'interval training']
    },
    
    cycling: {
      name: 'Cycling',
      category: 'cardio',
      muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
      equipment: ['bicycle', 'stationary bike'],
      difficulty: 'beginner',
      description: 'Low-impact cardio that\'s easy on joints while building leg strength.',
      benefits: [
        'Low impact on joints',
        'Great for active recovery',
        'Builds leg endurance',
        'Environmentally friendly transport'
      ],
      tips: [
        'Adjust seat height properly',
        'Keep slight bend in knee at bottom',
        'Engage core for stability',
        'Vary intensity for best results'
      ]
    }
  },
  
  // CORE/ABS EXERCISES
  core: {
    plank: {
      name: 'Plank',
      category: 'core',
      muscles: ['rectus abdominis', 'transverse abdominis', 'obliques', 'erector spinae'],
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      description: 'Isometric core exercise that builds stability and endurance.',
      instructions: [
        'Start in push-up position',
        'Lower to forearms, keeping body straight',
        'Engage core and glutes',
        'Hold position without sagging or piking',
        'Breathe normally throughout hold'
      ],
      progressions: ['knee plank', 'forearm plank', 'full plank', 'weighted plank'],
      variations: ['side plank', 'plank up-downs', 'plank with leg lifts'],
      tips: [
        'Don\'t hold breath',
        'Keep hips level',
        'Focus on quality over duration'
      ]
    }
  }
};

// =====================================================================================
// 🥗 COMPREHENSIVE NUTRITION DATABASE
// =====================================================================================

export const NUTRITION_DATABASE = {
  // MACRONUTRIENT GUIDELINES
  macronutrients: {
    protein: {
      recommendation: '1.6-2.2g per kg bodyweight for active individuals',
      sources: [
        'lean meats', 'fish', 'eggs', 'dairy', 'legumes', 
        'quinoa', 'tofu', 'protein powder', 'nuts', 'seeds'
      ],
      timing: 'distribute evenly throughout day, especially post-workout',
      benefits: [
        'Muscle protein synthesis',
        'Satiety and appetite control',
        'Metabolic boost',
        'Recovery and repair'
      ]
    },
    
    carbohydrates: {
      recommendation: '3-7g per kg bodyweight based on activity level',
      sources: [
        'oats', 'brown rice', 'sweet potatoes', 'fruits', 
        'vegetables', 'quinoa', 'whole grain bread', 'pasta'
      ],
      timing: 'prioritize around workouts for energy and recovery',
      benefits: [
        'Primary energy source',
        'Muscle glycogen replenishment',
        'Brain function',
        'Exercise performance'
      ]
    },
    
    fats: {
      recommendation: '0.8-1.2g per kg bodyweight',
      sources: [
        'avocados', 'nuts', 'seeds', 'olive oil', 'fatty fish',
        'coconut oil', 'nut butters', 'egg yolks'
      ],
      timing: 'avoid immediately before/after intense exercise',
      benefits: [
        'Hormone production',
        'Vitamin absorption',
        'Satiety',
        'Cell membrane health'
      ]
    }
  },
  
  // HYDRATION GUIDELINES
  hydration: {
    baseline: '35ml per kg bodyweight daily',
    exercise: 'additional 500-750ml per hour of exercise',
    indicators: [
      'pale yellow urine indicates proper hydration',
      'thirst is a late indicator of dehydration',
      'monitor during hot weather and intense exercise'
    ],
    electrolytes: {
      sodium: 'needed during prolonged exercise (>1 hour)',
      potassium: 'important for muscle function',
      magnesium: 'aids in recovery and sleep'
    }
  },
  
  // MEAL TIMING
  meal_timing: {
    pre_workout: {
      timing: '1-3 hours before exercise',
      focus: 'carbohydrates with moderate protein',
      examples: [
        'oatmeal with banana',
        'whole grain toast with peanut butter',
        'greek yogurt with berries'
      ],
      avoid: 'high fat, high fiber foods close to exercise'
    },
    
    post_workout: {
      timing: 'within 30-60 minutes after exercise',
      focus: 'protein and carbohydrates for recovery',
      ratio: '3:1 or 4:1 carbs to protein',
      examples: [
        'protein shake with banana',
        'chocolate milk',
        'chicken and rice',
        'greek yogurt with granola'
      ]
    }
  },
  
  // SUPPLEMENTATION
  supplementation: {
    evidence_based: {
      creatine: {
        dosage: '3-5g daily',
        benefits: 'increased power output, muscle mass',
        timing: 'any time, consistency matters most'
      },
      protein_powder: {
        dosage: '20-40g per serving',
        benefits: 'convenient protein source, recovery',
        timing: 'post-workout or between meals'
      },
      vitamin_d: {
        dosage: '1000-4000 IU daily',
        benefits: 'bone health, immune function, mood',
        timing: 'with meals for better absorption'
      },
      omega_3: {
        dosage: '1-3g EPA/DHA daily',
        benefits: 'inflammation reduction, heart health',
        timing: 'with meals to reduce fishy aftertaste'
      }
    },
    
    not_recommended: [
      'fat burners (limited evidence, potential side effects)',
      'testosterone boosters (natural levels adequate for most)',
      'detox teas (body naturally detoxifies)',
      'BCAAs (whole proteins more effective)'
    ]
  }
};

// =====================================================================================
// 🛡️ SAFETY GUIDELINES & RED FLAGS
// =====================================================================================

export const SAFETY_GUIDELINES = {
  // IMMEDIATE RED FLAGS (Stop exercise immediately)
  red_flags: [
    'chest pain or pressure during exercise',
    'severe shortness of breath',
    'dizziness, lightheadedness, or fainting',
    'severe joint pain or swelling',
    'muscle pain that worsens during activity',
    'nausea or vomiting during exercise',
    'unusual fatigue or weakness'
  ],
  
  // CONTRAINDICATIONS
  contraindications: {
    cardiovascular: [
      'recent heart attack or cardiac surgery',
      'uncontrolled high blood pressure (>180/110)',
      'severe heart rhythm abnormalities',
      'active myocarditis or pericarditis'
    ],
    
    musculoskeletal: [
      'acute muscle, tendon, or ligament injury',
      'severe arthritis with active inflammation',
      'recent surgery or fracture',
      'severe osteoporosis'
    ],
    
    metabolic: [
      'uncontrolled diabetes (blood glucose >250 mg/dL)',
      'severe obesity requiring medical supervision',
      'eating disorder',
      'severe electrolyte imbalances'
    ]
  },
  
  // PROGRESSION PRINCIPLES
  progression_principles: {
    overload: 'gradually increase intensity, duration, or frequency by 5-10% weekly',
    specificity: 'training should match your goals and movement patterns',
    recovery: 'allow 24-48 hours between intense sessions for same muscle groups',
    individuality: 'program must match individual capabilities and limitations',
    reversibility: 'fitness gains are lost without consistent training'
  },
  
  // FORM SAFETY CUES
  form_safety: {
    general: [
      'quality over quantity always',
      'pain is not gain - discomfort is normal, pain is not',
      'maintain neutral spine during exercises',
      'breathe throughout movements - never hold breath',
      'warm up before intense exercise'
    ],
    
    weightlifting: [
      'start with bodyweight before adding load',
      'use full range of motion safely',
      'control both lifting and lowering phases',
      'use spotter for heavy compound movements',
      'don\'t train to failure as a beginner'
    ]
  }
};

// =====================================================================================
// 💬 MOTIVATIONAL CONTENT LIBRARY
// =====================================================================================

export const MOTIVATIONAL_CONTENT = {
  // DAILY MOTIVATION
  daily_quotes: [
    "Every workout counts. Every healthy choice matters. You're building a stronger you!",
    "Progress isn't always visible, but it's always happening. Trust the process!",
    "Your body can do it. It's your mind you need to convince. You've got this!",
    "The hardest part is showing up. You've already won by being here!",
    "Strong is not a size, it's a feeling. Feel your strength growing every day!",
    "You're not just building muscle, you're building discipline, confidence, and resilience!",
    "Every rep is a choice to be better than yesterday. Choose strength!",
    "Your future self is thanking you for every effort you make today!",
    "Fitness is not about being better than someone else. It's about being better than you used to be!",
    "The only bad workout is the one that didn't happen. You're here, you're winning!"
  ],
  
  // ENCOURAGEMENT FOR DIFFERENT SITUATIONS
  encouragement: {
    struggling: [
      "It's okay to struggle - that means you're growing! Every champion has felt this way.",
      "The struggle you're in today is developing the strength you need for tomorrow.",
      "Remember why you started. That reason is still valid, and so are you!",
      "Progress isn't linear. Some days are harder, but you're still moving forward!"
    ],
    
    plateau: [
      "Plateaus are your body's way of adapting. Time to shake things up!",
      "Sometimes we need to take a step back to take two steps forward.",
      "Your body is getting stronger even when the scale doesn't move.",
      "Consistency during plateaus separates the champions from the quitters!"
    ],
    
    comeback: [
      "Welcome back! Every return is a victory over excuses.",
      "You're not starting over, you're starting stronger with more experience.",
      "Your muscles remember, your discipline is building. You've got this!",
      "The best time to restart was yesterday. The second best time is now!"
    ]
  },
  
  // GOAL-SPECIFIC MOTIVATION
  goal_motivation: {
    weight_loss: [
      "You're not just losing weight, you're gaining health, confidence, and years of life!",
      "Every healthy choice is a step towards the person you're becoming!",
      "Focus on how you feel, not just how you look. Energy and strength are victories too!"
    ],
    
    muscle_gain: [
      "Muscle is built in the kitchen and the gym. You're doing both - you're unstoppable!",
      "Every rep is building not just muscle, but mental toughness too!",
      "Patience and consistency are your superpowers. Trust the process!"
    ],
    
    strength: [
      "Strength isn't just physical - you're building mental fortitude with every workout!",
      "You're stronger than you think. Every session proves it a little more!",
      "Power comes from consistency, not just intensity. You're building both!"
    ]
  }
};

// =====================================================================================
// 🧠 INTELLIGENT RESPONSE TEMPLATES
// =====================================================================================

export const RESPONSE_TEMPLATES = {
  // WORKOUT PLANNING
  workout_plan: {
    beginner: "Here's a perfect starter routine focusing on foundational movements...",
    intermediate: "Ready to level up? This progressive plan will challenge you appropriately...",
    advanced: "Time for serious gains! This advanced protocol will push your limits safely..."
  },
  
  // FORM CORRECTIONS
  form_feedback: {
    positive: "Great form awareness! Here's how to perfect that movement...",
    corrective: "I notice some form adjustments that will help you get better results and stay safe...",
    encouraging: "Form takes time to perfect. You're on the right track! Let's fine-tune..."
  },
  
  // NUTRITION GUIDANCE
  nutrition_advice: {
    general: "Nutrition is the foundation of your results. Here's what your body needs...",
    specific: "For your specific goals, let's optimize your nutrition strategy...",
    practical: "Here are simple, actionable nutrition steps you can implement today..."
  }
};

// =====================================================================================
// 🔧 UTILITY FUNCTIONS
// =====================================================================================

export const LocalKnowledgeUtils = {
  // Find exercises by muscle group
  findExercisesByMuscle(targetMuscle) {
    const results = [];
    
    Object.values(EXERCISE_DATABASE).forEach(category => {
      Object.values(category).forEach(exercise => {
        if (exercise.muscles && exercise.muscles.some(muscle => 
          muscle.toLowerCase().includes(targetMuscle.toLowerCase())
        )) {
          results.push(exercise);
        }
      });
    });
    
    return results;
  },
  
  // Get exercise by name
  getExercise(exerciseName) {
    const name = exerciseName.toLowerCase().replace(/\s+/g, '_');
    
    for (const category of Object.values(EXERCISE_DATABASE)) {
      if (category[name]) {
        return category[name];
      }
    }
    
    return null;
  },
  
  // Get nutrition info for specific macronutrient
  getNutritionInfo(macronutrient) {
    const macro = macronutrient.toLowerCase();
    return NUTRITION_DATABASE.macronutrients[macro] || null;
  },
  
  // Check for safety red flags
  checkSafetyFlags(userMessage) {
    const message = userMessage.toLowerCase();
    const redFlags = SAFETY_GUIDELINES.red_flags;
    
    return redFlags.filter(flag => 
      message.includes(flag.toLowerCase())
    );
  },
  
  // Get random motivation
  getRandomMotivation(category = 'daily_quotes') {
    const quotes = MOTIVATIONAL_CONTENT[category];
    if (Array.isArray(quotes)) {
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
    return "You're doing amazing! Keep pushing forward! 💪";
  },
  
  // Intelligent exercise recommendations
  recommendExercises(userGoal, fitnessLevel, equipment = []) {
    const recommendations = [];
    
    // Basic exercise selection logic
    if (userGoal.includes('strength') || userGoal.includes('muscle')) {
      recommendations.push(
        EXERCISE_DATABASE.compound.squat,
        EXERCISE_DATABASE.compound.deadlift,
        EXERCISE_DATABASE.compound.bench_press
      );
    }
    
    if (userGoal.includes('cardio') || userGoal.includes('endurance')) {
      recommendations.push(
        EXERCISE_DATABASE.cardio.running,
        EXERCISE_DATABASE.cardio.cycling
      );
    }
    
    // Filter by equipment availability
    if (equipment.length > 0) {
      return recommendations.filter(exercise => 
        exercise.equipment && exercise.equipment.some(eq => 
          equipment.includes(eq)
        )
      );
    }
    
    return recommendations;
  }
};

// =====================================================================================
// 📊 ANALYTICS DATA
// =====================================================================================

export const ANALYTICS_DATA = {
  common_questions: [
    'how many sets and reps',
    'best exercises for beginners',
    'how to lose weight',
    'protein requirements',
    'workout frequency',
    'proper form cues',
    'nutrition timing',
    'supplement recommendations'
  ],
  
  user_goals: [
    'weight loss',
    'muscle gain',
    'strength building',
    'endurance improvement',
    'general fitness',
    'rehabilitation',
    'sports performance'
  ],
  
  equipment_usage: [
    'bodyweight',
    'dumbbells',
    'barbell',
    'resistance bands',
    'kettlebells',
    'machines',
    'cardio equipment'
  ]
};

// Default export with all knowledge
export default {
  EXERCISE_DATABASE,
  NUTRITION_DATABASE,
  SAFETY_GUIDELINES,
  MOTIVATIONAL_CONTENT,
  RESPONSE_TEMPLATES,
  LocalKnowledgeUtils,
  ANALYTICS_DATA
};