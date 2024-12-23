import { kv } from '@vercel/kv'

// Cache duration in seconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60

export async function getCachedYouTubeResult(query: string): Promise<string | null> {
  return kv.get<string>(`yt:${query}`)
}

export async function setCachedYouTubeResult(query: string, result: string): Promise<void> {
  await kv.set(`yt:${query}`, result, { ex: CACHE_DURATION })
} 