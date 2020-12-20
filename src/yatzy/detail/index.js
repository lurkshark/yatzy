import * as PIXI from 'pixi.js'
import DetailManager from './manager'
import detailTextureHelper from './detailTextureHelper'
import Menu from '../menu'

export default class Detail {

  constructor(coordinator, options = {}) {
    this.app = coordinator.app
    this.coordinator = coordinator
    this.manager = new DetailManager(coordinator, this, options)
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

        this.codeSprite = new PIXI.Sprite()
        container.addChild(this.codeSprite)

        this.gameDetailSprite = new PIXI.Sprite()
        container.addChild(this.gameDetailSprite)

        // Bottom share button
        this.shareButton = new PIXI.Sprite()
        this.shareButton.on('pointerup', () => {
          this.manager.share()
        })
        container.addChild(this.shareButton)

        // Bottom play button
        this.playButton = new PIXI.Sprite()
        this.playButton.on('pointerup', () => {
          this.manager.play()
        })
        container.addChild(this.playButton)

        // Bottom history hint
        this.hintSprite = new PIXI.Sprite()
        container.addChild(this.hintSprite)

        await this.manager.start()
        resolve()
      }

      // Load any assets and setup
      PIXI.Loader.shared.load(setup)
    })
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

  updateGameDetailSprite(game) {
    this.gameDetailSprite.y = this.codeSprite.y + this.codeSprite.height + 10
    if (Object.keys(game.scorecard).length < 1) return

    const graphic = detailTextureHelper(this.coordinator.width, game)
    const texture = this.app.renderer.generateTexture(graphic)
    this.gameDetailSprite.texture = texture
  }

  showGameDetail(game) {
    this.updateGameDetailSprite(game)
  }

  updateShareButton(isActive) {
    this.shareButton.interactive = isActive
    this.shareButton.buttonMode = isActive
    this.shareButton.y = this.gameDetailSprite.y + this.gameDetailSprite.height
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

  updatePlayButton(isActive) {
    this.playButton.interactive = isActive
    this.playButton.buttonMode = isActive
    // this.playButton.y = this.shareButton.y + this.shareButton.height + 10
    this.playButton.y = this.gameDetailSprite.y + this.gameDetailSprite.height
    const buttonWidth = this.coordinator.width
    const button = new PIXI.Graphics()
      .beginFill(0x4268a2, isActive ? 1 : 0.35)
      .drawRoundedRect(0, 0, buttonWidth, 50, 4)
      .endFill()
    // Button text
    const buttonText = new PIXI.Text('Play', {
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
    this.playButton.texture = texture
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
    this.hintSprite.anchor.set(0, 1)
    this.hintSprite.y = this.coordinator.height - 5
    const texture = this.app.renderer.generateTexture(hintText)
    this.hintSprite.texture = texture
  }

  showHint() {
    this.updateHintSprite()
  }

  onUpdate(delta) {}

  onFinish() {}
}
