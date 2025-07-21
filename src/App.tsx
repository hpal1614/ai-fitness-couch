import React, { useState } from 'react';
import { VoiceStatusProvider } from './voice/VoiceEngine';
import FitnessCoach from './components/FitnessCouch';
import { Mic, MessageCircle, Settings, User } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<'voice' | 'chat'>('chat');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <VoiceStatusProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Interaction Mode</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="chat"
                        checked={mode === 'chat'}
                        onChange={(e) => setMode(e.target.value as 'voice' | 'chat')}
                        className="mr-2"
                      />
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Text Chat
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="voice"
                        checked={mode === 'voice'}
                        onChange={(e) => setMode(e.target.value as 'voice' | 'chat')}
                        className="mr-2"
                      />
                      <Mic className="w-4 h-4 mr-2" />
                      Voice First
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main App */}
        <div className="h-screen flex flex-col">
          {/* Top Navigation */}
          <div className="flex justify-between items-center p-4 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VF</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">VoiceFit</h1>
                <p className="text-xs text-gray-500">AI Fitness Coach</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mode indicator */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                mode === 'voice' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {mode === 'voice' ? '🎤 Voice' : '💬 Chat'}
              </div>

              {/* Settings button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <FitnessCoach />
          </div>
        </div>
      </div>
    </VoiceStatusProvider>
  );
}

export default App;