"use client"

import { useStore } from "@/lib/store/useStore"
import { Visualization } from "@/components/player/visualization"
import { TrackInfo } from "@/components/player/track-info"
import { TrackControls } from "@/components/player/track-controls"
import { InputModes } from "@/components/input-modes"
import { YouTubePlayer } from "@/components/player/youtube-player"

export function Player() {
  const currentVideoId = useStore((state) => state.currentVideoId)

  return (
    <div className="w-full h-full bg-wonamp-bg flex flex-col">
      {/* Fun section - fills remaining space */}
      <div className="flex-1 p-4 min-h-0">
        {currentVideoId ? (
          <div className="w-full h-full bg-black border border-wonamp-border p-1">
            <YouTubePlayer videoId={currentVideoId} />
          </div>
        ) : (
          <div className="flex flex-row gap-4 h-full">
            {/* Left section */}
            <div className="flex flex-col space-y-2 flex-1 min-h-0">
              <div className="bg-black border border-wonamp-border p-1 relative min-h-0 h-full">
                <Visualization />
                <div className="absolute top-1 right-1">
                  <TrackInfo />
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex flex-col space-y-2 flex-1 min-h-0">
              <div className="bg-black border border-wonamp-border p-2 text-wonamp-text-green font-mono">
                <span className="opacity-70">4.</span> Track 3 <span className="opacity-70">(5:04)</span>
              </div>
              <TrackControls />
              <div className="flex-grow bg-black border border-wonamp-border min-h-0"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input section - fixed height */}
      <div className="flex-none p-4">
        <InputModes />
      </div>
    </div>
  )
}

