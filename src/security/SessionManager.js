// =====================================================================================
// 🗂️ SESSION MANAGER - SECURE SESSION MANAGEMENT
// =====================================================================================
// FILE LOCATION: src/security/SessionManager.js
// Created by Himanshu (himanshu1614)
// Purpose: Enterprise-grade session management with encryption

import encryptionService from './EncryptionService.js';

class SessionManager {
  constructor() {
    // Session configuration
    this.sessionTimeout = 15 * 60 * 1000; // 15 minutes
    this.refreshThreshold = 5 * 60 * 1000; // Refresh when 5 minutes remaining
    this.maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours absolute max
    this.maxConcurrentSessions = 3;
    this.idleTimeout = 30 * 60 * 1000; // 30 minutes idle
    
    // Security monitoring
    this.securityEvents = [];
    this.suspiciousActivityThreshold = 5;
    this.ipChangeAllowed = false; // Strict IP binding in production
    
    // Activity tracking
    this.lastActivity = Date.now();
    this.activityCheckInterval = null;
    this.sessionRefreshInterval = null;
    
    this.initialize();
  }

  // =====================================================================================
  // 🚀 INITIALIZATION
  // =====================================================================================

  initialize() {
    // Start activity monitoring
    this.startActivityMonitoring();
    
    // Start session refresh
    this.startSessionRefresh();
    
    // Start data cleanup
    this.startDataCleanup();
    
    console.log('🗂️ Session manager initialized');
  }

  // =====================================================================================
  // 🔐 SESSION CREATION
  // =====================================================================================

  async createSession(user, authenticationResult) {
    try {
      console.log('[SessionManager] Creating session for user:', user);
      console.log('[SessionManager] Auth result:', authenticationResult);
      const sessionId = this.generateSessionId();
      const deviceFingerprint = await this.generateDeviceFingerprint();
      const clientInfo = await this.getClientInformation();
      
      const sessionData = {
        // Core session data
        id: sessionId,
        userId: user.id,
        userEmail: user.email,
        
        // Timestamps
        createdAt: Date.now(),
        lastActivity: Date.now(),
        expiresAt: Date.now() + this.sessionTimeout,
        maxExpiresAt: Date.now() + this.maxSessionAge,
        
        // Security data
        deviceFingerprint,
        clientInfo,
        authMethod: authenticationResult.authMethod,
        authStrength: authenticationResult.securityLevel || 'high',
        
        // Session management
        refreshCount: 0,
        activityCount: 1,
        
        // Security flags
        isActive: true,
        isSecure: true,
        requiresReauth: false,
        
        // Security metadata
        securityLevel: this.calculateSecurityLevel(authenticationResult),
        riskScore: 0,
        
        // Audit trail
        events: [{
          type: 'session_created',
          timestamp: Date.now(),
          data: { authMethod: authenticationResult.authMethod }
        }]
      };

      // Encrypt session data
      const encryptedSession = await encryptionService.encryptData(sessionData);
      if (!encryptedSession.success) {
        console.error('[SessionManager] Session encryption failed:', encryptedSession.error);
        throw new Error('Session encryption failed');
      }

      // Store encrypted session
      const sessionKey = `session_${sessionId}`;
      localStorage.setItem(sessionKey, JSON.stringify(encryptedSession.encrypted));
      
      // Store session reference (non-sensitive data only)
      const sessionRef = {
        sessionId,
        userId: user.id,
        createdAt: sessionData.createdAt,
        encryptedAt: encryptedSession.encrypted.timestamp
      };
      localStorage.setItem('current_session_ref', JSON.stringify(sessionRef));

      // Log security event
      this.logSecurityEvent('session_created', {
        sessionId,
        userId: user.id,
        authMethod: authenticationResult.authMethod,
        securityLevel: sessionData.securityLevel
      });

      return {
        success: true,
        session: sessionData,
        sessionToken: this.generateSessionToken(sessionData),
        expiresIn: this.sessionTimeout
      };

    } catch (error) {
      console.error('[SessionManager] Failed to create session:', error, user, authenticationResult);
      this.logSecurityEvent('session_creation_failed', { 
        error: error.message,
        userId: user && user.id
      });
      
      return {
        success: false,
        error: 'Failed to create secure session',
        code: 'SESSION_CREATE_FAILED'
      };
    }
  }

  // =====================================================================================
  // 📋 SESSION RETRIEVAL
  // =====================================================================================

  async getCurrentSession() {
    try {
      // Get session reference
      const sessionRefData = localStorage.getItem('current_session_ref');
      if (!sessionRefData) {
        return { success: false, error: 'No active session' };
      }

      const sessionRef = JSON.parse(sessionRefData);
      const sessionKey = `session_${sessionRef.sessionId}`;
      
      // Get encrypted session data
      const encryptedSessionData = localStorage.getItem(sessionKey);
      if (!encryptedSessionData) {
        this.destroySession();
        return { success: false, error: 'Session data not found' };
      }

      // Decrypt session
      const encryptedSession = JSON.parse(encryptedSessionData);
      const decryptResult = await encryptionService.decryptData(encryptedSession);
      
      if (!decryptResult.success) {
        this.destroySession();
        this.logSecurityEvent('session_decryption_failed', { 
          sessionId: sessionRef.sessionId 
        });
        return { success: false, error: 'Session decryption failed' };
      }

      const session = decryptResult.data;

      // Validate session security
      const validation = await this.validateSession(session);
      if (!validation.isValid) {
        this.destroySession();
        this.logSecurityEvent('session_validation_failed', {
          sessionId: session.id,
          reason: validation.reason
        });
        return { success: false, error: validation.reason };
      }

      // Check expiration
      if (Date.now() > session.expiresAt) {
        this.destroySession();
        return { success: false, error: 'Session expired' };
      }

      // Check absolute max age
      if (Date.now() > session.maxExpiresAt) {
        this.destroySession();
        return { success: false, error: 'Session too old, re-authentication required' };
      }

      return {
        success: true,
        session,
        timeRemaining: session.expiresAt - Date.now(),
        isNearExpiry: (session.expiresAt - Date.now()) < this.refreshThreshold
      };

    } catch (error) {
      this.destroySession();
      return { 
        success: false, 
        error: 'Session validation failed',
        code: 'SESSION_VALIDATION_ERROR'
      };
    }
  }

  // =====================================================================================
  // ✅ SESSION VALIDATION
  // =====================================================================================

  async validateSession(session) {
    try {
      // Check device fingerprint
      const currentFingerprint = await this.generateDeviceFingerprint();
      if (!this.compareFingerprints(session.deviceFingerprint, currentFingerprint)) {
        return { isValid: false, reason: 'Device fingerprint mismatch - possible session hijacking' };
      }

      // Check client information
      const currentClientInfo = await this.getClientInformation();
      if (!this.validateClientInfo(session.clientInfo, currentClientInfo)) {
        return { isValid: false, reason: 'Client information mismatch' };
      }

      // Check for excessive refresh attempts
      if (session.refreshCount > 100) {
        return { isValid: false, reason: 'Excessive session refresh attempts' };
      }

      // Check risk score
      if (session.riskScore > 50) {
        return { isValid: false, reason: 'High risk score detected' };
      }

      // Check session age
      const sessionAge = Date.now() - session.createdAt;
      if (sessionAge > this.maxSessionAge) {
        return { isValid: false, reason: 'Session exceeded maximum age' };
      }

      // Check for required re-authentication
      if (session.requiresReauth) {
        return { isValid: false, reason: 'Re-authentication required' };
      }

      return { isValid: true };

    } catch (error) {
      return { isValid: false, reason: 'Session validation error' };
    }
  }

  // =====================================================================================
  // 🔄 SESSION REFRESH
  // =====================================================================================

  async refreshSession() {
    const sessionResult = await this.getCurrentSession();
    if (!sessionResult.success) {
      return sessionResult;
    }

    const session = sessionResult.session;
    
    try {
      // Update session data
      session.lastActivity = Date.now();
      session.expiresAt = Date.now() + this.sessionTimeout;
      session.refreshCount += 1;
      session.activityCount += 1;

      // Add refresh event
      session.events.push({
        type: 'session_refreshed',
        timestamp: Date.now(),
        data: { refreshCount: session.refreshCount }
      });

      // Re-encrypt updated session
      const encryptedSession = await encryptionService.encryptData(session);
      if (!encryptedSession.success) {
        throw new Error('Session re-encryption failed');
      }

      // Update stored session
      const sessionKey = `session_${session.id}`;
      localStorage.setItem(sessionKey, JSON.stringify(encryptedSession.encrypted));

      this.logSecurityEvent('session_refreshed', {
        sessionId: session.id,
        userId: session.userId,
        refreshCount: session.refreshCount
      });

      return {
        success: true,
        session,
        timeRemaining: session.expiresAt - Date.now()
      };

    } catch (error) {
      this.logSecurityEvent('session_refresh_failed', {
        sessionId: session.id,
        error: error.message
      });
      
      return {
        success: false,
        error: 'Session refresh failed',
        requiresReauth: true
      };
    }
  }

  // =====================================================================================
  // 🗑️ SESSION DESTRUCTION
  // =====================================================================================

  destroySession() {
    try {
      // Get current session reference
      const sessionRefData = localStorage.getItem('current_session_ref');
      if (sessionRefData) {
        const sessionRef = JSON.parse(sessionRefData);
        
        // Remove encrypted session data
        const sessionKey = `session_${sessionRef.sessionId}`;
        localStorage.removeItem(sessionKey);
        
        // Log security event
        this.logSecurityEvent('session_destroyed', {
          sessionId: sessionRef.sessionId,
          userId: sessionRef.userId
        });
      }
      
      // Remove session reference
      localStorage.removeItem('current_session_ref');
      
      // Stop monitoring intervals
      if (this.activityCheckInterval) {
        clearInterval(this.activityCheckInterval);
        this.activityCheckInterval = null;
      }
      
      if (this.sessionRefreshInterval) {
        clearInterval(this.sessionRefreshInterval);
        this.sessionRefreshInterval = null;
      }
      
      console.log('🗑️ Session destroyed successfully');
      
    } catch (error) {
      console.error('Session destruction failed:', error);
    }
  }

  // =====================================================================================
  // 📱 DEVICE FINGERPRINTING
  // =====================================================================================

  async generateDeviceFingerprint() {
    try {
      const fingerprint = {
        // Basic browser info
        userAgent: navigator.userAgent.substring(0, 200),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        
        // Screen info
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio
        },
        
        // Canvas fingerprint
        canvas: await this.generateCanvasFingerprint(),
        
        // WebGL fingerprint
        webgl: this.generateWebGLFingerprint(),
        
        // Audio fingerprint
        audio: await this.generateAudioFingerprint(),
        
        // Timestamp
        timestamp: Date.now()
      };

      // Create hash of fingerprint
      const hashResult = await encryptionService.hashData(JSON.stringify(fingerprint));
      fingerprint.hash = hashResult.success ? hashResult.hash : 'hash_failed';

      return fingerprint;
    } catch (error) {
      console.error('Device fingerprinting failed:', error);
      return { error: error.message, timestamp: Date.now() };
    }
  }

  async generateCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Draw unique pattern
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('AI Fitness Coach 🤖💪', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Canvas fingerprint', 4, 17);
      
      return canvas.toDataURL().substring(0, 100); // First 100 chars
    } catch {
      return 'canvas_unavailable';
    }
  }

  generateWebGLFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return 'webgl_unavailable';

      return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        extensions: gl.getSupportedExtensions()?.slice(0, 10) || []
      };
    } catch {
      return 'webgl_error';
    }
  }

  async generateAudioFingerprint() {
    try {
      if (!window.AudioContext && !window.webkitAudioContext) {
        return 'audio_unavailable';
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      
      const fingerprint = {
        sampleRate: context.sampleRate,
        state: context.state,
        maxChannelCount: context.destination.maxChannelCount
      };
      
      context.close();
      return fingerprint;
    } catch {
      return 'audio_error';
    }
  }

  compareFingerprints(stored, current) {
    if (!stored?.hash || !current?.hash) return false;
    return encryptionService.secureCompare(stored.hash, current.hash);
  }

  // =====================================================================================
  // 🌐 CLIENT INFORMATION
  // =====================================================================================

  async getClientInformation() {
    return {
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer.substring(0, 200),
      userAgent: navigator.userAgent.substring(0, 200),
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      protocol: window.location.protocol,
      port: window.location.port || (window.location.protocol === 'https:' ? '443' : '80')
    };
  }

  validateClientInfo(stored, current) {
    // Allow some flexibility for dynamic data
    return stored.userAgent === current.userAgent &&
           stored.language === current.language &&
           stored.protocol === current.protocol;
  }

  // =====================================================================================
  // 🔢 UTILITY METHODS
  // =====================================================================================

  generateSessionId() {
    return `sess_${Date.now()}_${encryptionService.generateSecureId(16)}`;
  }

  calculateSecurityLevel(authResult) {
    let score = 20; // Base score
    
    // Authentication method bonus
    if (authResult.authMethod === 'biometric') score += 40;
    else if (authResult.authMethod === 'mfa') score += 30;
    else if (authResult.authMethod === 'password') score += 20;
    else score += 10;
    
    // Security level bonus
    if (authResult.securityLevel === 'maximum') score += 30;
    else if (authResult.securityLevel === 'high') score += 20;
    else score += 10;
    
    return Math.min(100, score);
  }

  generateSessionToken(session) {
    const tokenData = {
      sid: session.id.substring(0, 16),
      uid: session.userId.substring(0, 16),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(session.expiresAt / 1000),
      sec: session.securityLevel
    };

    return btoa(JSON.stringify(tokenData));
  }

  // =====================================================================================
  // 📊 ACTIVITY MONITORING
  // =====================================================================================

  startActivityMonitoring() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      this.updateSessionActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });

    // Check for idle timeout
    this.activityCheckInterval = setInterval(() => {
      const idle = Date.now() - this.lastActivity;
      if (idle > this.idleTimeout) {
        console.log('🕒 Session idle timeout reached');
        this.destroySession();
      }
    }, 60 * 1000); // Check every minute
  }

  async updateSessionActivity() {
    this.lastActivity = Date.now();
    
    try {
      const sessionResult = await this.getCurrentSession();
      if (!sessionResult.success) return;

      const session = sessionResult.session;
      session.lastActivity = Date.now();
      session.activityCount += 1;

      // Add activity event
      session.events.push({
        type: 'activity_recorded',
        timestamp: Date.now(),
        data: { activityCount: session.activityCount }
      });

      // Keep only recent events
      session.events = session.events.slice(-50);

      // Re-encrypt and store
      const encryptedSession = await encryptionService.encryptData(session);
      if (encryptedSession.success) {
        const sessionKey = `session_${session.id}`;
        localStorage.setItem(sessionKey, JSON.stringify(encryptedSession.encrypted));
      }
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  startSessionRefresh() {
    this.sessionRefreshInterval = setInterval(async () => {
      const sessionResult = await this.getCurrentSession();
      if (sessionResult.success && sessionResult.isNearExpiry) {
        console.log('🔄 Auto-refreshing session');
        await this.refreshSession();
      }
    }, 60 * 1000); // Check every minute
  }

  // =====================================================================================
  // 🔒 SECURITY MONITORING
  // =====================================================================================

  logSecurityEvent(eventType, data) {
    const event = {
      id: encryptionService.generateSecureId(16),
      type: eventType,
      timestamp: Date.now(),
      data: data || {},
      source: 'session_manager'
    };

    this.securityEvents.push(event);
    
    // Keep only recent events
    if (this.securityEvents.length > 200) {
      this.securityEvents = this.securityEvents.slice(-200);
    }

    console.log(`🔒 Security Event: ${eventType}`, data);

    // Check for security threats
    this.checkSecurityThreats();
  }

  checkSecurityThreats() {
    const recentFailures = this.securityEvents.filter(event => 
      event.type.includes('failed') && 
      Date.now() - event.timestamp < 300000 // Last 5 minutes
    );

    if (recentFailures.length > this.suspiciousActivityThreshold) {
      this.logSecurityEvent('security_threat_detected', {
        threatType: 'multiple_session_failures',
        count: recentFailures.length
      });
    }
  }

  // =====================================================================================
  // 🧹 DATA CLEANUP
  // =====================================================================================

  startDataCleanup() {
    setInterval(() => {
      this.cleanupExpiredData();
    }, 30 * 60 * 1000); // Clean every 30 minutes
  }

  cleanupExpiredData() {
    try {
      // Clean old security events
      const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
      this.securityEvents = this.securityEvents.filter(event => 
        event.timestamp > cutoff
      );

      console.log('🧹 Cleaned up expired session data');
    } catch (error) {
      console.error('Data cleanup failed:', error);
    }
  }

  // =====================================================================================
  // 📊 SESSION STATISTICS
  // =====================================================================================

  getSessionStatistics() {
    return {
      totalEvents: this.securityEvents.length,
      recentEvents: this.securityEvents.filter(e => 
        Date.now() - e.timestamp < 3600000 // Last hour
      ).length,
      configuration: {
        sessionTimeout: this.sessionTimeout,
        maxSessionAge: this.maxSessionAge,
        idleTimeout: this.idleTimeout,
        maxConcurrentSessions: this.maxConcurrentSessions
      }
    };
  }

  getStatus() {
    return {
      isInitialized: true,
      activeSession: !!localStorage.getItem('current_session_ref'),
      securityLevel: 'enterprise',
      features: {
        encryption: true,
        deviceFingerprinting: true,
        activityMonitoring: true,
        autoRefresh: true,
        threatDetection: true
      },
      statistics: this.getSessionStatistics()
    };
  }
}

// Export singleton instance
const sessionManager = new SessionManager();
export default sessionManager;