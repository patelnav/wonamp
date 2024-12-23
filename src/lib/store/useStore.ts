import { create } from 'zustand'
import { Song, InputMode } from '@/types/song'

interface WonampState {
  // Current playlist state
  songs: Song[]
  currentMode: InputMode
  isProcessing: boolean
  error: string | null

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
}

export const useStore = create<WonampState>((set) => ({
  // Initial state
  songs: [],
  currentMode: 'text',
  isProcessing: false,
  error: null,
  uploadedImage: null,
  textInput: '',

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
    textInput: ''
  })
})) 