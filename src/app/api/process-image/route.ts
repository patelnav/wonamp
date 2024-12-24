import { NextResponse } from 'next/server'
import { GenerationConfig, GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { searchYouTube } from '@/lib/youtube'
import { generateSongID, generatePlaylistID } from '@/lib/utils'
import { Song } from '@/types/song'
import { z } from 'zod'
import { kv } from '@vercel/kv'

const MAX_SONG_COUNT = 30
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

// Input validation schema
const requestSchema = z.object({
  image: z.instanceof(Blob).refine(
    (blob) => blob.size <= MAX_IMAGE_SIZE,
    `Image must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
  )
})

// Initialize Gemini with configuration
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: "Extract a list of songs from this image. Format each song as \"Artist - Song Title\". \n    If you can't determine the artist, just return the song title. Return only the list of songs, one per line.\n    If you're not confident about a song name, skip it",
})

const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: SchemaType.OBJECT,
    properties: {
      response: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING
        }
      }
    }
  },
}

async function extractSongsFromImage(imageData: Blob): Promise<string[]> {
  try {
    // Convert blob to base64
    const buffer = Buffer.from(await imageData.arrayBuffer())
    const base64Image = buffer.toString('base64')

    // Create chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    })

    // Send the image to Gemini
    const result = await chatSession.sendMessage([
      "Extract songs from this image and return them as a JSON array of strings",
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      }
    ])

    // Parse the JSON response
    const jsonResponse = JSON.parse(result.response.text())
    return Array.isArray(jsonResponse.response) ? jsonResponse.response.slice(0, MAX_SONG_COUNT) : []

  } catch (error) {
    console.error('[Process Image] Error extracting songs:', error)
    throw new Error('Failed to extract songs from image')
  }
}

export async function POST(request: Request): Promise<NextResponse<{ error: string } | { songs: Song[], playlistId: string }>> {
  console.log('[Process Image] Starting new image processing request')
  try {
    // Get the form data
    const formData = await request.formData()
    const imageFile = formData.get('image') as Blob | null

    if (!imageFile) {
      throw new Error('No image provided')
    }

    // Validate the image
    requestSchema.parse({ image: imageFile })
    console.log(`[Process Image] Received image of size: ${imageFile.size} bytes`)

    // Extract songs from image using Gemini
    const songLines = await extractSongsFromImage(imageFile)
    console.log(`[Process Image] Extracted ${songLines.length} songs from image`)

    // Process songs in parallel with rate limiting
    console.log('[Process Image] Starting parallel song processing')
    const results = await Promise.all(
      songLines.map(async (line: string, index: number) => {
        try {
          console.log(`[Process Image] Processing line ${index + 1}/${songLines.length}: "${line}"`)
          const youtubeResult = await searchYouTube(line)

          // Split line into artist and title if possible
          const [artist = '', songTitle = line] = line.split('-').map((s: string) => s.trim())
          console.log(`[Process Image] Line ${index + 1} parsed - Artist: "${artist}", Title: "${songTitle}"`)

          const song: Song = {
            id: generateSongID(artist, songTitle),
            artist: artist || 'Unknown Artist',
            songTitle: songTitle,
            youtubeLink: youtubeResult?.url || null,
            youtubeTitle: youtubeResult?.title,
            duration: youtubeResult?.duration
          }

          console.log(`[Process Image] Line ${index + 1} processed successfully${youtubeResult ? ' with' : ' without'} YouTube match`)
          return song
        } catch (error) {
          console.error(`[Process Image] Error processing line "${line}":`, error)
          return null
        }
      })
    )

    // Filter out failed results
    const validResults = results.filter((result): result is Song => result !== null)
    console.log(`[Process Image] Processing completed. ${validResults.length}/${results.length} songs processed successfully`)

    // Generate and store playlist
    const playlistId = generatePlaylistID(validResults)
    await kv.set(`playlist:${playlistId}`, validResults)

    return NextResponse.json({
      songs: validResults,
      playlistId
    })
  } catch (error) {
    console.error('[Process Image] Error processing request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 400 }
    )
  }
} 