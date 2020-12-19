import * as PIXI from 'pixi.js'
import HistoryManager from './manager'
import historyTextureHelper from './historyTextureHelper'
import Menu from '../menu'

export default class History {

  constructor(coordinator) {
    this.app = coordinator.app
    this.coordinator = coordinator
    this.manager = new HistoryManager(coordinator, this)
  }

  onStart(container) {
    return new Promise((resolve) => {
      const setup = async (loader, resources) => {
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
          sprite.on('pointerup', () => {
            this.manager.shareRecentGame(i)
          })
          container.addChild(sprite)
          this.gameHistorySprites[i] = sprite
        }

        // Bottom sharing hint
        this.hintSprite = new PIXI.Sprite()
        container.addChild(this.hintSprite)
        this.updateHintSprite()

        await this.manager.start()
        resolve()
      }

      PIXI.Loader.shared.load(setup)
    })
  }

  get historyCount() {
    return Math.floor((this.coordinator.height - 80) / 55)
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
      this.coordinator.height - (this.historyCount * 55) + index * 55 - 40
    )

    const graphic = historyTextureHelper(this.coordinator.width, game)
    const texture = this.app.renderer.generateTexture(graphic)
    this.gameHistorySprites[index].texture = texture
  }

  showRecentGames(games) {
    for (let i = 0; i < this.historyCount; i += 1) {
      if (games[i] === undefined) break
      this.updateGameHistorySprite(i, games[i])
    }
  }

  updateHintSprite() {
    const hintText = new PIXI.Text('Select an entry to create a shareable challenge.', {
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
