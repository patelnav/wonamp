"use client"

import { useState } from "react"
import { useWonampActions } from "@/lib/store/useWonampActions"
import { InputModeButtons } from "./input-mode-buttons"
import { TextInputDialog } from "./text-input-dialog"
import { ImageUploadDialog } from "./image-upload-dialog"

export function InputModes() {
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const { processText, processImage } = useWonampActions()

  const handleTextSubmit = async (text: string) => {
    await processText(text)
    setShowTextDialog(false)
  }

  const handleImageSubmit = async (file: File) => {
    await processImage(file)
    setShowImageDialog(false)
  }

  return (
    <div className="flex items-center justify-center pointer-events-none p-2">
      <div className="pointer-events-auto">
        <InputModeButtons
          onTextClick={() => setShowTextDialog(true)}
          onImageClick={() => setShowImageDialog(true)}
        />
      </div>

      <TextInputDialog
        open={showTextDialog}
        onOpenChange={setShowTextDialog}
        onSubmit={handleTextSubmit}
      />

      <ImageUploadDialog
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
        onSubmit={handleImageSubmit}
      />
    </div>
  )
} 