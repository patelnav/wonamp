"use client"

import { useEffect, useRef } from "react"

export function Visualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<number[]>([])
  const targetHeightsRef = useRef<number[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const observer = new ResizeObserver(() => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    })

    observer.observe(container)

    // Initialize bars
    const NUM_BARS = 16
    barsRef.current = new Array(NUM_BARS).fill(0)
    targetHeightsRef.current = new Array(NUM_BARS).fill(0)

    // Set up the visualization
    const draw = () => {
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#1A1A1A"
      const gridSize = 4
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.strokeRect(x, y, gridSize, gridSize)
        }
      }

      // Update bar heights
      const barWidth = Math.floor(canvas.width / NUM_BARS)
      const maxBarHeight = canvas.height * 0.8

      // Randomly update target heights
      if (Math.random() < 0.1) {
        targetHeightsRef.current = targetHeightsRef.current.map(() =>
          Math.random() * maxBarHeight
        )
      }

      // Animate bars towards target heights
      barsRef.current = barsRef.current.map((height, i) => {
        const target = targetHeightsRef.current[i]
        const diff = target - height
        return height + diff * 0.1
      })

      // Draw bars
      ctx.fillStyle = "#00FF00"
      barsRef.current.forEach((height, i) => {
        const x = i * barWidth
        const barHeight = Math.max(2, height) // Minimum height of 2px
        const y = canvas.height - barHeight

        // Draw segments
        const segmentHeight = 2
        const numSegments = Math.floor(barHeight / (segmentHeight + 1))
        for (let j = 0; j < numSegments; j++) {
          const segmentY = y + j * (segmentHeight + 1)
          ctx.fillRect(x + 1, segmentY, barWidth - 2, segmentHeight)
        }
      })

      requestAnimationFrame(draw)
    }

    draw()

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  )
}

