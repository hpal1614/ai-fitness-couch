// =====================================================================================
// ☕ BUY ME A COFFEE WIDGET - SUPPORTING VOICEFIT DEVELOPMENT
// =====================================================================================
// Username: himanshu1614 as specified

import React, { useState, useEffect } from 'react';
import { Coffee, Heart, Star, Gift } from 'lucide-react';

const BuyMeCoffeeWidget = ({ showPrompt = false, achievementText = '' }) => {
  const [showWidget, setShowWidget] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const bmacUsername = 'himanshu1614';

  useEffect(() => {
    // Show widget after 30 seconds or immediately if showPrompt is true
    const timer = setTimeout(() => {
      setShowWidget(true);
    }, showPrompt ? 0 : 30000);

    return () => clearTimeout(timer);
  }, [showPrompt]);

  const handleDonate = () => {
    // Track achievement donation if provided
    if (achievementText) {
      console.log(`Achievement donation prompted: ${achievementText}`);
      // Could integrate with analytics here
    }
    
    // Open Buy Me a Coffee page
    window.open(`https://www.buymeacoffee.com/${bmacUsername}`, '_blank', 'noopener,noreferrer');
  };

  const handleDismiss = () => {
    setShowWidget(false);
    // Don't show again for this session
    sessionStorage.setItem('bmac_dismissed', 'true');
  };

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('bmac_dismissed') && !showPrompt) {
    return null;
  }

  if (!showWidget && !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Coffee Button */}
      <div 
        className="relative bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
        onClick={handleDonate}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Coffee className="w-6 h-6 animate-bounce" />
        
        {/* Floating Hearts Animation */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-4 h-4 text-red-400 animate-pulse" />
        </div>
        
        {/* Achievement Badge */}
        {achievementText && (
          <div className="absolute -top-1 -left-1 bg-yellow-400 text-yellow-900 rounded-full p-1">
            <Star className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg whitespace-nowrap z-50">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            <span>Support VoiceFit Development!</span>
          </div>
          {achievementText && (
            <div className="text-xs text-yellow-300 mt-1">
              🎉 {achievementText}
            </div>
          )}
          {/* Arrow pointing down */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Expandable Support Message */}
      {showPrompt && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 max-w-sm border border-orange-200">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <Coffee className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Support VoiceFit! ☕</h3>
              {achievementText ? (
                <p className="text-sm text-gray-600 mt-1">
                  🎉 {achievementText} 
                  <br />
                  <span className="text-orange-600">Consider supporting our free app!</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600 mt-1">
                  VoiceFit is free forever! If you're loving the experience, consider buying me a coffee to support development.
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleDonate}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  ☕ Buy Coffee
                </button>
                <button
                  onClick={handleDismiss}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for managing achievement-based donation prompts
export const useAchievementDonation = () => {
  const [achievements, setAchievements] = useState([]);
  const [showDonationPrompt, setShowDonationPrompt] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState('');

  const triggerAchievementDonation = (achievementText) => {
    // Only show donation prompt for significant achievements
    const significantAchievements = [
      'first workout completed',
      '7 day streak',
      '30 day streak',
      'perfect form achieved',
      '50 workouts completed',
      '100 workouts completed'
    ];

    const isSignificant = significantAchievements.some(significant => 
      achievementText.toLowerCase().includes(significant)
    );

    if (isSignificant) {
      setCurrentAchievement(achievementText);
      setShowDonationPrompt(true);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setShowDonationPrompt(false);
      }, 10000);
    }

    // Track all achievements
    setAchievements(prev => [...prev, {
      text: achievementText,
      timestamp: Date.now(),
      id: Date.now().toString()
    }]);
  };

  const dismissDonationPrompt = () => {
    setShowDonationPrompt(false);
  };

  return {
    achievements,
    showDonationPrompt,
    currentAchievement,
    triggerAchievementDonation,
    dismissDonationPrompt
  };
};

export default BuyMeCoffeeWidget;