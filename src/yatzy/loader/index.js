import * as PIXI from 'pixi.js'
import LoaderManager from './manager'
import Menu from '../menu'

export default class Loader {

  constructor(coordinator, options = {}) {
    this.app = coordinator.app
    this.coordinator = coordinator
    this.manager = new LoaderManager(coordinator, this, options)
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

        this.fileInputEl = document.createElement('input')
        document.body.appendChild(this.fileInputEl)
        this.fileInputEl.addEventListener('change', (e) => {
          const file = e.target.files[0]
          this.manager.loadCodeFromImageFile(file)
        })

        this.fileOutlineSprite = new PIXI.Sprite()
        container.addChild(this.fileOutlineSprite)

        await this.manager.start()
        resolve()
      }

      // Load any assets and setup
      PIXI.Loader.shared.load(setup)
    })
  }

  updateBackButton(subtitle) {
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
    const subHeaderText = new PIXI.Text(subtitle, {
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

  updateFileInputEl() {
    this.fileInputEl.setAttribute('type', 'file')
    this.fileInputEl.setAttribute('accept', 'image/*')
    this.fileInputEl.style.position = 'absolute'
    this.fileInputEl.style.width = `${this.coordinator.width}px`
    this.fileInputEl.style.height = this.fileInputEl.style.width
    this.fileInputEl.style.left = '20px'
    this.fileInputEl.style.top = '60px'
    this.fileInputEl.style.opacity = 0
    // this.fileInputEl.style.border = 'thin black solid'
  }

  updateFileOutlineSprite() {
    this.fileOutlineSprite.y = 40
    const size = this.coordinator.width - 5
    const outline = new PIXI.Graphics()
      .lineStyle({width: 5, color: 0x000000, alpha: 0.3})
      .drawRoundedRect(0, 0, size, size, 10)
    const texture = this.app.renderer.generateTexture(outline)
    this.fileOutlineSprite.texture = texture
  }

  onUpdate(delta) {}

  onFinish() {
    this.fileInputEl.remove()
  }
}
