import QRCode from 'qrcode'
import Archive from '../data/archive'
import Game from '../data/game'
import Gameplay from '../gameplay'

async function dataUrlToFile(dataUrl, filename) {
  const fileResponse = await fetch(dataUrl)
  const fileBlob = await fileResponse.blob()
  return new File([fileBlob], filename, {type: fileBlob.type})
}

export default class DetailManager {

  constructor(coordinator, view, options) {
    this.coordinator = coordinator
    this.localforage = coordinator.localforage
    this.view = view
    this.options = {gameId: null, ...options}
  }

  async start() {
    if (this.options.gameId === null) throw new Error('No gameId provided for details')
    this.game = await Game.Repository(this.localforage).load(this.options.gameId)
    if (this.game === null) {
      throw new Error(`Could not find game for gameId: ${this.options.gameId}`)
    }

    const codeTexture = await this.generateCodeImage(this.game.seed)

    this.view.showBackButton(this.game.id)
    this.view.showCodeImage(codeTexture)
    this.view.showGameDetail(this.game)
    // this.view.updateShareButton(navigator.share !== undefined)
    // this.view.updatePlayButton(!this.game.done)
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

  async share() {
    if (navigator.share === undefined) return

    const app = this.coordinator.app
    const backing = new PIXI.Graphics()
      .beginFill(0xe8f0f3)
      .drawRect(0, 0, app.screen.width, app.screen.height)
    app.stage.addChildAt(backing, 0)

    const dataUrl = app.renderer.plugins.extract.base64(app.stage)
    const file = await dataUrlToFile(dataUrl, `yatzy-${this.game.id}.png`)
    if (navigator.canShare && navigator.canShare({files: [file]})) {
      navigator.share({title: 'Yatzy Laboratory Experiment', files: [file]})
    }
  }

  play() {
    this.coordinator.gotoScene(new Gameplay(this.coordinator, {gameId: this.game.id}))
  }
}
