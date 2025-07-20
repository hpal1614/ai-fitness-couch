// =====================================================================================
// 🎯 COMPLETE FITNESS COACH COMPONENT WITH PROPER EXPORTS
// =====================================================================================
// File: src/components/FitnessCoach.tsx

import React, { useState } from 'react';
import { useVoiceEngine } from '../hooks/useVoiceEngine';
import { askCoachFlex } from '../utils/aiService';

interface FitnessCouchProps {
  mode: 'voice' | 'chat';
}

const FitnessCouch: React.FC<FitnessCouchProps> = ({ mode }) => {
  const [messages, setMessages] = useState<{ from: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');

  const voice = useVoiceEngine({
    enabled: mode === 'voice',
    onResult: (text) => handleUserInput(text),
  });

  function handleUserInput(text: string) {
    setMessages((msgs) => [...msgs, { from: 'user', text }]);
    setStatus('speaking');
    askCoachFlex(text).then((reply) => {
      setMessages((msgs) => [...msgs, { from: 'ai', text: reply }]);
      if (mode === 'voice') voice.speak(reply);
      setStatus('idle');
    });
  }

  function handleSend() {
    if (!input.trim()) return;
    handleUserInput(input);
    setInput('');
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <div className="mb-4 h-64 overflow-y-auto border rounded p-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}> 
            <span className={msg.from === 'user' ? 'bg-blue-100 px-2 py-1 rounded' : 'bg-green-100 px-2 py-1 rounded'}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      {mode === 'chat' && (
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
          />
          <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleSend}>Send</button>
        </div>
      )}
      {mode === 'voice' && (
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-full border ${voice.listening ? 'bg-green-200 animate-pulse' : ''}`}
            onClick={voice.startListening}
            disabled={voice.listening || voice.speaking}
          >
            {voice.listening ? 'Listening...' : '🎤 Speak'}
          </button>
          {voice.speaking && <span className="text-blue-500">Coach Flex is speaking...</span>}
        </div>
      )}
    </div>
  );
};

export default FitnessCouch;