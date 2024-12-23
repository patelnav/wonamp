"use client"

import { useState } from "react"
import { useWonampActions } from "@/lib/store/useWonampActions"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export function InputModes() {
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [textInput, setTextInput] = useState("")
  const { processText } = useWonampActions()

  const handleTextSubmit = async () => {
    await processText(textInput)
    setShowTextDialog(false)
    setTextInput("")
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex gap-4 pointer-events-auto">
        <button
          onClick={() => setShowTextDialog(true)}
          className="h-16 px-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                   border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                   flex items-center justify-center text-[#1D1D29] font-bold"
        >
          Text
        </button>
        <button
          onClick={() => alert("Coming soon!")}
          className="h-16 px-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                   border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                   flex items-center justify-center text-[#1D1D29] font-bold"
        >
          Image
        </button>
        <button
          onClick={() => alert("Coming soon!")}
          className="h-16 px-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                   border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                   flex items-center justify-center text-[#1D1D29] font-bold"
        >
          Voice
        </button>
      </div>

      <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogTitle>Enter Songs (one per line)</DialogTitle>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full h-64 bg-black border border-wonamp-border p-2 text-wonamp-text-green font-mono mb-4 focus:outline-none focus:ring-1 focus:ring-wonamp-text-green"
            placeholder="Artist - Song Title&#10;Artist - Song Title&#10;..."
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowTextDialog(false)}
              className="px-4 h-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                       border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                       text-[#1D1D29] font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleTextSubmit}
              className="px-4 h-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                       border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                       text-[#1D1D29] font-bold"
            >
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 