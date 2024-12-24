"use client"

import { useStore } from "@/lib/store/useStore"

interface InputModeButtonsProps {
  onTextClick: () => void
  onImageClick: () => void
}

export function InputModeButtons({ onTextClick, onImageClick }: InputModeButtonsProps) {
  const isProcessing = useStore((state) => state.isProcessing)

  return (
    <div className="flex gap-2">
      <button
        onClick={onTextClick}
        disabled={isProcessing}
        className="h-16 md:h-8 px-8 md:px-4 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                 border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                 flex items-center justify-center text-[#1D1D29] font-bold
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Text
      </button>
      <button
        onClick={onImageClick}
        disabled={isProcessing}
        className="h-16 md:h-8 px-8 md:px-4 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                 border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                 flex items-center justify-center text-[#1D1D29] font-bold
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Image
      </button>
      <button
        onClick={() => alert("Coming soon!")}
        disabled={isProcessing}
        className="h-16 md:h-8 px-8 md:px-4 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                 border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                 flex items-center justify-center text-[#1D1D29] font-bold
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Voice
      </button>
    </div>
  )
} 