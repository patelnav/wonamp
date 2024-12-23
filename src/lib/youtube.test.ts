import { describe, it, expect, beforeAll } from 'vitest'
import { searchYouTube } from './youtube'
import fs from 'fs/promises'
import path from 'path'

const FIXTURES_DIR = path.join(process.cwd(), 'src', 'test', 'fixtures')
const YOUTUBE_FIXTURE_PATH = path.join(FIXTURES_DIR, 'youtube-response.html')
const YOUTUBE_RESULT_PATH = path.join(FIXTURES_DIR, 'youtube-result.json')

async function ensureFixturesDirExists() {
  try {
    await fs.access(FIXTURES_DIR)
  } catch {
    await fs.mkdir(FIXTURES_DIR, { recursive: true })
  }
}

async function saveYouTubeResponse(query: string): Promise<string> {
  const encodedQuery = encodeURIComponent(query)
  const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`

  const response = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  })

  if (!response.ok) throw new Error('Failed to fetch YouTube response')

  const html = await response.text()
  await fs.writeFile(YOUTUBE_FIXTURE_PATH, html)
  return html
}

describe('searchYouTube', () => {
  beforeAll(async () => {
    await ensureFixturesDirExists()
  })

  it('should correctly parse YouTube search results', async () => {
    const query = 'Never Gonna Give You Up Rick Astley'

    // First make the real request and save both HTML and parsed result
    try {
      const html = await saveYouTubeResponse(query)
      console.log('Successfully saved YouTube HTML response')

      const result = await searchYouTube(query)
      expect(result).not.toBeNull()

      if (result) {
        // Save the successful result for comparison
        const testData = {
          query,
          html,
          expectedResult: result
        }
        await fs.writeFile(YOUTUBE_RESULT_PATH, JSON.stringify(testData, null, 2))

        // Verify the structure of the response
        expect(result).toMatchObject({
          url: expect.stringContaining('youtube.com/watch?v='),
          title: expect.any(String),
          duration: expect.stringMatching(/^(\d+ minutes?,? ?)?\d+ seconds?$/)
        })

        console.log('Test passed with result:', JSON.stringify(result, null, 2))
      }
    } catch (error) {
      console.error('Failed to fetch or save YouTube response:', error)
      throw error
    }
  })
}) 