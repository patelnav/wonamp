/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useRef, useEffect } from "react"
import { useStore } from "@/lib/store/useStore"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2, Upload, X } from "lucide-react"

interface CustomWindow extends Window {
  __handleDemoFile?: () => Promise<void>;
}

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (file: File) => Promise<void>
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

async function generateHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex.slice(0, 12)
}

async function checkExistingPlaylist(hash: string) {
  const response = await fetch('/api/playlist-from-hash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash })
  })
  return response.json()
}

export function ImageUploadDialog({ open, onOpenChange, onSubmit }: ImageUploadDialogProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const isProcessing = useStore((state) => state.isProcessing)

  // Clean up preview URL when dialog closes
  useEffect(() => {
    if (!open && previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }, [open, previewUrl])

  const processFile = async (file: File) => {
    try {
      // Client-side validation
      if (file.size > MAX_IMAGE_SIZE) {
        throw new Error(`Image must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`)
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      // Create preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(URL.createObjectURL(file))

      // Generate hash and check for existing playlist
      const hash = await generateHash(file)
      const result = await checkExistingPlaylist(hash)

      if (result.exists) {
        // Use existing playlist and update URL hash
        useStore.setState({ songs: result.songs, playlistId: result.playlistId })
        window.history.replaceState(null, '', `#${result.playlistId}`)
        onOpenChange(false)
        return
      }

      // No existing playlist, proceed with full upload
      await onSubmit(file)
    } catch (error) {
      console.error('Error processing file:', error)
      alert(error instanceof Error ? error.message : 'Failed to process file')
    }
  }

  // Handle demo file selection
  const handleDemoFile = async () => {
    try {
      const response = await fetch('/californication.jpg');
      const blob = await response.blob();
      const file = new File([blob], 'californication.jpg', { type: 'image/jpeg' });
      processFile(file);
    } catch (error) {
      console.error('Error loading demo file:', error);
    }
  };

  // Expose handleDemoFile to window for demo access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as CustomWindow).__handleDemoFile = handleDemoFile;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as CustomWindow).__handleDemoFile;
      }
    };
  }, []);

  // Handle clipboard paste
  useEffect(() => {
    if (!open) return

    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault()
      const items = e.clipboardData?.items

      if (!items) return

      // Find the first image item in the clipboard
      const imageItem = Array.from(items).find(
        item => item.type.indexOf('image') !== -1
      )

      if (imageItem) {
        const file = imageItem.getAsFile()
        if (file) {
          await processFile(file)
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [open, onSubmit])

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
      await processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0])
    }
  }

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !isProcessing && onOpenChange(open)}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogTitle>Upload Image of Song List</DialogTitle>
        <DialogDescription>
          {`Upload an image containing a list of songs. We'll extract the song titles automatically.`}
        </DialogDescription>
        <div
          ref={dropZoneRef}
          data-demo="drop-zone"
          className={`w-full h-64 border-2 border-dashed rounded-lg 
                   ${dragActive ? 'border-wonamp-text-green bg-black/10' : 'border-wonamp-border'} 
                   flex flex-col items-center justify-center gap-4 relative
                   ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !isProcessing && !previewUrl && fileInputRef.current?.click()}
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
          {previewUrl ? (
            <div className="relative w-full h-full p-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearPreview()
                }}
                className="absolute top-2 right-2 z-10 p-1 bg-black/50 rounded-full 
                         hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-wonamp-text-green" />
              <div className="text-center">
                <p className="text-wonamp-text-green font-bold">
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    "Drop your image here, click to select, or paste from clipboard"
                  )}
                </p>
                <p className="text-wonamp-text-green/60 text-sm mt-2">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
            </>
          )}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="w-8 h-8 animate-spin text-wonamp-text-green" />
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="px-4 h-8 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                     border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                     text-[#1D1D29] font-bold
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (previewUrl) {
                processFile(new File([previewUrl], 'californication.jpg', { type: 'image/jpeg' }));
              }
            }}
            disabled={isProcessing || !previewUrl}
            data-demo="submit-button"
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
  )
} 