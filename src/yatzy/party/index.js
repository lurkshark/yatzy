import * as PIXI from 'pixi.js'
import PartyManager from './manager'
import Menu from '../menu'

export default class Party {

  constructor(coordinator, options) {
    this.app = coordinator.app
    this.coordinator = coordinator
    this.manager = new PartyManager(coordinator, this, options)
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
    const subHeaderText = new PIXI.Text('Group Project', {
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

    if (this.coordinator.width > this.coordinator.height) {
      imageSprite.width = this.coordinator.height - 100
    }
    imageSprite.scale.y = imageSprite.scale.x

    const texture = this.app.renderer.generateTexture(imageSprite)
    this.codeSprite.texture = texture
  }

  showCodeImage(codeTexture) {
    this.updateCodeSprite(codeTexture)
  }

  updateHintSprite() {
    const hint = 'Scan the game challenge above with some friends'
      + ' to play the random experiment together.'
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
