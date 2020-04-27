import * as PIXI from 'pixi.js'
import Menu from '../menu'
import Game from './game'

export default class Gameplay {

  constructor(app, coordinator) {
    this.app = app
    this.coordinator = coordinator
  }

  onStart(container) {
    const setup = (loader, resources) => {
      // Roll button sprite
      this.rollButton = new PIXI.Sprite()
      this.rollButton.x = 20
      this.rollButton.y = this.coordinator.height - 60
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
        'threeOfAKind', 'fourOfAKind', 'smallStraight', 'largeStraight',
        'yatzy', 'chance'
      ].map((category) => {
        const sprite = new PIXI.Sprite()
        const columnOffset = this.coordinator.width / 2 - 10
        const rowOffset = 42
        let label, description
        switch (category) {
          case 'aces':
            sprite.x = 0
            sprite.y = 0
            label = 'Aces'
            description = 'Add only ones'
            break
          case 'twos':
            sprite.x = 0
            sprite.y = rowOffset
            label = 'Twos'
            description = 'Add only twos'
            break
          case 'threes':
            sprite.x = 0
            sprite.y = 2 * rowOffset
            label = 'Threes'
            description = 'Add only threes'
            break
          case 'fours':
            sprite.x = columnOffset
            sprite.y = 0
            label = 'Fours'
            description = 'Add only fours'
            break
          case 'fives':
            sprite.x = columnOffset
            sprite.y = rowOffset
            label = 'Fives'
            description = 'Add only fives'
            break
          case 'sixes':
            sprite.x = columnOffset
            sprite.y = 2 * rowOffset
            label = 'Sixes'
            description = 'Add only sixes'
            break
          case 'threeOfAKind':
            sprite.x = 0
            sprite.y = 3 * rowOffset
            label = 'Three of a kind'
            description = 'Score total of all 5 dice'
            break
          case 'fourOfAKind':
            sprite.x = 0
            sprite.y = 4 * rowOffset
            label = 'Four of a kind'
            description = 'Score total of all 5 dice'
            break
          case 'fullHouse':
            sprite.x = 0
            sprite.y = 5 * rowOffset
            label = 'Full House'
            description = 'Score 25'
            break
          case 'smallStraight':
            sprite.x = 0
            sprite.y = 6 * rowOffset
            label = 'Small Straight'
            description = 'Score 30'
            break
          case 'largeStraight':
            sprite.x = 0
            sprite.y = 7 * rowOffset
            label = 'Large Straight'
            description = 'Score 40'
            break
          case 'yatzy':
            sprite.x = 0
            sprite.y = 8 * rowOffset
            label = 'Yatzy'
            description = 'Score 50'
            break
          case 'chance':
            sprite.x = 0
            sprite.y = 9 * rowOffset
            label = 'Chance'
            description = 'Score total of all 5 dice'
            break
        }
        sprite.interactive = true
        sprite.buttonMode = true
        scorecardContainer.addChild(sprite)
        sprite.on('pointerup', () => this.onClickScorecard(category))
        return {category: category, label: label, description: description,  sprite: sprite}
      })
      // Scale the scorecard container
      scorecardContainer.x = 20
      scorecardContainer.y = 20
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
      diceContainer.y = this.coordinator.height - 130
      diceContainer.width = this.coordinator.width - 40
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
    const isActive = this.game.turnRolls < 3 && !this.game.done
    const button = new PIXI.Graphics()
      .beginFill(isActive ? 0x6784b2 : 0xcbe2f8)
      .drawRoundedRect(0, 0, this.coordinator.width - 40, 40, 4)
      .endFill()
    // Button text
    const buttonText = new PIXI.Text('Roll', {
      fontFamily: 'OpenSans',
      fill: '#ffffff',
      fontSize: 18
    })
    buttonText.anchor.set(0.5)
    buttonText.x = (this.coordinator.width - 40) / 2
    buttonText.y = 20
    
    // Add text to button
    button.addChild(buttonText)
    const texture = this.app.renderer.generateTexture(button)
    this.rollButton.texture = texture
  }

  updateScorecardTexture() {
    for (let score of this.scorecard) {
      // Rectangle backing
      const width = [
        'threeOfAKind', 'fourOfAKind',
        'smallStraight', 'largeStraight',
        'yatzy', 'chance'
      ].includes(score.category)
        ? this.coordinator.width / 2 + 5
        : this.coordinator.width / 2 - 30
      const backing = new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawRect(0, 0, width, 42)
        .endFill()
      const icon = new PIXI.Graphics()
        .beginFill(0xa75b95)
        .drawRoundedRect(0, 6, 24, 24, 4)
        .endFill()
      const underline = new PIXI.Graphics()
        .lineStyle({width: 0.5, color: 0xcccccc})
        .moveTo(36, 38).lineTo(width, 38)
        .lineStyle(0)
      const label = new PIXI.Text(score.label, {
        fontFamily: 'Ubuntu',
        fill: '#181d33',
        fontSize: 14
      })
      const description = new PIXI.Text(score.description, {
        fontFamily: 'OpenSans',
        fill: '#666666',
        fontSize: 10
      })
      const pointsValue = this.game.scorecard[score.category]
      const points = new PIXI.Text(pointsValue, {
        fontFamily: 'OpenSans',
        fill: '#181d33',
        fontSize: 26
      })
      label.x = 34
      label.y = 4
      description.x = 34
      description.y = 20
      points.x = width - (pointsValue > 9 ? 34 : 20)
      points.y = 4
      backing.addChild(icon)
      backing.addChild(underline)
      backing.addChild(label)
      backing.addChild(description)
      backing.addChild(points)
      // Generate the texture and update sprite
      const texture = this.app.renderer.generateTexture(backing)
      score.sprite.texture = texture
    }
  }

  updateDiceTexture() {
    for (let die of this.dice) {
      const face = new PIXI.Graphics()
      const value = this.game.currentDice[die.index] || die.index + 1
      const isActive = this.game.turnRolls > 0 && !this.game.done

      // Outline if holding
      if (die.holding) {
        face.lineStyle(8, 0xcbe2f8)
      }

      // Rounded square body
      face.beginFill(isActive ? 0xa75b95 : 0xcb93a6)
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

    if (this.game.done) {
      setTimeout(() => {
        this.coordinator.gotoScene(new Menu(this.app, this.coordinator))
      }, 3000)
    }
  }

  onClickDice(die) {
    if (this.game.turnRolls === 0) return
    this.dice[die].holding = !this.dice[die].holding
    this.updateDiceTexture()
  }

  onUpdate(delta) {}

  onFinish() {}
}
