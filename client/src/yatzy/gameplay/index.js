import * as PIXI from 'pixi.js'
import Game from './game'

export default class Gameplay {

  constructor(app, gotoScene, options = {}) {
    this.app = app
    this.gotoScene = gotoScene
    this.options = {...options}
  }

  onStart(container) {
    const setup = (loader, resources) => {
      // Roll button sprite
      this.rollButton = new PIXI.Sprite()
      this.rollButton.x = this.options.width / 2 - 40
      this.rollButton.y = this.options.height - 50
      this.rollButton.interactive = true
      this.rollButton.buttonMode = true
      // Add click handler and add to container
      this.rollButton.on('pointerup', () => this.onClickRollButton())
      this.container.addChild(this.rollButton)
      this.updateRollButtonTexture()

      // Scorecard container and sprites
      const scorecardContainer = new PIXI.Container()
      this.scorecard = [
        'aces', 'twos', 'threes', 'fours', 'fives', 'sixes'
      ].map((category) => {
        const sprite = new PIXI.Sprite()
        sprite.width = 200
        sprite.height = 40
        const leftColumnX = 0
        const rightColumnX = 200
        const rowOffsetY = 40
        switch (category) {
          case 'aces':
            sprite.x = leftColumnX
            sprite.y = 0
            break
          case 'twos':
            sprite.x = leftColumnX
            sprite.y = rowOffsetY
            break
          case 'threes':
            sprite.x = leftColumnX
            sprite.y = 2 * rowOffsetY
            break
          case 'fours':
            sprite.x = rightColumnX
            sprite.y = 0
            break
          case 'fives':
            sprite.x = rightColumnX
            sprite.y = rowOffsetY
            break
          case 'sixes':
            sprite.x = rightColumnX
            sprite.y = 2 * rowOffsetY
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
      scorecardContainer.y = 20
      scorecardContainer.width = this.options.width - 40
      scorecardContainer.scale.y = scorecardContainer.scale.x
      // Add the scaled scorecard container
      this.container.addChild(scorecardContainer)

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
      diceContainer.y = this.options.height - 140
      diceContainer.width = this.options.width - 40
      diceContainer.scale.y = diceContainer.scale.x
      // Add the scaled dice container
      this.container.addChild(diceContainer)
      
      this.updateRollButtonTexture()
      this.updateScorecardTexture()
      this.updateDiceTexture()
    }

    this.game = new Game()
    this.container = container
    PIXI.Loader.shared
      .load(setup)
  }

  updateRollButtonTexture() {
    // Button body
    const button = new PIXI.Graphics()
      .beginFill(0x999999)
      .lineStyle(2, 0x666666)
      .drawRect(0, 0, 100, 30)
      .lineStyle(0)
      .endFill()
    // Button text
    const buttonText = new PIXI.Text('-=[ roll ]=-', new PIXI.TextStyle({
      fontFamily: 'Comic Neue',
      fill: '#000000',
      fontSize: 18
    }))
    
    // Add text to button
    button.addChild(buttonText)
    const texture = this.app.renderer.generateTexture(button)
    this.rollButton.texture = texture
  }

  updateScorecardTexture() {
    for (let score of this.scorecard) {
      // Cell outline
      const cell = new PIXI.Graphics()
        .lineStyle(1, 0x000000)
        .drawRect(0, 0, 200, 40)
      const label = new PIXI.Text(score.category, new PIXI.TextStyle({
        fontFamily: 'Comic Neue',
        stroke: '#000000',
        fill: '#000000',
        fontSize: 24
      }))
      const points = new PIXI.Text(this.game.scorecard[score.category], new PIXI.TextStyle({
        fontFamily: 'Comic Neue',
        fill: '#000000',
        fontSize: 24
      }))
      label.roundPixels = true
      label.x = 5
      label.y = 5
      points.x = 140
      points.y = 5
      cell.addChild(label)
      cell.addChild(points)
      // Generate the texture and update sprite
      const texture = this.app.renderer.generateTexture(cell)
      score.sprite.texture = texture
    }
  }

  updateDiceTexture() {
    // Dice pips helper
    const pips = (n) => {
      const pipsText = new PIXI.Text(n, {fill: '#ffffff'})
      pipsText.anchor.set(0.5)
      pipsText.x = 50
      pipsText.y = 50
      return pipsText
    }

    for (let die of this.dice) {
      const face = new PIXI.Graphics()
      if (die.holding) {
        // Outline if holding
        face.lineStyle(4, 0x000000)
      }

      // Rounded square body
      const alpha = this.game.turnRolls === 0 ? 0.35 : 1
      face.beginFill(0xaa0000, alpha)
        .drawRoundedRect(0, 0, 100, 100, 12)
        .endFill()
        // Add the pips
        .addChild(pips(this.game.currentDice[die.index]))

      // Generate the texture and update sprite
      const texture = this.app.renderer.generateTexture(face)
      die.sprite.texture = texture
    }
  }

  onClickRollButton() {
    const holding = this.dice.map(die => die.holding)
    if (!this.game.canRoll(holding)) return
    this.game = this.game.roll(holding)
    this.updateDiceTexture()
  }

  onClickScorecard(category) {
    if (!this.game.canScore(category)) return
    this.game = this.game.score(category)
    for (let die of this.dice) {
      die.holding = false
    }

    this.updateScorecardTexture()
    this.updateDiceTexture()
  }

  onClickDice(die) {
    if (this.game.turnRolls === 0 || this.game.turnRolls === 3) return
    this.dice[die].holding = !this.dice[die].holding
    this.updateDiceTexture()
  }

  onUpdate(delta) {}

  onFinish() {}
}
