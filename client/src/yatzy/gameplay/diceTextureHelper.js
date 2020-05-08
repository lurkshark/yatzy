import * as PIXI from 'pixi.js'

export default function diceTextureHelper(width, value, isActive, isHolding) {
  const face = new PIXI.Graphics()

  // Outline if holding
  if (isHolding) {
    face.lineStyle(Math.floor(width * 0.08), 0xe1a0ab)
  }

  const adjustedWidth = isHolding
    ? Math.floor(width * 0.92)
    : Math.floor(width)
  // Rounded square body
  face.beginFill(0xa4cedd, isActive ? 1 : 0.35)
    .drawRoundedRect(0, 0, adjustedWidth, adjustedWidth, Math.floor(width * 0.12))
    .lineStyle(0)
    .endFill()

  // Draw the pips
  const radius = Math.floor(adjustedWidth * 0.1)
  const quarter = Math.floor(adjustedWidth * 0.28)
  const threeQuarter = Math.floor(adjustedWidth * 0.72)
  const half = Math.floor(adjustedWidth * 0.5)
  face.beginFill(0xffffff, isActive ? 1 : 0.35)
  // Top left
  if ([3, 4, 5, 6].includes(value)) {
    face.drawCircle(quarter, quarter, radius)
  }
  // Top right
  if ([2, 4, 5, 6].includes(value)) {
    face.drawCircle(threeQuarter, quarter, radius)
  }
  // Bottom left
  if ([2, 4, 5, 6].includes(value)) {
    face.drawCircle(quarter, threeQuarter, radius)
  }
  // Bottom right
  if ([3, 4, 5, 6].includes(value)) {
    face.drawCircle(threeQuarter, threeQuarter, radius)
  }
  // Middle
  if ([1, 3, 5].includes(value)) {
    face.drawCircle(half, half, radius)
  }
  // Left and right
  if (value === 6) {
    face.drawCircle(quarter, half, radius)
    face.drawCircle(threeQuarter, half, radius)
  }
  // End pips
  face.endFill()
  return face
}
