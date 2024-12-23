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
    <div className="h-full flex flex-col bg-wonamp-bg">
      <PlaylistHeader />
      <div className="flex-grow p-2 m-2 flex flex-col">
        <SongList songs={songs} onSongClick={handleSongClick} />
        <PlaylistControls
          songCount={songs.length}
          onQuickPlaylist={handleQuickPlaylist}
          hasSongs={songs.length > 0}
        />
      </div>
    </div>
  )
}

