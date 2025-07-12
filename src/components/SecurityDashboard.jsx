// =====================================================================================
// 📊 SECURITY DASHBOARD - SECURITY MONITORING UI
// =====================================================================================
// FILE LOCATION: src/components/SecurityDashboard.jsx
// Created by Himanshu (himanshu1614)
// Purpose: Visual security monitoring and management interface

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Settings,
  RefreshCw,
  LogOut,
  Eye,
  Database,
  Fingerprint,
  Zap,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone
} from 'lucide-react';
import { useSecurity } from '../security/SecurityProvider.jsx';

// =====================================================================================
// 📊 SECURITY DASHBOARD COMPONENT
// =====================================================================================

const SecurityDashboard = ({ isOpen, onClose }) => {
  const {
    user,
    session,
    securityLevel,
    threatLevel,
    securityEvents,
    isSessionExpired,
    refreshSession,
    logout,
    getSecurityStatus,
    getSecurityRecommendations
  } = useSecurity();

  const [refreshing, setRefreshing] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // =====================================================================================
  // 🔄 DATA LOADING
  // =====================================================================================

  useEffect(() => {
    if (isOpen) {
      loadSecurityData();
      const interval = setInterval(loadSecurityData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadSecurityData = () => {
    setSecurityStatus(getSecurityStatus());
    setRecommendations(getSecurityRecommendations());
  };

  const handleRefreshSession = async () => {
    setRefreshing(true);
    try {
      await refreshSession();
      loadSecurityData();
    } finally {
      setRefreshing(false);
    }
  };

  if (!isOpen) return null;

  // =====================================================================================
  // 🎨 RENDER COMPONENTS
  // =====================================================================================

  const renderTabButton = (tab, label, icon) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === tab
          ? 'bg-purple-500 text-white'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const renderSecurityLevel = () => {
    const level = securityLevel || 0;
    const color = level >= 80 ? 'green' : level >= 60 ? 'blue' : level >= 40 ? 'yellow' : 'red';
    
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Security Level</h3>
          <Shield className={`w-6 h-6 text-${color}-500`} />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Current Level</span>
            <span className={`font-bold text-${color}-600`}>{level}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 bg-${color}-500`}
              style={{ width: `${level}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Session Active</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Device Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Data Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Monitoring Active</span>
          </div>
        </div>
      </div>
    );
  };

  const renderThreatLevel = () => {
    const color = threatLevel === 'high' ? 'red' : threatLevel === 'medium' ? 'yellow' : 'green';
    const icon = threatLevel === 'high' ? AlertTriangle : threatLevel === 'medium' ? Eye : CheckCircle;
    const Icon = icon;
    
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Threat Level</h3>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        
        <div className={`text-2xl font-bold text-${color}-600 mb-2 capitalize`}>
          {threatLevel}
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          {threatLevel === 'high' && 'Multiple security events detected. Review recommended actions.'}
          {threatLevel === 'medium' && 'Some security activity noticed. Monitor closely.'}
          {threatLevel === 'low' && 'No unusual security activity detected.'}
        </div>
        
        <div className="text-xs text-gray-500">
          Based on recent activity and security events
        </div>
      </div>
    );
  };

  const renderSessionInfo = () => {
    if (!session) return null;

    const timeRemaining = session.expiresAt - Date.now();
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Session Info</h3>
          <Clock className="w-6 h-6 text-blue-500" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Time Remaining</div>
            <div className="font-bold text-blue-600">
              {hours}h {minutes}m
            </div>
          </div>
          <div>
            <div className="text-gray-600">Auth Method</div>
            <div className="font-bold">{session.authMethod}</div>
          </div>
          <div>
            <div className="text-gray-600">Refresh Count</div>
            <div className="font-bold">{session.refreshCount}</div>
          </div>
          <div>
            <div className="text-gray-600">Activity Count</div>
            <div className="font-bold">{session.activityCount}</div>
          </div>
        </div>
        
        <button
          onClick={handleRefreshSession}
          disabled={refreshing}
          className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {refreshing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh Session
            </>
          )}
        </button>
      </div>
    );
  };

  const renderRecentEvents = () => {
    const recentEvents = securityEvents.slice(-10).reverse();
    
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Events</h3>
          <Activity className="w-6 h-6 text-purple-500" />
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No recent security events
            </div>
          ) : (
            recentEvents.map((event) => {
              const eventColor = event.type.includes('failed') || event.type.includes('error') ? 'red' :
                               event.type.includes('login') || event.type.includes('created') ? 'green' :
                               'blue';
              
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full bg-${eventColor}-500 mt-2 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm">
                      {event.type.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                    {event.data && Object.keys(event.data).length > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        {Object.entries(event.data).slice(0, 2).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {typeof value === 'string' ? value.substring(0, 20) : value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Security Recommendations</h3>
          <Settings className="w-6 h-6 text-orange-500" />
        </div>
        
        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>All security recommendations satisfied!</span>
            </div>
          ) : (
            recommendations.map((rec, index) => {
              const color = rec.level === 'high' ? 'red' : rec.level === 'medium' ? 'yellow' : 'blue';
              const icon = rec.level === 'high' ? AlertTriangle : rec.level === 'medium' ? Eye : Settings;
              const Icon = icon;
              
              return (
                <div key={index} className={`flex items-start gap-3 p-3 bg-${color}-50 border border-${color}-200 rounded-lg`}>
                  <Icon className={`w-5 h-5 text-${color}-500 mt-0.5 flex-shrink-0`} />
                  <div>
                    <div className={`font-medium text-${color}-800 text-sm`}>
                      {rec.type.toUpperCase()} RECOMMENDATION
                    </div>
                    <div className={`text-${color}-700 text-sm mt-1`}>
                      {rec.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderDeviceInfo = () => {
    if (!session?.deviceFingerprint) return null;

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Device Information</h3>
          <Fingerprint className="w-6 h-6 text-indigo-500" />
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Browser:</span>
            <span className="font-medium">{navigator.userAgent.split(' ')[0]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Language:</span>
            <span className="font-medium">{navigator.language}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Timezone:</span>
            <span className="font-medium">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Screen:</span>
            <span className="font-medium">{screen.width}x{screen.height}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Online:</span>
            <span className={`font-medium ${navigator.onLine ? 'text-green-600' : 'text-red-600'}`}>
              {navigator.onLine ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fingerprint:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {session.deviceFingerprint.hash?.substring(0, 8)}...
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderSecurityLevel()}
      {renderThreatLevel()}
      {renderSessionInfo()}
      {renderRecommendations()}
    </div>
  );

  const renderEventsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderRecentEvents()}
      <div className="space-y-6">
        {renderDeviceInfo()}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Event Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{securityEvents.length}</div>
              <div className="text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {securityEvents.filter(e => Date.now() - e.timestamp < 3600000).length}
              </div>
              <div className="text-gray-600">Last Hour</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto Session Refresh</div>
              <div className="text-sm text-gray-600">Automatically refresh session before expiry</div>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Device Fingerprinting</div>
              <div className="text-sm text-gray-600">Enhanced device verification</div>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Activity Monitoring</div>
              <div className="text-sm text-gray-600">Track user activity for security</div>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            Change Password
          </button>
          <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
            Download Security Report
          </button>
          <button 
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  // =====================================================================================
  // 🎨 MAIN RENDER
  // =====================================================================================

  return (
    <div className="security-modal">
      <div className="security-card max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-500" />
              <div>
                <h2 className="security-title">Security Dashboard</h2>
                <p className="security-text">
                  Welcome back, {user?.firstName || 'User'}! Your security status is monitored.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="security-button p-2"
            >
               d7
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex gap-2">
            {renderTabButton('overview', 'Overview', <TrendingUp className="w-4 h-4" />)}
            {renderTabButton('events', 'Events', <Activity className="w-4 h-4" />)}
            {renderTabButton('settings', 'Settings', <Settings className="w-4 h-4" />)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'events' && renderEventsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-2xl p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AES-256 Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="w-4 h-4 text-blue-500" />
                <span>Secure Storage</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-purple-500" />
                <span>Real-time Monitoring</span>
              </div>
            </div>
            <div>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;