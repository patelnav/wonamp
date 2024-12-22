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
    <div className="w-full bg-[#3B3B4F] flex flex-col flex-grow">
      {/* Title bar with double gold lines */}
      <div className="relative h-[20px] flex items-center justify-center">
        <div className="absolute inset-x-1 top-[8px] flex flex-col gap-[2px]">
          <div className="h-[1px] bg-[#8B7355]" />
          <div className="h-[1px] bg-[#8B7355]" />
        </div>
        <div className="z-10 px-4 bg-[#3B3B4F] text-[#8B8B9F] text-xs font-bold">
          WONAMP PLAYLIST
        </div>
      </div>

      {/* Playlist content */}
      <div className="bg-black border border-[#282833] m-4 flex-grow flex flex-col">
        <div className="flex-grow overflow-auto">
          {SAMPLE_TRACKS.map((track) => (
            <div
              key={track.id}
              className="flex justify-between px-2 py-1 text-[#00FF00] font-mono text-sm 
                       hover:bg-[#1A1A1A] cursor-pointer border-b border-[#282833] last:border-0"
            >
              <div>
                <span className="opacity-70">{track.id}.</span> {track.artist} - {track.title}
              </div>
              <div className="opacity-70">{track.duration}</div>
            </div>
          ))}
        </div>

        {/* Playlist controls */}
        <div className="flex justify-between items-center p-2 bg-[#282833] border-t border-[#1D1D29]">
          <div className="flex gap-1">
            {['ADD', 'REM', 'SEL', 'MISC'].map((button) => (
              <button
                key={button}
                className="h-[18px] px-2 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                         border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                         text-[#8B8B9F] text-xs font-bold"
              >
                {button}
              </button>
            ))}
          </div>
          <div className="text-[#8B8B9F] font-mono text-xs">
            {SAMPLE_TRACKS.length} items
          </div>
        </div>
      </div>
    </div>
  )
}

