/* eslint-disable */
// @ts-nocheck
import { HttpsProxyAgent } from 'https-proxy-agent'
import { ExtendedRequestInit, proxySchema } from './types'

const PROXY_API_URL = 'https://proxylist.geonode.com/api/proxy-list?limit=100&page=1&sort_by=lastChecked&sort_type=desc&protocols=http%2Chttps'

export class ProxyManager {
  private proxyList = []
  private maxRetries = 3

  async getProxies() {
    try {
      console.log('[Proxy] Fetching proxy list from API')
      const response = await fetch(PROXY_API_URL)
      const data = await response.json()
      const validatedData = proxySchema.parse(data)

      const proxies = validatedData.data
        .filter(proxy => proxy.protocols.length > 0)
        .map(proxy => `${proxy.protocols[0].toLowerCase()}://${proxy.ip}:${proxy.port}`)

      console.log(`[Proxy] Found ${proxies.length} valid proxies`)
      return proxies
    } catch (error) {
      console.error('[Proxy] Failed to fetch proxies:', error)
      return []
    }
  }

  async refreshProxyList() {
    console.log('[Proxy] Refreshing proxy list')
    this.proxyList = await this.getProxies()
    console.log(`[Proxy] Proxy list refreshed, ${this.proxyList.length} proxies available`)
  }

  getRandomProxy() {
    if (this.proxyList.length === 0) {
      console.log('[Proxy] No proxies available')
      return null
    }
    const index = Math.floor(Math.random() * this.proxyList.length)
    const proxy = this.proxyList[index]
    this.proxyList.splice(index, 1) // Remove used proxy
    console.log(`[Proxy] Using proxy: ${proxy}, ${this.proxyList.length} proxies remaining`)
    return proxy
  }

  async makeRequest(url) {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    // Try direct request first
    console.log('[Proxy] Attempting direct request')
    try {
      const response = await fetch(url, { headers })
      if (response.ok) {
        console.log('[Proxy] Direct request successful')
        return response
      }
    } catch (error) {
      console.error('[Proxy] Direct request failed:', error)
    }

    // If direct request fails, try with proxies
    console.log('[Proxy] Direct request failed, trying with proxies')
    if (this.proxyList.length === 0) {
      await this.refreshProxyList()
    }

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      const proxy = this.getRandomProxy()
      if (!proxy) {
        console.log('[Proxy] No proxies available for retry')
        break
      }

      console.log(`[Proxy] Attempt ${attempt + 1}/${this.maxRetries} using proxy`)
      try {
        const proxyUrl = new URL(proxy)
        const proxyAgent = new HttpsProxyAgent(proxyUrl)
        const init = {
          headers,
          agent: proxyAgent
        }
        const response = await fetch(url, init)
        if (response.ok) {
          console.log(`[Proxy] Proxy request successful on attempt ${attempt + 1}`)
          return response
        }
      } catch (error) {
        console.error(`[Proxy] Proxy request failed (attempt ${attempt + 1}/${this.maxRetries}):`, error)
        continue
      }
    }

    console.log('[Proxy] All proxy attempts failed')
    return null
  }
} 