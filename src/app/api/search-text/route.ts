import { NextResponse } from 'next/server'
import { searchYouTube } from '@/lib/youtube'
import { generateSongID, generatePlaylistID } from '@/lib/utils'
import { Song } from '@/types/song'
import { z } from 'zod'
import { kv } from '@vercel/kv'

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

export async function POST(request: Request): Promise<NextResponse<{ error: string } | { songs: Song[], playlistId: string }>> {
  console.log('[Search Text] Starting new search request')
  try {
    // Parse and validate request body
    const body = await request.json()
    const { text } = requestSchema.parse(body)
    console.log(`[Search Text] Received text of length: ${text.length} characters`)

    // Split text into lines and filter empty lines
    const songLines = text
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .slice(0, MAX_SONG_COUNT) // Limit number of songs

    console.log(`[Search Text] Found ${songLines.length} non-empty lines`)

    // Validate each line
    const validSongLines = songLines
      .map((line: string) => {
        try {
          return songLineSchema.parse(line)
        } catch {
          console.log(`[Search Text] Invalid song line: "${line}"`)
          return null
        }
      })
      .filter((line): line is string => line !== null)

    console.log(`[Search Text] ${validSongLines.length} lines passed validation`)

    // Process songs in parallel with rate limiting
    console.log('[Search Text] Starting parallel song processing')
    const results = await Promise.all(
      validSongLines.map(async (line: string, index: number) => {
        try {
          console.log(`[Search Text] Processing line ${index + 1}/${validSongLines.length}: "${line}"`)
          const youtubeResult = await searchYouTube(line)

          // Split line into artist and title if possible
          const [artist = '', songTitle = line] = line.split('-').map((s: string) => s.trim())
          console.log(`[Search Text] Line ${index + 1} parsed - Artist: "${artist}", Title: "${songTitle}"`)

          const song: Song = {
            id: generateSongID(artist, songTitle),
            artist: artist || 'Unknown Artist',
            songTitle: songTitle,
            youtubeLink: youtubeResult?.url || null,
            youtubeTitle: youtubeResult?.title,
            duration: youtubeResult?.duration
          }

          console.log(`[Search Text] Line ${index + 1} processed successfully${youtubeResult ? ' with' : ' without'} YouTube match`)
          return song
        } catch (error) {
          console.error(`[Search Text] Error processing line "${line}":`, error)
          return null
        }
      })
    )

    // Filter out failed results
    const validResults = results.filter((result): result is Song => result !== null)
    console.log(`[Search Text] Search completed. ${validResults.length}/${results.length} songs processed successfully`)

    // Generate and store playlist
    const playlistId = generatePlaylistID(validResults)
    await kv.set(`playlist:${playlistId}`, validResults)

    return NextResponse.json({
      songs: validResults,
      playlistId
    })
  } catch (error) {
    console.error('[Search Text] Error processing request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 400 }
    )
  }
} 