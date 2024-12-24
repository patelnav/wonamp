"use client"

import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store/useStore'

interface YouTubePlayerProps {
  videoId: string | null
}

interface YouTubePlayer {
  playVideo(): void
  loadVideoById(videoId: string): void
  destroy(): void
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId: string
          events: {
            onReady: (event: { target: YouTubePlayer }) => void
            onStateChange: (event: { data: number }) => void
          }
        }
      ) => YouTubePlayer
    }
    onYouTubeIframeAPIReady: () => void
  }
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const playNextSong = useStore((state) => state.playNextSong)

  useEffect(() => {
    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!videoId || !containerRef.current) return

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        events: {
          onReady: (event) => {
            event.target.playVideo()
          },
          onStateChange: (event) => {
            // When video ends (state = 0), play next song
            if (event.data === 0) {
              playNextSong()
            }
          }
        }
      })
    }

    return () => {
      // Clean up player
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Update video when videoId changes
  useEffect(() => {
    if (playerRef.current && videoId) {
      playerRef.current.loadVideoById(videoId)
    }
  }, [videoId])

  if (!videoId) return null

  return (
    <div className="w-full h-full bg-black">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
} 