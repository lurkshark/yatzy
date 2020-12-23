import QRCode from 'qrcode'
import Game from '../data/game'

export default class PartyManager {

  constructor(coordinator, view, options) {
    this.coordinator = coordinator
    this.view = view
  }

  async start() {
    const randomSeed = new Game().seed
    const codeTexture = await this.generateCodeImage(randomSeed)

    this.view.showBackButton()
    this.view.showCodeImage(codeTexture)
    this.view.showHint()
  }

  async generateCodeImage(value) {
    const dataUrl = await QRCode.toDataURL(value, {
      errorCorrectionLevel: 'high',
      width: this.coordinator.width,
      margin: 1
    })

    // Even with a dataUrl, laoding the image
    // for a texture is done async. Wrapping it
    // in a promise makes this a bit cleaner
    return new Promise((resolve) => {
      if (PIXI.Loader.shared.resources[value]) {
        resolve(PIXI.Loader.shared.resources[value].texture)
      } else {
        PIXI.Loader.shared
          .add(value, dataUrl)
          .load((loader, resources) => {
            resolve(resources[value].texture)
          })
      }
    })
  }
}
