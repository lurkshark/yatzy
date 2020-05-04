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
        fontFamily: ['Ubuntu', 'sans-serif'],
        fill: '#333333',
        fontSize: 54
      })
      headerText.x = 35
      headerText.y = 25
      this.container.addChild(headerText)
      
      const startNewGameText = new PIXI.Text('Start a new experiment', {
        fontFamily: ['Ubuntu', 'sans-serif'],
        fill: '#333333',
        fontSize: 24
      })

      const startNewGameDescriptionText = new PIXI.Text('Play a fresh game of yatzy', {
        fontFamily: ['OpenSans', 'sans-serif'],
        fill: '#666666',
        fontSize: 14
      })

      startNewGameText.x = 35
      startNewGameText.y = 250
      startNewGameDescriptionText.x = 35
      startNewGameDescriptionText.y = 275
      startNewGameText.interactive = true
      startNewGameText.buttonMode = true
      startNewGameText.on('pointerup', () => this.onStartNewGame())
      this.container.addChild(startNewGameText)
      this.container.addChild(startNewGameDescriptionText)

      const reviewNotesText = new PIXI.Text('Review your notes', {
        fontFamily: ['Ubuntu', 'sans-serif'],
        fill: '#333333',
        fontSize: 24
      })

      const reviewNotesDescriptionText = new PIXI.Text('View game stats and history', {
        fontFamily: ['OpenSans', 'sans-serif'],
        fill: '#666666',
        fontSize: 14
      })

      reviewNotesText.x = 35
      reviewNotesText.y = 320
      reviewNotesDescriptionText.x = 35
      reviewNotesDescriptionText.y = 345
      reviewNotesText.interactive = true
      reviewNotesText.buttonMode = true
      reviewNotesText.on('pointerup', () => {})
      this.container.addChild(reviewNotesText)
      this.container.addChild(reviewNotesDescriptionText)

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
