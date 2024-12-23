"use client"

interface PlaylistControlsProps {
  songCount: number
  onQuickPlaylist?: () => void
  hasSongs: boolean
}

export function PlaylistControls({ songCount, onQuickPlaylist, hasSongs }: PlaylistControlsProps) {
  return (
    <div className="flex justify-between items-center p-2 bg-wonamp-border border-t border-wonamp-border-dark">
      <div className="flex gap-1">
        {hasSongs ? (
          <button
            onClick={onQuickPlaylist}
            className="h-[18px] px-2 bg-gradient-to-b from-wonamp-button-from to-wonamp-button-to 
                     border border-wonamp-border-dark active:from-wonamp-button-to active:to-wonamp-button-from
                     text-wonamp-text-muted text-xs font-bold"
          >
            Open Quick Playlist
          </button>
        ) : (
          ['ADD', 'REM', 'SEL', 'MISC'].map((button) => (
            <button
              key={button}
              className="h-[18px] px-2 bg-gradient-to-b from-wonamp-button-from to-wonamp-button-to 
                       border border-wonamp-border-dark active:from-wonamp-button-to active:to-wonamp-button-from
                       text-wonamp-text-muted text-xs font-bold"
            >
              {button}
            </button>
          ))
        )}
      </div>
      <div className="text-wonamp-text-muted font-mono text-xs">
        {songCount} items
      </div>
    </div>
  )
} 