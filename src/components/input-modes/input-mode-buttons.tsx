"use client"

import { useStore } from "@/lib/store/useStore"

interface InputModeButtonsProps {
  onTextClick: () => void
  onImageClick: () => void
  onCameraClick: () => void
}

const buttonClasses = `
  h-12 md:h-8 
  px-8 md:px-4 
  bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
  border border-[#1D1D29] 
  active:from-[#3B3B4F] active:to-[#777790]
  flex items-center justify-center 
  text-[#1D1D29] font-bold
  disabled:opacity-50 disabled:cursor-not-allowed
`

export function InputModeButtons({ onTextClick, onImageClick, onCameraClick }: InputModeButtonsProps) {
  const isProcessing = useStore((state) => state.isProcessing)

  return (
    <div className="flex gap-2">
      <button
        onClick={onTextClick}
        disabled={isProcessing}
        className={buttonClasses}
      >
        Text
      </button>
      <button
        onClick={onImageClick}
        disabled={isProcessing}
        className={buttonClasses}
        data-demo="upload-button"
      >
        Image
      </button>
      <button
        onClick={onCameraClick}
        disabled={isProcessing}
        className={buttonClasses}
      >
        Camera
      </button>
    </div>
  )
} 