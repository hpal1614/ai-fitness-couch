import React from 'react';
import { SecurityProvider } from '@/security/SecurityProvider';
import FitnessCoach from '@/components/FitnessCouch'; // Match the filename exactly (case-sensitive!)
import { VoiceStatusProvider } from './voice/VoiceEngine';

import './index.css';

function App(): React.ReactElement {
  return (
    <VoiceStatusProvider>
      <SecurityProvider>
        <div className="App">
          <FitnessCoach />
        </div>
      </SecurityProvider>
    </VoiceStatusProvider>
  );
}

export default App;