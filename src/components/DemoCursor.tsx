/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Position {
  x: number;
  y: number;
}

interface DemoCursorProps {
  isVisible?: boolean;
  targetElement?: HTMLElement | null;
  isClicking?: boolean;
  isDragging?: boolean;
  onAnimationComplete?: () => void;
}

export function DemoCursor({
  isVisible = false,
  targetElement = null,
  isClicking = false,
  isDragging = false,
  onAnimationComplete,
}: DemoCursorProps) {
  const [position, setPosition] = useState<Position>(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth - 100 : 0,
    y: typeof window !== 'undefined' ? 100 : 0,
  }));

  useEffect(() => {
    if (!targetElement || !isVisible) return;

    const rect = targetElement.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    // Animate cursor position
    const startTime = performance.now();
    const startX = position.x;
    const startY = position.y;
    const duration = 1000; // 1 second animation

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth movement
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentX = startX + (targetX - startX) * easeProgress;
      const currentY = startY + (targetY - startY) * easeProgress;

      setPosition({ x: currentX, y: currentY });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onAnimationComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [targetElement, isVisible, position.x, position.y, onAnimationComplete]);

  if (!isVisible || typeof document === 'undefined') return null;

  const cursorContent = (
    <>
      {/* Dragged image preview - separate from cursor to avoid transform issues */}
      {isDragging && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: `${position.x - 5}px`,
            top: `${position.y - 5}px`,
          }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-white/20">
            <img
              src="/californication.jpg"
              alt="Dragging preview"
              className="w-32 h-24 object-cover"
            />
          </div>
        </div>
      )}

      {/* Cursor */}
      <div
        className={`fixed pointer-events-none transition-transform ${isClicking ? 'scale-90' : 'scale-100'
          }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          {/* Cursor dot */}
          <div className="w-6 h-6 bg-blue-500 rounded-full opacity-50" />
          {/* Click ripple effect */}
          {isClicking && (
            <div className="absolute inset-0 animate-ping bg-blue-500 rounded-full opacity-25" />
          )}
        </div>
      </div>
    </>
  );

  // Create a portal to ensure the cursor is always on top
  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {cursorContent}
    </div>,
    document.body
  );
} 