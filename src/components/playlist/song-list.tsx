"use client"

import { Song } from "@/types/song"

interface SongListProps {
  songs: Song[]
  onSongClick: (youtubeLink: string | null) => void
}

export function SongList({ songs, onSongClick }: SongListProps) {
  return (
    <div className="flex-grow bg-black p-2 overflow-auto">
      {songs.length === 0 ? (
        <div className="h-full bg-black" />
      ) : (
        songs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => onSongClick(song.youtubeLink)}
            className="flex justify-between px-2 py-1 text-wonamp-text-green font-mono text-xs 
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
        ))
      )}
    </div>
  )
} 