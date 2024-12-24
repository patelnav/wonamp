"use client"

import { useEffect } from 'react'
import { useStore } from '@/lib/store/useStore'

export function PlaylistLoader() {
  const loadPlaylist = useStore((state) => state.loadPlaylist)

  useEffect(() => {
    // Load initial playlist from hash
    const hash = window.location.hash.slice(1)
    if (hash) {
      loadPlaylist(hash)
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1)
      if (newHash) {
        loadPlaylist(newHash)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [loadPlaylist])

  return null
} 