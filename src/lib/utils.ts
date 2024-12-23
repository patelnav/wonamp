import { createHash } from 'crypto'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
