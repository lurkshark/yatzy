import * as PIXI from 'pixi.js'

export default function detailTextureHelper(width, game) {
  const backing = new PIXI.Graphics()
    .drawRect(0, 0, width, 105)
  const underline = new PIXI.Graphics()
    .lineStyle({width: 0.5, color: 0xe1a0ab})
    .moveTo(0, 103).lineTo(width, 103)
    .lineStyle(0)
  backing.addChild(underline)

  const idText = `Experiment #${game.id}`
  const headerText = new PIXI.Text(idText, {
    fontFamily: 'Ubuntu',
    fill: '#333333',
    fontSize: 16
  })
  headerText.y = 6
  backing.addChild(headerText)

  const dateText = game.time.toLocaleString()
  const subHeaderText = new PIXI.Text(dateText, {
    fontFamily: 'OpenSans',
    fill: '#666666',
    fontSize: 12
  })
  subHeaderText.y = 24
  backing.addChild(subHeaderText)

  const upperSubtotalLabelText = new PIXI.Text('Subtotal', {
    fontFamily: 'Ubuntu',
    fill: '#e1a0ab',
    fontSize: 12
  })
  upperSubtotalLabelText.angle = 270
  upperSubtotalLabelText.y = 94
  backing.addChild(upperSubtotalLabelText)

  const upperSubtotalText = new PIXI.Text(game.upperSubtotal, {
    fontFamily: 'OpenSans',
    fill: '#333333',
    fontSize: 58
  })
  upperSubtotalText.x = 18
  upperSubtotalText.y = 38
  backing.addChild(upperSubtotalText)

  const upperBonusText = new PIXI.Text('+35', {
    fontFamily: 'OpenSans',
    fill: '#666666',
    fontSize: 30
  })
  upperBonusText.x = 85
  upperBonusText.y = 64
  if (game.upperSubtotal > 63) {
    backing.addChild(upperBonusText)
  }

  const totalText = new PIXI.Text(game.total, {
    fontFamily: 'OpenSans',
    fill: '#333333',
    fontSize: 84
  })
  totalText.anchor.set(1, 0)
  totalText.x = width
  totalText.y = 14
  backing.addChild(totalText)

  const totalLabelText = new PIXI.Text('Total', {
    fontFamily: 'Ubuntu',
    fill: '#e1a0ab',
    fontSize: 16
  })
  totalLabelText.x = width - totalText.width
  totalLabelText.y = 6
  backing.addChild(totalLabelText)

  const bonusesLabelText = new PIXI.Text('Bonuses', {
    fontFamily: 'Ubuntu',
    fill: '#e1a0ab',
    fontSize: 12
  })
  bonusesLabelText.angle = 270
  bonusesLabelText.x = width / 2 - 20
  bonusesLabelText.y = 94
  backing.addChild(bonusesLabelText)

  for (let i = 0; i < 3; i += 1) {
    const hasBonus = game.bonuses > i
    const bonusX = width / 2
    const bonusY = 47 + (3 * 18) - (i + 1) * 18
    const bonusGraphic = new PIXI.Graphics()
      .beginFill(hasBonus ? 0xa4c3dd : 0xe8f0f3)
      .lineStyle({width: 0.5, color: 0xa4c3dd})
      .drawRoundedRect(bonusX, bonusY, 10, 10, 1)
      .lineStyle(0)
      .endFill()
    backing.addChild(bonusGraphic)
  }

  return backing
}
