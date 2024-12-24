"use client"

import { useStore } from "@/lib/store/useStore"
import { FunMode } from "@/components/player/fun-mode"
import { InputModes } from "@/components/input-modes"
import { YouTubePlayer } from "@/components/player/youtube-player"

export function Player() {
  const currentVideoId = useStore((state) => state.currentVideoId)

  return (
    <div className="w-full h-full bg-wonamp-bg flex flex-col">
      {/* Main section - fills remaining space but leaves room for input modes */}
      <div className="flex-1 p-4 pb-2 min-h-0 overflow-hidden">
        {currentVideoId ? (
          <div className="w-full h-full bg-black border border-wonamp-border p-1">
            <YouTubePlayer videoId={currentVideoId} />
          </div>
        ) : (
          <FunMode />
        )}
      </div>

      {/* Input section - fixed height with enough room for buttons */}
      <div className="flex-none h-[60px] px-4">
        <InputModes />
      </div>
    </div>
  )
}

