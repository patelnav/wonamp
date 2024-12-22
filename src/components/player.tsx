"use client"

import { WinampSlider } from "./winamp-slider"
import { Visualization } from "./visualization"
import { Play, Pause, SkipBack, SkipForward, Square, Shuffle, Repeat } from 'lucide-react'

export function Player() {
  return (
    <div className="w-full bg-[#3B3B4F]">
      {/* Top border with double gold lines */}
      <div className="h-[4px] flex flex-col gap-[2px] px-1 bg-[#3B3B4F]">
        <div className="h-[1px] bg-[#8B7355]" />
        <div className="h-[1px] bg-[#8B7355]" />
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left section */}
        <div className="space-y-2">
          <div className="bg-black border border-[#282833] p-1">
            <Visualization />
            <div className="flex justify-between items-center mt-2 text-[#00FF00] font-mono text-sm">
              <div className="text-xl tabular-nums">00:04</div>
              <div className="flex items-center gap-2">
                <span className="bg-black px-1 border border-[#282833]">192 kbps</span>
                <span className="bg-black px-1 border border-[#282833]">44 khz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="space-y-2">
          <div className="bg-black border border-[#282833] p-2 text-[#00FF00] font-mono">
            <span className="opacity-70">4.</span> Track 3 <span className="opacity-70">(5:04)</span>
          </div>
          <div className="flex items-center gap-2 bg-[#282833] p-2 border border-[#1D1D29]">
            <div className="flex-1">
              <WinampSlider
                defaultValue={[75]}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="text-[#00FF00] font-mono text-sm px-2 bg-black border border-[#282833]">
              stereo
            </div>
          </div>
        </div>
      </div>

      {/* Transport controls with matching aesthetic */}
      <div className="px-4 pb-4">
        <div className="bg-[#282833] border border-[#1D1D29] p-2 flex justify-between items-center">
          <div className="flex gap-1">
            {['prev', 'play', 'pause', 'stop', 'next'].map((button) => (
              <button
                key={button}
                className="h-[18px] w-[18px] bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                         border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                         flex items-center justify-center"
              >
                {button === 'prev' && <SkipBack className="h-3 w-3 text-[#1D1D29]" />}
                {button === 'play' && <Play className="h-3 w-3 text-[#1D1D29]" />}
                {button === 'pause' && <Pause className="h-3 w-3 text-[#1D1D29]" />}
                {button === 'stop' && <Square className="h-3 w-3 text-[#1D1D29]" />}
                {button === 'next' && <SkipForward className="h-3 w-3 text-[#1D1D29]" />}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <button className="h-[18px] px-2 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                           border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                           flex items-center justify-center">
              <Shuffle className="h-3 w-3 text-[#1D1D29]" />
            </button>
            <button className="h-[18px] px-2 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                           border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                           flex items-center justify-center">
              <Repeat className="h-3 w-3 text-[#1D1D29]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

