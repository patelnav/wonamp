import { create } from 'zustand'
import { Song, InputMode } from '@/types/song'

interface WonampState {
  // Current playlist state
  songs: Song[]
  currentMode: InputMode
  isProcessing: boolean
  error: string | null
  playlistId: string | null
  isLoadingPlaylist: boolean

  // Image mode state
  uploadedImage: File | null

  // Text mode state
  textInput: string

  // Actions
  setSongs: (songs: Song[]) => void
  addSong: (song: Song) => void
  removeSong: (id: string) => void
  setMode: (mode: InputMode) => void
  setProcessing: (isProcessing: boolean) => void
  setError: (error: string | null) => void
  setUploadedImage: (file: File | null) => void
  setTextInput: (text: string) => void
  clearState: () => void
  setPlaylistId: (id: string | null) => void
  loadPlaylist: (id: string) => Promise<void>
}

export const useStore = create<WonampState>((set, get) => ({
  // Initial state
  songs: [],
  currentMode: 'text',
  isProcessing: false,
  error: null,
  uploadedImage: null,
  textInput: '',
  playlistId: null,
  isLoadingPlaylist: false,

  // Actions
  setSongs: (songs) => set({ songs }),
  addSong: (song) => set((state) => ({
    songs: [...state.songs, song],
    error: null
  })),
  removeSong: (id) => set((state) => ({
    songs: state.songs.filter((song) => song.id !== id)
  })),
  setMode: (mode) => set({
    currentMode: mode,
    error: null
  }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  setUploadedImage: (file) => set({
    uploadedImage: file,
    error: null
  }),
  setTextInput: (text) => set({
    textInput: text,
    error: null
  }),
  clearState: () => set({
    songs: [],
    isProcessing: false,
    error: null,
    uploadedImage: null,
    textInput: '',
    playlistId: null
  }),
  setPlaylistId: (id) => set({ playlistId: id }),
  loadPlaylist: async (id) => {
    const state = get()
    if (state.isLoadingPlaylist) return

    set({ isLoadingPlaylist: true, error: null })
    try {
      const response = await fetch(`/api/playlists?id=${id}`)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()

      // Validate that we received an array of songs
      if (!Array.isArray(data)) {
        throw new Error('Invalid playlist data')
      }

      // Validate each song has the required properties
      const songs = data.filter((song): song is Song => {
        return (
          typeof song === 'object' &&
          song !== null &&
          typeof song.id === 'string' &&
          typeof song.artist === 'string' &&
          typeof song.songTitle === 'string' &&
          (song.youtubeLink === null || typeof song.youtubeLink === 'string')
        )
      })

      set({
        songs,
        playlistId: id,
        isLoadingPlaylist: false,
        error: songs.length === 0 ? 'Playlist is empty' : null
      })
    } catch (error) {
      console.error('Failed to load playlist:', error)
      set({
        songs: [],
        error: error instanceof Error ? error.message : 'Failed to load playlist',
        isLoadingPlaylist: false
      })
    }
  }
})) 