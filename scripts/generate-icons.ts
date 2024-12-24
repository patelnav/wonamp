import { createCanvas, loadImage } from 'canvas'
import { writeFileSync } from 'fs'
import { join } from 'path'
import pngToIco from 'png-to-ico'

function drawIcon(size: number): Buffer {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Clear the canvas to create a transparent background
  ctx.clearRect(0, 0, size, size)

  // Draw rotated white square with shadow
  ctx.save()
  ctx.translate(size / 2, size / 2)
  ctx.rotate(Math.PI / 4)
  // Make square 65% of canvas (up from 50%, but not too big)
  const squareSize = size * 0.65

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

  // Make W 55% of canvas width and 40% height (up from 40%/30%)
  const wWidth = size * 0.55
  const wHeight = size * 0.4

  function drawW(offsetX: number, offsetY: number, width: number, height: number) {
    ctx.beginPath()
    ctx.moveTo(-width / 2 + offsetX, -height / 2 + offsetY)
    ctx.lineTo(-width / 4 + offsetX, height / 2 + offsetY)
    ctx.lineTo(0 + offsetX, -height / 4 + offsetY)
    ctx.lineTo(width / 4 + offsetX, height / 2 + offsetY)
    ctx.lineTo(width / 2 + offsetX, -height / 2 + offsetY)
    ctx.closePath()
    ctx.fill()
  }

  // Draw multiple shadow layers
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  const shadowOffsets = [
    { x: size * 0.02, y: size * 0.02 },
    { x: size * 0.015, y: size * 0.015 },
    { x: size * 0.01, y: size * 0.01 }
  ]

  shadowOffsets.forEach(offset => {
    drawW(offset.x, offset.y, wWidth, wHeight)
  })

  // Draw darker outline
  ctx.fillStyle = '#CC7700'
  drawW(size * 0.005, size * 0.005, wWidth, wHeight)

  // Draw main orange W
  ctx.fillStyle = '#FF9900'
  drawW(0, 0, wWidth, wHeight)

  // Add highlight effect
  ctx.fillStyle = '#FFBB33'
  drawW(-size * 0.005, -size * 0.005, wWidth * 0.9, wHeight * 0.9)

  ctx.restore()

  return canvas.toBuffer('image/png')
}

async function generateSplash(): Promise<Buffer> {
  // Create a 2048x2048 canvas for the splash screen (iOS recommended size)
  const canvas = createCanvas(2048, 2048)
  const ctx = canvas.getContext('2d')

  // Fill background with app's dark theme color
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 2048, 2048)

  // Create a temporary file for the icon
  const iconBuffer = drawIcon(512)
  const img = await loadImage(iconBuffer)

  // Center the icon
  ctx.drawImage(img, (2048 - 512) / 2, (2048 - 512) / 2, 512, 512)

  // Add loading text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 64px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('WONAMP', 1024, 1400)

  return canvas.toBuffer('image/png')
}

async function generateFavicon(): Promise<Buffer> {
  // Create multiple sizes for the favicon (16x16, 32x32, 48x48, 64x64, 128x128)
  const sizes = [16, 32, 48, 64, 128]
  const buffers = sizes.map(size => drawIcon(size))
  return await pngToIco(buffers)
}

// Generate all assets
async function main() {
  // Generate PWA icons
  const sizes = [192, 512]
  sizes.forEach(size => {
    const buffer = drawIcon(size)
    const outputPath = join(process.cwd(), 'public', `icon-${size}.png`)
    writeFileSync(outputPath, buffer)
    console.log(`Generated icon-${size}.png`)
  })

  // Generate favicon.ico with multiple sizes
  const faviconBuffer = await generateFavicon()
  writeFileSync(join(process.cwd(), 'public', 'favicon.ico'), faviconBuffer)
  console.log('Generated favicon.ico')

  // Generate splash screen
  const splashBuffer = await generateSplash()
  writeFileSync(join(process.cwd(), 'public', 'splash.png'), splashBuffer)
  console.log('Generated splash.png')
}

main().catch(console.error) 