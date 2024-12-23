"use client"

import { useState } from "react"
import { useStore } from "@/lib/store/useStore"
import { useWonampActions } from "@/lib/store/useWonampActions"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

export function InputModes() {
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [textInput, setTextInput] = useState("")
  const { processText } = useWonampActions()
  const isProcessing = useStore((state) => state.isProcessing)

  const handleTextSubmit = async () => {
    await processText(textInput)
    setShowTextDialog(false)
    setTextInput("")
  }

  return (
    <div className="flex items-center justify-center pointer-events-none">
      <div className="flex gap-4 pointer-events-auto">
        <button
          onClick={() => setShowTextDialog(true)}
          disabled={isProcessing}
          className="h-16 px-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                   border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                   flex items-center justify-center text-[#1D1D29] font-bold
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Text
        </button>
        <button
          onClick={() => alert("Coming soon!")}
          disabled={isProcessing}
          className="h-16 px-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                   border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                   flex items-center justify-center text-[#1D1D29] font-bold
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Image
        </button>
        <button
          onClick={() => alert("Coming soon!")}
          disabled={isProcessing}
          className="h-16 px-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                   border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                   flex items-center justify-center text-[#1D1D29] font-bold
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Voice
        </button>
      </div>

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
    </div>
  )
} 