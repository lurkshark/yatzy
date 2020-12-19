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
    .beginFill(0xa4cedd, 0.35)
    .drawCircle(15, 23, 15)
  backing.addChild(statusCircle)

  const idText = `Experiment #${game.id}`
  const headerText = new PIXI.Text(idText, {
    fontFamily: 'Ubuntu',
    fill: '#333333',
    fontSize: 16
  })
  headerText.x = 40
  headerText.y = 6
  backing.addChild(headerText)

  const dateText = game.time.toLocaleString()
  const subHeaderText = new PIXI.Text(dateText, {
    fontFamily: 'OpenSans',
    fill: '#666666',
    fontSize: 12
  })
  subHeaderText.x = 40
  subHeaderText.y = 24
  backing.addChild(subHeaderText)

  const totalText = new PIXI.Text(game.total, {
    fontFamily: 'OpenSans',
    fill: '#e1a0ab',
    fontSize: 36
  })
  totalText.anchor.set(1, 0)
  totalText.x = width - 70
  totalText.y = 2
  backing.addChild(totalText)

  const bonusGraphic = new PIXI.Graphics()
    .beginFill(game.upperSubtotal > 63 ? 0xa4c3dd : 0xe8f0f3)
    .lineStyle({width: 0.5, color: 0xa4c3dd})
    .drawRoundedRect(width - 58, 10, 10, 10, 1)
    .lineStyle(0)
    .endFill()
  backing.addChild(bonusGraphic)

  const yatzyGraphic = new PIXI.Graphics()
    .beginFill(game.scorecard[Game.Categories.YATZY] > 0 ? 0xa4c3dd : 0xe8f0f3)
    .lineStyle({width: 0.5, color: 0xa4c3dd})
    .drawRoundedRect(width - 58, 26, 10, 10, 1)
    .lineStyle(0)
    .endFill()
  backing.addChild(yatzyGraphic)

  const bonusLabelText = new PIXI.Text('Upper', {
    fontFamily: 'Ubuntu',
    fill: '#666666',
    fontSize: 14
  })
  bonusLabelText.x = width - 42
  bonusLabelText.y = 6
  backing.addChild(bonusLabelText)

  const yatzyLabelText = new PIXI.Text('Yatzy', {
    fontFamily: 'Ubuntu',
    fill: '#666666',
    fontSize: 14
  })
  yatzyLabelText.x = width - 42
  yatzyLabelText.y = 22
  backing.addChild(yatzyLabelText)

  return backing
}
