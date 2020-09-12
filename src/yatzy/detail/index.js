import * as PIXI from 'pixi.js'
import DetailManager from './manager'
import historyTextureHelper from '../history/historyTextureHelper'
import Menu from '../menu'

export default class Detail {

  constructor(coordinator, options = {}) {
    this.app = coordinator.app
    this.coordinator = coordinator
    this.manager = new DetailManager(coordinator, this, options)
  }

  onStart(container) {
    const setup = (loader, resources) => {
      // Top header and back button
      this.backButton = new PIXI.Sprite()
      this.backButton.on('pointerup', () => {
        this.coordinator.gotoScene(new Menu(this.coordinator))
      })
      container.addChild(this.backButton)

      this.codeSprite = new PIXI.Sprite()
      container.addChild(this.codeSprite)

      this.gameHistorySprite = new PIXI.Sprite()
      container.addChild(this.gameHistorySprite)

      // Bottom history hint
      this.hintSprite = new PIXI.Sprite()
      container.addChild(this.hintSprite)

      // Bottom share button
      this.shareButton = new PIXI.Sprite()
      this.shareButton.on('pointerdown', () => {
        this.manager.share()
      })
      container.addChild(this.shareButton)

      this.manager.start()
    }

    // Load any assets and setup
    PIXI.Loader.shared.load(setup)
  }

  updateBackButton(gameId) {
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
    const idText = `Experiment #${gameId}`
    const subHeaderText = new PIXI.Text(idText, {
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

  showBackButton(gameId) {
    this.updateBackButton(gameId)
  }

  updateCodeSprite(codeTexture) {
    this.codeSprite.y = 40
    const imageSprite = new PIXI.Sprite()
    imageSprite.texture = codeTexture
    imageSprite.width = this.coordinator.width - 30
    imageSprite.scale.y = imageSprite.scale.x
    imageSprite.x = 25
    const overlayLabelX = this.coordinator.width / 2 + 10
    const overlay = new PIXI.Graphics()
      .beginFill(0x000000)
      .drawRect(2, 0, 25, imageSprite.height)
      .beginFill(0xffffff)
      .lineStyle({width: 5, color: 0x000000})
      .drawEllipse(overlayLabelX, overlayLabelX - 40, 60, 30)
      .endFill()
      .lineStyle({width: 1, color: 0x000000})
      .moveTo(overlayLabelX - 35, overlayLabelX - 37)
      .lineTo(overlayLabelX + 35, overlayLabelX - 37)
      .moveTo(overlayLabelX - 35, overlayLabelX - 30)
      .lineTo(overlayLabelX + 35, overlayLabelX - 30)
      .lineStyle({width: 5, color: 0x000000})
      .drawRoundedRect(0, 0, this.coordinator.width - 5, imageSprite.height, 10)
    const compositionLabel = new PIXI.Text('COMPOSITION', {
      fontFamily: 'Ubuntu',
      fill: '#333333',
      fontSize: 10
    })
    compositionLabel.x = overlayLabelX - 35
    compositionLabel.y = overlayLabelX - 55

    const container = new PIXI.Container()
    container.addChild(imageSprite)
    container.addChild(overlay)
    container.addChild(compositionLabel)

    const texture = this.app.renderer.generateTexture(container)
    this.codeSprite.texture = texture
  }

  showCodeImage(codeTexture) {
    this.updateCodeSprite(codeTexture)
  }

  updateGameHistorySprite(game) {
    this.gameHistorySprite.y = this.codeSprite.y + this.codeSprite.height + 10
    const graphic = historyTextureHelper(this.coordinator.width, game)
    const texture = this.app.renderer.generateTexture(graphic)
    this.gameHistorySprite.texture = texture
  }

  showGameHistory(game) {
    this.updateGameHistorySprite(game)
  }

  updateHintSprite() {
    const hint = 'Share your notes with a friend so they can'
      + ' run the same experiment and compare results.'
    const hintText = new PIXI.Text(hint, {
      fontFamily: 'OpenSans',
      fill: '#666666',
      fontSize: 14,
      wordWrap: true,
      wordWrapWidth: this.coordinator.width
    })
    this.hintSprite.y = this.gameHistorySprite.y + this.gameHistorySprite.height + 10
    const texture = this.app.renderer.generateTexture(hintText)
    this.hintSprite.texture = texture
  }

  showHint() {
    this.updateHintSprite()
  }

  updateShareButton(isActive) {
    this.shareButton.interactive = true
    this.shareButton.buttonMode = true
    this.shareButton.y = this.coordinator.height - 50
    const buttonWidth = this.coordinator.width
    const button = new PIXI.Graphics()
      .beginFill(0xb25d96, isActive ? 1 : 0.35)
      .drawRoundedRect(0, 0, buttonWidth, 50, 4)
      .endFill()
    // Button text
    const buttonText = new PIXI.Text('Share', {
      fontFamily: 'OpenSans',
      fill: '#ffffff',
      fontSize: 18
    })
    buttonText.anchor.set(0.5)
    buttonText.x = buttonWidth / 2
    buttonText.y = 25

    // Add text to button
    button.addChild(buttonText)
    const texture = this.app.renderer.generateTexture(button)
    this.shareButton.texture = texture
  }

  showShareButton() {
    this.updateShareButton(true)
  }

  onUpdate(delta) {}

  onFinish() {}
}
