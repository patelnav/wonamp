import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const ICON_SIZES = [16, 32, 48, 64, 128, 192, 512]

// Create an SVG icon with the given size
function createSvgIcon(size: number) {
  const padding = size * 0.1 // 10% padding
  const innerSize = size - (padding * 2)
  const textSize = size * 0.4
  const strokeWidth = size * 0.02

  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#3B3B4F"/>
          <stop offset="100%" style="stop-color:#1D1D29"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="${size * 0.02}" dy="${size * 0.02}" stdDeviation="${size * 0.01}" flood-opacity="0.5"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <g transform="rotate(45, ${size / 2}, ${size / 2})">
        <rect 
          x="${padding}" 
          y="${padding}" 
          width="${innerSize}" 
          height="${innerSize}" 
          fill="black"
          stroke="#DAA520"
          stroke-width="${strokeWidth}"
          filter="url(#shadow)"
        />
      </g>
      <g transform="rotate(-45, ${size / 2}, ${size / 2})">
        <text
          x="50%"
          y="50%"
          font-family="Arial"
          font-size="${textSize}"
          fill="#00FF00"
          text-anchor="middle"
          dominant-baseline="middle"
          font-weight="bold"
          filter="url(#shadow)"
        >W</text>
      </g>
    </svg>
  `)
}

async function generateIcons() {
  const publicDir = path.join(process.cwd(), 'public')

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir)
  }

  // Generate icons of different sizes
  await Promise.all(ICON_SIZES.map(async (size) => {
    const svg = createSvgIcon(size)
    const iconBuffer = await sharp(svg)
      .png()
      .toBuffer()

    if (size === 192) {
      fs.writeFileSync(path.join(publicDir, 'icon-192.png'), iconBuffer)
      console.log('Generated icon-192.png')
    } else if (size === 512) {
      fs.writeFileSync(path.join(publicDir, 'icon-512.png'), iconBuffer)
      console.log('Generated icon-512.png')
    }
  }))

  // Generate favicon.ico (using 32x32 size)
  const faviconBuffer = await sharp(createSvgIcon(32))
    .resize(32, 32)
    .png()
    .toBuffer()

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconBuffer)
  console.log('Generated favicon.ico')

  // Generate splash screen
  const splashSvg = createSvgIcon(2048)
  const splash = await sharp(splashSvg)
    .png()
    .toBuffer()

  fs.writeFileSync(path.join(publicDir, 'splash.png'), splash)
  console.log('Generated splash.png')
}

generateIcons().catch(console.error) 