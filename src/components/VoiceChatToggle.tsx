import React from 'react';

interface VoiceChatToggleProps {
  mode: 'voice' | 'chat';
  onToggle: (mode: 'voice' | 'chat') => void;
}

const VoiceChatToggle: React.FC<VoiceChatToggleProps> = ({ mode, onToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="Switch to Voice Mode"
        className={`p-2 rounded-full border ${mode === 'voice' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        onClick={() => onToggle('voice')}
        disabled={mode === 'voice'}
      >
        <span role="img" aria-label="Microphone">🎤</span>
      </button>
      <button
        aria-label="Switch to Chat Mode"
        className={`p-2 rounded-full border ${mode === 'chat' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        onClick={() => onToggle('chat')}
        disabled={mode === 'chat'}
      >
        <span role="img" aria-label="Chat Bubble">💬</span>
      </button>
    </div>
  );
};

export default VoiceChatToggle; 