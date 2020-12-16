import * as PIXI from 'pixi.js'
import MenuManager from './manager'
import Gameplay from '../gameplay'
import History from '../history'
import {scientistSprites} from './assets'

export default class Menu {

  constructor(coordinator) {
    this.app = coordinator.app
    this.coordinator = coordinator
    this.manager = new MenuManager(coordinator, this)
  }

  onStart(container) {
    return new Promise((resolve) => {
      const setup = async (loader, resources) => {
        this.headerSprite = new PIXI.Sprite()
        container.addChild(this.headerSprite)
        this.updateHeaderSprite()

        this.startGameButton = new PIXI.Sprite()
        this.startGameButton.on('pointerup', () => {
          this.coordinator.gotoScene(new Gameplay(this.coordinator))
        })
        container.addChild(this.startGameButton)

        this.loadChallengeButton = new PIXI.Sprite()
        container.addChild(this.loadChallengeButton)
        this.updateLoadChallengeButton()

        this.reviewHistoryButton = new PIXI.Sprite()
        this.reviewHistoryButton.on('pointerup', () => {
          this.coordinator.gotoScene(new History(this.coordinator))
        })
        container.addChild(this.reviewHistoryButton)
        this.updateReviewHistoryButton()

        this.scientistSprite = new PIXI.Sprite()
        container.addChild(this.scientistSprite)
        this.updateScientistSprite(resources.scientist.texture)

        await this.manager.start()
        resolve()
      }

      const randomScientistIndex = Math.floor(Math.random() * scientistSprites.length)
      if (!PIXI.Loader.shared.resources.hasOwnProperty('scientist')) {
        PIXI.Loader.shared.add('scientist', scientistSprites[randomScientistIndex])
      }
      PIXI.Loader.shared.load(setup)
    })
  }

  updateHeaderSprite() {
    const headerText = new PIXI.Text('Yatzy\nLaboratory', {
      fontFamily: 'Ubuntu',
      fill: '#333333',
      fontSize: 54
    })
    this.headerSprite.x = 15
    this.headerSprite.y = 5
    const texture = this.app.renderer.generateTexture(headerText)
    this.headerSprite.texture = texture
  }

  updateStartGameButton(isGameInProgress) {
    const startGameContainer = new PIXI.Container()
    const textContent = isGameInProgress
      ? 'Continue last experiment'
      : 'Start a new experiment'
    const startGameText = new PIXI.Text(textContent, {
      fontFamily: 'Ubuntu',
      fill: '#333333',
      fontSize: 24
    })

    const descriptionTextContent = isGameInProgress
      ? 'Resume your ongoing yatzy game'
      : 'Play a fresh game of yatzy'
    const startGameDescriptionText = new PIXI.Text(descriptionTextContent, {
      fontFamily: 'OpenSans',
      fill: '#666666',
      fontSize: 14
    })

    startGameDescriptionText.y = 25
    startGameContainer.addChild(startGameText)
    startGameContainer.addChild(startGameDescriptionText)

    this.startGameButton.x = 15
    this.startGameButton.y = 155
    this.startGameButton.interactive = true
    this.startGameButton.buttonMode = true
    const texture = this.app.renderer.generateTexture(startGameContainer)
    this.startGameButton.texture = texture
  }

  showStartNewExperimentButton() {
    this.updateStartGameButton(false)
  }

  showContinueExperimentButton() {
    this.updateStartGameButton(true)
  }

  updateLoadChallengeButton() {
    const loadChallengeContainer = new PIXI.Container()
    const loadChallengeText = new PIXI.Text('Reproduce an experiment', {
      fontFamily: 'Ubuntu',
      fill: '#333333',
      fontSize: 24
    })

    const loadChallengeDescriptionText = new PIXI.Text('Load a game challenge from a friend', {
      fontFamily: 'OpenSans',
      fill: '#666666',
      fontSize: 14
    })

    loadChallengeDescriptionText.y = 25
    loadChallengeContainer.addChild(loadChallengeText)
    loadChallengeContainer.addChild(loadChallengeDescriptionText)

    this.loadChallengeButton.x = 15
    this.loadChallengeButton.y = 220
    this.loadChallengeButton.alpha = 0.35
    this.loadChallengeButton.interactive = true
    this.loadChallengeButton.buttonMode = true
    const texture = this.app.renderer.generateTexture(loadChallengeContainer)
    this.loadChallengeButton.texture = texture
  }

  updateReviewHistoryButton() {
    const reviewHistoryContainer = new PIXI.Container()
    const reviewHistoryText = new PIXI.Text('Review your notes', {
      fontFamily: 'Ubuntu',
      fill: '#333333',
      fontSize: 24
    })

    const reviewHistoryDescriptionText = new PIXI.Text('View game stats and history', {
      fontFamily: 'OpenSans',
      fill: '#666666',
      fontSize: 14
    })

    reviewHistoryDescriptionText.y = 25
    reviewHistoryContainer.addChild(reviewHistoryText)
    reviewHistoryContainer.addChild(reviewHistoryDescriptionText)

    this.reviewHistoryButton.x = 15
    this.reviewHistoryButton.y = 285
    this.reviewHistoryButton.interactive = true
    this.reviewHistoryButton.buttonMode = true
    const texture = this.app.renderer.generateTexture(reviewHistoryContainer)
    this.reviewHistoryButton.texture = texture
  }

  updateScientistSprite(scientistTexture) {
    this.scientistSprite.anchor.set(1)
    this.scientistSprite.x = this.coordinator.width
    this.scientistSprite.y = this.coordinator.height
    this.scientistSprite.texture = scientistTexture
    this.scientistSprite.height = this.coordinator.height / 3
    this.scientistSprite.scale.x = this.scientistSprite.scale.y
  }

  onUpdate(delta) {}

  onFinish() {}
}
