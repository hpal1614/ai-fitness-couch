// =====================================================================================
// 🔧 AI DEBUG COMPONENT - Temporary diagnostic tool
// =====================================================================================
// File: src/components/AIDebugger.tsx
// Add this file to your project temporarily

import React, { useState, useEffect } from 'react';

// Try to import your AI service - adjust path if needed
let aiService: any = null;
try {
  // Adjust this import path to match your actual AI service location
  import('../utils/aiService').then((module) => {
    aiService = new module.AIService();
    console.log('✅ AI Service imported successfully');
  }).catch((error) => {
    console.error('❌ Failed to import AI service:', error);
  });
} catch (error) {
  console.error('❌ AI Service import error:', error);
}

const AIDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string>('Initializing debug...');
  const [testMessage, setTestMessage] = useState('How do I do a proper squat?');
  const [testResponse, setTestResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = () => {
    let info = '🔍 AI SERVICE DIAGNOSTICS\n\n';
    
    // Test 1: Check environment
    try {
      info += '=== ENVIRONMENT CHECK ===\n';
      info += `Node ENV: ${process.env.NODE_ENV || 'undefined'}\n`;
      info += `Import Meta: ${typeof import.meta !== 'undefined' ? 'Available' : 'Not Available'}\n`;
      
      // Check API keys (with enhanced debugging)
      const getEnvVar = (key: string): string => {
        try {
          const value = (import.meta as any)?.env?.[key] || '';
          console.log(`🔍 Environment variable ${key}:`, value ? `${value.substring(0, 10)}...` : 'EMPTY');
          return value;
        } catch (error) {
          console.error(`❌ Error reading ${key}:`, error);
          return '';
        }
      };

      // Log all environment variables for debugging
      console.log('🌍 All import.meta.env:', (import.meta as any)?.env);
      
      const apiKeys = {
        openRouter: getEnvVar('VITE_OPENROUTER_API_KEY'),
        groq: getEnvVar('VITE_GROQ_API_KEY'),
        googleAI: getEnvVar('VITE_GOOGLE_AI_API_KEY'),
      };
      
      info += '\nAPI KEYS STATUS:\n';
      Object.entries(apiKeys).forEach(([provider, key]) => {
        const status = key && key.length > 10 ? '✅ Set' : '❌ Missing';
        const preview = key ? `(${key.substring(0, 10)}...)` : '(empty)';
        info += `${provider}: ${status} ${preview}\n`;
      });
      
    } catch (error) {
      info += `❌ Environment check failed: ${error}\n`;
    }

    // Test 2: AI Service status
    try {
      info += '\n=== AI SERVICE STATUS ===\n';
      if (aiService) {
        info += '✅ AI Service instance created\n';
        if (typeof aiService.processMessage === 'function') {
          info += '✅ processMessage method available\n';
        } else {
          info += '❌ processMessage method missing\n';
        }
        
        // Check for analytics method
        if (typeof aiService.getAnalytics === 'function') {
          const analytics = aiService.getAnalytics();
          info += `Analytics: ${JSON.stringify(analytics, null, 2)}\n`;
        }
      } else {
        info += '❌ AI Service not initialized\n';
      }
    } catch (error) {
      info += `❌ AI Service check failed: ${error}\n`;
    }

    // Test 3: Local Knowledge
    try {
      info += '\n=== LOCAL KNOWLEDGE TEST ===\n';
      // Simulate what local knowledge should return
      const mockLocalResponse = {
        content: "A proper squat involves standing with feet shoulder-width apart, lowering your body by bending at the knees and hips, keeping your chest up and core engaged. Lower until your thighs are parallel to the ground, then push through your heels to return to standing.",
        source: 'local_knowledge',
        confidence: 0.9
      };
      info += `Mock local response: ${JSON.stringify(mockLocalResponse, null, 2)}\n`;
    } catch (error) {
      info += `❌ Local knowledge test failed: ${error}\n`;
    }

    setDebugInfo(info);
  };

  const testAIService = async () => {
    if (!testMessage.trim()) return;
    
    setIsLoading(true);
    setTestResponse('Testing...');
    
    try {
      if (aiService && typeof aiService.processMessage === 'function') {
        console.log('🧪 Testing AI service with message:', testMessage);
        const response = await aiService.processMessage(testMessage, 'debug_user');
        setTestResponse(JSON.stringify(response, null, 2));
        console.log('✅ AI Response:', response);
      } else {
        setTestResponse('❌ AI Service not available or processMessage method missing');
      }
    } catch (error) {
      const errorMsg = `❌ Test failed: ${error}`;
      setTestResponse(errorMsg);
      console.error('AI Test Error:', error);
    }
    
    setIsLoading(false);
  };

  const testLocalKnowledge = () => {
    // Test if local knowledge is working
    const testCases = [
      'How do I do a proper squat?',
      'Create a beginner workout',
      'What should I eat before workout?',
      'I need motivation'
    ];
    
    console.log('🧪 Testing local knowledge responses...');
    testCases.forEach(question => {
      console.log(`Question: ${question}`);
      // This would test your local knowledge system
    });
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      width: '400px', 
      maxHeight: '80vh',
      backgroundColor: '#f0f0f0', 
      border: '2px solid #333', 
      borderRadius: '8px',
      padding: '15px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      overflow: 'auto'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>🔧 AI Debug Panel</h3>
      
      {/* Diagnostic Info */}
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={runDiagnostics}
          style={{ 
            padding: '5px 10px', 
            marginBottom: '10px',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh Diagnostics
        </button>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '10px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {debugInfo}
        </pre>
      </div>

      {/* AI Test */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0' }}>🧪 Test AI Service</h4>
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '5px', 
            marginBottom: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          placeholder="Enter test message"
        />
        <button 
          onClick={testAIService}
          disabled={isLoading}
          style={{ 
            padding: '5px 10px',
            backgroundColor: isLoading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginRight: '5px'
          }}
        >
          {isLoading ? '⏳ Testing...' : '🚀 Test AI'}
        </button>
        <button 
          onClick={testLocalKnowledge}
          style={{ 
            padding: '5px 10px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📚 Test Local
        </button>
        
        {testResponse && (
          <pre style={{ 
            marginTop: '10px',
            whiteSpace: 'pre-wrap', 
            backgroundColor: '#fff', 
            padding: '10px', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '10px',
            maxHeight: '150px',
            overflow: 'auto'
          }}>
            {testResponse}
          </pre>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h4 style={{ margin: '0 0 5px 0' }}>⚡ Quick Actions</h4>
        <button 
          onClick={() => console.log('Window object:', window)}
          style={{ 
            padding: '3px 8px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            marginRight: '5px',
            marginBottom: '3px'
          }}
        >
          Log Window
        </button>
        <button 
          onClick={() => {
            console.log('🔍 DETAILED ENV DEBUG:');
            console.log('import.meta:', import.meta);
            console.log('import.meta.env:', (import.meta as any)?.env);
            console.log('All env keys:', Object.keys((import.meta as any)?.env || {}));
            console.log('VITE_OPENROUTER_API_KEY:', (import.meta as any)?.env?.VITE_OPENROUTER_API_KEY);
            console.log('VITE_GROQ_API_KEY:', (import.meta as any)?.env?.VITE_GROQ_API_KEY);
            console.log('VITE_GOOGLE_AI_API_KEY:', (import.meta as any)?.env?.VITE_GOOGLE_AI_API_KEY);
          }}
          style={{ 
            padding: '3px 8px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            marginRight: '5px',
            marginBottom: '3px'
          }}
        >
          Log Import Meta
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '3px 8px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          🔄 Reload Page
        </button>
      </div>
    </div>
  );
};

export default AIDebugger;