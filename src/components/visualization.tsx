"use client"

import { useEffect, useRef } from "react"

export function Visualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set up the visualization
    const draw = () => {
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#1A1A1A"
      const gridSize = 10
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.strokeRect(x, y, gridSize, gridSize)
        }
      }

      // Simulate waveform
      ctx.strokeStyle = "#00FF00"
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.05 + Date.now() * 0.005) * 20
        ctx.lineTo(x, y)
      }
      ctx.stroke()

      requestAnimationFrame(draw)
    }

    draw()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={60}
      className="w-full bg-black"
    />
  )
}

