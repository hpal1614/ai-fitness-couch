import React from 'react';
import { SecurityProvider } from './security/SecurityProvider.jsx';
import FitnessCoach from './components/FitnessCoach.jsx';
import './index.css';

function App() {
  return (
    <SecurityProvider>
      <div className="App">
        <FitnessCoach />
      </div>
    </SecurityProvider>
  );
}

export default App;