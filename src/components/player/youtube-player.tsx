"use client"

interface YouTubePlayerProps {
  videoId: string | null
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  if (!videoId) return null

  return (
    <div className="w-full h-full bg-black">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
} 