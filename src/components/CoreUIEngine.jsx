import React, { useState } from 'react';
import {
  Brain, Zap, Target, Activity, Clock, TrendingUp,
  CheckCircle, AlertTriangle, Settings, RefreshCw,
  Cpu, Database, Shield, Eye, Smartphone
} from 'lucide-react';

import {
  ProductionSmartPredictionEngine,
  UserPatternLearningSystem,
  RealTimePerformanceOptimizer
} from '../utils/SmartPredictionEngine.js';


const CoreUIEngine = () => {
  // Instantiate engines (in real app, these might be singletons or context)
  const [engine] = useState(() => new ProductionSmartPredictionEngine());
  const [learner] = useState(() => new UserPatternLearningSystem());
  const [optimizer] = useState(() => new RealTimePerformanceOptimizer());

  // UI state
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [userData, setUserData] = useState('');
  const [learnResult, setLearnResult] = useState(null);
  const [perfData, setPerfData] = useState('');
  const [optResult, setOptResult] = useState(null);

  // Demo handlers
  const handlePredict = () => {
    try {
      const result = engine.predict(input);
      setPrediction(result);
    } catch (e) {
      setPrediction('Prediction error: ' + e.message);
    }
  };

  const handleLearn = () => {
    try {
      const result = learner.learn(userData);
      setLearnResult(result || 'Learning complete!');
    } catch (e) {
      setLearnResult('Learning error: ' + e.message);
    }
  };

  const handleOptimize = () => {
    try {
      const result = optimizer.optimize(perfData);
      setOptResult(result || 'Optimization complete!');
    } catch (e) {
      setOptResult('Optimization error: ' + e.message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-2xl border border-gray-200 relative">
      <div className="flex items-center mb-6">
        <Brain className="w-8 h-8 text-indigo-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Smart Prediction Engine Demo</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prediction Panel */}
        <div className="bg-indigo-50 rounded-lg p-4 flex flex-col items-center shadow">
          <Zap className="w-6 h-6 text-indigo-500 mb-2" />
          <h3 className="font-semibold mb-2">Predict</h3>
          <input
            className="w-full px-2 py-1 border rounded mb-2 text-sm"
            placeholder="Enter input..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
            onClick={handlePredict}
          >
            Run Prediction
          </button>
          {prediction && (
            <div className="mt-2 text-xs text-gray-700 bg-white rounded p-2 w-full border">
              <span className="font-mono">{String(prediction)}</span>
            </div>
          )}
        </div>
        {/* Learning Panel */}
        <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center shadow">
          <Target className="w-6 h-6 text-green-500 mb-2" />
          <h3 className="font-semibold mb-2">Learn Pattern</h3>
          <input
            className="w-full px-2 py-1 border rounded mb-2 text-sm"
            placeholder="User data..."
            value={userData}
            onChange={e => setUserData(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            onClick={handleLearn}
          >
            Learn
          </button>
          {learnResult && (
            <div className="mt-2 text-xs text-gray-700 bg-white rounded p-2 w-full border">
              <span className="font-mono">{String(learnResult)}</span>
            </div>
          )}
        </div>
        {/* Optimization Panel */}
        <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center shadow">
          <TrendingUp className="w-6 h-6 text-yellow-500 mb-2" />
          <h3 className="font-semibold mb-2">Optimize</h3>
          <input
            className="w-full px-2 py-1 border rounded mb-2 text-sm"
            placeholder="Performance data..."
            value={perfData}
            onChange={e => setPerfData(e.target.value)}
          />
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
            onClick={handleOptimize}
          >
            Optimize
          </button>
          {optResult && (
            <div className="mt-2 text-xs text-gray-700 bg-white rounded p-2 w-full border">
              <span className="font-mono">{String(optResult)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 text-xs text-gray-400 text-center">
        <Cpu className="inline w-4 h-4 mr-1 align-text-bottom" />
        Modular AI Engine &bull; Demo only &bull; All logic runs client-side
      </div>
    </div>
  );
};

export default CoreUIEngine;
