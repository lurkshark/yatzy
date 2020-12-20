import jsQR from 'jsqr'
import Game from '../data/game'
import Gameplay from '../gameplay'
import Detail from '../detail'

export default class LoaderManager {

  constructor(coordinator, view, options) {
    this.coordinator = coordinator
    this.localforage = coordinator.localforage
    this.view = view
  }

  async start() {
    this.view.updateBackButton('Peer Review')
    this.view.updateFileInputEl()
    this.view.updateFileOutlineSprite()
    this.view.showHint()
  }

  async loadCodeFromImageFile(file) {
    const image = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const image = document.createElement('img')
        image.addEventListener('load', () => {
          const canvas = document.createElement('canvas')
          if (image.width > 360) {
            canvas.width = 360
            canvas.height = 640
          }
          const ctx = canvas.getContext('2d')
          ctx.drawImage(image, 0, 0, 360, 640)
          resolve({
            data: ctx.getImageData(0, 0, 360, 640).data,
            width: 360,
            height: 640
          })
        })
        image.src = reader.result
      })
      reader.readAsDataURL(file)
    })

    const code = jsQR(image.data, image.width, image.height)
    if (code && code.data) {
      const scannedGameId = new Game(code.data).id
      const existingGame = await Game.Repository(this.localforage).load(scannedGameId)
      if (existingGame === null) {
        await Game.Repository(this.localforage).save(new Game(code.data))
        this.coordinator.gotoScene(new Gameplay(this.coordinator, {gameId: scannedGameId}))
      } else if (!existingGame.done) {
        this.coordinator.gotoScene(new Gameplay(this.coordinator, {gameId: scannedGameId}))
      } else {
        this.coordinator.gotoScene(new Detail(this.coordinator, {gameId: scannedGameId}))
      }
    }
  }
}
