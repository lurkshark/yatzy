import * as PIXI from 'pixi.js'
import Menu from './menu'
import './assets'

window.PIXI = PIXI
// PIXI.settings.ROUND_PIXELS = true
// PIXI.settings.RESOLUTION = 2

export default class Yatzy {

  constructor(window, body) {
    this.app = new PIXI.Application({
      resizeTo: window,
      backgroundColor: 0xffffff
    })

    // Scene stack
    this.backStack = []
    // Stage within the border
    this.innerStage = new PIXI.Container()
    this.innerStage.width = this.app.renderer.width
    this.innerStage.position.y = 72

    this.app.stage.addChild(this.innerStage)
    body.appendChild(this.app.view)

    // Destroy current scene and load new
    const gotoScene = async (newScene) => {
      if (this.backStack[0]) {
        await this.backStack[0].onFinish()
        this.innerStage.removeChildren()
      }

      const container = new PIXI.Container()
      this.innerStage.addChild(container)
      await newScene.onStart(container)
      this.backStack.unshift(newScene)

      // Pop old dead scenes off the stack
      if (this.backStack.length > 5) {
        this.backStack.pop()
      }
    }

    const goBack = async () => {
      if (this.backStack.length < 2) return
      // TODO
    }

    // Add the overall update
    this.app.ticker.add((delta) => {
      this.update(delta)
    })

    // Load the menu with height adjusted
    gotoScene(new Menu(this.app, gotoScene, {
      height: this.app.renderer.height - 100,
      width: Math.min(
        this.app.renderer.width,
        Math.floor(this.app.renderer.height / 1.34)
      )
    }))

    this.drawStage()
  }

  update(delta) {
    if (!this.backStack[0]) return
    this.backStack[0].onUpdate(delta)
  }

  drawStage() {
    const frame = new PIXI.Graphics()
    // Blue title bar
    frame.beginFill(0x5d7cb2)
      .drawRect(0, 0, this.app.renderer.width, 26)
      .endFill()
    // Top fill
    frame.beginFill(0xc0c0c0)
      .lineStyle({width: 1, color: 0x7e7e7e})
      .drawRect(0, 26, this.app.renderer.width, 46)
      .lineStyle(0)
      .endFill()
    // Back arrow circle
    frame.beginFill(0x71bf3b)
      .lineStyle({width: 1, color: 0x7e7e7e})
      .drawCircle(15, 35, 10)
      .lineStyle(0)
      .endFill()
    // Back arrow
    frame.lineStyle({width: 2, color: 0xffffff})
      .moveTo(10, 35).lineTo(21, 35)
      .moveTo(10, 35).lineTo(15, 30)
      .moveTo(10, 35).lineTo(15, 40)
      .lineStyle(0)
    // Bottom fill
    frame.beginFill(0xc0c0c0)
      .lineStyle({width: 1, color: 0x7e7e7e})
      .drawRect(0, this.app.renderer.height - 28, this.app.renderer.width, 28)
      .lineStyle(0)
      .endFill()
    this.app.stage.addChild(frame)
  }
}
