import { create } from 'zustand'
import { Song } from '@/types/song'

interface WonampState {
  // Processing state
  isProcessing: boolean
  setProcessing: (isProcessing: boolean) => void

  // Error state
  error: string | null
  setError: (error: string | null) => void

  // Songs state
  songs: Song[]
  setSongs: (songs: Song[]) => void

  // Input state
  uploadedImage: File | null
  setUploadedImage: (image: File | null) => void
  textInput: string
  setTextInput: (text: string) => void

  // Playlist state
  playlistId: string | null
  setPlaylistId: (id: string | null) => void
  loadPlaylist: (id: string) => Promise<void>

  // Player state
  currentVideoId: string | null
  setCurrentVideoId: (id: string | null) => void
}

export const useStore = create<WonampState>((set) => ({
  // Processing state
  isProcessing: false,
  setProcessing: (isProcessing) => set({ isProcessing }),

  // Error state
  error: null,
  setError: (error) => set({ error }),

  // Songs state
  songs: [],
  setSongs: (songs) => set({ songs }),

  // Input state
  uploadedImage: null,
  setUploadedImage: (image) => set({ uploadedImage: image }),
  textInput: '',
  setTextInput: (text) => set({ textInput: text }),

  // Playlist state
  playlistId: null,
  setPlaylistId: (id) => set({ playlistId: id }),
  loadPlaylist: async (id) => {
    try {
      set({ isProcessing: true })
      const response = await fetch(`/api/playlists?id=${id}`)
      if (!response.ok) {
        throw new Error('Failed to load playlist')
      }
      const songs = await response.json()
      set({ songs, playlistId: id })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load playlist' })
    } finally {
      set({ isProcessing: false })
    }
  },

  // Player state
  currentVideoId: null,
  setCurrentVideoId: (id) => set({ currentVideoId: id }),
})) 