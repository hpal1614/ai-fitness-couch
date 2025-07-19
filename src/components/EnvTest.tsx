// =====================================================================================
// 🧪 ENVIRONMENT TEST COMPONENT
// =====================================================================================
// File: src/components/EnvTest.tsx
// Create this file temporarily to test environment variables

import React from 'react';

// TypeScript fix for import.meta.env
declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

const EnvTest: React.FC = () => {
  // Test environment variables with TypeScript casting
  const envVars = {
    VITE_TEST_VALUE: (import.meta as any).env?.VITE_TEST_VALUE,
    VITE_OPENROUTER_API_KEY: (import.meta as any).env?.VITE_OPENROUTER_API_KEY,
    VITE_GROQ_API_KEY: (import.meta as any).env?.VITE_GROQ_API_KEY,
    VITE_GOOGLE_AI_API_KEY: (import.meta as any).env?.VITE_GOOGLE_AI_API_KEY,
  };

  // Log to console as well
  React.useEffect(() => {
    console.log('🧪 Environment Variables Test:', envVars);
    console.log('🧪 import.meta.env object:', (import.meta as any).env);
    console.log('🧪 All available env keys:', Object.keys((import.meta as any).env || {}));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      border: '2px solid #333',
      borderRadius: '8px',
      padding: '20px',
      zIndex: 10000,
      fontSize: '14px',
      fontFamily: 'monospace',
      maxWidth: '80vw',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>🧪 Environment Variables Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Environment Variables:</strong>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          margin: '10px 0',
          fontSize: '12px',
          overflow: 'auto'
        }}>
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>All import.meta.env keys:</strong>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          margin: '10px 0',
          fontSize: '12px',
          overflow: 'auto'
        }}>
          {JSON.stringify(Object.keys((import.meta as any).env || {}), null, 2)}
        </pre>
      </div>

      <div>
        <strong>Status:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          {Object.entries(envVars).map(([key, value]) => (
            <li key={key} style={{ margin: '5px 0' }}>
              <span style={{ color: value ? 'green' : 'red' }}>
                {value ? '✅' : '❌'}
              </span>
              {' '}
              {key}: {value ? `"${String(value).substring(0, 20)}..."` : 'undefined'}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => {
          const element = document.querySelector('[data-env-test]') as HTMLElement;
          if (element) element.style.display = 'none';
        }}
        style={{
          padding: '10px 15px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Close Test
      </button>
    </div>
  );
};

export default EnvTest;