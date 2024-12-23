/* eslint-disable */
// @ts-nocheck
import { z } from 'zod'
import { HttpsProxyAgent } from 'https-proxy-agent'

export interface YouTubeResult {
  url: string
  title: string
  duration: string
  durationSeconds?: number | null
}

// Validate proxy data
export const proxySchema = z.object({
  data: z.array(z.object({
    protocols: z.array(z.string()),
    ip: z.string(),
    port: z.string()
  }))
})

export interface ExtendedRequestInit extends RequestInit {
  agent?: HttpsProxyAgent
  headers?: Record<string, string>
} 