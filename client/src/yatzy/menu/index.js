import * as PIXI from 'pixi.js'
import {flamingDeathmatch, yacht} from './assets'
import Gameplay from '../gameplay'

export default class Menu {

  constructor(app, gotoScene, options = {}) {
    this.app = app
    this.gotoScene = gotoScene
    this.options = {...options}
  }

  onStart(container) {
    const setup = (loader, resources) => {
      const yatzyText = new PIXI.Text('Yatzy', new PIXI.TextStyle({
        fontFamily: 'Arial',
        strokeThickness: 2,
        stroke: '#000000',
        fill: ['#ff9999', '#990000'],
        fontWeight: 700,
        fontSize: 72
      }))

      yatzyText.x = 50
      yatzyText.y = 15
      this.container.addChild(yatzyText)
      
      const deathmatchText = new PIXI.Sprite(resources.deathmatch.texture)
      deathmatchText.width = this.options.width - 50
      deathmatchText.scale.y = deathmatchText.scale.x
      deathmatchText.x = this.options.width / 2
      deathmatchText.anchor.set(0.5, 0)
      deathmatchText.y = 100
      this.container.addChild(deathmatchText)
      
      const startNewGameButton = new PIXI.Text('Start a new game', new PIXI.TextStyle({
        fontFamily: 'Comic Neue',
        strokeThickness: 2,
        stroke: '#ffffff',
        fill: '#ff34ff',
        fontSize: 36
      }))

      startNewGameButton.x = 50
      startNewGameButton.y = 250
      startNewGameButton.interactive = true
      startNewGameButton.buttonMode = true
      startNewGameButton.on('pointerup', () => this.onStartNewGame())
      this.container.addChild(startNewGameButton)
    }
    
    this.container = container
    PIXI.Loader.shared
      .add('deathmatch', flamingDeathmatch)
      .add('yacht', yacht)
      .load(setup)
  }

  onStartNewGame() {
    this.gotoScene(new Gameplay(this.app, this.gotoScene, this.options))
  }

  onUpdate(delta) {}

  onFinish() {}
}
