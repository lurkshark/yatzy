import Archive from '../data/archive'
import Game from '../data/game'

export default class GameplayManager {

  constructor(coordinator, view, options) {
    this.coordinator = coordinator
    this.localforage = coordinator.localforage
    this.view = view
    this.options = {gameId: null, ...options}
  }

  async start() {
    this.selectedCategory = null
    this.holding = [false, false, false, false, false]

    const archive = await Archive.Repository(this.localforage).load()
    if (this.options.gameId === null) {
      // Load most recent game or register a new one
      const currentGame = archive.currentGame
      this.game = currentGame === null || currentGame.done
        ? await Game.Repository(this.localforage).save(new Game())
        : currentGame
    } else {
      // Load the given game and display the state
      this.game = await Game.Repository(this.localforage).load(this.options.gameId)
      if (this.game == null) throw new Error(`No game with gameId: ${this.options.gameId}`)
    }

    // Make sure the game is registered with the archive
    const updatedArchive = archive.registerGame(this.game)
    await Archive.Repository(this.localforage).save(updatedArchive)

    this.view.showBackButton(this.game.id)
    this.view.showScorecard(this.game.scorecard)
    this.view.showTotal(this.game.upperSubtotal, this.game.bonuses, this.game.total)
    this.updateDiceAndButtonsView()
  }

  selectCategory(category) {
    if (!this.game.canScore(category)) return
    this.selectedCategory = category
    const scorecardWithSelection = this.game.score(category).scorecard
    this.view.showScorecardWithSelection(scorecardWithSelection, category)
    this.updateDiceAndButtonsView()
  }

  score() {
    if (!this.game.canScore(this.selectedCategory)) return
    this.game = this.game.score(this.selectedCategory)
    this.selectedCategory = null
    this.holding = [false, false, false, false, false]
    this.saveGame() // async
    // Update view elements
    this.view.showScorecard(this.game.scorecard)
    this.view.showTotal(this.game.upperSubtotal, this.game.bonuses, this.game.total)
    this.updateDiceAndButtonsView()
  }

  toggleHold(die) {
    if (this.game.turnRolls === 0) return
    this.holding[die] = !this.holding[die]
    this.updateDiceAndButtonsView()
  }

  roll() {
    if (!this.game.canRoll(this.holding)) return
    this.game = this.game.roll(this.holding)
    this.selectedCategory = null
    this.saveGame() // async
    // Update view elements
    this.view.showScorecard(this.game.scorecard)
    this.updateDiceAndButtonsView()
  }

  updateDiceAndButtonsView() {
    // The dice and bottoms buttons depend on the turn rolls
    if (this.game.turnRolls > 0) { // Implies game is not done
      this.view.showDice(this.game.currentDice, this.holding)
      if (this.game.turnRolls < 3) { // On first or second roll
        this.view.showRollAndScoreButtons(this.selectedCategory !== null)
      } else { // After third/last roll
        this.view.showOnlyScoreButton(this.selectedCategory !== null)
      }
    } else { // May be beginning of turn or game is done
      this.view.showDiceInactive(this.game.currentDice)
      if (this.game.done) { // Game is done
        this.view.showOnlyInactiveRollButton()
      } else { // Beginning of new turn
        this.view.showOnlyRollButton()
      }
    }
  }

  saveGame() {
    return Game.Repository(this.localforage).save(this.game)
  }
}
