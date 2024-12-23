export interface Song {
  id: string
  artist: string
  songTitle: string
  youtubeLink: string | null
  youtubeTitle?: string
  duration?: string
}

export type InputMode = 'image' | 'text' | 'voice' 