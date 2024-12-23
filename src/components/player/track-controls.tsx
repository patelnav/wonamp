"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface DigitalDisplayProps {
  value: string
  unit: string
  className?: string
}

function DigitalDisplay({ value, unit, className }: DigitalDisplayProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="bg-black border border-[#282833] px-1">
        <span className="font-mono text-[#00FF00]">{value}</span>
      </div>
      <span className="text-white font-mono text-sm">{unit}</span>
    </div>
  )
}

interface SliderProps {
  value: number
  onChange: (value: number) => void
  color?: "red" | "green"
}

function MetallicSlider({ value, onChange, color = "red" }: SliderProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    onChange(Math.round(percentage))
  }

  return (
    <div
      className="relative h-[10px] bg-[#282833] border border-[#1D1D29] cursor-pointer"
      onClick={handleClick}
    >
      {/* Track */}
      <div
        className={cn(
          "absolute h-full",
          color === "red" ? "bg-red-600" : "bg-[#00FF00]"
        )}
        style={{ width: `${value}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-[20px] h-[16px]"
        style={{ left: `calc(${value}% - 10px)` }}
      >
        <div className="w-full h-full bg-gradient-to-b from-[#CCCCCC] to-[#888888] border border-[#1D1D29]">
          <div className="h-full w-[2px] mx-auto bg-[#1D1D29]" />
        </div>
      </div>
    </div>
  )
}

interface ControlButtonProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

function ControlButton({ children, active, onClick }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 h-[18px]",
        "bg-gradient-to-b from-[#777790] to-[#3B3B4F]",
        "border border-[#1D1D29]",
        "font-mono text-xs",
        "flex items-center gap-1",
        active ? "text-[#00FF00]" : "text-[#8B8B9F]"
      )}
    >
      {active && <span className="w-[3px] h-[3px] bg-[#00FF00]" />}
      {children}
    </button>
  )
}

export function TrackControls() {
  const [volume, setVolume] = useState(75)
  const [balance, setBalance] = useState(50)
  const [isEqActive, setIsEqActive] = useState(false)
  const [isPlActive, setIsPlActive] = useState(true)

  return (
    <div className="flex flex-col gap-2 p-2 bg-[#282833] border border-[#1D1D29]">
      {/* Top row with digital displays */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DigitalDisplay value="192" unit="kbps" />
          <DigitalDisplay value="44" unit="kHz" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-[#8B8B9F]">mono</span>
          <span className="font-mono text-sm text-[#00FF00]">stereo</span>
        </div>
      </div>

      {/* Bottom row with sliders and controls */}
      <div className="flex items-center gap-4">
        {/* Volume slider */}
        <div className="flex-1">
          <MetallicSlider
            value={volume}
            onChange={setVolume}
            color="red"
          />
        </div>

        {/* Balance slider */}
        <div className="flex-1">
          <MetallicSlider
            value={balance}
            onChange={setBalance}
            color="green"
          />
        </div>

        {/* Control buttons */}
        <ControlButton
          active={isEqActive}
          onClick={() => setIsEqActive(!isEqActive)}
        >
          EQ
        </ControlButton>
        <ControlButton
          active={isPlActive}
          onClick={() => setIsPlActive(!isPlActive)}
        >
          PL
        </ControlButton>
      </div>
    </div>
  )
}

