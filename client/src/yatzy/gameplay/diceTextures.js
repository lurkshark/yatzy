import * as PIXI from 'pixi.js'

export default function diceTextures(value, isActive, isHolding) {
  const face = new PIXI.Graphics()

  // Outline if holding
  if (isHolding) {
    face.lineStyle(8, 0xe1a0ab)
  }

  // Rounded square body
  face.beginFill(0xa4cedd, isActive ? 1 : 0.35)
    .drawRoundedRect(0, 0, 100, 100, 12)
    .lineStyle(0)
    .endFill()

  // Draw the pips
  face.beginFill(0xffffff, isActive ? 1 : 0.35)
  // Top left
  if ([3, 4, 5, 6].includes(value)) {
    face.drawCircle(28, 28, 8)
  }
  // Top right
  if ([2, 4, 5, 6].includes(value)) {
    face.drawCircle(72, 28, 8)
  }
  // Bottom left
  if ([2, 4, 5, 6].includes(value)) {
    face.drawCircle(28, 72, 8)
  }
  // Bottom right
  if ([3, 4, 5, 6].includes(value)) {
    face.drawCircle(72, 72, 8)
  }
  // Middle
  if ([1, 3, 5].includes(value)) {
    face.drawCircle(50, 50, 8)
  }
  // Left and right
  if (value === 6) {
    face.drawCircle(28, 50, 8)
    face.drawCircle(72, 50, 8)
  }
  // End pips
  face.endFill()
  return face
}
