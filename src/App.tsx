import React, { useState } from 'react';
import { SecurityProvider } from '@/security/SecurityProvider';
import FitnessCoach from '@/components/FitnessCouch'; // Match the filename exactly (case-sensitive!)
import { VoiceStatusProvider } from './voice/VoiceEngine';
import VoiceChatToggle from './components/VoiceChatToggle';

import './index.css';

function App(): React.ReactElement {
  const [mode, setMode] = useState<'voice' | 'chat'>('chat');
  return (
    <VoiceStatusProvider>
      <SecurityProvider>
        <div className="min-h-screen bg-gray-50">
          <header className="flex justify-between items-center p-4 bg-white shadow">
            <h1 className="text-2xl font-bold text-blue-600">VoiceFit</h1>
            <VoiceChatToggle mode={mode} onToggle={setMode} />
          </header>
          {/* Pass mode to children or context as needed */}
          <div className="App">
            <FitnessCoach mode={mode} />
          </div>
        </div>
      </SecurityProvider>
    </VoiceStatusProvider>
  );
}

export default App;