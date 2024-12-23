import { z } from 'zod'
import { getCachedYouTubeResult, setCachedYouTubeResult } from './redis'
import { HttpsProxyAgent } from 'https-proxy-agent'

const PROXY_API_URL = 'https://proxylist.geonode.com/api/proxy-list?limit=100&page=1&sort_by=lastChecked&sort_type=desc&protocols=http%2Chttps'

interface YouTubeResult {
  url: string
  title: string
  duration: string
}

// Validate proxy data
const proxySchema = z.object({
  data: z.array(z.object({
    protocols: z.array(z.string()),
    ip: z.string(),
    port: z.string()
  }))
})

interface ExtendedRequestInit extends RequestInit {
  agent?: HttpsProxyAgent<'https'>
  headers?: Record<string, string>
}

class ProxyManager {
  private proxyList: string[] = []
  private maxRetries: number = 3

  async getProxies(): Promise<string[]> {
    try {
      const response = await fetch(PROXY_API_URL)
      const data = await response.json()
      const validatedData = proxySchema.parse(data)

      return validatedData.data
        .filter(proxy => proxy.protocols.length > 0)
        .map(proxy => `${proxy.protocols[0].toLowerCase()}://${proxy.ip}:${proxy.port}`)
    } catch (error) {
      console.error('Failed to fetch proxies:', error)
      return []
    }
  }

  async refreshProxyList(): Promise<void> {
    this.proxyList = await this.getProxies()
  }

  getRandomProxy(): string | null {
    if (this.proxyList.length === 0) return null
    const index = Math.floor(Math.random() * this.proxyList.length)
    const proxy = this.proxyList[index]
    this.proxyList.splice(index, 1) // Remove used proxy
    return proxy
  }

  async makeRequest(url: string): Promise<Response | null> {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    // Try direct request first
    try {
      const response = await fetch(url, { headers })
      if (response.ok) return response
    } catch (error) {
      console.error('Direct request failed:', error)
    }

    // If direct request fails, try with proxies
    if (this.proxyList.length === 0) {
      await this.refreshProxyList()
    }

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      const proxy = this.getRandomProxy()
      if (!proxy) break

      try {
        const proxyUrl = new URL(proxy)
        const proxyAgent = new HttpsProxyAgent<'https'>(proxyUrl)
        const init: ExtendedRequestInit = {
          headers,
          agent: proxyAgent
        }
        const response = await fetch(url, init)
        if (response.ok) return response
      } catch (error) {
        console.error(`Proxy request failed (attempt ${attempt + 1}/${this.maxRetries}):`, error)
        continue
      }
    }

    return null
  }
}

export async function searchYouTube(query: string): Promise<YouTubeResult | null> {
  // Check cache first
  const cachedResult = await getCachedYouTubeResult(query)
  if (cachedResult) {
    try {
      return JSON.parse(cachedResult)
    } catch {
      // If cached result is invalid, proceed with new search
    }
  }

  const proxyManager = new ProxyManager()
  const encodedQuery = encodeURIComponent(query)
  const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`

  try {
    const response = await proxyManager.makeRequest(searchUrl)
    if (!response) return null

    const html = await response.text()

    // Extract video ID
    const videoIdMatch = html.match(/watch\?v=(\S{11})/)
    if (!videoIdMatch?.[1]) return null

    // Extract title and duration from the HTML
    const titleMatch = html.match(/"title":{"runs":\[{"text":"([^"]+)"}]}/)?.[1] || 'Unknown Title'
    const durationMatch = html.match(/"lengthText":{"simpleText":"([^"]+)"}/) || html.match(/"lengthText":{"accessibility":{"accessibilityData":{"label":"([^"]+)"}}/)
    const duration = durationMatch?.[1] || '0:00'

    const result: YouTubeResult = {
      url: `https://www.youtube.com/watch?v=${videoIdMatch[1]}`,
      title: titleMatch,
      duration: duration
    }

    // Cache the result
    await setCachedYouTubeResult(query, JSON.stringify(result))
    return result
  } catch (error) {
    console.error('Error searching YouTube:', error)
  }

  return null
}
