// src/App.tsx
import React from 'react';
import { SecurityProvider } from './security/SecurityProvider'; // Remove .jsx extension
import FitnessCoach from './components/FitnessCoach'; // Remove .jsx extension  
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