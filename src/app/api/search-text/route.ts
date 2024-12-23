import { NextResponse } from 'next/server'
import { searchYouTube } from '@/lib/youtube'
import { generateSongID } from '@/lib/utils'
import { Song } from '@/types/song'
import { z } from 'zod'

const MAX_SONG_LENGTH = 300
const MAX_SONG_COUNT = 30

// Input validation schema
const requestSchema = z.object({
  text: z.string().min(1).max(MAX_SONG_COUNT * MAX_SONG_LENGTH)
})

// Song validation schema
const songLineSchema = z.string()
  .min(1)
  .max(MAX_SONG_LENGTH)
  .refine((line: string) => {
    // Basic validation for song format
    return line.length <= MAX_SONG_LENGTH && line.trim().length > 0
  }, {
    message: "Invalid song format"
  })

export async function POST(request: Request): Promise<NextResponse<{ error: string } | Song[]>> {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { text } = requestSchema.parse(body)

    // Split text into lines and filter empty lines
    const songLines = text
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .slice(0, MAX_SONG_COUNT) // Limit number of songs

    // Validate each line
    const validSongLines = songLines
      .map((line: string) => {
        try {
          return songLineSchema.parse(line)
        } catch {
          return null
        }
      })
      .filter((line): line is string => line !== null)

    // Process songs in parallel with rate limiting
    const results = await Promise.all(
      validSongLines.map(async (line: string) => {
        try {
          const youtubeResult = await searchYouTube(line)
          // Split line into artist and title if possible
          const [artist = '', songTitle = line] = line.split('-').map((s: string) => s.trim())

          const song: Song = {
            id: generateSongID(artist, songTitle),
            artist: artist || 'Unknown Artist',
            songTitle: songTitle,
            youtubeLink: youtubeResult?.url || null,
            youtubeTitle: youtubeResult?.title,
            duration: youtubeResult?.duration
          }
          return song
        } catch (error) {
          console.error(`Error processing line "${line}":`, error)
          return null
        }
      })
    )

    // Filter out failed results
    const validResults = results.filter((result): result is Song => result !== null)

    return NextResponse.json(validResults)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 400 }
    )
  }
} 