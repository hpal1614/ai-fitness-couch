// =====================================================================================
// ☕ BUY ME COFFEE - MONETIZATION COMPONENT
// =====================================================================================
// Created by Himanshu (himanshu1614)
// Features: Coffee buttons, donation modals, celebration animations, social sharing
// Purpose: Sustainable monetization for the AI Fitness Coach app
// FILE LOCATION: src/components/BuyMeCoffee.jsx

import React, { useState, useEffect } from 'react';
import { Coffee, Heart, Star, Gift, Trophy, Target } from 'lucide-react';

// =====================================================================================
// 🎨 CELEBRATION ANIMATIONS
// =====================================================================================

const CelebrationModal = ({ isOpen, onClose, amount, type = 'coffee' }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const celebrationMessages = {
    coffee: [
      "You're amazing! ☕ This coffee will fuel more awesome features!",
      "Thank you so much! 🚀 Your support means everything!",
      "You're a legend! 💪 This helps keep the coach running strong!",
      "Incredible generosity! ⭐ You're helping build something special!"
    ],
    monthly: [
      "Monthly supporter! 🏆 You're now part of the fitness family!",
      "Ongoing champion! 💎 Your support enables continuous improvements!",
      "Fitness family member! 🎯 Together we're building the best coach!"
    ]
  };
  
  const randomMessage = celebrationMessages[type][Math.floor(Math.random() * celebrationMessages[type].length)];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: '1.5rem'
                }}
              >
                {['🎉', '🎊', '⭐', '💪', '🚀', '❤️'][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>
        )}
        
        {/* Main Content */}
        <div className="relative z-10">
          <div className="text-6xl mb-4">
            {type === 'coffee' ? '☕' : '🏆'}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            You're Awesome!
          </h2>
          
          <p className="text-lg text-gray-600 mb-4">
            {randomMessage}
          </p>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>${amount}</strong> contribution • <strong>100%</strong> goes to app development
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.open('https://twitter.com/intent/tweet?text=Just%20supported%20the%20amazing%20AI%20Fitness%20Coach!%20💪%20Check%20it%20out!', '_blank')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Share on Twitter 🐦
            </button>
            
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continue Crushing Goals! 💪
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================================
// ☕ COFFEE BUTTON VARIANTS
// =====================================================================================

const CoffeeButton = ({ variant = 'default', amount = 5, onClick, className = '' }) => {
  const variants = {
    default: {
      icon: Coffee,
      bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      hover: 'hover:from-amber-600 hover:to-orange-600',
      text: 'Buy me a coffee',
      emoji: '☕'
    },
    heart: {
      icon: Heart,
      bg: 'bg-gradient-to-r from-pink-500 to-red-500',
      hover: 'hover:from-pink-600 hover:to-red-600',
      text: 'Support with love',
      emoji: '❤️'
    },
    star: {
      icon: Star,
      bg: 'bg-gradient-to-r from-yellow-500 to-amber-500',
      hover: 'hover:from-yellow-600 hover:to-amber-600',
      text: 'Give a star',
      emoji: '⭐'
    },
    gift: {
      icon: Gift,
      bg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      hover: 'hover:from-purple-600 hover:to-indigo-600',
      text: 'Send a gift',
      emoji: '🎁'
    },
    trophy: {
      icon: Trophy,
      bg: 'bg-gradient-to-r from-yellow-600 to-yellow-500',
      hover: 'hover:from-yellow-700 hover:to-yellow-600',
      text: 'Champion support',
      emoji: '🏆'
    }
  };
  
  const config = variants[variant];
  const Icon = config.icon;
  
  return (
    <button
      onClick={() => onClick(amount, variant)}
      className={`
        ${config.bg} ${config.hover}
        text-white font-semibold py-3 px-6 rounded-xl
        flex items-center gap-2 transition-all duration-200
        transform hover:scale-105 hover:shadow-lg
        ${className}
      `}
    >
      <Icon size={20} />
      <span>{config.text}</span>
      <span className="text-lg">{config.emoji}</span>
      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-lg text-sm">
        ${amount}
      </span>
    </button>
  );
};

// =====================================================================================
// 🎯 FLOATING SUPPORT WIDGET
// =====================================================================================

const FloatingSupportWidget = ({ onSupportClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show widget after user has been active for 30 seconds
    const timer = setTimeout(() => setIsVisible(true), 30000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isExpanded && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl p-4 max-w-xs">
          <div className="text-center mb-3">
            <h4 className="font-bold text-gray-800 mb-1">Loving the AI Coach?</h4>
            <p className="text-sm text-gray-600">
              Your support helps keep it free and improving! 🚀
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSupportClick(3, 'coffee')}
              className="bg-amber-500 text-white p-2 rounded-lg text-sm hover:bg-amber-600 transition-colors"
            >
              ☕ $3
            </button>
            <button
              onClick={() => onSupportClick(5, 'coffee')}
              className="bg-amber-500 text-white p-2 rounded-lg text-sm hover:bg-amber-600 transition-colors"
            >
              ☕ $5
            </button>
            <button
              onClick={() => onSupportClick(10, 'heart')}
              className="bg-pink-500 text-white p-2 rounded-lg text-sm hover:bg-pink-600 transition-colors"
            >
              ❤️ $10
            </button>
            <button
              onClick={() => onSupportClick(20, 'trophy')}
              className="bg-yellow-500 text-white p-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors"
            >
              🏆 $20
            </button>
          </div>
          
          <button
            onClick={() => setIsExpanded(false)}
            className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700"
          >
            Maybe later
          </button>
        </div>
      )}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
      >
        {isExpanded ? (
          <span className="text-xl">✕</span>
        ) : (
          <Coffee size={24} />
        )}
      </button>
    </div>
  );
};

// =====================================================================================
// 💳 DONATION MODAL WITH PAYMENT OPTIONS
// =====================================================================================

const DonationModal = ({ isOpen, onClose, onDonate }) => {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [supportType, setSupportType] = useState('one-time');
  
  if (!isOpen) return null;
  
  const predefinedAmounts = [3, 5, 10, 20, 50];
  
  const finalAmount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">💪</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Support AI Fitness Coach
          </h2>
          <p className="text-gray-600">
            Help keep the coach free and constantly improving!
          </p>
        </div>
        
        {/* Support Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setSupportType('one-time')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              supportType === 'one-time'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            One-time ☕
          </button>
          <button
            onClick={() => setSupportType('monthly')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              supportType === 'monthly'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly 🏆
          </button>
        </div>
        
        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose amount:
          </label>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            {predefinedAmounts.map(amount => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setIsCustom(false);
                }}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedAmount === amount && !isCustom
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setIsCustom(true);
              }}
              onFocus={() => setIsCustom(true)}
              className={`w-full p-3 border-2 rounded-lg ${
                isCustom
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200'
              }`}
            />
            <span className="absolute left-3 top-3 text-gray-500">$</span>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Your support enables:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>🚀 New AI features and improvements</li>
            <li>📱 Mobile app development</li>
            <li>🔬 Exercise science research integration</li>
            <li>🆓 Keeping the coach completely free</li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </button>
          
          <button
            onClick={() => {
              if (finalAmount > 0) {
                onDonate(finalAmount, supportType);
                onClose();
              }
            }}
            disabled={finalAmount <= 0}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
              finalAmount > 0
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {supportType === 'monthly' ? `Support Monthly` : `Donate`} ${finalAmount || 0}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          Powered by secure payment processing. No account required.
        </p>
      </div>
    </div>
  );
};

// =====================================================================================
// 📊 SUPPORT STATS WIDGET
// =====================================================================================

const SupportStatsWidget = ({ totalSupport = 234, supporters = 89, goal = 1000 }) => {
  const progressPercentage = (totalSupport / goal) * 100;
  
  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">Community Support</h4>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Heart size={16} className="text-red-500" />
          <span>{supporters} supporters</span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>${totalSupport} raised</span>
          <span>${goal} goal</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-xs text-gray-600">
        Help us reach our goal to unlock new features! 🚀
      </p>
    </div>
  );
};

// =====================================================================================
// 🎉 MILESTONE CELEBRATIONS
// =====================================================================================

const MilestoneCelebration = ({ milestone, isVisible, onClose }) => {
  if (!isVisible) return null;
  
  const milestones = {
    first_support: {
      title: "First Support! 🎉",
      message: "You're officially part of the AI Fitness Coach family!",
      emoji: "🥳"
    },
    monthly_supporter: {
      title: "Monthly Champion! 🏆",
      message: "You're now a monthly supporter! Your ongoing help is incredible!",
      emoji: "💎"
    },
    big_supporter: {
      title: "Major Supporter! 🌟",
      message: "Wow! Your generous support will enable amazing new features!",
      emoji: "🚀"
    }
  };
  
  const config = milestones[milestone] || milestones.first_support;
  
  return (
    <div className="fixed top-4 right-4 bg-white rounded-xl shadow-2xl p-6 max-w-sm z-50 border-l-4 border-green-500">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{config.emoji}</div>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">{config.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{config.message}</p>
          <button
            onClick={onClose}
            className="text-xs text-purple-600 hover:text-purple-800"
          >
            Awesome! ✨
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================================================
// 🎁 MAIN BUY ME COFFEE COMPONENT
// =====================================================================================

const BuyMeCoffee = ({ 
  showFloatingWidget = true, 
  showStats = true,
  className = '',
  onSupportComplete = () => {} 
}) => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [celebrationData, setCelebrationData] = useState({});
  const [milestoneType, setMilestoneType] = useState('first_support');
  
  // Mock data - in real app, this would come from API
  const [supportStats, setSupportStats] = useState({
    totalSupport: 234,
    supporters: 89,
    goal: 1000
  });
  
  const handleSupportClick = (amount, type) => {
    // In real app, this would integrate with payment processor
    handleDonation(amount, 'one-time', type);
  };
  
  const handleDonation = (amount, supportType, variant = 'coffee') => {
    // Simulate payment processing
    console.log(`Processing ${supportType} donation of ${amount}`);
    
    // Show celebration
    setCelebrationData({ amount, type: variant });
    setShowCelebration(true);
    
    // Update stats (mock)
    setSupportStats(prev => ({
      ...prev,
      totalSupport: prev.totalSupport + amount,
      supporters: prev.supporters + 1
    }));
    
    // Show milestone if applicable
    if (amount >= 20) {
      setMilestoneType('big_supporter');
      setShowMilestone(true);
    } else if (supportType === 'monthly') {
      setMilestoneType('monthly_supporter');
      setShowMilestone(true);
    } else {
      setMilestoneType('first_support');
      setShowMilestone(true);
    }
    
    // Callback for parent component
    onSupportComplete({ amount, supportType, variant });
    
    // In real app, this would:
    // 1. Call payment processor API
    // 2. Update database
    // 3. Send confirmation email
    // 4. Update user account if applicable
  };
  
  return (
    <div className={`buy-me-coffee ${className}`}>
      {/* Support Stats Widget */}
      {showStats && (
        <SupportStatsWidget {...supportStats} />
      )}
      
      {/* Coffee Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <CoffeeButton
          variant="default"
          amount={5}
          onClick={handleSupportClick}
        />
        <CoffeeButton
          variant="heart"
          amount={10}
          onClick={handleSupportClick}
        />
        <CoffeeButton
          variant="gift"
          amount={15}
          onClick={handleSupportClick}
        />
        <CoffeeButton
          variant="trophy"
          amount={25}
          onClick={handleSupportClick}
        />
      </div>
      
      {/* Custom Amount Button */}
      <button
        onClick={() => setShowDonationModal(true)}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <Target size={20} />
        Choose Custom Amount
        <span className="text-lg">🎯</span>
      </button>
      
      {/* Floating Support Widget */}
      {showFloatingWidget && (
        <FloatingSupportWidget onSupportClick={handleSupportClick} />
      )}
      
      {/* Modals */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onDonate={(amount, type) => handleDonation(amount, type)}
      />
      
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        amount={celebrationData.amount}
        type={celebrationData.type}
      />
      
      <MilestoneCelebration
        milestone={milestoneType}
        isVisible={showMilestone}
        onClose={() => setShowMilestone(false)}
      />
      
      {/* Footer Info */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          Your support helps keep AI Fitness Coach free and improving! 🚀
        </p>
        <p className="text-xs text-gray-400 mt-1">
          100% of contributions go directly to app development
        </p>
      </div>
    </div>
  );
};

// =====================================================================================
// 📤 EXPORTS
// =====================================================================================

export default BuyMeCoffee;

export {
  CoffeeButton,
  DonationModal,
  CelebrationModal,
  FloatingSupportWidget,
  SupportStatsWidget,
  MilestoneCelebration
};