import * as PIXI from 'pixi.js'
import HistoryManager from './manager'
import Menu from '../menu'

export default class History {

  constructor(coordinator) {
    this.app = coordinator.app
    this.coordinator = coordinator
    this.manager = new HistoryManager(coordinator, this)
  }

  onStart(container) {
    const setup = (loader, resources) => {
      // Top header and back button
      this.backButton = new PIXI.Sprite()
      this.backButton.on('pointerup', () => {
        this.coordinator.gotoScene(new Menu(this.coordinator))
      })
      container.addChild(this.backButton)
      this.updateBackButton()

      // History sprites
      this.gameHistorySprites = {}
      for (let i = 0; i < this.historyCount; i += 1) {
        const sprite = new PIXI.Sprite()
        sprite.on('pointerdown', () => {
          this.manager.shareRecentGame(i)
        })
        container.addChild(sprite)
        this.gameHistorySprites[i] = sprite
      }

      // Bottom sharing hint
      this.hintSprite = new PIXI.Sprite()
      // TODO: Uncomment when sharing is implemented
      //container.addChild(this.hintSprite)
      this.updateHintSprite()

      this.manager.start()
    }
    
    PIXI.Loader.shared.load(setup)
  }

  get historyCount() {
    return Math.floor((this.coordinator.height - 80) / 105)
  }

  updateBackButton() {
    this.backButton.interactive = true
    this.backButton.buttonMode = true
    
    // Button body
    const button = new PIXI.Graphics()
      .drawRect(0, 0, 290, 20)
      .lineStyle({width: 1, color: 0x666666})
      .moveTo(0, 10).lineTo(12, 10)
      .moveTo(0, 10).lineTo(5, 5)
      .moveTo(0, 10).lineTo(5, 15)
    const headerText = new PIXI.Text('Yatzy Laboratory', {
      fontFamily: 'Ubuntu',
      fill: '#333333',
      fontSize: 16
    })
    const subHeaderText = new PIXI.Text('Notebook', {
      fontFamily: 'OpenSans',
      fill: '#666666',
      fontSize: 12
    })
    headerText.x = 20
    subHeaderText.x = 148
    subHeaderText.y = 3
    button.addChild(headerText)
    button.addChild(subHeaderText)
    const texture = this.app.renderer.generateTexture(button)
    this.backButton.texture = texture
  }

  updateGameHistorySprite(index, game) {
    this.gameHistorySprites[index].interactive = true
    this.gameHistorySprites[index].buttonMode = true
    this.gameHistorySprites[index].y = (
      this.coordinator.height - (this.historyCount * 105) + index * 105 - 40
    )

    const backing = new PIXI.Graphics()
      .drawRect(0, 0, this.coordinator.width, 105)
    const underline = new PIXI.Graphics()
      .lineStyle({width: 0.5, color: 0xe1a0ab})
      .moveTo(0, 103).lineTo(this.coordinator.width, 103)
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
    totalText.x = this.coordinator.width
    totalText.y = 14
    backing.addChild(totalText)

    const totalLabelText = new PIXI.Text('Total', {
      fontFamily: 'Ubuntu',
      fill: '#e1a0ab',
      fontSize: 16
    })
    totalLabelText.x = this.coordinator.width - totalText.width
    totalLabelText.y = 6
    backing.addChild(totalLabelText)

    const bonusesLabelText = new PIXI.Text('Bonuses', {
      fontFamily: 'Ubuntu',
      fill: '#e1a0ab',
      fontSize: 12
    })
    bonusesLabelText.angle = 270
    bonusesLabelText.x = this.coordinator.width / 2 - 20
    bonusesLabelText.y = 94
    backing.addChild(bonusesLabelText)

    for (let i = 0; i < 3; i += 1) {
      const hasBonus = game.bonuses > i
      const bonusX = this.coordinator.width / 2
      const bonusY = 47 + (3 * 18) - (i + 1) * 18
      const bonusGraphic = new PIXI.Graphics()
        .beginFill(hasBonus ? 0xa4c3dd : 0xe8f0f3)
        .lineStyle({width: 0.5, color: 0xa4c3dd})
        .drawRoundedRect(bonusX, bonusY, 10, 10, 1)
        .lineStyle(0)
        .endFill()
      backing.addChild(bonusGraphic)
    }

    const texture = this.app.renderer.generateTexture(backing)
    this.gameHistorySprites[index].texture = texture
  }

  showRecentGames(games) {
    for (let i = 0; i < this.historyCount; i += 1) {
      if (games[i] === undefined) break
      this.updateGameHistorySprite(i, games[i])
    }
  }

  updateHintSprite() {
    const hintText = new PIXI.Text('Select an entry to create a shareable challenge', {
      fontFamily: 'OpenSans',
      fill: '#666666',
      fontSize: 14
    })
    this.hintSprite.anchor.set(0, 1)
    this.hintSprite.y = this.coordinator.height - 5
    const texture = this.app.renderer.generateTexture(hintText)
    this.hintSprite.texture = texture
  }

  onUpdate(delta) {}

  onFinish() {}
}

