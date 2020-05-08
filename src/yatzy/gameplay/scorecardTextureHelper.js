import * as PIXI from 'pixi.js'
import diceTextureHelper from './diceTextureHelper'
import Game from '../data/game'

const DEFAULT_ICON = new PIXI.Graphics()
  .beginFill(0xa4cedd)
  .drawRoundedRect(0, 0, 24, 24, 24 * 0.12)
  .endFill()

const INFO = {}
INFO[Game.Categories.ACES] = {
  label: 'Aces',
  description: 'Add only ones',
  icon: diceTextureHelper(24, 1, true, false)
}
INFO[Game.Categories.TWOS] = {
  label: 'Twos',
  description: 'Add only twos',
  icon: diceTextureHelper(24, 2, true, false)
}
INFO[Game.Categories.THREES] = {
  label: 'Threes',
  description: 'Add only threes',
  icon: diceTextureHelper(24, 3, true, false)
}
INFO[Game.Categories.FOURS] = {
  label: 'Fours',
  description: 'Add only fours',
  icon: diceTextureHelper(24, 4, true, false)
}
INFO[Game.Categories.FIVES] = {
  label: 'Fives',
  description: 'Add only fives',
  icon: diceTextureHelper(24, 5, true, false)
}
INFO[Game.Categories.SIXES] = {
  label: 'Sixes',
  description: 'Add only sixes',
  icon: diceTextureHelper(24, 6, true, false)
}
INFO[Game.Categories.THREE_OF_A_KIND] = {
  label: '3 of a Kind',
  description: 'Add all dice',
  icon: DEFAULT_ICON
}
INFO[Game.Categories.FOUR_OF_A_KIND] = {
  label: '4 of a Kind',
  description: 'Add all dice',
  icon: DEFAULT_ICON
}
INFO[Game.Categories.FULL_HOUSE] = {
  label: 'Full House',
  description: 'Score 25',
  icon: DEFAULT_ICON
}
INFO[Game.Categories.SMALL_STRAIGHT] = {
  label: 'Sm Straight',
  description: 'Score 30',
  icon: DEFAULT_ICON
}
INFO[Game.Categories.LARGE_STRAIGHT] = {
  label: 'Lg Straight',
  description: 'Score 40',
  icon: DEFAULT_ICON
}
INFO[Game.Categories.YATZY] = {
  label: 'Yatzy',
  description: 'Score 50',
  icon: DEFAULT_ICON
}
INFO[Game.Categories.CHANCE] = {
  label: 'Chance',
  description: 'Add all dice',
  icon: DEFAULT_ICON
}

export default function scorecardTextureHelper(width, category, isSelected, score) {
  // Rectangle backing
  const backing = new PIXI.Graphics()
    .drawRect(0, 0, width, 42)
  const icon = INFO[category].icon
  icon.width = 24
  icon.scale.y = icon.scale.x
  icon.x = 0
  icon.y = 7
  const underline = new PIXI.Graphics()
    .lineStyle({width: 0.5, color: 0xe1a0ab})
    .moveTo(36, 40).lineTo(width, 40)
    .lineStyle(0)
  const label = new PIXI.Text(INFO[category].label, {
    fontFamily: 'Ubuntu',
    fill: '#333333',
    fontSize: 14
  })
  const description = new PIXI.Text(INFO[category].label, {
    fontFamily: 'OpenSans',
    fill: '#666666',
    fontSize: 10
  })
  const pointsFill = isSelected ? '#e1a0ab' : '#333333'
  const points = new PIXI.Text(score, {
    fontFamily: 'OpenSans',
    fill: pointsFill,
    fontSize: 26
  })
  label.x = 34
  label.y = 4
  description.x = 34
  description.y = 20
  points.x = width - (score > 9 ? 34 : 20)
  points.y = 4
  backing.addChild(icon)
  backing.addChild(underline)
  backing.addChild(label)
  backing.addChild(description)
  backing.addChild(points)
  return backing
}
