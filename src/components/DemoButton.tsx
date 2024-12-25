'use client';

import { useDemo } from '@/hooks/useDemo';
import { DemoCursor } from './DemoCursor';
import { Upload } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export function DemoButton() {
  const playlistId = useStore((state) => state.playlistId);
  const { isRunning, targetElement, isClicking, isDragging, startDemo } = useDemo();

  // Hide button when a playlist is loaded
  if (playlistId) return null;

  return (
    <>
      <tr className="hover:bg-wonamp-hover cursor-pointer">
        <td className="px-2 py-1 text-wonamp-text-green font-mono text-xs">
          <button
            onClick={startDemo}
            disabled={isRunning}
            className="w-full flex items-center justify-center gap-2 py-4 hover:text-wonamp-text-green/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            Demo uploading a cd cover
          </button>
          <DemoCursor
            isVisible={isRunning}
            targetElement={targetElement}
            isClicking={isClicking}
            isDragging={isDragging}
          />
        </td>
      </tr>
    </>
  );
} 