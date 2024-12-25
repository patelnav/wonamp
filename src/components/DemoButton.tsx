'use client';

import { useEffect, useState } from 'react';
import { useDemo } from '@/hooks/useDemo';
import { DemoCursor } from './DemoCursor';

export function DemoButton() {
  const [isVisible, setIsVisible] = useState(true);
  const { isRunning, targetElement, isClicking, isDragging, startDemo } = useDemo();

  // Hide button when URL has a playlist hash
  useEffect(() => {
    const hasPlaylist = window.location.hash.length > 0;
    setIsVisible(!hasPlaylist);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <button
        onClick={startDemo}
        disabled={isRunning}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Try Demo
      </button>

      <DemoCursor
        isVisible={isRunning}
        targetElement={targetElement}
        isClicking={isClicking}
        isDragging={isDragging}
      />
    </>
  );
} 