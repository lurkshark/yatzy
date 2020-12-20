import * as PIXI from 'pixi.js'
import Game from '../data/game'

export default function historyTextureHelper(width, game) {
  const backing = new PIXI.Graphics()
    //.beginFill(0xeeeeee)
    .drawRect(0, 0, width, 50)
  const underline = new PIXI.Graphics()
    .lineStyle({width: 0.5, color: 0xe1a0ab})
    .moveTo(0, 50).lineTo(width, 50)
    .lineStyle(0)
  backing.addChild(underline)

  const statusCircle = new PIXI.Graphics()
    .beginFill(0xa4cedd)
    .drawCircle(15, 23, 15)
  backing.addChild(statusCircle)

  if (game.done) {
    const statusIcon = new PIXI.Graphics()
      .lineStyle({width: 4, color: 0xe8f0f3})
      .moveTo(7, 22).lineTo(13, 28)
      .lineTo(23, 18)
    backing.addChild(statusIcon)
  } else {
    const progress = Object.keys(game.scorecard).length / 13
    const startAngle = 3 * Math.PI / 2
    const endAngle = startAngle + 2 * Math.PI * progress
    const statusCircle = new PIXI.Graphics()
      .beginFill(0xe8f0f3)
      .arc(15, 23, 11, startAngle, endAngle, true)
      .arc(15, 23, 0, startAngle, endAngle, true)
    backing.addChild(statusCircle)
  }

  const idText = `Experiment #${game.id}`
  const headerText = new PIXI.Text(idText, {
    fontFamily: 'Ubuntu',
    fill: '#333333',
    fontSize: 16
  })
  headerText.x = 38
  headerText.y = 6
  backing.addChild(headerText)

  const dateText = game.time.toLocaleString()
  const subHeaderText = new PIXI.Text(dateText, {
    fontFamily: 'OpenSans',
    fill: '#666666',
    fontSize: 12
  })
  subHeaderText.x = 38
  subHeaderText.y = 24
  backing.addChild(subHeaderText)

  const totalText = new PIXI.Text(game.total, {
    fontFamily: 'OpenSans',
    fill: '#e1a0ab',
    fontSize: 36
  })
  totalText.anchor.set(1, 0)
  totalText.x = width - 60
  totalText.y = 2
  backing.addChild(totalText)

  const bonusGraphic = new PIXI.Graphics()
    .beginFill(game.upperSubtotal > 63 ? 0xa4c3dd : 0xe8f0f3)
    .lineStyle({width: 0.5, color: 0xa4c3dd})
    .drawRoundedRect(width - 52, 10, 10, 10, 1)
    .lineStyle(0)
    .endFill()
  backing.addChild(bonusGraphic)

  const yatzyGraphic = new PIXI.Graphics()
    .beginFill(game.scorecard[Game.Categories.YATZY] > 0 ? 0xa4c3dd : 0xe8f0f3)
    .lineStyle({width: 0.5, color: 0xa4c3dd})
    .drawRoundedRect(width - 52, 26, 10, 10, 1)
    .lineStyle(0)
    .endFill()
  backing.addChild(yatzyGraphic)

  const bonusLabelText = new PIXI.Text('Upper', {
    fontFamily: 'Ubuntu',
    fill: '#666666',
    fontSize: 12
  })
  bonusLabelText.x = width - 36
  bonusLabelText.y = 8
  backing.addChild(bonusLabelText)

  const yatzyLabelText = new PIXI.Text('Yatzy', {
    fontFamily: 'Ubuntu',
    fill: '#666666',
    fontSize: 12
  })
  yatzyLabelText.x = width - 36
  yatzyLabelText.y = 24
  backing.addChild(yatzyLabelText)

  return backing
}
