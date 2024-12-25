import { createHash } from 'crypto'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Song } from '@/types/song'
import hash from 'object-hash'

/**
 * Generates a hash for an image file
 * @param imageData The image file or blob to hash
 * @returns A 12-character hash
 */
export async function generateImageHash(imageData: Blob | File): Promise<string> {
  try {
    // Create a hash based on file content and metadata
    const buffer = await imageData.arrayBuffer();
    const fileInfo = {
      content: Array.from(new Uint8Array(buffer)),
      size: imageData.size,
      type: imageData.type,
      name: 'name' in imageData ? imageData.name : undefined
    };

    return hash(fileInfo).slice(0, 12);
  } catch (error) {
    console.error('Error generating hash:', error);
    // Fallback to a simple hash of size and timestamp
    return hash({ size: imageData.size, time: Date.now() }).slice(0, 12);
  }
}

/**
 * Generates a unique, URL-friendly ID for a song based on artist and title
 * @param artist The artist name
 * @param songTitle The song title
 * @returns A URL-friendly ID string
 */
export function generateSongID(artist: string, songTitle: string): string {
  const slug = `${artist}-${songTitle}`
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens

  // Generate a short hash
  const hash = createHash('sha1')
    .update(slug)
    .digest('hex')
    .substring(0, 6)

  // Combine slug with hash
  return `${slug}-${hash}`
}

/**
 * Validates if a string is a reasonable song title or artist name
 * @param text The text to validate
 * @returns boolean indicating if the text is valid
 */
export function isValidSongText(text: string): boolean {
  // Remove common music notation and special characters
  const cleanText = text
    .replace(/[\(\[\{].*?[\)\]\}]/g, '') // Remove text in brackets
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .trim()

  // Check if remaining text is reasonable
  return cleanText.length >= 2 && cleanText.length <= 100
}

/**
 * Merge multiple class names with Tailwind CSS support
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a deterministic playlist ID based on the content of the songs
 * Same songs will always generate the same ID
 */
export function generatePlaylistID(songs: Song[]): string {
  // Sort songs to ensure same content generates same hash regardless of order
  const sortedSongs = [...songs].sort((a, b) =>
    `${a.artist}-${a.songTitle}`.localeCompare(`${b.artist}-${b.songTitle}`)
  )

  // Create a string representation of the playlist
  const playlistString = sortedSongs
    .map(song => `${song.artist}-${song.songTitle}`)
    .join('|')

  // Generate a hash of the playlist content
  const hash = createHash('sha256')
    .update(playlistString)
    .digest('base64url')
    .substring(0, 12) // Use first 12 chars for a reasonable length

  return hash
}
