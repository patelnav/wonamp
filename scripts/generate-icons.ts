import sharp from 'sharp'
import fs from 'fs'
import path from 'path'


// Create an SVG icon with the given size
function createSvgIcon(size: number) {
  const squareSize = size * 0.65 // Make square 65% of canvas
  const wWidth = size * 0.55 // W width is 55% of canvas
  const wHeight = size * 0.4 // W height is 40% of canvas
  const shadowBlur = size * 0.05
  const shadowOffset = size * 0.02

  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="squareShadow">
          <feDropShadow dx="${shadowOffset}" dy="${shadowOffset}" stdDeviation="${shadowBlur}" flood-opacity="0.5"/>
        </filter>
        <filter id="wShadow">
          <feDropShadow dx="${shadowOffset}" dy="${shadowOffset}" stdDeviation="${shadowBlur}" flood-opacity="0.5"/>
        </filter>
      </defs>

      <!-- Rotated white square with shadow -->
      <g transform="translate(${size / 2}, ${size / 2}) rotate(45)">
        <rect 
          x="${-squareSize / 2}"
          y="${-squareSize / 2}"
          width="${squareSize}"
          height="${squareSize}"
          fill="white"
          stroke="#333333"
          stroke-width="${size * 0.01}"
          filter="url(#squareShadow)"
        />
      </g>

      <!-- Orange W with shadow -->
      <g transform="translate(${size / 2}, ${size / 2}) rotate(-45)">
        <!-- Shadow layers -->
        <path 
          d="M ${-wWidth / 2} ${-wHeight / 2}
             L ${-wWidth / 4} ${wHeight / 2}
             L 0 ${-wHeight / 4}
             L ${wWidth / 4} ${wHeight / 2}
             L ${wWidth / 2} ${-wHeight / 2}"
          fill="rgba(0, 0, 0, 0.5)"
          transform="translate(${shadowOffset}, ${shadowOffset})"
        />
        <path 
          d="M ${-wWidth / 2} ${-wHeight / 2}
             L ${-wWidth / 4} ${wHeight / 2}
             L 0 ${-wHeight / 4}
             L ${wWidth / 4} ${wHeight / 2}
             L ${wWidth / 2} ${-wHeight / 2}"
          fill="rgba(0, 0, 0, 0.5)"
          transform="translate(${shadowOffset * 0.75}, ${shadowOffset * 0.75})"
        />
        <path 
          d="M ${-wWidth / 2} ${-wHeight / 2}
             L ${-wWidth / 4} ${wHeight / 2}
             L 0 ${-wHeight / 4}
             L ${wWidth / 4} ${wHeight / 2}
             L ${wWidth / 2} ${-wHeight / 2}"
          fill="rgba(0, 0, 0, 0.5)"
          transform="translate(${shadowOffset * 0.5}, ${shadowOffset * 0.5})"
        />

        <!-- Dark orange outline -->
        <path 
          d="M ${-wWidth / 2} ${-wHeight / 2}
             L ${-wWidth / 4} ${wHeight / 2}
             L 0 ${-wHeight / 4}
             L ${wWidth / 4} ${wHeight / 2}
             L ${wWidth / 2} ${-wHeight / 2}"
          fill="#CC7700"
          transform="translate(${size * 0.005}, ${size * 0.005})"
        />

        <!-- Main orange W -->
        <path 
          d="M ${-wWidth / 2} ${-wHeight / 2}
             L ${-wWidth / 4} ${wHeight / 2}
             L 0 ${-wHeight / 4}
             L ${wWidth / 4} ${wHeight / 2}
             L ${wWidth / 2} ${-wHeight / 2}"
          fill="#FF9900"
        />

        <!-- Highlight -->
        <path 
          d="M ${-wWidth / 2} ${-wHeight / 2}
             L ${-wWidth / 4} ${wHeight / 2}
             L 0 ${-wHeight / 4}
             L ${wWidth / 4} ${wHeight / 2}
             L ${wWidth / 2} ${-wHeight / 2}"
          fill="#FFBB33"
          transform="translate(${-size * 0.005}, ${-size * 0.005}) scale(0.9)"
          transform-origin="center"
        />
      </g>
    </svg>
  `)
}

async function generateSplash(): Promise<Buffer> {
  const size = 2048
  const iconSize = 512
  const iconX = (size - iconSize) / 2
  const iconY = (size - iconSize) / 2 - 100 // Move icon up a bit to make room for text

  // Create a 2048x2048 splash screen
  const svg = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#000000"/>
      <g transform="translate(${iconX}, ${iconY})">
        ${createSvgIcon(iconSize).toString().replace(/<\\?xml.*\\?>/, '')}
      </g>
      <text
        x="${size / 2}"
        y="${iconY + iconSize + 100}"
        font-family="Arial"
        font-size="64"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
        dominant-baseline="middle"
      >WONAMP</text>
    </svg>
  `)

  return await sharp(svg).png().toBuffer()
}

async function generateFavicon(): Promise<Buffer> {
  // Create multiple sizes for the favicon
  const sizes = [16, 32, 48]
  const buffers = await Promise.all(sizes.map(async size => {
    const svg = createSvgIcon(size)
    return await sharp(svg).png().toBuffer()
  }))

  // Use the 32x32 size for favicon
  return buffers[1]
}

async function generateIcons() {
  const publicDir = path.join(process.cwd(), 'public')

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir)
  }

  // Generate PWA icons
  const sizes = [192, 512]
  await Promise.all(sizes.map(async size => {
    const svg = createSvgIcon(size)
    const buffer = await sharp(svg).png().toBuffer()
    fs.writeFileSync(path.join(publicDir, `icon-${size}.png`), buffer)
    console.log(`Generated icon-${size}.png`)
  }))

  // Generate favicon.ico
  const faviconBuffer = await generateFavicon()
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconBuffer)
  console.log('Generated favicon.ico')

  // Generate splash screen
  const splashBuffer = await generateSplash()
  fs.writeFileSync(path.join(publicDir, 'splash.png'), splashBuffer)
  console.log('Generated splash.png')
}

generateIcons().catch(console.error) 