import * as PIXI from 'pixi.js'

export default class Menu {

  constructor(app, gotoScene) {
    this.app = app
    this.gotoScene = gotoScene
  }

  onStart(container) {
    this.container = container
    const richText = new PIXI.Text('TURN DOWN FOR WHAT??', new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
    }))

    richText.x = 50
    richText.y = 250
    this.container.addChild(richText)
  }

  update(delta) {}

  onFinish() {}
}
