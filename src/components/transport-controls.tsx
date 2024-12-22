"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Square, Shuffle, Repeat } from 'lucide-react'

interface TransportButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

const TransportButton = forwardRef<HTMLButtonElement, TransportButtonProps>(
  ({ className, active, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base button styling
          "relative h-[22px] w-[23px] select-none",
          // Main background with gradient
          "bg-gradient-to-b from-[#777790] to-[#3B3B4F]",
          // Outer border
          "border border-[#1D1D29]",
          // Inner shadow structure
          "before:absolute before:inset-[1px]",
          "before:border before:border-[#1D1D29]",
          // Top highlight
          "after:absolute after:inset-x-0 after:top-0 after:h-[1px]",
          "after:bg-gradient-to-r after:from-transparent after:via-[#FFFFFF40] after:to-transparent",
          // Pressed state
          "active:translate-y-[1px]",
          "active:before:inset-[2px]",
          "active:after:opacity-50",
          // Active state
          active && [
            "bg-gradient-to-b from-[#3B3B4F] to-[#777790]",
            "before:inset-[2px]",
            "after:opacity-50"
          ],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TransportButton.displayName = "TransportButton"

export function TransportControls() {
  return (
    <div className="relative">
      {/* Main container with border effects */}
      <div className="relative bg-[#3B3B4F] p-4">
        {/* Top highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFFFFF30] to-transparent" />
        
        {/* Bottom shadow */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#00000040] to-transparent" />

        {/* Transport buttons container */}
        <div className="relative flex items-center gap-[1px]">
          {/* Main controls */}
          <div className="flex gap-[1px]">
            <TransportButton aria-label="Previous">
              <SkipBack className="h-3 w-3 text-[#1D1D29]" />
            </TransportButton>
            <TransportButton aria-label="Play">
              <Play className="h-3 w-3 text-[#1D1D29]" />
            </TransportButton>
            <TransportButton aria-label="Pause">
              <Pause className="h-3 w-3 text-[#1D1D29]" />
            </TransportButton>
            <TransportButton aria-label="Stop">
              <Square className="h-3 w-3 text-[#1D1D29]" />
            </TransportButton>
            <TransportButton aria-label="Next">
              <SkipForward className="h-3 w-3 text-[#1D1D29]" />
            </TransportButton>
          </div>

          {/* Spacer with inset effect */}
          <div className="mx-2 h-[22px] w-[1px] bg-[#1D1D29] shadow-[1px_0_#FFFFFF40]" />

          {/* Additional controls */}
          <div className="flex gap-[1px]">
            <TransportButton aria-label="Shuffle">
              <Shuffle className="h-3 w-3 text-[#1D1D29]" />
            </TransportButton>
            <TransportButton aria-label="Repeat">
              <Repeat className="h-3 w-3 text-[#1D1D29]" />
            </TransportButton>
          </div>

          {/* Volume slider container */}
          <div className="ml-4 flex h-[22px] items-center gap-2">
            <div className="h-1 w-[68px] rounded-sm bg-[#1D1D29]">
              <div 
                className="relative h-full w-3/4 rounded-sm bg-gradient-to-r from-[#6B6B8D] to-[#A3A3BD]"
                style={{
                  boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.2)"
                }}
              >
                {/* Slider thumb */}
                <div 
                  className="absolute right-0 top-1/2 h-[7px] w-[3px] -translate-y-1/2 translate-x-1/2
                           bg-gradient-to-b from-[#CCCCCC] to-[#666666]
                           border-x border-[#1D1D29]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

