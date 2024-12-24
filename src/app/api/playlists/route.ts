import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { Song } from '@/types/song'
import { generatePlaylistID } from '@/lib/utils'
import { z } from 'zod'

// Validation schema for POST request
const postRequestSchema = z.object({
  songs: z.array(z.object({
    id: z.string(),
    artist: z.string(),
    songTitle: z.string(),
    youtubeLink: z.string().nullable(),
    youtubeTitle: z.string().optional(),
    duration: z.string().optional()
  }))
})

// GET /api/playlists?id=<playlist-id>
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing playlist ID' }, { status: 400 })
    }

    const playlist = await kv.get<Song[]>(`playlist:${id}`)

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    return NextResponse.json(playlist)
  } catch (error) {
    console.error('[Playlists API] Error fetching playlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch playlist' },
      { status: 500 }
    )
  }
}

// POST /api/playlists
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { songs } = postRequestSchema.parse(body)

    // Generate ID based on content
    const playlistId = generatePlaylistID(songs)

    // Check if playlist already exists
    const existing = await kv.get(`playlist:${playlistId}`)
    if (existing) {
      // Return existing ID if found (idempotent)
      return NextResponse.json({ id: playlistId })
    }

    // Store new playlist
    await kv.set(`playlist:${playlistId}`, songs)

    return NextResponse.json({ id: playlistId })
  } catch (error) {
    console.error('[Playlists API] Error storing playlist:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid playlist data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to store playlist' },
      { status: 500 }
    )
  }
} 