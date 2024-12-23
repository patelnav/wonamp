import { describe, it, expect } from 'vitest'
import { parseYouTubeHtml } from './youtube'
import fs from 'fs/promises'
import path from 'path'

describe('YouTube HTML Parsing', () => {
  it('should correctly parse YouTube search results from fixture', async () => {
    // Read the actual HTML fixture
    const fixtureHtml = await fs.readFile(
      path.join(process.cwd(), 'src', 'test', 'fixtures', 'youtube-response.html'),
      'utf-8'
    )

    const result = parseYouTubeHtml(fixtureHtml)
    expect(result).not.toBeNull()

    if (result) {
      expect(result).toMatchObject({
        url: expect.stringContaining('youtube.com/watch?v='),
        title: expect.any(String),
        duration: expect.any(String)
      })

      // Log the actual values to help with debugging
      console.log('Parsed result:', JSON.stringify(result, null, 2))
    }
  })
}) 