import Game from '../data/game'

export default class GameplayManager {

  constructor(coordinator, view) {
    this.coordinator = coordinator
    this.view = view
  }

  start() {
    // Load most recent game and set view state
    this.holding = [false, false, false, false, false]
    this.selectedCategory = false
    this.game = new Game()
    
    this.view.showBackButton(this.game.id)
    this.view.showScorecard(this.game.scorecard)

    if (this.game.turnRolls > 0) {
      this.view.showDice(this.game.currentDice, this.holding)
      if (this.game.turnRolls < 3) {
        this.view.showRollAndScoreButtons(!!this.selectedCategory)
      } else {
        this.view.showOnlyScoreButton(!!this.selectedCategory)
      }
    } else {
      this.view.showDiceInactive(this.game.currentDice)
      this.view.showOnlyRollButton()
    }
  }

  selectCategory(category) {
    if (!this.game.canScore(category)) return
    this.selectedCategory = category
    const scorecardWithSelection = this.game.score(category).scorecard
    this.view.showScorecardWithSelection(scorecardWithSelection, category)
    if (this.game.turnRolls < 3) {
      this.view.showRollAndScoreButtons(true)
    } else {
      this.view.showOnlyScoreButton(true)
    }
  }

  score() {
    if (!this.game.canScore(this.selectedCategory)) return
    this.game = this.game.score(this.selectedCategory)
    this.holding = [false, false, false, false, false]
    this.selectedCategory = false
    this.view.showScorecard(this.game.scorecard)
    this.view.showTotal(this.game.upperSubtotal, this.game.bonuses, this.game.total)
    this.view.showDiceInactive(this.game.currentDice)
    this.view.showOnlyRollButton()
  }

  toggleHold(die) {
    if (this.game.turnRolls === 0) return
    this.holding[die] = !this.holding[die]
    this.view.showDice(this.game.currentDice, this.holding)
  }

  roll() {
    if (!this.game.canRoll(this.holding)) return
    this.game = this.game.roll(this.holding)
    this.selectedCategory = false
    this.view.showScorecard(this.game.scorecard)
    this.view.showDice(this.game.currentDice, this.holding)
    if (this.game.turnRolls < 3) {
      this.view.showRollAndScoreButtons(false)
    } else {
      this.view.showOnlyScoreButton(false)
    }
  }
}
