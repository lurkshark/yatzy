import * as PIXI from 'pixi.js'
import {darkMetal} from './assets'
import Menu from './menu'

window.PIXI = PIXI
PIXI.settings.ROUND_PIXELS = true
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
// PIXI.settings.PRECISION_FRAGMENT = 'highp'
//PIXI.settings.RESOLUTION = 2

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
    this.innerStage.position.y = 68

    this.drawStage()
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
      height: this.app.renderer.height - 104,
      width: Math.min(
        this.app.renderer.width,
        Math.floor(this.app.renderer.height / 1.34)
      )
    }))
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
      .drawRect(0, 26, this.app.renderer.width, 38)
      .lineStyle(0)
      .beginFill(0xdddddd)
      .drawRect(0, 27, this.app.screen.width, 1)
      .endFill()
    // Back arrow circle
    frame.beginFill(0x71bf3b)
      .lineStyle({width: 1, color: 0x7e7e7e})
      .drawCircle(23, 46, 12)
      .lineStyle(0)
      .endFill()
    // Forward arrow circle
    frame.beginFill(0x9a9a9a)
      .lineStyle({width: 1, color: 0x7e7e7e})
      .drawCircle(112, 46, 12)
      .lineStyle(0)
      .endFill()
    // Back arrow
    frame.lineStyle({width: 2, color: 0xffffff})
      .moveTo(18, 46).lineTo(29, 46)
      .moveTo(18, 46).lineTo(24, 40)
      .moveTo(18, 46).lineTo(24, 52)
      .lineStyle(0)
    // Forward arrow
    frame.lineStyle({width: 2, color: 0xdddddd})
      .moveTo(117, 46).lineTo(106, 46)
      .moveTo(117, 46).lineTo(111, 40)
      .moveTo(117, 46).lineTo(111, 52)
      .lineStyle(0)
    // Back text
    const backText = new PIXI.Text('Back', {fontSize: 18, fill: '#666666'})
    backText.x = 42
    backText.y = 37
    frame.addChild(backText)
    // Address bar
    frame.beginFill(0xffffff)
      .lineStyle({width: 1, color: 0x7e7e7e})
      .drawRect(142, 32, this.app.screen.width - 190, 26)
      .lineStyle(0)
      .beginFill(0x666666)
      // Top and left bevel
      .drawRect(142, 33, this.app.screen.width - 192, 1)
      .drawRect(142, 32, 1, 26)
      .endFill()
    // Bottom fill
    frame.beginFill(0xc0c0c0)
      .lineStyle({width: 1, color: 0x7e7e7e})
      .drawRect(0, this.app.screen.height - 28, this.app.screen.width, 28)
      .lineStyle(0)
      .beginFill(0xdddddd)
      .drawRect(0, this.app.screen.height - 27, this.app.screen.width, 1)
      .endFill()

    const bg = new PIXI.TilingSprite(
      new PIXI.Texture.from(darkMetal),
      this.app.screen.width,
      this.app.screen.height
    )

    bg.alpha = 0.85
    this.app.stage.addChild(bg)
    this.app.stage.addChild(frame)
  }
}
