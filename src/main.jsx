// 🚀 AI FITNESS COACH - MAIN ENTRY POINT
// Created by Himanshu (himanshu1614)
// React 18 with StrictMode for better development experience

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Error boundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console for debugging
    console.error('AI Fitness Coach Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">🤖⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              The AI Fitness Coach encountered an error. Don't worry, this doesn't affect your data!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Restart Coach 🔄
            </button>
            <div className="mt-4 text-xs text-gray-500">
              If this persists, try refreshing your browser
            </div>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-red-600 cursor-pointer">
                  Developer Info (click to expand)
                </summary>
                <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-800 font-mono">
                  <div className="font-bold">Error:</div>
                  <div>{this.state.error && this.state.error.toString()}</div>
                  <div className="font-bold mt-2">Component Stack:</div>
                  <div className="whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

// Performance monitoring (optional)
if (typeof window !== 'undefined') {
  // Log app startup time
  window.addEventListener('load', () => {
    const loadTime = performance.now()
    console.log(`🚀 AI Fitness Coach loaded in ${Math.round(loadTime)}ms`)
  })
  
  // Service worker registration for PWA features (future)
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}