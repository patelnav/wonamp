"use client"

import { useStore } from "@/lib/store/useStore"
import { Song } from "@/types/song"

// Header Component
function PlaylistHeader() {
  return (
    <div className="h-[20px] flex-none flex items-center justify-center relative">
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

// Song List Component
interface SongListProps {
  songs: Song[]
  onSongClick: (youtubeLink: string | null) => void
}

function SongList({ songs, onSongClick }: SongListProps) {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <table className="w-full border-collapse bg-black">
        <tbody>
          {songs.length === 0 ? (
            <tr>
              <td className="h-full bg-black" />
            </tr>
          ) : (
            songs.map((song, index) => (
              <tr
                key={song.id}
                onClick={() => onSongClick(song.youtubeLink)}
                className="hover:bg-wonamp-hover cursor-pointer border-b border-wonamp-border last:border-0"
              >
                <td className="px-2 py-1 text-wonamp-text-green font-mono text-xs whitespace-nowrap">
                  <div className="flex justify-between items-center">
                    <div className="overflow-hidden">
                      {song.youtubeTitle ? (
                        <div className="truncate">
                          <span className="opacity-70">{index + 1}.</span> {song.youtubeTitle}
                          <span className="opacity-50 ml-2">({song.artist} - {song.songTitle})</span>
                        </div>
                      ) : (
                        <div className="truncate">
                          <span className="opacity-70">{index + 1}.</span> {song.artist} - {song.songTitle}
                        </div>
                      )}
                    </div>
                    <div className="opacity-70 flex-shrink-0 ml-4">{song.duration || "0:00"}</div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// Controls Component
interface PlaylistControlsProps {
  songCount: number
  onQuickPlaylist?: () => void
  hasSongs: boolean
}

function PlaylistControls({ songCount, onQuickPlaylist, hasSongs }: PlaylistControlsProps) {
  return (
    <div className="h-[32px] flex-none flex justify-between items-center p-2 bg-wonamp-border border-t border-wonamp-border-dark">
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

// Main Playlist Component
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
    <div className="h-full flex flex-col bg-wonamp-bg">
      <PlaylistHeader />
      <div className="flex-1 min-h-0 m-2 bg-black relative">
        <SongList songs={songs} onSongClick={handleSongClick} />
      </div>
      <PlaylistControls
        songCount={songs.length}
        onQuickPlaylist={handleQuickPlaylist}
        hasSongs={songs.length > 0}
      />
    </div>
  )
}

