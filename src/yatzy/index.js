import * as PIXI from 'pixi.js'
import localforage from 'localforage'
import WebFont from 'webfontloader'
import Menu from './menu'
import './assets'

window.PIXI = PIXI
PIXI.settings.RESOLUTION = window.devicePixelRatio || 1

export default class Yatzy {

  constructor(window, body) {
    this.app = new PIXI.Application({
      resizeTo: window,
      backgroundColor: 0xe8f0f3,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    })

    // Add canvas to body
    body.appendChild(this.app.view)

    // Add the overall update
    this.app.ticker.add((delta) => {
      this.update(delta)
    })

    // Initialize instance of localforage
    this.localforage = localforage.createInstance({
      name: 'YatzyLaboratory-v1'
    })

    WebFont.load({
      // Load the menu when fonts are ready
      active: () => this.gotoScene(new Menu(this)),
      custom: {
        families: ['Ubuntu', 'OpenSans']
      }
    })
  }

  // Destroy current scene and load new
  async gotoScene(newScene) {
    if (this.currentScene !== undefined) {
      await this.currentScene.onFinish()
      // This is a hacky inline fadeout
      await new Promise((resolve) => {
        let start
        const fadeOut = (timestamp) => {
          if (start === undefined) start = timestamp
          const elapsed = timestamp - start
          const alpha = Math.max(0, 1 - elapsed / 100)
          this.app.stage.alpha = alpha
          if (elapsed < 100) {
            requestAnimationFrame(fadeOut)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(fadeOut)
      })
      this.app.stage.removeChildren()
    }

    const container = new PIXI.Container()
    container.x = 20
    container.y = 20

    await newScene.onStart(container)
    this.app.stage.addChild(container)
    this.currentScene = newScene
    // This is a hacky inline fadein
    await new Promise((resolve) => {
      let start
      const fadeIn = (timestamp) => {
        if (start === undefined) start = timestamp
        const elapsed = timestamp - start
        const alpha = Math.min(1, elapsed / 100)
        this.app.stage.alpha = alpha
        if (elapsed < 100) {
          requestAnimationFrame(fadeIn)
        } else {
          resolve()
        }
      }
      requestAnimationFrame(fadeIn)
    })
  }

  update(delta) {
    if (this.currentScene === undefined) return
    this.currentScene.onUpdate(delta)
  }

  get width() {
    return this.app.screen.width - 40
  }

  get height() {
    return this.app.screen.height - 40
  }
}
