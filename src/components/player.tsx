"use client"

import { WonampSlider } from "@/components/wonamp-slider"
import { Visualization } from "@/components/visualization"
import { Play, Pause, SkipBack, SkipForward, Square, Shuffle, Repeat } from 'lucide-react'

export function Player() {
  return (
    <div className="w-full h-full bg-wonamp-bg">

      <div className="flex flex-col h-[calc(100%-4px)]">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          {/* Left section */}
          <div className="min-h-[120px] md:h-full space-y-2 flex flex-col">
            <div className="bg-black border border-wonamp-border p-1 flex-grow flex flex-col">
              <Visualization />
              <div className="flex justify-between items-center mt-2 text-wonamp-text-green font-mono text-sm">
                <div className="text-xl tabular-nums">00:04</div>
                <div className="flex items-center gap-2">
                  <span className="bg-black px-1 border border-wonamp-border">192 kbps</span>
                  <span className="bg-black px-1 border border-wonamp-border">44 khz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="space-y-2 flex flex-col min-h-[120px] md:h-full">
            <div className="bg-black border border-wonamp-border p-2 text-wonamp-text-green font-mono">
              <span className="opacity-70">4.</span> Track 3 <span className="opacity-70">(5:04)</span>
            </div>
            <div className="flex items-center gap-2 bg-wonamp-border p-2 border border-wonamp-border-dark">
              <div className="flex-1">
                <WonampSlider
                  defaultValue={[75]}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="text-wonamp-text-green font-mono text-sm px-2 bg-black border border-wonamp-border">
                stereo
              </div>
            </div>
            <div className="flex-grow bg-black border border-wonamp-border"></div>
          </div>
        </div>

        {/* Transport controls with matching aesthetic */}
        <div className="px-4 pb-4">
          <div className="bg-wonamp-border border border-wonamp-border-dark p-2 flex justify-between items-center">
            <div className="flex gap-1">
              {['prev', 'play', 'pause', 'stop', 'next'].map((button) => (
                <button
                  key={button}
                  className="h-[18px] w-[18px] bg-gradient-to-b from-wonamp-button-from to-wonamp-button-to 
                           border border-wonamp-border-dark active:from-wonamp-button-to active:to-wonamp-button-from
                           flex items-center justify-center"
                >
                  {button === 'prev' && <SkipBack className="h-3 w-3 text-wonamp-border-dark" />}
                  {button === 'play' && <Play className="h-3 w-3 text-wonamp-border-dark" />}
                  {button === 'pause' && <Pause className="h-3 w-3 text-wonamp-border-dark" />}
                  {button === 'stop' && <Square className="h-3 w-3 text-wonamp-border-dark" />}
                  {button === 'next' && <SkipForward className="h-3 w-3 text-wonamp-border-dark" />}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button className="h-[18px] px-2 bg-gradient-to-b from-wonamp-button-from to-wonamp-button-to 
                             border border-wonamp-border-dark active:from-wonamp-button-to active:to-wonamp-button-from
                             flex items-center justify-center">
                <Shuffle className="h-3 w-3 text-wonamp-border-dark" />
              </button>
              <button className="h-[18px] px-2 bg-gradient-to-b from-wonamp-button-from to-wonamp-button-to 
                             border border-wonamp-border-dark active:from-wonamp-button-to active:to-wonamp-button-from
                             flex items-center justify-center">
                <Repeat className="h-3 w-3 text-wonamp-border-dark" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

