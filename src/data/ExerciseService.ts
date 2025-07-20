// =====================================================================================
// 🏋️ BATTLE-TESTED EXERCISE DATABASE SERVICE
// =====================================================================================
// Using yuhonas/free-exercise-db (2,800+ stars) + API Ninjas backup
// 800+ exercises from public domain sources

import Fuse from 'fuse.js';

export interface Exercise {
  id: string;
  name: string;
  target: string;
  bodyPart: string;
  equipment: string;
  instructions: string[];
  gifUrl?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  muscles?: string[];
  type?: 'strength' | 'cardio' | 'flexibility' | 'balance';
}

export interface ExerciseSearchResult {
  exercises: Exercise[];
  total: number;
  query: string;
  confidence: number;
}

class ExerciseService {
  private exercises: Exercise[] = [];
  private fuse: Fuse<Exercise> | null = null;
  private isLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  /**
   * Initialize and load exercise database
   */
  async initialize(): Promise<void> {
    if (this.isLoaded) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = this.loadExerciseDatabase();
    await this.loadingPromise;
  }

  /**
   * Load battle-tested exercise database
   */
  private async loadExerciseDatabase(): Promise<void> {
    try {
      console.log('🏋️ Loading battle-tested exercise database...');
      
      // Primary source: yuhonas/free-exercise-db (2,800+ GitHub stars)
      await this.loadFreeExerciseDB();
      
      // Backup source: API Ninjas (if API key available)
      await this.loadAPINinjasExercises();
      
      // Initialize fuzzy search
      this.initializeFuzzySearch();
      
      this.isLoaded = true;
      console.log(`✅ Loaded ${this.exercises.length} exercises from battle-tested sources`);
      
    } catch (error) {
      console.error('❌ Error loading exercise database:', error);
      // Load cached/fallback exercises
      this.loadFallbackExercises();
      this.initializeFuzzySearch();
      this.isLoaded = true;
    }
  }

  /**
   * Load exercises from yuhonas/free-exercise-db (primary source)
   */
  private async loadFreeExerciseDB(): Promise<void> {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises.json',
        { 
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform to our format
      const transformedExercises: Exercise[] = data.map((exercise: any, index: number) => ({
        id: exercise.id || `exercise_${index}`,
        name: exercise.name || 'Unknown Exercise',
        target: exercise.target || exercise.primaryMuscles?.[0] || 'Unknown',
        bodyPart: exercise.bodyPart || exercise.category || 'Unknown',
        equipment: exercise.equipment || exercise.force || 'bodyweight',
        instructions: exercise.instructions || exercise.steps || ['No instructions available'],
        gifUrl: exercise.gifUrl || exercise.images?.[0],
        category: exercise.category || 'general',
        difficulty: this.mapDifficulty(exercise.level),
        muscles: exercise.primaryMuscles || exercise.secondaryMuscles || [exercise.target],
        type: this.mapExerciseType(exercise.category || exercise.bodyPart)
      }));
      
      this.exercises.push(...transformedExercises);
      console.log(`✅ Loaded ${transformedExercises.length} exercises from free-exercise-db`);
      
    } catch (error) {
      console.warn('⚠️ Failed to load from free-exercise-db:', error);
    }
  }

  /**
   * Load additional exercises from API Ninjas (backup source)
   */
  private async loadAPINinjasExercises(): Promise<void> {
    const apiKey = import.meta.env.VITE_API_NINJAS_KEY;
    
    if (!apiKey || apiKey === 'your_api_ninjas_key_here') {
      console.log('ℹ️ API Ninjas key not configured, skipping backup source');
      return;
    }

    const muscleGroups = ['biceps', 'triceps', 'chest', 'back', 'legs', 'shoulders', 'abdominals', 'calves'];
    
    for (const muscle of muscleGroups) {
      try {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}&limit=10`,
          {
            headers: {
              'X-Api-Key': apiKey,
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(5000)
          }
        );
        
        if (response.ok) {
          const exercises = await response.json();
          
          const transformedExercises: Exercise[] = exercises.map((exercise: any) => ({
            id: `ninjas_${exercise.name.toLowerCase().replace(/\s+/g, '_')}`,
            name: exercise.name,
            target: exercise.muscle,
            bodyPart: this.mapBodyPart(exercise.muscle),
            equipment: exercise.equipment || 'bodyweight',
            instructions: exercise.instructions ? exercise.instructions.split('. ') : ['No instructions available'],
            category: 'api_ninjas',
            difficulty: exercise.difficulty as any || 'intermediate',
            muscles: [exercise.muscle],
            type: exercise.type || 'strength'
          }));
          
          // Avoid duplicates by checking names
          const existingNames = new Set(this.exercises.map(e => e.name.toLowerCase()));
          const newExercises = transformedExercises.filter(
            e => !existingNames.has(e.name.toLowerCase())
          );
          
          this.exercises.push(...newExercises);
          console.log(`✅ Added ${newExercises.length} new exercises from API Ninjas (${muscle})`);
        }
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.warn(`⚠️ Failed to load ${muscle} exercises from API Ninjas:`, error);
      }
    }
  }

  /**
   * Load fallback exercises if all sources fail
   */
  private loadFallbackExercises(): void {
    this.exercises = [
      {
        id: 'pushup',
        name: 'Push-up',
        target: 'chest',
        bodyPart: 'upper body',
        equipment: 'bodyweight',
        instructions: [
          'Start in a plank position with hands shoulder-width apart',
          'Lower your body until chest nearly touches the floor',
          'Push back up to starting position',
          'Keep your core tight throughout the movement'
        ],
        difficulty: 'beginner',
        muscles: ['chest', 'shoulders', 'triceps'],
        type: 'strength'
      },
      {
        id: 'squat',
        name: 'Bodyweight Squat',
        target: 'quadriceps',
        bodyPart: 'lower body',
        equipment: 'bodyweight',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower down as if sitting back into a chair',
          'Keep knees tracking over toes',
          'Return to standing position'
        ],
        difficulty: 'beginner',
        muscles: ['quadriceps', 'glutes', 'hamstrings'],
        type: 'strength'
      },
      {
        id: 'plank',
        name: 'Plank',
        target: 'abdominals',
        bodyPart: 'core',
        equipment: 'bodyweight',
        instructions: [
          'Start in push-up position',
          'Lower to forearms',
          'Keep body in straight line',
          'Hold position while breathing normally'
        ],
        difficulty: 'beginner',
        muscles: ['core', 'shoulders'],
        type: 'strength'
      }
    ];
    
    console.log('📦 Loaded fallback exercise database');
  }

  /**
   * Initialize fuzzy search with Fuse.js
   */
  private initializeFuzzySearch(): void {
    const options = {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'target', weight: 0.5 },
        { name: 'bodyPart', weight: 0.4 },
        { name: 'muscles', weight: 0.3 },
        { name: 'equipment', weight: 0.2 }
      ],
      threshold: 0.4, // Lower = more strict matching
      includeScore: true,
      minMatchCharLength: 2
    };
    
    this.fuse = new Fuse(this.exercises, options);
  }

  /**
   * Search exercises by voice input (with fuzzy matching)
   */
  async searchByVoice(query: string): Promise<ExerciseSearchResult> {
    await this.initialize();
    
    if (!query?.trim()) {
      return {
        exercises: this.exercises.slice(0, 10),
        total: this.exercises.length,
        query: '',
        confidence: 0
      };
    }

    const cleanQuery = query.toLowerCase().trim();
    
    // Try exact matches first
    const exactMatches = this.exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(cleanQuery) ||
      exercise.target.toLowerCase().includes(cleanQuery) ||
      exercise.bodyPart.toLowerCase().includes(cleanQuery)
    );

    if (exactMatches.length > 0) {
      return {
        exercises: exactMatches.slice(0, 10),
        total: exactMatches.length,
        query: cleanQuery,
        confidence: 0.9
      };
    }

    // Fall back to fuzzy search
    if (this.fuse) {
      const results = this.fuse.search(cleanQuery);
      const exercises = results.map(result => result.item);
      const avgScore = results.length > 0 
        ? results.reduce((sum, result) => sum + (1 - (result.score || 0)), 0) / results.length
        : 0;

      return {
        exercises: exercises.slice(0, 10),
        total: exercises.length,
        query: cleanQuery,
        confidence: avgScore
      };
    }

    return {
      exercises: [],
      total: 0,
      query: cleanQuery,
      confidence: 0
    };
  }

  /**
   * Get exercises by body part
   */
  async getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
    await this.initialize();
    
    const normalizedBodyPart = bodyPart.toLowerCase();
    return this.exercises.filter(exercise => 
      exercise.bodyPart.toLowerCase().includes(normalizedBodyPart) ||
      exercise.target.toLowerCase().includes(normalizedBodyPart) ||
      exercise.muscles?.some(muscle => muscle.toLowerCase().includes(normalizedBodyPart))
    );
  }

  /**
   * Get random exercise for motivation
   */
  async getRandomExercise(): Promise<Exercise | null> {
    await this.initialize();
    
    if (this.exercises.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * this.exercises.length);
    return this.exercises[randomIndex];
  }

  /**
   * Get exercise by exact name
   */
  async getExerciseByName(name: string): Promise<Exercise | null> {
    await this.initialize();
    
    return this.exercises.find(exercise => 
      exercise.name.toLowerCase() === name.toLowerCase()
    ) || null;
  }

  /**
   * Get all available body parts
   */
  async getBodyParts(): Promise<string[]> {
    await this.initialize();
    
    const bodyParts = new Set(this.exercises.map(e => e.bodyPart));
    return Array.from(bodyParts).sort();
  }

  /**
   * Get exercise database stats
   */
  getStats() {
    return {
      totalExercises: this.exercises.length,
      bodyParts: [...new Set(this.exercises.map(e => e.bodyPart))].length,
      equipment: [...new Set(this.exercises.map(e => e.equipment))].length,
      isLoaded: this.isLoaded,
      hasFuzzySearch: !!this.fuse
    };
  }

  // Helper methods
  private mapDifficulty(level: string): 'beginner' | 'intermediate' | 'advanced' {
    if (!level) return 'intermediate';
    
    const normalized = level.toLowerCase();
    if (normalized.includes('beginner') || normalized.includes('easy')) return 'beginner';
    if (normalized.includes('advanced') || normalized.includes('expert')) return 'advanced';
    return 'intermediate';
  }

  private mapExerciseType(category: string): 'strength' | 'cardio' | 'flexibility' | 'balance' {
    if (!category) return 'strength';
    
    const normalized = category.toLowerCase();
    if (normalized.includes('cardio') || normalized.includes('aerobic')) return 'cardio';
    if (normalized.includes('stretch') || normalized.includes('flexibility')) return 'flexibility';
    if (normalized.includes('balance') || normalized.includes('stability')) return 'balance';
    return 'strength';
  }

  private mapBodyPart(muscle: string): string {
    const muscleToBodyPart: Record<string, string> = {
      'biceps': 'arms',
      'triceps': 'arms',
      'chest': 'chest',
      'back': 'back',
      'shoulders': 'shoulders',
      'legs': 'legs',
      'quadriceps': 'legs',
      'hamstrings': 'legs',
      'calves': 'legs',
      'glutes': 'legs',
      'abdominals': 'core',
      'core': 'core'
    };
    
    return muscleToBodyPart[muscle.toLowerCase()] || 'full body';
  }
}

// Export singleton instance
export const exerciseService = new ExerciseService();
export default ExerciseService;