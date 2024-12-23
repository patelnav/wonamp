/* eslint-disable */
// @ts-nocheck
import * as cheerio from 'cheerio'
import { YouTubeResult } from './types'

interface VideoData {
  contents?: {
    twoColumnSearchResultsRenderer?: {
      primaryContents?: {
        sectionListRenderer?: {
          contents?: Array<{
            itemSectionRenderer?: {
              contents?: Array<{
                videoRenderer?: {
                  videoId: string
                  title?: {
                    runs?: Array<{
                      text: string
                    }>
                  }
                  lengthText?: {
                    simpleText?: string
                    accessibility?: {
                      accessibilityData?: {
                        label: string
                      }
                    }
                  }
                }
              }>
            }
          }>
        }
      }
    }
  }
}

interface PlayerResponse {
  videoDetails?: {
    lengthSeconds?: string
  }
}

export function parseYouTubeHtml(html: string): YouTubeResult | null {
  try {
    const $ = cheerio.load(html)

    // Look for both ytInitialData and ytInitialPlayerResponse
    let videoData: VideoData | null = null
    let playerResponse: PlayerResponse | null = null

    $('script').each((_, script) => {
      const content = $(script).html() || ''

      // Try to find ytInitialData
      if (content.includes('var ytInitialData = ')) {
        try {
          // Extract the JSON between ytInitialData = {...} and the next semicolon
          const match = content.match(/var\s+ytInitialData\s*=\s*({.+?});/)
          if (match && match[1]) {
            videoData = JSON.parse(match[1])
          }
        } catch (e) {
          console.error('Failed to parse ytInitialData:', e)
        }
      }

      // Try to find ytInitialPlayerResponse
      if (content.includes('ytInitialPlayerResponse')) {
        try {
          const match = content.match(/ytInitialPlayerResponse\s*=\s*({.+?});/)
          if (match && match[1]) {
            playerResponse = JSON.parse(match[1])
          }
        } catch (e) {
          console.error('Failed to parse ytInitialPlayerResponse:', e)
        }
      }
    })

    if (!videoData) {
      console.error('No videoData found')
      return null
    }

    // Navigate through the JSON structure to find the first video result
    const contents = videoData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents
    if (!contents?.length) {
      console.error('No contents found in videoData')
      return null
    }

    // Find the first video result
    const videoResult = contents.find(item => item.videoRenderer)?.videoRenderer
    if (!videoResult) {
      console.error('No videoRenderer found')
      return null
    }

    // Get duration from multiple sources, prioritizing ytInitialPlayerResponse
    let durationSeconds: number | null = null
    let durationText = videoResult?.lengthText?.simpleText ||
      videoResult?.lengthText?.accessibility?.accessibilityData?.label ||
      '0:00'

    // First try to get exact duration from playerResponse
    if (playerResponse?.videoDetails?.lengthSeconds) {
      durationSeconds = parseInt(playerResponse.videoDetails.lengthSeconds, 10)
      if (!isNaN(durationSeconds)) {
        // Convert seconds to HH:MM:SS or MM:SS format
        if (durationSeconds >= 3600) {
          const hours = Math.floor(durationSeconds / 3600)
          const minutes = Math.floor((durationSeconds % 3600) / 60)
          const seconds = durationSeconds % 60
          durationText = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        } else {
          const minutes = Math.floor(durationSeconds / 60)
          const seconds = durationSeconds % 60
          durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`
        }
      }
    }

    // If no exact duration found, parse from the text format
    if (durationSeconds === null) {
      const timeParts = durationText.split(':').map((part: string) => parseInt(part, 10))
      if (timeParts.length === 2) { // MM:SS format
        durationSeconds = timeParts[0] * 60 + timeParts[1]
      } else if (timeParts.length === 3) { // HH:MM:SS format
        durationSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
      }
    }

    return {
      url: `https://www.youtube.com/watch?v=${videoResult.videoId}`,
      title: videoResult.title?.runs?.[0]?.text || 'Unknown Title',
      duration: durationText,
      durationSeconds
    }
  } catch (error) {
    console.error('Error parsing YouTube HTML:', error)
    return null
  }
} 