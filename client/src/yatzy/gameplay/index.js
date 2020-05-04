import * as PIXI from 'pixi.js'
import Menu from '../menu'
import Game from './game'
import scorecardTextures from './scorecardTextures'
import diceTextures from './diceTextures'

export default class Gameplay {

  constructor(app, coordinator) {
    this.app = app
    this.coordinator = coordinator
  }

  onStart(container) {
    const setup = (loader, resources) => {
      this.backButton = new PIXI.Sprite()
      this.backButton.x = 20
      this.backButton.y = 20
      this.backButton.interactive = true
      this.backButton.buttonMode = true
      // Add click handler and add to container
      this.backButton.on('pointerup', () => this.onClickBackButton())
      this.container.addChild(this.backButton)
      this.updateBackButtonTexture()


      // Roll button sprite
      this.rollButton = new PIXI.Sprite()
      this.rollButton.x = 20
      this.rollButton.y = this.coordinator.height - 70
      this.rollButton.interactive = true
      this.rollButton.buttonMode = true
      // Add click handler and add to container
      this.rollButton.on('pointerup', () => this.onClickRollButton())
      this.container.addChild(this.rollButton)
      this.updateRollButtonTexture()

      // Score button sprite
      this.scoreButton = new PIXI.Sprite()
      this.scoreButton.x = this.coordinator.width / 2 + 10
      this.scoreButton.y = this.coordinator.height - 70
      this.scoreButton.interactive = true
      this.scoreButton.buttonMode = true
      // Add click handler and add to container
      this.scoreButton.on('pointerup', () => this.onClickScoreButton())
      this.container.addChild(this.scoreButton)
      this.updateScoreButtonTexture()

      // Scorecard container and sprites
      const scorecardContainer = new PIXI.Container()
      this.scorecard = [
        'aces', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeOfAKind', 'fourOfAKind', 'fullHouse',
        'smallStraight', 'largeStraight',
        'yatzy', 'chance'
      ].map((category) => {
        const sprite = new PIXI.Sprite()
        const columnOffset = (this.coordinator.width - 60) / 2 + 20
        const rowOffset = 42
        let label, description
        switch (category) {
          case 'aces':
            sprite.x = 0
            sprite.y = 0
            break
          case 'twos':
            sprite.x = 0
            sprite.y = rowOffset
            break
          case 'threes':
            sprite.x = 0
            sprite.y = 2 * rowOffset
            break
          case 'fours':
            sprite.x = 0
            sprite.y = 3 * rowOffset
            break
          case 'fives':
            sprite.x = 0
            sprite.y = 4 * rowOffset
            break
          case 'sixes':
            sprite.x = 0
            sprite.y = 5 * rowOffset
            break
          case 'threeOfAKind':
            sprite.x = columnOffset
            sprite.y = 0
            break
          case 'fourOfAKind':
            sprite.x = columnOffset
            sprite.y = rowOffset
            break
          case 'fullHouse':
            sprite.x = columnOffset
            sprite.y = 2 * rowOffset
            break
          case 'smallStraight':
            sprite.x = columnOffset
            sprite.y = 3 * rowOffset
            break
          case 'largeStraight':
            sprite.x = columnOffset
            sprite.y = 4 * rowOffset
            break
          case 'yatzy':
            sprite.x = columnOffset
            sprite.y = 5 * rowOffset
            break
          case 'chance':
            sprite.x = columnOffset
            sprite.y = 6 * rowOffset
            break
        }
        sprite.interactive = true
        sprite.buttonMode = true
        scorecardContainer.addChild(sprite)
        sprite.on('pointerup', () => this.onClickScorecard(category))
        return {category: category, sprite: sprite}
      })
      // Scale the scorecard container
      scorecardContainer.x = 20
      scorecardContainer.y = 50
      // Add the scaled scorecard container
      this.container.addChild(scorecardContainer)

      // Totals sprites
      this.upperTotalSprite = new PIXI.Sprite()
      this.upperTotalSprite.x = (this.coordinator.width - 60) / 2 - 30
      this.upperTotalSprite.y = 6 * 42 + 60
      //this.container.addChild(this.upperTotalSprite)
      this.totalSprite = new PIXI.Sprite()
      this.totalSprite.x = this.coordinator.width - 90
      this.totalSprite.y = 7 * 42 + 60
      this.container.addChild(this.totalSprite)

      // Dice container and sprites
      const diceContainer = new PIXI.Container()
      this.dice = [0, 1, 2, 3, 4].map((die) => {
        const sprite = new PIXI.Sprite()
        sprite.width = 100
        sprite.height = 100
        sprite.x = die * 120
        sprite.interactive = true
        sprite.buttonMode = true
        diceContainer.addChild(sprite)
        sprite.on('pointerup', () => this.onClickDice(die))
        return {index: die, holding: false, sprite: sprite}
      })
      // Scale the dice container
      diceContainer.x = 20
      diceContainer.width = this.coordinator.width - 40
      diceContainer.scale.y = diceContainer.scale.x
      diceContainer.y = this.coordinator.height - diceContainer.height - 90
      // Add the scaled dice container
      this.container.addChild(diceContainer)
      
      this.updateRollButtonTexture()
      this.updateScorecardTexture()
      this.updateTotalsTexture()
      this.updateDiceTexture()
    }

    this.game = new Game()
    this.container = container
    PIXI.Loader.shared.load(setup)
  }

  updateBackButtonTexture() {
    // Button body
    const button = new PIXI.Graphics()
      .drawRect(0, 0, 290, 20)
      .lineStyle({width: 1, color: 0x666666})
      .moveTo(0, 10).lineTo(12, 10)
      .moveTo(0, 10).lineTo(5, 5)
      .moveTo(0, 10).lineTo(5, 15)
    const headerText = new PIXI.Text('Yatzy Laboratory', {
      fontFamily: ['Ubuntu', 'sans-serif'],
      fill: '#333333',
      fontSize: 16
    })
    const subHeaderText = new PIXI.Text('Experiment #612710', {
      fontFamily: ['OpenSans', 'sans-serif'],
      fill: '#666666',
      fontSize: 12
    })
    headerText.x = 20
    headerText.y = 0
    subHeaderText.x = 148
    subHeaderText.y = 3
    button.addChild(headerText)
    button.addChild(subHeaderText)
    const texture = this.app.renderer.generateTexture(button)
    this.backButton.texture = texture
  }

  updateRollButtonTexture() {
    // Button body
    const isVisible = this.game.turnRolls < 3 && !this.game.done
    const isFullWidth = this.game.turnRolls === 0 && false
    const isActive = isVisible

    const buttonWidth = isFullWidth
      ? this.coordinator.width - 40
      : (this.coordinator.width - 40) / 2 - 10
    const button = new PIXI.Graphics()
      .beginFill(0x4268a2, isActive ? 1 : 0.35)
      .drawRoundedRect(0, 0, buttonWidth, 50, 4)
      .endFill()
    // Button text
    const buttonText = new PIXI.Text('Roll', {
      fontFamily: ['OpenSans', 'sans-serif'],
      fill: '#ffffff',
      fontSize: 18
    })
    buttonText.anchor.set(0.5)
    buttonText.x = buttonWidth / 2
    buttonText.y = 25
    
    // Add text to button
    button.addChild(buttonText)
    const texture = this.app.renderer.generateTexture(button)
    this.rollButton.texture = texture
  }

  updateScoreButtonTexture() {
    // Button body
    const isVisible = this.game.turnRolls > 0 && !this.game.done
    const isFullWidth = this.game.turnRolls === 3 && false
    const isActive = isVisible && !!this.selectedCategory

    const buttonWidth = isFullWidth
      ? this.coordinator.width - 40
      : (this.coordinator.width - 40) / 2 - 10
    const button = new PIXI.Graphics()
      .beginFill(0xb25d96, isActive ? 1 : 0.35)
      .drawRoundedRect(0, 0, buttonWidth, 50, 4)
      .endFill()
    // Button text
    const buttonText = new PIXI.Text('Score', {
      fontFamily: ['OpenSans', 'sans-serif'],
      fill: '#ffffff',
      fontSize: 18
    })
    buttonText.anchor.set(0.5)
    buttonText.x = buttonWidth / 2
    buttonText.y = 25
    
    // Add text to button
    button.addChild(buttonText)
    const texture = this.app.renderer.generateTexture(button)
    this.scoreButton.texture = texture
  }

  updateScorecardTexture() {
    for (let score of this.scorecard) {
      // Generate the texture and update sprite
      const width = (this.coordinator.width - 60) / 2
      const isSelected = this.selectedCategory === score.category
      const cell = scorecardTextures(width, this.game, score.category, isSelected)
      const texture = this.app.renderer.generateTexture(cell)
      score.sprite.texture = texture
    }
  }

  updateTotalsTexture() {
    const upper = new PIXI.Container()
    upper.addChild(
      new PIXI.Text(this.game.upperSubtotal, {
        fontFamily: ['OpenSans', 'sans-serif'],
        fill: '#666666',
        fontSize: 38
      })
    )

    const upperTexture = this.app.renderer.generateTexture(upper)
    this.upperTotalSprite.texture = upperTexture
    
    const total = new PIXI.Container()
    total.addChild(
      new PIXI.Text(this.game.total, {
        fontFamily: ['OpenSans', 'sans-serif'],
        fill: '#333333',
        fontSize: 38
      })
    )

    const totalTexture = this.app.renderer.generateTexture(total)
    this.totalSprite.texture = totalTexture
  }

  updateDiceTexture() {
    for (let die of this.dice) {
      const value = this.game.currentDice[die.index] || die.index + 1
      const isActive = this.game.turnRolls > 0 && !this.game.done
      const face = diceTextures(value, isActive, die.holding)

      // Generate the texture and update sprite
      const texture = this.app.renderer.generateTexture(face)
      die.sprite.texture = texture
    }
  }

  onClickBackButton() {
    this.coordinator.gotoScene(new Menu(this.app, this.coordinator))
  }

  onClickRollButton() {
    const holding = this.dice.map(die => die.holding)
    if (!this.game.canRoll(holding)) return
    this.game = this.game.roll(holding)
    this.updateRollButtonTexture()
    this.updateDiceTexture()
  }

  onClickScoreButton() {
    if (!this.game.canScore(this.selectedCategory)) return
    this.game = this.game.score(this.selectedCategory)
    for (let die of this.dice) {
      die.holding = false
    }
    this.selectedCategory = false
    this.updateRollButtonTexture()
    this.updateScoreButtonTexture()
    this.updateScorecardTexture()
    this.updateDiceTexture()
    this.updateTotalsTexture()
  }

  onClickScorecard(category) {
    if (!this.game.canScore(category)) return
    this.selectedCategory = category
    this.updateScoreButtonTexture()
    this.updateScorecardTexture()
  }

  onClickDice(die) {
    if (this.game.turnRolls === 0) return
    this.dice[die].holding = !this.dice[die].holding
    this.updateDiceTexture()
  }

  onUpdate(delta) {}

  onFinish() {}
}
