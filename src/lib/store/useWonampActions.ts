import { useStore } from './useStore'

export const useWonampActions = () => {
  const {
    setProcessing,
    setError,
    setSongs,
    setUploadedImage,
    setTextInput,
  } = useStore()

  const processText = async (text: string) => {
    try {
      setProcessing(true)
      setTextInput(text)

      const response = await fetch('/api/search-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to process text')
      }

      const songs = await response.json()
      setSongs(songs)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process text')
    } finally {
      setProcessing(false)
    }
  }

  const processImage = async (file: File) => {
    try {
      setProcessing(true)
      setUploadedImage(file)

      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const songs = await response.json()
      setSongs(songs)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process image')
    } finally {
      setProcessing(false)
    }
  }

  const processVoice = () => {
    // To be implemented in Phase Two
    setError('Voice processing is not yet implemented')
  }

  return {
    processImage,
    processText,
    processVoice,
  }
} 