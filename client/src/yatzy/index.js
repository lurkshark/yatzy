import * as PIXI from 'pixi.js'
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
    window.theApp = this.app

    // Scene stack
    this.backStack = []
    body.appendChild(this.app.view)

    // Add the overall update
    this.app.ticker.add((delta) => {
      this.update(delta)
    })

    WebFont.load({
      // Load the menu with height adjusted
      active: () => this.gotoScene(new Menu(this.app, this)),
      custom: {
        families: ['Ubuntu', 'OpenSans']
      }
    })
  }

  // Destroy current scene and load new
  async gotoScene(newScene) {
    if (this.backStack[0]) {
      await this.backStack[0].onFinish()
      this.app.stage.removeChildren()
    }

    const container = new PIXI.Container()
    this.app.stage.addChild(container)
    await newScene.onStart(container)
    this.backStack.unshift(newScene)

    // Pop old dead scenes off the stack
    if (this.backStack.length > 5) {
      this.backStack.pop()
    }
  }

  update(delta) {
    if (!this.backStack[0]) return
    this.backStack[0].onUpdate(delta)
  }

  get width() {
    return this.app.screen.width
  }

  get height() {
    return this.app.screen.height
  }
}
