"use client"

export function PlaylistHeader() {
  return (
    <div className="h-[20px] flex items-center justify-center relative">
      <div className="absolute inset-x-1 top-[8px] flex flex-col gap-[2px]">
        <div className="h-[1px] bg-wonamp-gold" />
        <div className="h-[1px] bg-wonamp-gold" />
      </div>
      <div className="z-10 px-4 bg-wonamp-bg text-wonamp-text-muted text-xs font-bold">
        PLAYLIST
      </div>
    </div>
  )
} 