import * as PIXI from 'pixi.js'
import GameplayManager from './manager'
import scorecardTextureHelper from './scorecardTextureHelper'
import diceTextureHelper from './diceTextureHelper'
import Game from '../data/game'
import Menu from '../menu'

export default class Gameplay {

  constructor(coordinator) {
    this.app = coordinator.app
    this.coordinator = coordinator
    this.manager = new GameplayManager(coordinator, this)
  }

  onStart(container) {
    const setup = (loader, resources) => {
      // Top header and back button
      this.backButton = new PIXI.Sprite()
      this.backButton.on('pointerup', () => {
        this.coordinator.gotoScene(new Menu(this.coordinator))
      })
      container.addChild(this.backButton)
      
      // Scorecard sprites table
      this.scorecardSprites = {}
      for (let category of Object.values(Game.Categories)) {
        const sprite = new PIXI.Sprite()
        sprite.on('pointerdown', () => {
          this.manager.selectCategory(category)
        })
        container.addChild(sprite)
        this.scorecardSprites[category] = sprite
      }

      // Total sprite
      this.upperTotalSprite = new PIXI.Sprite()
      container.addChild(this.upperTotalSprite)
      this.totalSprite = new PIXI.Sprite()
      container.addChild(this.totalSprite)

      // Dice sprites
      this.diceSprites = {}
      for (let die = 0; die < 5; die += 1) {
        const sprite = new PIXI.Sprite()
        sprite.on('pointerdown', () => {
          this.manager.toggleHold(die)
        })
        container.addChild(sprite)
        this.diceSprites[die] = sprite
      }

      // Bottom roll dice button
      this.rollButton = new PIXI.Sprite()
      this.rollButton.on('pointerup', () => {
        this.manager.roll()
      })
      container.addChild(this.rollButton)

      // Bottom score button
      this.scoreButton = new PIXI.Sprite()
      this.scoreButton.on('pointerup', () => {
        this.manager.score()
      })
      container.addChild(this.scoreButton)

      // Let the manager know we're
      // all setup and ready to go
      this.manager.start()
    }

    // Load any assets and setup
    PIXI.Loader.shared.load(setup)
  }

  updateBackButton(gameId) {
    //console.log(`updateBackButton(${gameId})`)
    this.backButton.interactive = true
    this.backButton.buttonMode = true
    
    // Button body
    const button = new PIXI.Graphics()
      .drawRect(0, 0, 290, 20)
      .lineStyle({width: 1, color: 0x666666})
      .moveTo(0, 10).lineTo(12, 10)
      .moveTo(0, 10).lineTo(5, 5)
      .moveTo(0, 10).lineTo(5, 15)
    const headerText = new PIXI.Text('Yatzy Laboratory', {
      fontFamily: 'Ubuntu',
      fill: '#333333',
      fontSize: 16
    })
    const idText = `Experiment #${gameId}`
    const subHeaderText = new PIXI.Text(idText, {
      fontFamily: 'OpenSans',
      fill: '#666666',
      fontSize: 12
    })
    headerText.x = 20
    subHeaderText.x = 148
    subHeaderText.y = 3
    button.addChild(headerText)
    button.addChild(subHeaderText)
    const texture = this.app.renderer.generateTexture(button)
    this.backButton.texture = texture
  }

  showBackButton(gameId) {
    this.updateBackButton(gameId)
  }

  updateScorecardSprite(category, isSelected, points) {
    //console.log(`updateScorecardSprite(${category}, ${isSelected}, ${points})`)
    this.scorecardSprites[category].interactive = true
    this.scorecardSprites[category].buttonMode = true

    const spriteWidth = this.coordinator.width / 2 - 10
    const columnOffset = this.coordinator.width / 2 + 10
    const marginTop = 40
    const rowOffset = 42
    switch (category) {
      case Game.Categories.ACES:
        this.scorecardSprites[category].x = 0
        this.scorecardSprites[category].y = 0 + marginTop
        break
      case Game.Categories.TWOS:
        this.scorecardSprites[category].x = 0
        this.scorecardSprites[category].y = rowOffset + marginTop
        break
      case Game.Categories.THREES:
        this.scorecardSprites[category].x = 0
        this.scorecardSprites[category].y = 2 * rowOffset + marginTop
        break
      case Game.Categories.FOURS:
        this.scorecardSprites[category].x = 0
        this.scorecardSprites[category].y = 3 * rowOffset + marginTop
        break
      case Game.Categories.FIVES:
        this.scorecardSprites[category].x = 0
        this.scorecardSprites[category].y = 4 * rowOffset + marginTop
        break
      case Game.Categories.SIXES:
        this.scorecardSprites[category].x = 0
        this.scorecardSprites[category].y = 5 * rowOffset + marginTop
        break
      case Game.Categories.THREE_OF_A_KIND:
        this.scorecardSprites[category].x = columnOffset
        this.scorecardSprites[category].y = 0 + marginTop
        break
      case Game.Categories.FOUR_OF_A_KIND:
        this.scorecardSprites[category].x = columnOffset
        this.scorecardSprites[category].y = rowOffset + marginTop
        break
      case Game.Categories.FULL_HOUSE:
        this.scorecardSprites[category].x = columnOffset
        this.scorecardSprites[category].y = 2 * rowOffset + marginTop
        break
      case Game.Categories.SMALL_STRAIGHT:
        this.scorecardSprites[category].x = columnOffset
        this.scorecardSprites[category].y = 3 * rowOffset + marginTop
        break
      case Game.Categories.LARGE_STRAIGHT:
        this.scorecardSprites[category].x = columnOffset
        this.scorecardSprites[category].y = 4 * rowOffset + marginTop
        break
      case Game.Categories.YATZY:
        this.scorecardSprites[category].x = columnOffset
        this.scorecardSprites[category].y = 5 * rowOffset + marginTop
        break
      case Game.Categories.CHANCE:
        this.scorecardSprites[category].x = columnOffset
        this.scorecardSprites[category].y = 6 * rowOffset + marginTop
        break
    }
    const graphic = scorecardTextureHelper(spriteWidth, category, isSelected, points)
    const texture = this.app.renderer.generateTexture(graphic)
    this.scorecardSprites[category].texture = texture
  }

  showScorecard(scorecard) {
    for (let category of Object.values(Game.Categories)) {
      this.updateScorecardSprite(category, false, scorecard[category])
    }
  }

  showScorecardWithSelection(scorecardWithSelection, selectedCategory) {
    for (let category of Object.values(Game.Categories)) {
      const isSelected = category === selectedCategory
      const points = scorecardWithSelection[category]
      this.updateScorecardSprite(category, isSelected, points)
    }
  }

  updateUpperTotalSprite(upperSubtotal) {
    //console.log(`updateUpperTotalSprite(${upperSubtotal})`)
    const container = new PIXI.Container()
    const upperSubtotalText = new PIXI.Text(upperSubtotal, {
      fontFamily: 'OpenSans',
      fill: '#666666',
      fontSize: 22
    })
    container.addChild(upperSubtotalText)
    this.upperTotalSprite.x = upperSubtotal > 9
      ? this.coordinator.width / 2 - 40
      : this.coordinator.width / 2 - 28
    this.upperTotalSprite.y = 300
    const texture = this.app.renderer.generateTexture(container)
    this.upperTotalSprite.texture = texture
  }

  updateTotalSprite(upperSubtotal, yatzyBonusCount, total) {
    //console.log(`updateTotalSprite(${upperSubtotal}, ${yatzyBonusCount}, ${total})`)
    const container = new PIXI.Container()
    const totalText = new PIXI.Text(total, {
      fontFamily: 'OpenSans',
      fill: '#333333',
      fontSize: 38
    })
    container.addChild(totalText)
    this.totalSprite.x = total > 9
      ? total > 99
        ? this.coordinator.width - 70
        : this.coordinator.width - 50
      : this.coordinator.width - 30
    this.totalSprite.y = 350
    const texture = this.app.renderer.generateTexture(container)
    this.totalSprite.texture = texture
  }

  showTotal(upperSubtotal, yatzyBonusCount, total) {
    this.updateTotalSprite(upperSubtotal, yatzyBonusCount, total)
    this.updateUpperTotalSprite(upperSubtotal)
  }

  updateDiceSprite(die, value, isActive, isHolding) {
    //console.log(`updateDiceSprite(${die}, ${value}, ${isActive}, ${isHolding})`)
    this.diceSprites[die].interactive = true
    this.diceSprites[die].buttonMode = true

    const spriteWidth = this.coordinator.width / 6
    const columnOffset = spriteWidth + spriteWidth / 4
    this.diceSprites[die].x = die * columnOffset
    this.diceSprites[die].y = this.coordinator.height - spriteWidth - 70

    const graphic = diceTextureHelper(spriteWidth, value, isActive, isHolding)
    const texture = this.app.renderer.generateTexture(graphic)
    this.diceSprites[die].texture = texture
  }

  showDice(currentDice, holding) {
    for (let die = 0; die < 5; die += 1) {
      this.updateDiceSprite(die, currentDice[die], true, holding[die])
    }
  }

  showDiceInactive(currentDice) {
    for (let die = 0; die < 5; die += 1) {
      this.updateDiceSprite(die, currentDice[die], false, false)
    }
  }

  updateRollButton(isVisible, isActive, isFullWidth) {
    //console.log(`updateRollButton(${isVisible}, ${isActive}, ${isFullWidth})`)
    this.rollButton.interactive = true
    this.rollButton.buttonMode = true
    this.rollButton.y = this.coordinator.height - 50
    if (isVisible) {
      const buttonWidth = isFullWidth
        ? this.coordinator.width
        : this.coordinator.width / 2 - 10
      const button = new PIXI.Graphics()
        .beginFill(0x4268a2, isActive ? 1 : 0.35)
        .drawRoundedRect(0, 0, buttonWidth, 50, 4)
        .endFill()
      // Button text
      const buttonText = new PIXI.Text('Roll', {
        fontFamily: 'OpenSans',
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
    } else {
      this.rollButton.texture = PIXI.Texture.EMPTY
    }
  }

  updateScoreButton(isVisible, isActive, isFullWidth) {
    //console.log(`updateScoreButton(${isVisible}, ${isActive}, ${isFullWidth})`)
    this.scoreButton.interactive = true
    this.scoreButton.buttonMode = true
    this.scoreButton.x = isFullWidth
      ? 0
      : this.coordinator.width / 2 + 10
    this.scoreButton.y = this.coordinator.height - 50
    if (isVisible) {
      const buttonWidth = isFullWidth
        ? this.coordinator.width
        : this.coordinator.width / 2 - 10
      const button = new PIXI.Graphics()
        .beginFill(0xb25d96, isActive ? 1 : 0.35)
        .drawRoundedRect(0, 0, buttonWidth, 50, 4)
        .endFill()
      // Button text
      const buttonText = new PIXI.Text('Score', {
        fontFamily: 'OpenSans',
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
    } else {
      this.scoreButton.texture = PIXI.Texture.EMPTY
    }
  }

  showOnlyRollButton() {
    this.updateRollButton(true, true, true)
    this.updateScoreButton(false, false, false)
  }

  showOnlyInactiveRollButton() {
    this.updateRollButton(true, false, true)
    this.updateScoreButton(false, false, false)
  }

  showOnlyScoreButton(isActive) {
    this.updateRollButton(false, false, false)
    this.updateScoreButton(true, isActive, true)
  }

  showRollAndScoreButtons(scoreButtonIsActive) {
    this.updateRollButton(true, true, false)
    this.updateScoreButton(true, scoreButtonIsActive, false)
  }

  onUpdate(delta) {}

  onFinish() {}
}

