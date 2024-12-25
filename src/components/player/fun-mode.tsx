"use client"

import { Visualization } from "./visualization"
import { TrackInfo } from "./track-info"
import { TrackControls } from "./track-controls"

export function FunMode() {
  return (
    <div className="flex flex-row gap-4 h-full">
      {/* Left section */}
      <div className="flex flex-col space-y-2 flex-1 min-h-0">
        <div className="bg-black border border-wonamp-border p-1 relative min-h-0 h-full">
          <Visualization />
          {/* Track info needs ~20px height */}
          <div className="absolute top-1 right-1 min-h-[100px] [&>*]:h-[20px]">
            <TrackInfo />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex flex-col space-y-2 flex-1 min-h-0">
        {/* Track title: text-xs (12px) + p-2 top/bottom (16px) + border (2px) = 30px */}
        <div className="min-h-[30px] [&>*]:h-[30px]">
          <div className="bg-black border border-wonamp-border p-2 text-wonamp-text-green font-mono text-xs leading-none">
            <div className="inline-flex overflow-hidden whitespace-nowrap mx-2 w-[200px]">
              <div className="animate-marquee inline-block pr-4">
                Turn any songs into a YouTube playlist • Just paste a list or upload a photo • Get instant YouTube playlists • That&apos;s it! •
              </div>
              <div className="animate-marquee inline-block pr-4" aria-hidden={true}>
                Turn any songs into a YouTube playlist • Just paste a list or upload a photo • Get instant YouTube playlists • That&apos;s it! •
              </div>
            </div>
          </div>
        </div>
        <TrackControls />
        <div className="flex-grow bg-black border border-wonamp-border min-h-0" />
      </div>
    </div>
  )
} 