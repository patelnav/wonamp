"use client"

import { Minimize2, X } from 'lucide-react'

export function TitleBar() {
  return (
    <div className="relative h-[20px] w-full bg-[#3B3B4F] select-none">
      {/* Container for the entire title bar */}
      <div className="relative h-full w-full flex items-center justify-between px-1">
        {/* Left corner icon */}
        <div className="h-[9px] w-[9px] relative">
          <div className="absolute inset-0 bg-[#8B7355]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%, 0 0)' }} />
        </div>

        {/* Left gold bars */}
        <div className="flex-1 mx-1 flex flex-col gap-[2px]">
          <div className="h-[1px] bg-[#8B7355]" />
          <div className="h-[1px] bg-[#8B7355]" />
        </div>

        {/* WONAMP text */}
        <div className="px-2 font-bold text-xs tracking-wider text-[#8B8B9F]">
          WONAMP
        </div>

        {/* Right gold bars */}
        <div className="flex-1 mx-1 flex flex-col gap-[2px]">
          <div className="h-[1px] bg-[#8B7355]" />
          <div className="h-[1px] bg-[#8B7355]" />
        </div>

        {/* Window controls */}
        <div className="flex gap-[2px]">
          {/* Minimize button */}
          <button className="relative group h-[9px] w-[9px] bg-[#3B3B4F] border border-[#282833]">
            <div className="absolute inset-[1px] bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                          group-active:from-[#3B3B4F] group-active:to-[#777790]">
              <Minimize2 className="h-[5px] w-[5px] text-[#1D1D29]" />
            </div>
          </button>

          {/* Close button */}
          <button className="relative group h-[9px] w-[9px] bg-[#3B3B4F] border border-[#282833]">
            <div className="absolute inset-[1px] bg-gradient-to-b from-[#777790] to-[#3B3B4F]
                          group-active:from-[#3B3B4F] group-active:to-[#777790]">
              <X className="h-[5px] w-[5px] text-[#1D1D29]" />
            </div>
          </button>
        </div>

        {/* Right corner icon */}
        <div className="h-[9px] w-[9px] relative">
          <div className="absolute inset-0 bg-[#8B7355]"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 100% 0)' }} />
        </div>
      </div>

      {/* Bottom border effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#282833]" />
    </div>
  )
}

