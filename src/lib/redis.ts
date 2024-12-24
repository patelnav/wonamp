import { kv } from '@vercel/kv'
import { Song } from '@/types/song'
import { songArraySchema } from '@/lib/validations/song'

// Cache duration in seconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60

// Key prefixes
const YOUTUBE_PREFIX = 'yt:'
const PLAYLIST_PREFIX = 'playlist:'
const IMAGE_HASH_PREFIX = 'img:'

// YouTube cache operations
export async function getCachedYouTubeResult(query: string): Promise<string | null> {
  return kv.get<string>(`${YOUTUBE_PREFIX}${query}`)
}

export async function setCachedYouTubeResult(query: string, result: string): Promise<void> {
  await kv.set(`${YOUTUBE_PREFIX}${query}`, result, { ex: CACHE_DURATION })
}

// Image hash operations
export async function getPlaylistFromImageHash(hash: string): Promise<string | null> {
  return kv.get<string>(`${IMAGE_HASH_PREFIX}${hash}`)
}

export async function storeImageHashToPlaylist(hash: string, playlistId: string): Promise<void> {
  // Store permanently (no expiration) since playlists are permanent
  await kv.set(`${IMAGE_HASH_PREFIX}${hash}`, playlistId)
}

// Playlist operations
export async function getPlaylist(id: string): Promise<Song[] | null> {
  const playlist = await kv.get<Song[]>(`${PLAYLIST_PREFIX}${id}`)

  if (!playlist) {
    return null
  }

  // Validate playlist data
  try {
    songArraySchema.parse(playlist)
    return playlist
  } catch (error) {
    console.error('[Redis] Invalid playlist data:', error)
    return null
  }
}

export async function storePlaylist(id: string, songs: Song[]): Promise<void> {
  // Validate songs before storing
  songArraySchema.parse(songs)
  await kv.set(`${PLAYLIST_PREFIX}${id}`, songs)
}

export async function checkPlaylistExists(id: string): Promise<boolean> {
  return (await kv.exists(`${PLAYLIST_PREFIX}${id}`)) === 1
} 