/* eslint-disable */
// @ts-nocheck
import { put } from '@vercel/blob'
import { getCachedYouTubeResult, setCachedYouTubeResult } from '../redis'
import type { YouTubeResult } from './types'
import { ProxyManager } from './proxy'
import { parseYouTubeHtml } from './parser'

// Configuration
const BLOB_STORE_URL = process.env.BLOB_STORE_URL || 'https://public.blob.vercel-storage.com'
const ENABLE_BLOB_CACHE = process.env.ENABLE_BLOB_CACHE === 'true' // Disabled by default, enable with ENABLE_BLOB_CACHE=true

export async function searchYouTube(query: string, skipResultCache = false): Promise<YouTubeResult | null> {
  console.log(`[YouTube Search] Starting search for: "${query}" (Blob cache: ${ENABLE_BLOB_CACHE ? 'enabled' : 'disabled'})`)

  // Check result cache first (unless skipped)
  if (!skipResultCache) {
    console.log(`[YouTube Search] Checking Redis cache for: "${query}"`)
    const cachedResult = await getCachedYouTubeResult(query)
    if (cachedResult) {
      try {
        // Handle both string and object cases
        const parsed = typeof cachedResult === 'string' ? JSON.parse(cachedResult) : cachedResult
        console.log(`[YouTube Search] Found in Redis cache: "${query}"`)
        return parsed
      } catch (error) {
        console.log(`[YouTube Search] Failed to parse Redis cache for: "${query}"`, error)
        // If cached result is invalid, proceed with new search
      }
    } else {
      console.log(`[YouTube Search] Not found in Redis cache: "${query}"`)
    }
  }

  // Check HTML cache in Blob storage if enabled
  if (ENABLE_BLOB_CACHE) {
    const blobKey = `yt_html_${query}`
    const blobUrl = `${BLOB_STORE_URL}/${blobKey}`

    try {
      console.log(`[YouTube Search] Checking Blob storage for: "${query}"`)
      const response = await fetch(blobUrl)
      if (response.ok) {
        console.log(`[YouTube Search] Found in Blob storage: "${query}"`)
        const html = await response.text()
        const result = parseYouTubeHtml(html)
        if (result) {
          console.log(`[YouTube Search] Successfully parsed HTML from Blob storage for: "${query}"`)
          // Store the object directly, let Redis handle serialization
          await setCachedYouTubeResult(query, result)
          console.log(`[YouTube Search] Cached result in Redis for: "${query}"`)
          return result
        } else {
          console.log(`[YouTube Search] Failed to parse HTML from Blob storage for: "${query}"`)
        }
      } else {
        console.log(`[YouTube Search] Not found in Blob storage: "${query}"`)
      }
    } catch (error) {
      console.error(`[YouTube Search] Error reading from Blob storage for: "${query}"`, error)
    }
  } else {
    console.log(`[YouTube Search] Blob storage check skipped: caching disabled`)
  }

  // If no cache, fetch from YouTube
  console.log(`[YouTube Search] Fetching fresh from YouTube: "${query}"`)
  const proxyManager = new ProxyManager()
  const encodedQuery = encodeURIComponent(query)
  const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`

  try {
    const response = await proxyManager.makeRequest(searchUrl)
    if (!response) {
      console.log(`[YouTube Search] Failed to get response from YouTube for: "${query}"`)
      return null
    }

    console.log(`[YouTube Search] Got response from YouTube for: "${query}"`)
    const html = await response.text()

    // Cache the HTML in Blob storage if enabled
    if (ENABLE_BLOB_CACHE) {
      try {
        const blobKey = `yt_html_${query}`
        console.log(`[YouTube Search] Caching HTML in Blob storage for: "${query}"`)
        await put(blobKey, html, {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'text/html',
          cacheControlMaxAge: 60 * 60 * 24 * 7 // Cache for 7 days
        })
        console.log(`[YouTube Search] Successfully cached HTML in Blob storage for: "${query}"`)
      } catch (error) {
        console.error(`[YouTube Search] Error saving to Blob storage for: "${query}"`, error)
      }
    } else {
      console.log(`[YouTube Search] Blob storage caching skipped: caching disabled`)
    }

    const result = parseYouTubeHtml(html)
    if (result) {
      console.log(`[YouTube Search] Successfully parsed YouTube response for: "${query}"`)
      // Store the object directly, let Redis handle serialization
      await setCachedYouTubeResult(query, result)
      console.log(`[YouTube Search] Cached result in Redis for: "${query}"`)
      return result
    } else {
      console.log(`[YouTube Search] Failed to parse YouTube response for: "${query}"`)
    }
  } catch (error) {
    console.error(`[YouTube Search] Error searching YouTube for: "${query}"`, error)
  }

  console.log(`[YouTube Search] Search failed for: "${query}"`)
  return null
}

// Re-export types and functions that should be available to consumers
export type { YouTubeResult } from './types'
export { parseYouTubeHtml } from './parser'
