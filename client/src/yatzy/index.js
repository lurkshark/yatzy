import * as PIXI from 'pixi.js'
import Menu from './menu'

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

    // Add the overall update
    this.app.ticker.add((delta) => {
      this.update(delta)
    })

    gotoScene(new Menu(this.app, gotoScene))
    this.drawStage()
  }

  update(delta) {
    if (!this.backStack[0]) return
    this.backStack[0].update(delta)
  }

  drawStage() {
    const frame = new PIXI.Graphics();
    // Blue title bar
    frame.beginFill(0x5d7cb2)
      .drawRect(0, 0, this.app.renderer.width, 20)
      .endFill()
    // Top fill
    frame.beginFill(0xc0c0c0)
      .lineStyle({width: 1, color: 0x7e7e7e})
      .drawRect(0, 20, this.app.renderer.width, 30)
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
      .drawRect(0, this.app.renderer.height - 20, this.app.renderer.width, 30)
      .lineStyle(0)
      .endFill()
    this.app.stage.addChild(frame)
  }
}
