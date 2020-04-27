import * as PIXI from 'pixi.js'
import Gameplay from '../gameplay'

export default class Menu {

  constructor(app, coordinator) {
    this.app = app
    this.coordinator = coordinator
  }

  onStart(container) {
    const setup = (loader, resources) => {
      const headerText = new PIXI.Text('Yatzy\nLaboratory', {
        fontFamily: 'Ubuntu',
        fill: '#333333',
        fontSize: 54
      })
      headerText.x = 35
      headerText.y = 25
      this.container.addChild(headerText)
      
      const startNewGameText = new PIXI.Text('New Experiment', {
        fontFamily: 'OpenSans',
        fill: '#333333',
        fontSize: 24
      })

      startNewGameText.x = 35
      startNewGameText.y = 250
      startNewGameText.interactive = true
      startNewGameText.buttonMode = true
      startNewGameText.on('pointerup', () => this.onStartNewGame())
      this.container.addChild(startNewGameText)
    }
    
    this.container = container
    PIXI.Loader.shared
      .load(setup)
  }

  onStartNewGame() {
    this.coordinator.gotoScene(new Gameplay(this.app, this.coordinator))
  }

  onUpdate(delta) {}

  onFinish() {}
}
