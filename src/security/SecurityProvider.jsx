// =====================================================================================
// 🛡️ SECURITY PROVIDER - REACT SECURITY CONTEXT
// =====================================================================================
// FILE LOCATION: src/security/SecurityProvider.jsx
// Created by Himanshu (himanshu1614)
// Purpose: React context for security state management

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authenticationService from './AuthenticationService.js';
import sessionManager from './SessionManager.js';
import encryptionService from './EncryptionService.js';
import './security.css';

// =====================================================================================
// 🔐 SECURITY CONTEXT
// =====================================================================================

const SecurityContext = createContext(null);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

// =====================================================================================
// 🛡️ SECURITY PROVIDER COMPONENT
// =====================================================================================

export const SecurityProvider = ({ children }) => {
  // Security state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [securityLevel, setSecurityLevel] = useState('none');
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Security monitoring
  const [securityEvents, setSecurityEvents] = useState([]);
  const [threatLevel, setThreatLevel] = useState('low');

  // =====================================================================================
  // 🚀 INITIALIZATION
  // =====================================================================================

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check for existing session
      const sessionResult = await sessionManager.getCurrentSession();
      if (sessionResult.success) {
        const userData = authenticationService.getUserById(sessionResult.session.userId);
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
          setSession(sessionResult.session);
          setSecurityLevel(sessionResult.session.securityLevel);
          
          console.log('✅ Existing session restored');
        }
      } else {
        console.log('ℹ️ No existing session found');
      }

      // Start security monitoring
      startSecurityMonitoring();

    } catch (error) {
      console.error('Security initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =====================================================================================
  // 🔑 AUTHENTICATION METHODS
  // =====================================================================================

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);

      // Authenticate user
      const authResult = await authenticationService.loginWithPassword(email, password);
      if (!authResult.success) {
        return { success: false, error: authResult.error };
      }

      // Create session
      const sessionResult = await sessionManager.createSession(authResult.user, authResult);
      if (!sessionResult.success) {
        return { success: false, error: sessionResult.error };
      }

      // Update state
      setIsAuthenticated(true);
      setUser(authResult.user);
      setSession(sessionResult.session);
      setSecurityLevel(sessionResult.session.securityLevel);
      setIsSessionExpired(false);

      // Log security event
      addSecurityEvent('user_login', {
        userId: authResult.user.id,
        authMethod: authResult.authMethod,
        securityLevel: sessionResult.session.securityLevel
      });

      return { success: true, user: authResult.user };

    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);

      // Register user
      const registerResult = await authenticationService.register(userData);
      if (!registerResult.success) {
        return { success: false, error: registerResult.error };
      }

      // Create session
      const sessionResult = await sessionManager.createSession(registerResult.user, registerResult);
      if (!sessionResult.success) {
        return { success: false, error: sessionResult.error };
      }

      // Update state
      setIsAuthenticated(true);
      setUser(registerResult.user);
      setSession(sessionResult.session);
      setSecurityLevel(sessionResult.session.securityLevel);

      // Log security event
      addSecurityEvent('user_registration', {
        userId: registerResult.user.id,
        authMethod: registerResult.authMethod
      });

      return { success: true, user: registerResult.user };

    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsGuest = useCallback(async () => {
    try {
      setIsLoading(true);

      // Create guest user
      const guestResult = await authenticationService.guestLogin();
      if (!guestResult.success) {
        return { success: false, error: guestResult.error };
      }

      // Create session
      const sessionResult = await sessionManager.createSession(guestResult.user, guestResult);
      if (!sessionResult.success) {
        return { success: false, error: sessionResult.error };
      }

      // Update state
      setIsAuthenticated(true);
      setUser(guestResult.user);
      setSession(sessionResult.session);
      setSecurityLevel(sessionResult.session.securityLevel);

      // Log security event
      addSecurityEvent('guest_login', {
        userId: guestResult.user.id,
        authMethod: guestResult.authMethod
      });

      return { success: true, user: guestResult.user };

    } catch (error) {
      console.error('Guest login failed:', error);
      return { success: false, error: 'Guest login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Log security event
      if (user) {
        addSecurityEvent('user_logout', {
          userId: user.id,
          sessionDuration: session ? Date.now() - session.createdAt : 0
        });
      }

      // Destroy session
      sessionManager.destroySession();

      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      setSecurityLevel('none');
      setIsSessionExpired(false);

      console.log('✅ User logged out successfully');

    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [user, session]);

  // =====================================================================================
  // 🔄 SESSION MANAGEMENT
  // =====================================================================================

  const refreshSession = useCallback(async () => {
    try {
      const refreshResult = await sessionManager.refreshSession();
      if (refreshResult.success) {
        setSession(refreshResult.session);
        setIsSessionExpired(false);
        
        addSecurityEvent('session_refreshed', {
          sessionId: refreshResult.session.id,
          timeRemaining: refreshResult.timeRemaining
        });
        
        return { success: true };
      } else {
        setIsSessionExpired(true);
        return { success: false, error: refreshResult.error };
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      setIsSessionExpired(true);
      return { success: false, error: 'Session refresh failed' };
    }
  }, []);

  const validateSession = useCallback(async () => {
    try {
      const sessionResult = await sessionManager.getCurrentSession();
      if (!sessionResult.success) {
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
        setIsSessionExpired(true);
        return false;
      }

      // Check if session is near expiry
      if (sessionResult.isNearExpiry) {
        await refreshSession();
      }

      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }, [refreshSession]);

  // =====================================================================================
  // 👤 USER MANAGEMENT
  // =====================================================================================

  const updateUserPreferences = useCallback(async (preferences) => {
    try {
      if (!user) {
        return { success: false, error: 'No authenticated user' };
      }

      const updateResult = await authenticationService.updateUserPreferences(user.id, preferences);
      if (updateResult.success) {
        setUser(prev => ({
          ...prev,
          preferences: updateResult.preferences
        }));

        addSecurityEvent('preferences_updated', {
          userId: user.id,
          preferences: Object.keys(preferences)
        });
      }

      return updateResult;
    } catch (error) {
      console.error('Update preferences failed:', error);
      return { success: false, error: 'Update failed' };
    }
  }, [user]);

  // =====================================================================================
  // 🔒 SECURITY MONITORING
  // =====================================================================================

  const startSecurityMonitoring = useCallback(() => {
    // Session validation interval
    const sessionInterval = setInterval(async () => {
      if (isAuthenticated) {
        await validateSession();
      }
    }, 60 * 1000); // Check every minute

    // Security event cleanup
    const cleanupInterval = setInterval(() => {
      setSecurityEvents(prev => {
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
        return prev.filter(event => event.timestamp > cutoff);
      });
    }, 30 * 60 * 1000); // Clean every 30 minutes

    // Cleanup on unmount
    return () => {
      clearInterval(sessionInterval);
      clearInterval(cleanupInterval);
    };
  }, [isAuthenticated, validateSession]);

  const addSecurityEvent = useCallback((type, data) => {
    const event = {
      id: encryptionService.generateSecureId(16),
      type,
      timestamp: Date.now(),
      data: data || {},
      source: 'security_provider'
    };

    setSecurityEvents(prev => {
      const newEvents = [...prev, event];
      // Keep only last 100 events
      return newEvents.slice(-100);
    });

    // Update threat level based on events
    updateThreatLevel();

    console.log(`🔒 Security Event: ${type}`, data);
  }, []);

  const updateThreatLevel = useCallback(() => {
    const recentEvents = securityEvents.filter(event => 
      Date.now() - event.timestamp < 300000 // Last 5 minutes
    );

    const failedEvents = recentEvents.filter(event => 
      event.type.includes('failed') || event.type.includes('error')
    );

    if (failedEvents.length >= 5) {
      setThreatLevel('high');
    } else if (failedEvents.length >= 3) {
      setThreatLevel('medium');
    } else {
      setThreatLevel('low');
    }
  }, [securityEvents]);

  // =====================================================================================
  // 🔍 SECURITY UTILITIES
  // =====================================================================================

  const getSecurityStatus = useCallback(() => {
    return {
      isAuthenticated,
      securityLevel,
      threatLevel,
      sessionValid: !!session && !isSessionExpired,
      sessionTimeRemaining: session ? session.expiresAt - Date.now() : 0,
      deviceFingerprint: session?.deviceFingerprint?.hash || null,
      totalSecurityEvents: securityEvents.length,
      recentSecurityEvents: securityEvents.filter(e => 
        Date.now() - e.timestamp < 3600000 // Last hour
      ).length
    };
  }, [isAuthenticated, securityLevel, threatLevel, session, isSessionExpired, securityEvents]);

  const getSecurityRecommendations = useCallback(() => {
    const recommendations = [];

    if (!isAuthenticated) {
      recommendations.push({
        type: 'authentication',
        level: 'high',
        message: 'Sign in to access secure features and save your progress'
      });
    }

    if (user?.role === 'guest') {
      recommendations.push({
        type: 'account',
        level: 'medium',
        message: 'Create a full account to secure your data and unlock all features'
      });
    }

    if (securityLevel < 50) {
      recommendations.push({
        type: 'security',
        level: 'medium',
        message: 'Enable additional security features for better protection'
      });
    }

    if (threatLevel === 'high') {
      recommendations.push({
        type: 'threat',
        level: 'high',
        message: 'High security threat detected. Consider changing your password.'
      });
    }

    return recommendations;
  }, [isAuthenticated, user, securityLevel, threatLevel]);

  // =====================================================================================
  // 📱 CONTEXT VALUE
  // =====================================================================================

  const contextValue = {
    // Authentication state
    isAuthenticated,
    user,
    session,
    isLoading,
    securityLevel,
    isSessionExpired,

    // Authentication methods
    login,
    register,
    loginAsGuest,
    logout,

    // Session management
    refreshSession,
    validateSession,

    // User management
    updateUserPreferences,

    // Security monitoring
    securityEvents,
    threatLevel,
    addSecurityEvent,

    // Security utilities
    getSecurityStatus,
    getSecurityRecommendations,

    // Service access
    authService: authenticationService,
    sessionService: sessionManager,
    encryptionService: encryptionService
  };

  // =====================================================================================
  // 🎨 RENDER
  // =====================================================================================

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

// =====================================================================================
// 🛡️ SECURITY WRAPPER HOC
// =====================================================================================

export const withSecurity = (WrappedComponent) => {
  return function WithSecurityComponent(props) {
    const security = useSecurity();
    return <WrappedComponent {...props} security={security} />;
  };
};

// =====================================================================================
// 🔒 PROTECTED ROUTE COMPONENT
// =====================================================================================

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  minSecurityLevel = 0,
  fallback = null 
}) => {
  const { isAuthenticated, securityLevel, isLoading } = useSecurity();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access this feature.
          </p>
        </div>
      </div>
    );
  }

  if (securityLevel < minSecurityLevel) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Higher Security Required
          </h2>
          <p className="text-gray-600">
            This feature requires enhanced security authentication.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default SecurityProvider;