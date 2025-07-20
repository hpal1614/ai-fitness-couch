import React from 'react';
import { SecurityProvider } from '@/security/SecurityProvider';
import FitnessCouch from '@/components/FitnessCouch'; // ✅ Fixed: Capital F and C

import './index.css';

function App(): React.ReactElement {
  return (
    <SecurityProvider>
      <div className="App">
        <FitnessCouch />
      </div>
    </SecurityProvider>
  );
}

export default App;