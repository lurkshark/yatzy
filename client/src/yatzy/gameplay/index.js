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
      this.rollButton.x = 20
      this.rollButton.width = this.options.width - 40
      this.rollButton.y = this.options.height - 60
      this.rollButton.height = 40
      this.rollButton.interactive = true
      this.rollButton.buttonMode = true
      // Add click handler and add to container
      this.rollButton.on('pointerup', () => this.onClickRollButton())
      this.container.addChild(this.rollButton)
      this.updateRollButtonTexture()

      // Scorecard container and sprites
      const scorecardContainer = new PIXI.Container()
      this.scorecard = [
        'aces', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeOfAKind', 'fourOfAKind'
      ].map((category) => {
        const sprite = new PIXI.Sprite()
        sprite.width = 180
        sprite.height = 36
        switch (category) {
          case 'aces':
            sprite.x = 0
            sprite.y = 0
            break
          case 'twos':
            sprite.x = 0
            sprite.y = sprite.height
            break
          case 'threes':
            sprite.x = 0
            sprite.y = 2 * sprite.height
            break
          case 'fours':
            sprite.x = sprite.width
            sprite.y = 0
            break
          case 'fives':
            sprite.x = sprite.width
            sprite.y = sprite.height
            break
          case 'sixes':
            sprite.x = sprite.width
            sprite.y = 2 * sprite.height
            break
          case 'threeOfAKind':
            sprite.x = 0
            sprite.y = 4 * sprite.height
            break
          case 'fourOfAKind':
            sprite.x = 0
            sprite.y = 5 * sprite.height
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
      .lineStyle(1, 0x666666)
      .drawRoundedRect(0, 0, 400, 40, 2)
      .lineStyle(0)
      .beginFill(0xdddddd)
      .drawRect(1, 1, 400, 1)
      .drawRect(1, 1, 1, 40)
      .endFill()
    // Button text
    const buttonText = new PIXI.Text('-=[ ROLL ]=-', new PIXI.TextStyle({
      fontFamily: 'Comic Neue',
      fill: '#000000',
      fontWeight: 700,
      fontSize: 18
    }))
    buttonText.anchor.set(0.5)
    buttonText.x = 200
    buttonText.y = 20
    
    // Add text to button
    button.addChild(buttonText)
    const texture = this.app.renderer.generateTexture(button)
    this.rollButton.texture = texture
  }

  updateScorecardTexture() {
    for (let score of this.scorecard) {
      // Cell outline
      const cell = new PIXI.Graphics()
        .beginFill(0xffffff)
        .lineStyle(1, 0x000000)
        .drawRect(0, 0, 180, 36)
        .endFill()
      const label = new PIXI.Text(score.category, new PIXI.TextStyle({
        fontFamily: 'Comic Neue',
        fill: '#000000',
        fontSize: 24
      }))
      const points = new PIXI.Text(this.game.scorecard[score.category], new PIXI.TextStyle({
        fontFamily: 'Comic Neue',
        fill: '#000000',
        fontSize: 24
      }))
      label.x = 5
      label.y = 5
      points.x = 150
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
      const body = new PIXI.Graphics()
      body.beginFill(0xffffff)
      // Top left
      if ([3, 4, 5, 6].includes(n)) {
        body.drawCircle(28, 28, 8)
      }
      // Top right
      if ([2, 4, 5, 6].includes(n)) {
        body.drawCircle(72, 28, 8)
      }
      // Bottom left
      if ([2, 4, 5, 6].includes(n)) {
        body.drawCircle(28, 72, 8)
      }
      // Bottom right
      if ([3, 4, 5, 6].includes(n)) {
        body.drawCircle(72, 72, 8)
      }
      // Middle
      if ([1, 3, 5].includes(n)) {
        body.drawCircle(50, 50, 8)
      }
      // Left and right
      if (n === 6) {
        body.drawCircle(28, 50, 8)
        body.drawCircle(72, 50, 8)
      }

      return body
    }

    for (let die of this.dice) {
      const face = new PIXI.Graphics()
      const value = this.game.currentDice[die.index]
      const isActive = this.game.turnRolls > 0 && !this.game.done

      // Outline if holding
      if (die.holding) {
        face.lineStyle(8, 0xffff00)
      }

      // Rounded square body
      face.beginFill(isActive ? 0xaa0000 : 0x660000)
        .drawRoundedRect(0, 0, 100, 100, 12)
        .lineStyle(0)
        .endFill()

      // Draw the pips
      face.beginFill(isActive ? 0xffffff : 0xcccccc)
      // Top left
      if ([3, 4, 5, 6].includes(value)) {
        face.drawCircle(28, 28, 8)
      }
      // Top right
      if ([2, 4, 5, 6].includes(value)) {
        face.drawCircle(72, 28, 8)
      }
      // Bottom left
      if ([2, 4, 5, 6].includes(value)) {
        face.drawCircle(28, 72, 8)
      }
      // Bottom right
      if ([3, 4, 5, 6].includes(value)) {
        face.drawCircle(72, 72, 8)
      }
      // Middle
      if ([1, 3, 5].includes(value)) {
        face.drawCircle(50, 50, 8)
      }
      // Left and right
      if (value === 6) {
        face.drawCircle(28, 50, 8)
        face.drawCircle(72, 50, 8)
      }
      // End pips
      face.endFill()

      // Generate the texture and update sprite
      const texture = this.app.renderer.generateTexture(face)
      die.sprite.texture = texture
    }
  }

  onClickRollButton() {
    const holding = this.dice.map(die => die.holding)
    if (!this.game.canRoll(holding)) return
    this.game = this.game.roll(holding)
    this.updateRollButtonTexture()
    this.updateDiceTexture()
  }

  onClickScorecard(category) {
    if (!this.game.canScore(category)) return
    this.game = this.game.score(category)
    for (let die of this.dice) {
      die.holding = false
    }

    this.updateRollButtonTexture()
    this.updateScorecardTexture()
    this.updateDiceTexture()
  }

  onClickDice(die) {
    if (this.game.turnRolls === 0) return
    this.dice[die].holding = !this.dice[die].holding
    this.updateDiceTexture()
  }

  onUpdate(delta) {}

  onFinish() {}
}
