"use client"

import { useStore } from "@/lib/store/useStore"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Camera } from "./camera"

interface CameraDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (file: File) => Promise<void>
}

export function CameraDialog({
  open,
  onOpenChange,
  onSubmit,
}: CameraDialogProps) {
  const isProcessing = useStore((state) => state.isProcessing)

  const handleCapture = async (file: File) => {
    if (isProcessing) return
    await onSubmit(file)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !isProcessing && onOpenChange(open)}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogTitle>Capture from Camera</DialogTitle>
        <DialogDescription>
          Take a picture of a CD, cassette, or tracklist. We&apos;ll find the
          songs for you.
        </DialogDescription>
        <Camera onCapture={handleCapture} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
} 