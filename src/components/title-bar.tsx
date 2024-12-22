"use client"

import { Minimize2, X } from 'lucide-react'

export function TitleBar() {
  return (
    <div className="relative h-[20px] w-full bg-wonamp-bg select-none">
      {/* Container for the entire title bar */}
      <div className="relative h-full w-full flex items-center justify-between px-1">
        {/* Left corner icon */}
        <div className="h-[9px] w-[9px] relative">
          <div className="absolute inset-0 bg-wonamp-gold"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%, 0 0)' }} />
        </div>

        {/* Left gold bars */}
        <div className="flex-1 mx-1 flex flex-col gap-[2px]">
          <div className="h-[1px] bg-wonamp-gold" />
          <div className="h-[1px] bg-wonamp-gold" />
        </div>

        {/* WONAMP text */}
        <div className="px-2 font-bold text-xs tracking-wider text-wonamp-text-muted">
          WONAMP
        </div>

        {/* Right gold bars */}
        <div className="flex-1 mx-1 flex flex-col gap-[2px]">
          <div className="h-[1px] bg-wonamp-gold" />
          <div className="h-[1px] bg-wonamp-gold" />
        </div>

        {/* Window controls */}
        <div className="flex gap-[2px]">
          {/* Minimize button */}
          <button className="relative group h-[9px] w-[9px] bg-wonamp-bg border border-wonamp-border">
            <div className="absolute inset-[1px] bg-gradient-to-b from-wonamp-button-from to-wonamp-button-to 
                          group-active:from-wonamp-button-to group-active:to-wonamp-button-from">
              <Minimize2 className="h-[5px] w-[5px] text-wonamp-border-dark" />
            </div>
          </button>

          {/* Close button */}
          <button className="relative group h-[9px] w-[9px] bg-wonamp-bg border border-wonamp-border">
            <div className="absolute inset-[1px] bg-gradient-to-b from-wonamp-button-from to-wonamp-button-to
                          group-active:from-wonamp-button-to group-active:to-wonamp-button-from">
              <X className="h-[5px] w-[5px] text-wonamp-border-dark" />
            </div>
          </button>
        </div>

        {/* Right corner icon */}
        <div className="h-[9px] w-[9px] relative">
          <div className="absolute inset-0 bg-wonamp-gold"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 100% 0)' }} />
        </div>
      </div>

      {/* Bottom border effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-wonamp-border" />
    </div>
  )
}

