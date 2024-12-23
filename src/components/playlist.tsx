"use client"

import { useStore } from "@/lib/store/useStore"
import { PlaylistHeader } from "@/components/playlist/playlist-header"
import { SongList } from "@/components/playlist/song-list"
import { PlaylistControls } from "@/components/playlist/playlist-controls"

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
    <div className="w-full h-full bg-wonamp-bg flex flex-col">
      <PlaylistHeader />
      <SongList songs={songs} onSongClick={handleSongClick} />
      {/* <div className="flex-1 flex flex-col m-4">
        <div className="flex-1 flex flex-col bg-black border border-wonamp-border min-h-0">
        </div>
      </div> */}
      <PlaylistControls
        songCount={songs.length}
        onQuickPlaylist={handleQuickPlaylist}
        hasSongs={songs.length > 0}
      />
    </div>
  )
}

