"use client"

import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export const WinampLogoGenerator: React.FC = () => {
  const canvasRef192 = useRef<HTMLCanvasElement>(null)
  const canvasRef512 = useRef<HTMLCanvasElement>(null)

  const drawIcon = (canvas: HTMLCanvasElement, size: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear the canvas to create a transparent background
    ctx.clearRect(0, 0, size, size)

    // Draw rotated white square with shadow
    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.rotate(Math.PI / 4)
    const squareSize = size * 0.5

    // Draw shadow for white square
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = size * 0.05
    ctx.shadowOffsetX = size * 0.02
    ctx.shadowOffsetY = size * 0.02

    // Draw white square with dark border
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize)
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = size * 0.01
    ctx.strokeRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize)

    ctx.restore()

    // Draw "W"
    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.rotate(-Math.PI / 4) // Rotate opposite to the square

    const wWidth = size * 0.4
    const wHeight = size * 0.3

    // Draw multiple shadow layers
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    const shadowOffsets = [
      { x: size * 0.02, y: size * 0.02 },
      { x: size * 0.015, y: size * 0.015 },
      { x: size * 0.01, y: size * 0.01 }
    ]

    shadowOffsets.forEach(offset => {
      drawW(ctx, offset.x, offset.y, wWidth, wHeight)
    })

    // Draw darker outline
    ctx.fillStyle = '#CC7700'
    drawW(ctx, size * 0.005, size * 0.005, wWidth, wHeight)

    // Draw main orange W
    ctx.fillStyle = '#FF9900'
    drawW(ctx, 0, 0, wWidth, wHeight)

    // Add highlight effect
    ctx.fillStyle = '#FFBB33'
    drawW(ctx, -size * 0.005, -size * 0.005, wWidth * 0.9, wHeight * 0.9)

    ctx.restore()
  }

  const drawW = (ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, width: number, height: number) => {
    ctx.beginPath()
    ctx.moveTo(-width / 2 + offsetX, -height / 2 + offsetY)
    ctx.lineTo(-width / 4 + offsetX, height / 2 + offsetY)
    ctx.lineTo(0 + offsetX, -height / 4 + offsetY)
    ctx.lineTo(width / 4 + offsetX, height / 2 + offsetY)
    ctx.lineTo(width / 2 + offsetX, -height / 2 + offsetY)
    ctx.closePath()
    ctx.fill()
  }

  const downloadIcon = (canvas: HTMLCanvasElement, size: number) => {
    const link = document.createElement('a')
    link.download = `wonamp-icon-${size}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  useEffect(() => {
    if (canvasRef192.current) {
      drawIcon(canvasRef192.current, 192)
    }
    if (canvasRef512.current) {
      drawIcon(canvasRef512.current, 512)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center space-y-8 p-8 bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-white">Wonamp Logo Generator</h1>

      <div className="flex flex-col items-center space-y-4">
        <canvas ref={canvasRef192} width={192} height={192} className="border border-gray-600 bg-gray-300" />
        <Button
          onClick={() => canvasRef192.current && downloadIcon(canvasRef192.current, 192)}
          variant="secondary"
        >
          Download 192x192
        </Button>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <canvas ref={canvasRef512} width={512} height={512} className="border border-gray-600 bg-gray-300" />
        <Button
          onClick={() => canvasRef512.current && downloadIcon(canvasRef512.current, 512)}
          variant="secondary"
        >
          Download 512x512
        </Button>
      </div>
    </div>
  )
}

