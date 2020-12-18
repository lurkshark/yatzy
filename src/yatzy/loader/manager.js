import jsQR from 'jsqr'
import Archive from '../data/archive'
import Game from '../data/game'

export default class LoaderManager {

  constructor(coordinator, view, options) {
    this.coordinator = coordinator
    this.localforage = coordinator.localforage
    this.view = view
    this.options = {...options}
  }

  async start() {
    this.view.updateBackButton()
    this.view.updateFileInputEl()
  }

  async loadCodeFromImageFile(file) {
    const image = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const resourceKey = `loaded-${new Date().getTime()}`
        PIXI.Loader.shared
          .add(resourceKey, reader.result)
          .load((loader, resources) => {
            const resolution = this.coordinator.app.renderer.resolution
            const loadedImage = new PIXI.Sprite(resources[resourceKey].texture)
            const canvasExtract = this.coordinator.app.renderer.plugins.extract
            const pixels = canvasExtract.pixels(loadedImage)
            resolve({
              data: pixels,
              width: loadedImage.width * resolution,
              height: loadedImage.height * resolution
            })
          })
      })
      reader.readAsDataURL(file)
    })

    const code = jsQR(image.data, image.width, image.height)
    console.log(code && code.data ? code.data : null)
    alert(code && code.data ? code.data : null)
  }
}
