// File: src/components/LoginForm.tsx

// =====================================================================================
// 🔐 LOGIN FORM - AUTHENTICATION UI COMPONENT
// =====================================================================================
// Created by Himanshu (himanshu1614)
// Purpose: Beautiful login/register interface with security features

import React, { useState, useEffect, ReactNode } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  User, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Loader,
  UserPlus,
  LogIn,
  Coffee
} from 'lucide-react';

// =====================================================================================
// 🎯 TYPE DEFINITIONS
// =====================================================================================

export interface LoginFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  submit?: string;
}

export interface PasswordStrength {
  score: number;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
  };
  level: 'weak' | 'fair' | 'good' | 'strong';
  percentage: number;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface SecurityContextType {
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: LoginFormData) => Promise<AuthResult>;
  loginAsGuest: () => Promise<AuthResult>;
  isLoading: boolean;
}

export interface LoginFormProps {
  onClose?: () => void;
  defaultTab?: 'login' | 'register';
}

export type ActiveTab = 'login' | 'register';
export type InputType = 'text' | 'email' | 'password';

// =====================================================================================
// 🎯 MOCK SECURITY PROVIDER HOOK
// =====================================================================================

const useSecurity = (): SecurityContextType => {
  return {
    login: async (email: string, password: string): Promise<AuthResult> => {
      // Mock implementation
      console.log('Logging in with:', email);
      return new Promise((resolve) => {
        setTimeout(() => {
          if (email === 'demo@aifitnesscoach.com' && password === 'Demo123!') {
            resolve({
              success: true,
              user: { id: '1', email, firstName: 'Demo', lastName: 'User' }
            });
          } else {
            resolve({
              success: false,
              error: 'Invalid credentials'
            });
          }
        }, 1000);
      });
    },
    register: async (data: LoginFormData): Promise<AuthResult> => {
      // Mock implementation
      console.log('Registering user:', data);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            user: { 
              id: '2', 
              email: data.email, 
              firstName: data.firstName, 
              lastName: data.lastName 
            }
          });
        }, 1500);
      });
    },
    loginAsGuest: async (): Promise<AuthResult> => {
      // Mock implementation
      console.log('Logging in as guest');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            user: { id: 'guest', email: 'guest@aifitnesscoach.com', firstName: 'Guest' }
          });
        }, 500);
      });
    },
    isLoading: false
  };
};

// =====================================================================================
// 🎨 LOGIN FORM COMPONENT
// =====================================================================================

const LoginForm: React.FC<LoginFormProps> = ({ onClose, defaultTab = 'login' }) => {
  const { login, register, loginAsGuest, isLoading } = useSecurity();
  
  // Form state
  const [activeTab, setActiveTab] = useState<ActiveTab>(defaultTab);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  
  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [showDemo, setShowDemo] = useState<boolean>(false);

  // =====================================================================================
  // 🔄 FORM HANDLERS
  // =====================================================================================

  const handleInputChange = (field: keyof LoginFormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Check password strength on password change
    if (field === 'password' && activeTab === 'register') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string): void => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;
    
    const strength: PasswordStrength = {
      score,
      checks,
      level: score < 2 ? 'weak' : score < 4 ? 'fair' : score < 5 ? 'good' : 'strong',
      percentage: (score / 5) * 100
    };

    setPasswordStrength(strength);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Registration-specific validation
    if (activeTab === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (passwordStrength && passwordStrength.level === 'weak') {
        newErrors.password = 'Please choose a stronger password';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let result: AuthResult;
      
      if (activeTab === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }
      
      if (result.success) {
        onClose?.();
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const result = await loginAsGuest();
      if (result.success) {
        onClose?.();
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Guest login failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (): void => {
    setFormData(prev => ({
      ...prev,
      email: 'demo@aifitnesscoach.com',
      password: 'Demo123!'
    }));
    setShowDemo(false);
  };

  // =====================================================================================
  // 🎨 RENDER COMPONENTS
  // =====================================================================================

  const renderTabButton = (tab: ActiveTab, label: string, icon: ReactNode): ReactNode => (
    <button
      key={tab}
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-purple-500 text-white shadow-md'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {icon}
        {label}
      </div>
    </button>
  );

  const renderPasswordStrength = (): ReactNode => {
    if (!passwordStrength || activeTab !== 'register') return null;

    const colors: Record<PasswordStrength['level'], string> = {
      weak: 'bg-red-500',
      fair: 'bg-yellow-500',
      good: 'bg-blue-500',
      strong: 'bg-green-500'
    };

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Password strength:</span>
          <span className={`font-medium ${
            passwordStrength.level === 'weak' ? 'text-red-600' :
            passwordStrength.level === 'fair' ? 'text-yellow-600' :
            passwordStrength.level === 'good' ? 'text-blue-600' :
            'text-green-600'
          }`}>
            {passwordStrength.level.toUpperCase()}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${colors[passwordStrength.level]}`}
            style={{ width: `${passwordStrength.percentage}%` }}
          />
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
          <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.checks.length ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            8+ characters
          </div>
          <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.checks.uppercase ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            Uppercase
          </div>
          <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.checks.lowercase ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            Lowercase
          </div>
          <div className={`flex items-center gap-1 ${passwordStrength.checks.numbers ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.checks.numbers ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            Numbers
          </div>
          <div className={`flex items-center gap-1 ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.checks.special ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            Special chars
          </div>
        </div>
      </div>
    );
  };

  const renderInputField = (
    field: keyof LoginFormData, 
    label: string, 
    type: InputType = 'text', 
    icon: ReactNode = null, 
    placeholder: string = ''
  ): ReactNode => (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
          </button>
        )}
      </div>
      {errors[field] && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {errors[field]}
        </p>
      )}
      {/* Apple-style password strength */}
      {field === 'password' && activeTab === 'register' && passwordStrength && (
        <div className="password-strength-container">
          <div className="password-strength-bar">
            <div className={`password-strength-fill ${passwordStrength.level}`} />
          </div>
          <div className="password-checks">
            <div className={`password-check ${passwordStrength.checks.length ? 'valid' : ''}`}>
              {passwordStrength.checks.length ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              8+ characters
            </div>
            <div className={`password-check ${passwordStrength.checks.uppercase ? 'valid' : ''}`}>
              {passwordStrength.checks.uppercase ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              Uppercase
            </div>
            <div className={`password-check ${passwordStrength.checks.lowercase ? 'valid' : ''}`}>
              {passwordStrength.checks.lowercase ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              Lowercase
            </div>
            <div className={`password-check ${passwordStrength.checks.numbers ? 'valid' : ''}`}>
              {passwordStrength.checks.numbers ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              Numbers
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // =====================================================================================
  // 🎨 MAIN RENDER
  // =====================================================================================

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🤖💪</div>
          <h2 className="text-2xl font-bold text-gray-800">
            AI Fitness Coach
          </h2>
          <p className="text-gray-600">
            Secure access to your fitness journey
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {renderTabButton('login', 'Sign In', <LogIn size={16} />)}
          {renderTabButton('register', 'Sign Up', <UserPlus size={16} />)}
        </div>

        {/* Demo Credentials Notice */}
        {activeTab === 'login' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                <strong>Demo Account Available</strong>
              </div>
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="text-blue-600 text-sm underline"
              >
                {showDemo ? 'Hide' : 'Show'}
              </button>
            </div>
            {showDemo && (
              <div className="mt-2 text-xs text-blue-700">
                <div>Email: demo@aifitnesscoach.com</div>
                <div>Password: Demo123!</div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="mt-1 text-blue-600 underline"
                >
                  Fill automatically
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Registration Fields */}
          {activeTab === 'register' && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                {renderInputField('firstName', 'First Name', 'text', <User size={20} className="text-gray-400" />, 'John')}
              </div>
              <div>
                {renderInputField('lastName', 'Last Name', 'text', <User size={20} className="text-gray-400" />, 'Doe')}
              </div>
            </div>
          )}

          {/* Email Field */}
          {renderInputField('email', 'Email', 'email', <Mail size={20} className="text-gray-400" />, 'your@email.com')}

          {/* Password Field */}
          {renderInputField('password', 'Password', 'password', <Lock size={20} className="text-gray-400" />, '••••••••')}
          
          {/* Password Strength Indicator */}
          {renderPasswordStrength()}

          {/* Confirm Password Field */}
          {activeTab === 'register' && (
            <div className="mt-4">
              {renderInputField('confirmPassword', 'Confirm Password', 'password', <Lock size={20} className="text-gray-400" />, '••••••••')}
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader size={20} className="animate-spin" />
                {activeTab === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                {activeTab === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Guest Login */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isSubmitting || isLoading}
          className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Coffee size={20} />
          Continue as Guest
        </button>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <Shield size={16} />
            <span className="font-medium">Enterprise Security</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Your data is protected with AES-256 encryption and advanced security monitoring.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          By continuing, you agree to our terms and privacy policy.
        </div>
      </div>
    </div>
  );
};

export default LoginForm;