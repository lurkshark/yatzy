import jsQR from 'jsqr'
import Archive from '../data/archive'
import Game from '../data/game'
import Gameplay from '../gameplay'

export default class LoaderManager {

  constructor(coordinator, view, options) {
    this.coordinator = coordinator
    this.localforage = coordinator.localforage
    this.view = view
    this.options = {...options}
  }

  async start() {
    this.view.updateBackButton('Peer Review')
    this.view.updateFileInputEl()
    this.view.updateFileOutlineSprite()
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
      const scannedGame = new Game(code.data)
      const existingGame = await Game.Repository(this.localforage).load(scannedGame.id)
      if (existingGame === null) await Game.Repository(this.localforage).save(scannedGame)
      this.coordinator.gotoScene(new Gameplay(this.coordinator, {gameId: scannedGame.id}))
    }
  }
}
