import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock the redis cache functions to avoid actual caching during tests
vi.mock('../lib/redis', () => ({
  getCachedYouTubeResult: vi.fn().mockResolvedValue(null),
  setCachedYouTubeResult: vi.fn().mockResolvedValue(undefined),
})) 