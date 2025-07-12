// =====================================================================================
// 🔑 AUTHENTICATION SERVICE - USER AUTHENTICATION & AUTHORIZATION
// =====================================================================================
// FILE LOCATION: src/security/AuthenticationService.js
// Created by Himanshu (himanshu1614)
// Purpose: Secure user authentication with multiple methods

import encryptionService from './EncryptionService.js';

class AuthenticationService {
  constructor() {
    this.users = new Map(); // In-memory user store (replace with API in production)
    this.attempts = new Map(); // Track login attempts
    this.maxAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
    this.passwordRequirements = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    };
    
    // Initialize demo user for testing
    this.initializeDemoUser();
    
    console.log('🔑 Authentication service initialized');
  }

  // =====================================================================================
  // 👤 USER MANAGEMENT
  // =====================================================================================

  async initializeDemoUser() {
    // Create demo user for testing
    const demoUser = {
      id: 'demo_user_001',
      email: 'demo@aifitnesscoach.com',
      username: 'demo',
      firstName: 'Demo',
      lastName: 'User',
      createdAt: Date.now(),
      isVerified: true,
      role: 'user',
      preferences: {
        units: 'metric',
        experience: 'beginner',
        goals: ['strength', 'endurance']
      }
    };

    // Hash demo password: "Demo123!"
    const passwordHash = await this.hashPassword('Demo123!');
    if (passwordHash.success) {
      demoUser.passwordHash = passwordHash.hash;
      demoUser.salt = passwordHash.salt;
      this.users.set(demoUser.email, demoUser);
      console.log('🎯 Demo user created: demo@aifitnesscoach.com / Demo123!');
    }
  }

  // =====================================================================================
  // 🔐 PASSWORD MANAGEMENT
  // =====================================================================================

  validatePassword(password) {
    const errors = [];
    const req = this.passwordRequirements;

    if (password.length < req.minLength) {
      errors.push(`Password must be at least ${req.minLength} characters long`);
    }

    if (req.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (req.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (req.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (req.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  calculatePasswordStrength(password) {
    let score = 0;
    
    // Length bonus
    score += Math.min(password.length * 2, 20);
    
    // Character variety bonus
    if (/[a-z]/.test(password)) score += 5;
    if (/[A-Z]/.test(password)) score += 5;
    if (/\d/.test(password)) score += 5;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
    
    // Pattern penalties
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
    if (/123|abc|qwerty/i.test(password)) score -= 15; // Common patterns
    
    // Convert to percentage
    const percentage = Math.max(0, Math.min(100, score));
    
    if (percentage < 30) return { level: 'weak', score: percentage };
    if (percentage < 60) return { level: 'fair', score: percentage };
    if (percentage < 80) return { level: 'good', score: percentage };
    return { level: 'strong', score: percentage };
  }

  async hashPassword(password) {
    try {
      // Generate salt
      const salt = encryptionService.generateSalt();
      
      // Derive key from password
      const keyResult = await encryptionService.deriveKeyFromPassword(password, salt);
      if (!keyResult.success) {
        throw new Error('Key derivation failed');
      }

      // Export key as hash
      const keyBuffer = await window.crypto.subtle.exportKey('raw', keyResult.key);
      const hashArray = new Uint8Array(keyBuffer);
      const hash = Array.from(hashArray);

      return {
        success: true,
        hash,
        salt: Array.from(salt)
      };
    } catch (error) {
      console.error('Password hashing failed:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyPassword(password, storedHash, storedSalt) {
    try {
      // Derive key from provided password
      const salt = new Uint8Array(storedSalt);
      const keyResult = await encryptionService.deriveKeyFromPassword(password, salt);
      
      if (!keyResult.success) {
        return { success: false, error: 'Key derivation failed' };
      }

      // Export and compare
      const keyBuffer = await window.crypto.subtle.exportKey('raw', keyResult.key);
      const derivedHash = Array.from(new Uint8Array(keyBuffer));

      // Secure comparison
      const isValid = encryptionService.secureCompare(
        derivedHash.join(','),
        storedHash.join(',')
      );

      return { success: true, isValid };
    } catch (error) {
      console.error('Password verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // =====================================================================================
  // 🚪 AUTHENTICATION METHODS
  // =====================================================================================

  async loginWithPassword(email, password) {
    try {
      // Check rate limiting
      const rateLimitCheck = this.checkRateLimit(email);
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          error: `Too many failed attempts. Try again in ${Math.ceil(rateLimitCheck.timeRemaining / 60000)} minutes`,
          code: 'RATE_LIMITED'
        };
      }

      // Find user
      const user = this.users.get(email.toLowerCase());
      if (!user) {
        this.recordFailedAttempt(email);
        return {
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        };
      }

      // Verify password
      const passwordResult = await this.verifyPassword(password, user.passwordHash, user.salt);
      if (!passwordResult.success || !passwordResult.isValid) {
        this.recordFailedAttempt(email);
        return {
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        };
      }

      // Clear failed attempts on successful login
      this.clearFailedAttempts(email);

      // Create authentication result
      const authResult = {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          preferences: user.preferences,
          isVerified: user.isVerified
        },
        authMethod: 'password',
        securityLevel: 'high',
        timestamp: Date.now()
      };

      console.log('✅ User authenticated successfully:', user.email);
      return authResult;

    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: 'Authentication failed',
        code: 'AUTH_ERROR'
      };
    }
  }

  async register(userData) {
    try {
      const { email, password, firstName, lastName, username } = userData;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return {
          success: false,
          error: 'Missing required fields',
          code: 'VALIDATION_ERROR'
        };
      }

      // Check if user already exists
      if (this.users.has(email.toLowerCase())) {
        return {
          success: false,
          error: 'User with this email already exists',
          code: 'USER_EXISTS'
        };
      }

      // Validate password
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: passwordValidation.errors.join('. '),
          code: 'WEAK_PASSWORD'
        };
      }

      // Hash password
      const passwordHash = await this.hashPassword(password);
      if (!passwordHash.success) {
        throw new Error('Password hashing failed');
      }

      // Create user
      const newUser = {
        id: encryptionService.generateSecureId(),
        email: email.toLowerCase(),
        username: username || email.split('@')[0],
        firstName,
        lastName,
        passwordHash: passwordHash.hash,
        salt: passwordHash.salt,
        createdAt: Date.now(),
        isVerified: false, // Would require email verification in production
        role: 'user',
        preferences: {
          units: 'metric',
          experience: 'beginner',
          goals: []
        }
      };

      // Store user
      this.users.set(newUser.email, newUser);

      console.log('✅ User registered successfully:', newUser.email);

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          preferences: newUser.preferences,
          isVerified: newUser.isVerified
        },
        authMethod: 'registration',
        securityLevel: 'medium'
      };

    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      };
    }
  }

  async guestLogin() {
    try {
      // Create temporary guest user
      const guestUser = {
        id: `guest_${encryptionService.generateSecureId(16)}`,
        email: 'guest@temporary.com',
        username: 'Guest User',
        firstName: 'Guest',
        lastName: 'User',
        role: 'guest',
        isVerified: false,
        preferences: {
          units: 'metric',
          experience: 'beginner',
          goals: []
        },
        isTemporary: true,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      console.log('✅ Guest user created:', guestUser.id);

      return {
        success: true,
        user: guestUser,
        authMethod: 'guest',
        securityLevel: 'low',
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('Guest login failed:', error);
      return {
        success: false,
        error: 'Guest login failed',
        code: 'GUEST_ERROR'
      };
    }
  }

  // =====================================================================================
  // 🚦 RATE LIMITING
  // =====================================================================================

  checkRateLimit(identifier) {
    const attempts = this.attempts.get(identifier);
    if (!attempts) {
      return { allowed: true };
    }

    const now = Date.now();
    
    // Clear old attempts
    const recentAttempts = attempts.filter(timestamp => 
      now - timestamp < this.lockoutDuration
    );

    if (recentAttempts.length >= this.maxAttempts) {
      const oldestAttempt = Math.min(...recentAttempts);
      const timeRemaining = this.lockoutDuration - (now - oldestAttempt);
      
      return {
        allowed: false,
        attemptsRemaining: 0,
        timeRemaining
      };
    }

    return {
      allowed: true,
      attemptsRemaining: this.maxAttempts - recentAttempts.length
    };
  }

  recordFailedAttempt(identifier) {
    const attempts = this.attempts.get(identifier) || [];
    attempts.push(Date.now());
    this.attempts.set(identifier, attempts);
  }

  clearFailedAttempts(identifier) {
    this.attempts.delete(identifier);
  }

  // =====================================================================================
  // 👥 USER UTILITIES
  // =====================================================================================

  getUserById(userId) {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          preferences: user.preferences,
          isVerified: user.isVerified
        };
      }
    }
    return null;
  }

  async updateUserPreferences(userId, preferences) {
    try {
      const user = Array.from(this.users.values()).find(u => u.id === userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      user.preferences = { ...user.preferences, ...preferences };
      this.users.set(user.email, user);

      return { success: true, preferences: user.preferences };
    } catch (error) {
      console.error('Update preferences failed:', error);
      return { success: false, error: error.message };
    }
  }

  // =====================================================================================
  // 📊 SERVICE STATUS
  // =====================================================================================

  getStatus() {
    return {
      totalUsers: this.users.size,
      activeAttempts: this.attempts.size,
      rateLimiting: {
        maxAttempts: this.maxAttempts,
        lockoutDuration: this.lockoutDuration
      },
      passwordRequirements: this.passwordRequirements,
      supportedMethods: ['password', 'guest'],
      demoUser: {
        email: 'demo@aifitnesscoach.com',
        password: 'Demo123!'
      }
    };
  }

  // =====================================================================================
  // 🧹 CLEANUP
  // =====================================================================================

  cleanup() {
    const now = Date.now();
    
    // Clean old rate limiting data
    for (const [identifier, attempts] of this.attempts.entries()) {
      const recentAttempts = attempts.filter(timestamp => 
        now - timestamp < this.lockoutDuration
      );
      
      if (recentAttempts.length === 0) {
        this.attempts.delete(identifier);
      } else {
        this.attempts.set(identifier, recentAttempts);
      }
    }

    // Clean expired guest users
    for (const [email, user] of this.users.entries()) {
      if (user.isTemporary && user.expiresAt < now) {
        this.users.delete(email);
      }
    }
  }
}

// Export singleton instance
const authenticationService = new AuthenticationService();

// Start cleanup timer
setInterval(() => {
  authenticationService.cleanup();
}, 5 * 60 * 1000); // Clean every 5 minutes

export default authenticationService;