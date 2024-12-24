"use client"

import { useState, useRef } from "react"
import { useStore } from "@/lib/store/useStore"
import { useWonampActions } from "@/lib/store/useWonampActions"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Upload } from "lucide-react"

export function InputModes() {
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { processText, processImage } = useWonampActions()
  const isProcessing = useStore((state) => state.isProcessing)

  const handleTextSubmit = async () => {
    await processText(textInput)
    setShowTextDialog(false)
    setTextInput("")
  }

  const handleImageSubmit = async (file: File) => {
    await processImage(file)
    setShowImageDialog(false)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleImageSubmit(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleImageSubmit(e.target.files[0])
    }
  }

  return (
    <div className="flex items-center justify-center pointer-events-none">
      <div className="flex gap-2 pointer-events-auto">
        <button
          onClick={() => setShowTextDialog(true)}
          disabled={isProcessing}
          className="h-16 md:h-8 px-8 md:px-4 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                   border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                   flex items-center justify-center text-[#1D1D29] font-bold
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Text
        </button>
        <button
          onClick={() => setShowImageDialog(true)}
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

      {/* Text Input Dialog */}
      <Dialog open={showTextDialog} onOpenChange={(open) => !isProcessing && setShowTextDialog(open)}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogTitle>Enter Songs (one per line)</DialogTitle>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isProcessing}
            className="w-full h-64 bg-black border border-wonamp-border p-2 text-wonamp-text-green font-mono mb-4 
                     focus:outline-none focus:ring-1 focus:ring-wonamp-text-green
                     disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Artist - Song Title&#10;Artist - Song Title&#10;..."
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowTextDialog(false)}
              disabled={isProcessing}
              className="px-4 h-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                       border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                       text-[#1D1D29] font-bold
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleTextSubmit}
              disabled={isProcessing || !textInput.trim()}
              className="min-w-[100px] px-4 h-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                       border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                       text-[#1D1D29] font-bold relative flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#1D1D29]" />
                  <span className="text-[#1D1D29]">Processing...</span>
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={showImageDialog} onOpenChange={(open) => !isProcessing && setShowImageDialog(open)}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogTitle>Upload Image of Song List</DialogTitle>
          <div
            className={`w-full h-64 border-2 border-dashed rounded-lg 
                     ${dragActive ? 'border-wonamp-text-green bg-black/10' : 'border-wonamp-border'} 
                     flex flex-col items-center justify-center gap-4 relative
                     ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <Upload className="w-12 h-12 text-wonamp-text-green" />
            <div className="text-center">
              <p className="text-wonamp-text-green font-bold">
                {isProcessing ? (
                  "Processing..."
                ) : (
                  "Drop your image here, or click to select"
                )}
              </p>
              <p className="text-wonamp-text-green/60 text-sm mt-2">
                Supports JPG, PNG, GIF up to 10MB
              </p>
            </div>
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="w-8 h-8 animate-spin text-wonamp-text-green" />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowImageDialog(false)}
              disabled={isProcessing}
              className="px-4 h-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                       border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                       text-[#1D1D29] font-bold
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 