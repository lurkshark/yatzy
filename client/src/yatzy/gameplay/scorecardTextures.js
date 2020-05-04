import * as PIXI from 'pixi.js'
import diceTextures from './diceTextures'

const text = {
  aces: {
    label: 'Aces',
    description: 'Add only ones'
  },
  twos: {
    label: 'Twos',
    description: 'Add only twos'
  },
  threes: {
    label: 'Threes',
    description: 'Add only threes'
  },
  fours: {
    label: 'Fours',
    description: 'Add only fours'
  },
  fives: {
    label: 'Fives',
    description: 'Add only fives'
  },
  sixes: {
    label: 'Sixes',
    description: 'Add only sixes'
  },
  threeOfAKind: {
    label: '3 of a Kind',
    description: 'Add all dice'
  },
  fourOfAKind: {
    label: '4 of a Kind',
    description: 'Add all dice'
  },
  fullHouse: {
    label: 'Full House',
    description: 'Score 25'
  },
  smallStraight: {
    label: 'Sm Straight',
    description: 'Score 30'
  },
  largeStraight: {
    label: 'Lg Straight',
    description: 'Score 40'
  },
  yatzy: {
    label: 'Yatzy',
    description: 'Score 50'
  },
  chance: {
    label: 'Chance',
    description: 'Add all dice'
  }
}

function iconForCategory(category) {
  switch (category) {
    case 'aces':
      return diceTextures(1, true, false)
    case 'twos':
      return diceTextures(2, true, false)
    case 'threes':
      return diceTextures(3, true, false)
    case 'fours':
      return diceTextures(4, true, false)
    case 'fives':
      return diceTextures(5, true, false)
    case 'sixes':
      return diceTextures(6, true, false)
  }
  return new PIXI.Graphics()
    .beginFill(0xa4cedd)
    .drawRoundedRect(0, 0, 100, 100, 12)
    .endFill()
}

// const width = (this.coordinator.width - 60) / 2
export default function scorecardTextures(width, game, category, isSelected) {
  const score = isSelected && game.canScore(category)
    ? game.score(category).scorecard[category]
    : game.scorecard[category]
  // Rectangle backing
  const backing = new PIXI.Graphics()
    .drawRect(0, 0, width, 42)
  const icon = iconForCategory(category)
  icon.width = 24
  icon.scale.y = icon.scale.x
  icon.x = 0
  icon.y = 6
  const underline = new PIXI.Graphics()
    .lineStyle({width: 0.5, color: 0xe1a0ab})
    .moveTo(36, 40).lineTo(width, 40)
    .lineStyle(0)
  const label = new PIXI.Text(text[category].label, {
    fontFamily: ['Ubuntu', 'sans-serif'],
    fill: '#333333',
    fontSize: 14
  })
  const description = new PIXI.Text(text[category].label, {
    fontFamily: ['OpenSans', 'sans-serif'],
    fill: '#666666',
    fontSize: 10
  })
  const pointsFill = isSelected ? '#e1a0ab' : '#333333'
  const points = new PIXI.Text(score, {
    fontFamily: ['OpenSans', 'sans-serif'],
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
