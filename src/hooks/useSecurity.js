// =====================================================================================
// 🪝 USE SECURITY HOOK - SECURITY REACT HOOK
// =====================================================================================
// FILE LOCATION: src/hooks/useSecurity.js
// Created by Himanshu (himanshu1614)
// Purpose: Custom React hook for security operations

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSecurity as useSecurityContext } from '../security/SecurityProvider.jsx';

// =====================================================================================
// 🔐 ENHANCED SECURITY HOOK
// =====================================================================================

export const useSecurity = () => {
  // Get context
  const securityContext = useSecurityContext();
  
  // Additional state for hook-specific features
  const [isSessionNearExpiry, setIsSessionNearExpiry] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  
  // Refs for intervals
  const timeCheckInterval = useRef(null);
  const autoRefreshInterval = useRef(null);

  // =====================================================================================
  // 🕐 SESSION TIMING
  // =====================================================================================

  useEffect(() => {
    if (securityContext.session) {
      // Start time monitoring
      timeCheckInterval.current = setInterval(() => {
        const timeLeft = securityContext.session.expiresAt - Date.now();
        setSessionTimeRemaining(Math.max(0, timeLeft));
        
        // Check if near expiry (5 minutes)
        const isNearExpiry = timeLeft < 5 * 60 * 1000 && timeLeft > 0;
        setIsSessionNearExpiry(isNearExpiry);
        
        // Auto-refresh if enabled and near expiry
        if (isNearExpiry && autoRefreshEnabled && timeLeft > 2 * 60 * 1000) {
          handleAutoRefresh();
        }
      }, 1000);
    } else {
      // Clear intervals if no session
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current);
        timeCheckInterval.current = null;
      }
      setSessionTimeRemaining(0);
      setIsSessionNearExpiry(false);
    }

    return () => {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current);
      }
    };
  }, [securityContext.session, autoRefreshEnabled]);

  // =====================================================================================
  // 🔄 AUTO-REFRESH LOGIC
  // =====================================================================================

  const handleAutoRefresh = useCallback(async () => {
    if (!autoRefreshEnabled || !securityContext.session) return;
    
    try {
      await securityContext.refreshSession();
      console.log('🔄 Session auto-refreshed successfully');
    } catch (error) {
      console.error('Auto-refresh failed:', error);
    }
  }, [securityContext.refreshSession, autoRefreshEnabled]);

  // =====================================================================================
  // 🛡️ SECURITY UTILITIES
  // =====================================================================================

  const formatTimeRemaining = useCallback((milliseconds) => {
    if (milliseconds <= 0) return 'Expired';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }, []);

  const getSecurityLevelColor = useCallback((level) => {
    if (level >= 80) return 'green';
    if (level >= 60) return 'blue';
    if (level >= 40) return 'yellow';
    return 'red';
  }, []);

  const getThreatLevelColor = useCallback((threat) => {
    switch (threat) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  }, []);

  const getSecurityScore = useCallback(() => {
    let score = 0;
    
    // Authentication bonus
    if (securityContext.isAuthenticated) score += 30;
    
    // User type bonus
    if (securityContext.user?.role === 'user') score += 20;
    else if (securityContext.user?.role === 'guest') score += 10;
    
    // Session security bonus
    if (securityContext.session) {
      score += 20;
      if (securityContext.session.deviceFingerprint) score += 10;
      if (securityContext.session.securityLevel > 70) score += 10;
    }
    
    // Threat level penalty
    if (securityContext.threatLevel === 'high') score -= 20;
    else if (securityContext.threatLevel === 'medium') score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }, [securityContext]);

  // =====================================================================================
  // 📊 SECURITY ANALYTICS
  // =====================================================================================

  const getSecurityAnalytics = useCallback(() => {
    const events = securityContext.securityEvents || [];
    const now = Date.now();
    
    // Time ranges
    const lastHour = events.filter(e => now - e.timestamp < 3600000);
    const lastDay = events.filter(e => now - e.timestamp < 86400000);
    const lastWeek = events.filter(e => now - e.timestamp < 604800000);
    
    // Event types
    const loginEvents = events.filter(e => e.type.includes('login'));
    const failedEvents = events.filter(e => e.type.includes('failed') || e.type.includes('error'));
    const securityEvents = events.filter(e => e.type.includes('security') || e.type.includes('threat'));
    
    return {
      totalEvents: events.length,
      timeRanges: {
        lastHour: lastHour.length,
        lastDay: lastDay.length,
        lastWeek: lastWeek.length
      },
      eventTypes: {
        logins: loginEvents.length,
        failures: failedEvents.length,
        security: securityEvents.length
      },
      averageEventsPerDay: lastWeek.length / 7,
      securityScore: getSecurityScore(),
      riskLevel: failedEvents.length > 5 ? 'high' : failedEvents.length > 2 ? 'medium' : 'low'
    };
  }, [securityContext.securityEvents, getSecurityScore]);

  // =====================================================================================
  // 🔔 SECURITY NOTIFICATIONS
  // =====================================================================================

  const getSecurityNotifications = useCallback(() => {
    const notifications = [];
    
    // Session expiry warning
    if (isSessionNearExpiry) {
      notifications.push({
        id: 'session_expiry',
        type: 'warning',
        title: 'Session Expiring Soon',
        message: `Your session will expire in ${formatTimeRemaining(sessionTimeRemaining)}`,
        action: 'Refresh Session',
        actionCallback: securityContext.refreshSession
      });
    }
    
    // High threat level
    if (securityContext.threatLevel === 'high') {
      notifications.push({
        id: 'high_threat',
        type: 'error',
        title: 'High Security Threat',
        message: 'Unusual security activity detected. Consider changing your password.',
        action: 'Review Security',
        actionCallback: () => console.log('Review security clicked')
      });
    }
    
    // Guest user upgrade
    if (securityContext.user?.role === 'guest') {
      notifications.push({
        id: 'guest_upgrade',
        type: 'info',
        title: 'Upgrade Your Account',
        message: 'Create a full account to secure your data and unlock all features.',
        action: 'Sign Up',
        actionCallback: () => console.log('Sign up clicked')
      });
    }
    
    // Low security level
    if (securityContext.securityLevel < 50) {
      notifications.push({
        id: 'low_security',
        type: 'warning',
        title: 'Security Level Low',
        message: 'Enable additional security features for better protection.',
        action: 'Improve Security',
        actionCallback: () => console.log('Improve security clicked')
      });
    }
    
    return notifications;
  }, [
    isSessionNearExpiry, 
    sessionTimeRemaining, 
    securityContext.threatLevel, 
    securityContext.user, 
    securityContext.securityLevel,
    formatTimeRemaining,
    securityContext.refreshSession
  ]);

  // =====================================================================================
  // 🎮 SECURITY ACTIONS
  // =====================================================================================

  const securityActions = {
    // Quick actions
    refreshSession: securityContext.refreshSession,
    logout: securityContext.logout,
    
    // Settings
    toggleAutoRefresh: () => setAutoRefreshEnabled(!autoRefreshEnabled),
    
    // Security checks
    validateSession: securityContext.validateSession,
    
    // Emergency actions
    emergencyLogout: () => {
      securityContext.addSecurityEvent('emergency_logout', { 
        reason: 'User initiated emergency logout' 
      });
      securityContext.logout();
    },
    
    // Session extension
    extendSession: async () => {
      try {
        await securityContext.refreshSession();
        securityContext.addSecurityEvent('session_extended', {
          extendedBy: 'user_request'
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };

  // =====================================================================================
  // 🎨 UI HELPERS
  // =====================================================================================

  const getSessionStatusDisplay = useCallback(() => {
    if (!securityContext.session) {
      return {
        status: 'No Session',
        color: 'gray',
        icon: '⚪',
        description: 'Not authenticated'
      };
    }
    
    if (securityContext.isSessionExpired) {
      return {
        status: 'Expired',
        color: 'red',
        icon: '🔴',
        description: 'Session has expired'
      };
    }
    
    if (isSessionNearExpiry) {
      return {
        status: 'Expiring Soon',
        color: 'yellow',
        icon: '🟡',
        description: `Expires in ${formatTimeRemaining(sessionTimeRemaining)}`
      };
    }
    
    return {
      status: 'Active',
      color: 'green',
      icon: '🟢',
      description: `${formatTimeRemaining(sessionTimeRemaining)} remaining`
    };
  }, [
    securityContext.session, 
    securityContext.isSessionExpired, 
    isSessionNearExpiry, 
    sessionTimeRemaining,
    formatTimeRemaining
  ]);

  // =====================================================================================
  // 📤 RETURN ENHANCED SECURITY OBJECT
  // =====================================================================================

  return {
    // Original context
    ...securityContext,
    
    // Enhanced timing info
    isSessionNearExpiry,
    sessionTimeRemaining,
    formattedTimeRemaining: formatTimeRemaining(sessionTimeRemaining),
    
    // Auto-refresh
    autoRefreshEnabled,
    
    // Security analytics
    securityScore: getSecurityScore(),
    securityAnalytics: getSecurityAnalytics(),
    securityNotifications: getSecurityNotifications(),
    
    // UI helpers
    formatTimeRemaining,
    getSecurityLevelColor,
    getThreatLevelColor,
    getSessionStatusDisplay: getSessionStatusDisplay(),
    
    // Actions
    ...securityActions
  };
};

// =====================================================================================
// 🔒 SECURITY STATUS HOOK
// =====================================================================================

export const useSecurityStatus = () => {
  const security = useSecurity();
  
  return {
    isSecure: security.isAuthenticated && security.securityLevel > 50,
    securityLevel: security.securityLevel,
    threatLevel: security.threatLevel,
    hasActiveSession: !!security.session && !security.isSessionExpired,
    timeUntilExpiry: security.sessionTimeRemaining,
    needsAttention: security.securityNotifications.length > 0,
    notifications: security.securityNotifications
  };
};

// =====================================================================================
// 🛡️ SECURITY GUARD HOOK
// =====================================================================================

export const useSecurityGuard = (requiredLevel = 0, requiredAuth = false) => {
  const security = useSecurity();
  const [isAllowed, setIsAllowed] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    // Check authentication requirement
    if (requiredAuth && !security.isAuthenticated) {
      setIsAllowed(false);
      setReason('Authentication required');
      return;
    }
    
    // Check security level requirement
    if (security.securityLevel < requiredLevel) {
      setIsAllowed(false);
      setReason(`Security level ${requiredLevel} required (current: ${security.securityLevel})`);
      return;
    }
    
    // Check session validity
    if (security.isAuthenticated && security.isSessionExpired) {
      setIsAllowed(false);
      setReason('Session expired');
      return;
    }
    
    // All checks passed
    setIsAllowed(true);
    setReason('');
  }, [security.isAuthenticated, security.securityLevel, security.isSessionExpired, requiredLevel, requiredAuth]);

  return {
    isAllowed,
    reason,
    security
  };
};

// =====================================================================================
// 📊 SECURITY METRICS HOOK
// =====================================================================================

export const useSecurityMetrics = () => {
  const security = useSecurity();
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const calculateMetrics = () => {
      const events = security.securityEvents || [];
      const now = Date.now();
      
      // Calculate various metrics
      const newMetrics = {
        // Basic counts
        totalEvents: events.length,
        eventsToday: events.filter(e => now - e.timestamp < 86400000).length,
        eventsThisWeek: events.filter(e => now - e.timestamp < 604800000).length,
        
        // Security events breakdown
        loginAttempts: events.filter(e => e.type.includes('login')).length,
        failedAttempts: events.filter(e => e.type.includes('failed')).length,
        securityEvents: events.filter(e => e.type.includes('security')).length,
        
        // Session metrics
        sessionAge: security.session ? now - security.session.createdAt : 0,
        sessionRefreshes: security.session?.refreshCount || 0,
        sessionActivity: security.session?.activityCount || 0,
        
        // Security scores
        overallScore: security.securityScore,
        threatScore: security.threatLevel === 'high' ? 100 : security.threatLevel === 'medium' ? 50 : 0,
        
        // Time-based metrics
        averageSessionDuration: 0, // Would calculate from historical data
        lastActivityTime: security.session?.lastActivity || 0,
        
        // Risk indicators
        riskFactors: [
          security.threatLevel === 'high' && 'High threat level',
          security.securityLevel < 50 && 'Low security level',
          security.user?.role === 'guest' && 'Guest account',
          security.isSessionExpired && 'Expired session'
        ].filter(Boolean)
      };
      
      setMetrics(newMetrics);
    };

    calculateMetrics();
    
    // Update metrics every 30 seconds
    const interval = setInterval(calculateMetrics, 30000);
    return () => clearInterval(interval);
  }, [security]);

  return metrics;
};

// =====================================================================================
// 🔔 SECURITY ALERTS HOOK
// =====================================================================================

export const useSecurityAlerts = () => {
  const security = useSecurity();
  const [alerts, setAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);

  useEffect(() => {
    const generateAlerts = () => {
      const newAlerts = [];
      
      // Critical alerts
      if (security.threatLevel === 'high') {
        newAlerts.push({
          id: 'threat_high',
          level: 'critical',
          title: 'High Security Threat Detected',
          message: 'Multiple security events detected. Immediate attention required.',
          timestamp: Date.now(),
          actions: [
            { label: 'Review Events', action: 'review_events' },
            { label: 'Change Password', action: 'change_password' }
          ]
        });
      }
      
      // Warning alerts
      if (security.isSessionNearExpiry) {
        newAlerts.push({
          id: 'session_expiry',
          level: 'warning',
          title: 'Session Expiring Soon',
          message: `Your session will expire in ${security.formattedTimeRemaining}`,
          timestamp: Date.now(),
          actions: [
            { label: 'Extend Session', action: 'extend_session' }
          ]
        });
      }
      
      if (security.securityLevel < 40) {
        newAlerts.push({
          id: 'low_security',
          level: 'warning',
          title: 'Low Security Level',
          message: 'Your account security can be improved.',
          timestamp: Date.now(),
          actions: [
            { label: 'Improve Security', action: 'improve_security' }
          ]
        });
      }
      
      // Info alerts
      if (security.user?.role === 'guest') {
        newAlerts.push({
          id: 'guest_account',
          level: 'info',
          title: 'Guest Account Active',
          message: 'Create a full account to secure your data.',
          timestamp: Date.now(),
          actions: [
            { label: 'Create Account', action: 'create_account' }
          ]
        });
      }
      
      // Update alerts if different
      if (JSON.stringify(newAlerts) !== JSON.stringify(alerts)) {
        setAlerts(newAlerts);
        
        // Add new alerts to history
        const newInHistory = newAlerts.filter(alert => 
          !alertHistory.some(histAlert => histAlert.id === alert.id)
        );
        
        if (newInHistory.length > 0) {
          setAlertHistory(prev => [...prev, ...newInHistory].slice(-50)); // Keep last 50
        }
      }
    };

    generateAlerts();
    
    // Check for new alerts every 10 seconds
    const interval = setInterval(generateAlerts, 10000);
    return () => clearInterval(interval);
  }, [security, alerts, alertHistory]);

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleAlertAction = async (alertId, actionType) => {
    switch (actionType) {
      case 'extend_session':
        await security.extendSession();
        break;
      case 'review_events':
        // Would open security dashboard
        console.log('Opening security dashboard...');
        break;
      case 'change_password':
        // Would open password change dialog
        console.log('Opening password change...');
        break;
      case 'improve_security':
        // Would open security settings
        console.log('Opening security settings...');
        break;
      case 'create_account':
        // Would open registration
        console.log('Opening registration...');
        break;
    }
    
    dismissAlert(alertId);
  };

  return {
    alerts,
    alertHistory,
    dismissAlert,
    handleAlertAction,
    hasActiveAlerts: alerts.length > 0,
    criticalAlerts: alerts.filter(a => a.level === 'critical'),
    warningAlerts: alerts.filter(a => a.level === 'warning'),
    infoAlerts: alerts.filter(a => a.level === 'info')
  };
};

// =====================================================================================
// 🛡️ SECURITY MONITOR HOOK
// =====================================================================================

export const useSecurityMonitor = (options = {}) => {
  const {
    enableAutoRefresh = true,
    enableThreatDetection = true,
    enableSessionMonitoring = true,
    alertThresholds = {
      failedLogins: 3,
      lowSecurityLevel: 40,
      sessionExpiryWarning: 300000 // 5 minutes
    }
  } = options;

  const security = useSecurity();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringStats, setMonitoringStats] = useState({
    checksPerformed: 0,
    threatsDetected: 0,
    autoRefreshes: 0,
    alertsGenerated: 0
  });

  useEffect(() => {
    if (!isMonitoring) return;

    const performSecurityCheck = () => {
      setMonitoringStats(prev => ({
        ...prev,
        checksPerformed: prev.checksPerformed + 1
      }));

      // Check for threats
      if (enableThreatDetection) {
        const recentEvents = security.securityEvents.filter(e => 
          Date.now() - e.timestamp < 300000 // Last 5 minutes
        );
        
        const failedEvents = recentEvents.filter(e => 
          e.type.includes('failed') || e.type.includes('error')
        );

        if (failedEvents.length >= alertThresholds.failedLogins) {
          setMonitoringStats(prev => ({
            ...prev,
            threatsDetected: prev.threatsDetected + 1
          }));
        }
      }

      // Check session status
      if (enableSessionMonitoring && security.session) {
        const timeLeft = security.session.expiresAt - Date.now();
        
        if (timeLeft < alertThresholds.sessionExpiryWarning && timeLeft > 0) {
          setMonitoringStats(prev => ({
            ...prev,
            alertsGenerated: prev.alertsGenerated + 1
          }));
        }
      }

      // Auto-refresh if needed
      if (enableAutoRefresh && security.isSessionNearExpiry) {
        security.refreshSession().then(() => {
          setMonitoringStats(prev => ({
            ...prev,
            autoRefreshes: prev.autoRefreshes + 1
          }));
        });
      }
    };

    const interval = setInterval(performSecurityCheck, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [isMonitoring, security, enableAutoRefresh, enableThreatDetection, enableSessionMonitoring, alertThresholds]);

  const startMonitoring = () => setIsMonitoring(true);
  const stopMonitoring = () => setIsMonitoring(false);

  return {
    isMonitoring,
    monitoringStats,
    startMonitoring,
    stopMonitoring,
    
    // Quick status
    systemStatus: {
      overall: security.securityScore > 70 ? 'good' : security.securityScore > 40 ? 'warning' : 'critical',
      session: security.session && !security.isSessionExpired ? 'active' : 'inactive',
      threats: security.threatLevel,
      monitoring: isMonitoring ? 'active' : 'inactive'
    }
  };
};

// =====================================================================================
// 📤 DEFAULT EXPORT
// =====================================================================================

export default useSecurity;