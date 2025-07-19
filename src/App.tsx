import React from 'react';
import { SecurityProvider } from '@/security/SecurityProvider';
import FitnessCoach from '@/components/FitnessCoach'; // ✅ Fixed: Capital F and C

import './index.css';

function App(): React.ReactElement {
  return (
    <SecurityProvider>
      <div className="App">
        <FitnessCoach />
      </div>
    </SecurityProvider>
  );
}

export default App;