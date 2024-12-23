"use client"

import { PlayerContainer } from "@/components/player/player-container"
import { Visualization } from "@/components/player/visualization"
import { TrackInfo } from "@/components/player/track-info"
import { TrackControls } from "@/components/player/track-controls"
import { TransportControls } from "@/components/player/transport-controls"
import { InputModes } from "@/components/input-modes"

export function Player() {
  return (
    <div className="h-full">
      <PlayerContainer>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* Left section */}
          <div className="space-y-2 flex flex-col">
            <div className="bg-black border border-wonamp-border p-1 flex-grow flex flex-col relative">
              <Visualization />
              <TrackInfo />
            </div>
          </div>

          {/* Right section */}
          <div className="space-y-2 flex flex-col">
            <div className="bg-black border border-wonamp-border p-2 text-wonamp-text-green font-mono">
              <span className="opacity-70">4.</span> Track 3 <span className="opacity-70">(5:04)</span>
            </div>
            <TrackControls />
            <div className="flex-grow bg-black border border-wonamp-border"></div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <TransportControls />
        </div>
        <InputModes />
      </PlayerContainer>
    </div>
  )
}

