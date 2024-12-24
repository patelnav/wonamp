"use client"

import { useServiceWorker } from "./use-service-worker"

interface ServiceWorkerProviderProps {
  children: React.ReactNode
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  useServiceWorker()
  return <>{children}</>
} 