"use client"

import { Visualization } from "@/components/player/visualization"
import { TrackInfo } from "@/components/player/track-info"
import { TrackControls } from "@/components/player/track-controls"
import { TransportControls } from "@/components/player/transport-controls"
import { InputModes } from "@/components/input-modes"

export function Player() {
  return (
    <div className="w-full h-full bg-wonamp-bg flex flex-col">
      {/* Fun section - fills remaining space */}
      <div className="flex-1 p-4 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Left section */}
        <div className="flex flex-col space-y-2 flex-1 min-h-0">
          <div className="bg-black border border-wonamp-border p-1 flex flex-col relative min-h-0">
            <div className="flex-1 min-h-0">
              <Visualization />
            </div>
            <div className="flex-none">
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

      {/* Controls section - fixed height */}
      <div className="flex-none p-4">
        <TransportControls />
      </div>

      {/* Input section - fixed height */}
      <div className="flex-none p-4">
        <InputModes />
      </div>
    </div>


  )
}

