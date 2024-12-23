"use client"

import { useStore } from "@/lib/store/useStore"

export function Playlist() {
  const { songs } = useStore()

  const handleSongClick = (youtubeLink: string | null) => {
    if (youtubeLink) {
      window.open(youtubeLink, '_blank')
    }
  }

  const handleQuickPlaylist = () => {
    if (songs.length === 0) return

    const videoIds = songs
      .map(song => song.youtubeLink?.split('=')[1])
      .filter((id): id is string => id !== undefined)

    if (videoIds.length > 0) {
      const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`
      window.open(playlistUrl, '_blank')
    }
  }

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
          {songs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => handleSongClick(song.youtubeLink)}
              className="flex justify-between px-2 py-1 text-wonamp-text-green font-mono text-sm 
                       hover:bg-wonamp-hover cursor-pointer border-b border-wonamp-border last:border-0"
            >
              <div>
                <span className="opacity-70">{index + 1}.</span> {song.artist} - {song.songTitle}
                {song.youtubeTitle && (
                  <span className="opacity-50 ml-2">({song.youtubeTitle})</span>
                )}
              </div>
              <div className="opacity-70">{song.duration || "0:00"}</div>
            </div>
          ))}
        </div>

        {/* Playlist controls */}
        <div className="flex justify-between items-center p-2 bg-wonamp-border border-t border-wonamp-border-dark">
          <div className="flex gap-1">
            {songs.length > 0 ? (
              <button
                onClick={handleQuickPlaylist}
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
            {songs.length} items
          </div>
        </div>
      </div>
    </div>
  )
}

