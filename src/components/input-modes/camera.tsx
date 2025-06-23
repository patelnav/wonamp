"use client"

import { useRef, useState, useEffect } from "react"
import { useStore } from "@/lib/store/useStore"
import { Loader2 } from "lucide-react"

interface CameraProps {
  onCapture: (file: File) => void
  onClose: () => void
}

const buttonClasses = `
  px-4 h-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
  border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
  text-[#1D1D29] font-bold
  disabled:opacity-50 disabled:cursor-not-allowed
  flex items-center justify-center
`

export function Camera({ onCapture, onClose }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [_stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const isProcessing = useStore((state) => state.isProcessing)

  useEffect(() => {
    let activeStream: MediaStream | null = null
    async function getCameraStream() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera API is not supported in this browser.")
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        activeStream = stream
        setStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setError(
          "Could not access camera. Please grant permission in your browser settings."
        )
      }
    }

    getCameraStream()

    return () => {
      activeStream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const handleCanPlay = () => {
    setIsCameraReady(true)
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "capture.png", {
                type: "image/png",
              })
              onCapture(file)
            }
          },
          "image/png",
          0.9
        )
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onCanPlay={handleCanPlay}
          className={`w-full h-full object-cover ${
            !isCameraReady || error ? "hidden" : ""
          }`}
        />
        {!isCameraReady && !error && (
          <div className="text-wonamp-text-green">Starting camera...</div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onClose} disabled={isProcessing} className={buttonClasses}>
          Cancel
        </button>
        <button
          onClick={handleCapture}
          disabled={!isCameraReady || !!error || isProcessing}
          className={buttonClasses}
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Capture"
          )}
        </button>
      </div>
    </div>
  )
} 