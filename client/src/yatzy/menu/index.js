import * as PIXI from 'pixi.js'
import Gameplay from '../gameplay'
import {scientistSprites} from './assets'

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
      
      const newGameContainer = new PIXI.Container()
      const startNewGameText = new PIXI.Text('Start a new experiment', {
        fontFamily: 'Ubuntu',
        fill: '#333333',
        fontSize: 24
      })

      const startNewGameDescriptionText = new PIXI.Text('Play a fresh game of yatzy', {
        fontFamily: 'OpenSans',
        fill: '#666666',
        fontSize: 14
      })

      startNewGameDescriptionText.y = 25

      newGameContainer.x = 35
      newGameContainer.y = 200
      newGameContainer.interactive = true
      newGameContainer.buttonMode = true
      newGameContainer.on('pointerup', () => this.onStartNewGame())
      newGameContainer.addChild(startNewGameText)
      newGameContainer.addChild(startNewGameDescriptionText)
      this.container.addChild(newGameContainer)

      const viewHistoryContainer = new PIXI.Container()
      const reviewNotesText = new PIXI.Text('Review your notes', {
        fontFamily: 'Ubuntu',
        fill: '#333333',
        fontSize: 24
      })

      const reviewNotesDescriptionText = new PIXI.Text('View game stats and history', {
        fontFamily: 'OpenSans',
        fill: '#666666',
        fontSize: 14
      })

      reviewNotesDescriptionText.y = 25

      viewHistoryContainer.x = 35
      viewHistoryContainer.y = 270
      viewHistoryContainer.alpha = 0.35
      viewHistoryContainer.interactive = true
      viewHistoryContainer.buttonMode = true
      viewHistoryContainer.on('pointerup', () => {})
      viewHistoryContainer.addChild(reviewNotesText)
      viewHistoryContainer.addChild(reviewNotesDescriptionText)
      this.container.addChild(viewHistoryContainer)

      const scientistSprite = new PIXI.Sprite()
      scientistSprite.texture = resources.scientist.texture
      scientistSprite.anchor.set(1)
      scientistSprite.x = this.coordinator.width - 20
      scientistSprite.y = this.coordinator.height - 20
      scientistSprite.height = this.coordinator.height / 3
      scientistSprite.scale.x = scientistSprite.scale.y
      this.container.addChild(scientistSprite)
    }
    
    this.container = container
    const randomScientistIndex = Math.floor(Math.random() * scientistSprites.length)
    if (!PIXI.Loader.shared.resources.hasOwnProperty('scientist')) {
      PIXI.Loader.shared.add('scientist', scientistSprites[randomScientistIndex])
    }
    PIXI.Loader.shared.load(setup)
  }

  onStartNewGame() {
    this.coordinator.gotoScene(new Gameplay(this.app, this.coordinator))
  }

  onUpdate(delta) {}

  onFinish() {}
}
