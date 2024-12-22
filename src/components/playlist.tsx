"use client"

interface Track {
  id: number
  artist: string
  title: string
  duration: string
}

const SAMPLE_TRACKS: Track[] = [
  { id: 100, artist: "Marz", title: "Bialaich", duration: "1:14" },
  { id: 101, artist: "Marz", title: "Slide", duration: "4:34" },
  { id: 102, artist: "Marz", title: "Third Eye", duration: "4:34" },
  { id: 103, artist: "Marz", title: "Steal My Shine", duration: "4:03" },
  { id: 104, artist: "Marz", title: "Step Aside", duration: "4:56" },
  // Add more tracks to fill the space
  ...Array.from({ length: 15 }, (_, i) => ({
    id: 105 + i,
    artist: "Artist",
    title: `Track ${i + 1}`,
    duration: "3:30"
  }))
]

export function Playlist() {
  return (
    <div className="w-full h-full bg-wonamp-bg">
      {/* Title bar with double gold lines */}
      <div className="relative h-[20px] flex items-center justify-center">
        <div className="absolute inset-x-1 top-[8px] flex flex-col gap-[2px]">
          <div className="h-[1px] bg-wonamp-gold" />
          <div className="h-[1px] bg-wonamp-gold" />
        </div>
        <div className="z-10 px-4 bg-wonamp-bg text-wonamp-text-muted text-xs font-bold">
          WONAMP PLAYLIST
        </div>
      </div>

      {/* Playlist content */}
      <div className="bg-black border border-wonamp-border m-4 h-[calc(100%-28px)] flex flex-col">
        <div className="flex-grow overflow-auto">
          {SAMPLE_TRACKS.map((track) => (
            <div
              key={track.id}
              className="flex justify-between px-2 py-1 text-wonamp-text-green font-mono text-sm 
                       hover:bg-wonamp-hover cursor-pointer border-b border-wonamp-border last:border-0"
            >
              <div>
                <span className="opacity-70">{track.id}.</span> {track.artist} - {track.title}
              </div>
              <div className="opacity-70">{track.duration}</div>
            </div>
          ))}
        </div>

        {/* Playlist controls */}
        <div className="flex justify-between items-center p-2 bg-wonamp-border border-t border-wonamp-border-dark">
          <div className="flex gap-1">
            {['ADD', 'REM', 'SEL', 'MISC'].map((button) => (
              <button
                key={button}
                className="h-[18px] px-2 bg-gradient-to-b from-wonamp-button-from to-wonamp-button-to 
                         border border-wonamp-border-dark active:from-wonamp-button-to active:to-wonamp-button-from
                         text-wonamp-text-muted text-xs font-bold"
              >
                {button}
              </button>
            ))}
          </div>
          <div className="text-wonamp-text-muted font-mono text-xs">
            {SAMPLE_TRACKS.length} items
          </div>
        </div>
      </div>
    </div>
  )
}

