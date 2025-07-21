// =====================================================================================
// 🎤 VOICE ENGINE HOOK - UPDATED FOR BATTLE-TESTED INTEGRATION
// =====================================================================================
// Updated to work with the new VoiceStatusProvider system

import React, { useCallback, useEffect } from 'react';
import { useVoiceStatus } from '../voice/VoiceEngine';

export function useVoiceEngine({ onResult, enabled }: { onResult: (text: string) => void, enabled: boolean }) {
  const voiceStatus = useVoiceStatus();

  // Set up result handler
  const handleTranscript = useCallback((transcript: string) => {
    if (transcript && enabled) {
      onResult(transcript);
    }
  }, [onResult, enabled]);

  // Update transcript handling when transcript changes
  useEffect(() => {
    if (voiceStatus?.transcript && enabled) {
      handleTranscript(voiceStatus.transcript);
    }
  }, [voiceStatus?.transcript, enabled, handleTranscript]);

  return {
    isListening: voiceStatus?.isListening || false,
    isSupported: voiceStatus?.isSupported || false,
    transcript: voiceStatus?.transcript || '',
    confidence: voiceStatus?.confidence || 0,
    startListening: voiceStatus?.startListening || (() => {}),
    stopListening: voiceStatus?.stopListening || (() => {}),
    error: voiceStatus?.error || null
  };
} 