import { NextResponse } from 'next/server'
import { getPlaylistFromImageHash, getPlaylist } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const { hash } = await request.json()

    if (!hash || typeof hash !== 'string') {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 400 })
    }

    // Try to find existing playlist
    const existingPlaylistId = await getPlaylistFromImageHash(hash)
    if (!existingPlaylistId) {
      return NextResponse.json({ exists: false })
    }

    // Get the playlist data
    const playlist = await getPlaylist(existingPlaylistId)
    if (!playlist) {
      return NextResponse.json({ exists: false })
    }

    return NextResponse.json({
      exists: true,
      songs: playlist,
      playlistId: existingPlaylistId
    })
  } catch (error) {
    console.error('[Playlist Lookup] Error:', error)
    return NextResponse.json(
      { error: 'Failed to lookup playlist' },
      { status: 500 }
    )
  }
} 