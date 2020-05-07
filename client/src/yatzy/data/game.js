import speakeasy from 'speakeasy'

export default class Game {

  constructor(
      seed = speakeasy
        .generateSecret()
        .base32,
      turnRolls = 0,
      totalDiceRolls = 0,
      currentDice = [1, 2, 3, 4, 5],
      scorecard = {},
      bonuses = 0) {
    this.seed = seed
    this.turnRolls = turnRolls
    this.totalDiceRolls = totalDiceRolls
    this.currentDice = [...currentDice]
    this.scorecard = {...scorecard}
    this.bonuses = 0
  }

  static get Categories() {
    return {
      ACES: 0, TWOS: 1, THREES: 2, FOURS: 3, FIVES: 4, SIXES: 5,
      THREE_OF_A_KIND: 6, FOUR_OF_A_KIND: 7, FULL_HOUSE: 8,
      SMALL_STRAIGHT: 9, LARGE_STRAIGHT: 10,
      YATZY: 11, CHANCE: 12
    }
  }

  static load(id) {
    // TODO: Load from localforage
  }

  save() {
    // TODO: Save to localforage
  }

  canRoll(hold) {
    return (
      !this.done
      && this.turnRolls < 3
      && hold.length === 5
      && (
        hold.every(k => !k)
        || this.turnRolls > 0
      )
    )
  }

  roll(hold) {
    if (!this.canRoll(hold)) return false
    const newCurrentDice = [...this.currentDice]
    const diceValue = (offset) => {
      const otp = +speakeasy.hotp({
        secret: this.seed,
        counter: offset
      })

      return (otp % 6) + 1
    }

    let newTotalDiceRolls = this.totalDiceRolls
    for (let i = 0; i < 5; i += 1) {
      if (!hold[i]) {
        newCurrentDice[i] = diceValue(newTotalDiceRolls)
        newTotalDiceRolls++
      }
    }

    return new Game(
      this.seed,
      this.turnRolls + 1,
      newTotalDiceRolls,
      newCurrentDice,
      this.scorecard,
      this.bonuses
    )
  }

  hasScore(category) {
    return this.scorecard.hasOwnProperty(category)
  }

  canScore(category) {
    return (
      !this.done
      && this.turnRolls > 0
      && !this.hasScore(category)
      && Object.values(Game.Categories).includes(category)
      // && enforce joker rules
    )
  }

  score(category) {
    if (!this.canScore(category)) return false
    const isYatzy = this.currentDice.every((die, _, dice) => die === dice[0])
    const newScorecard = {...this.scorecard}
    let tally = {} // Used for reduce
    switch (category) {
      case Game.Categories.ACES:
        newScorecard[category] = this.currentDice.reduce((acc, die) => {
          return die === 1 ? acc + 1 : acc
        }, 0)
        break
      case Game.Categories.TWOS:
        newScorecard[category] = this.currentDice.reduce((acc, die) => {
          return die === 2 ? acc + 2 : acc
        }, 0)
        break
      case Game.Categories.THREES:
        newScorecard[category] = this.currentDice.reduce((acc, die) => {
          return die === 3 ? acc + 3 : acc
        }, 0)
        break
      case Game.Categories.FOURS:
        newScorecard[category] = this.currentDice.reduce((acc, die) => {
          return die === 4 ? acc + 4 : acc
        }, 0)
        break
      case Game.Categories.FIVES:
        newScorecard[category] = this.currentDice.reduce((acc, die) => {
          return die === 5 ? acc + 5 : acc
        }, 0)
        break
      case Game.Categories.SIXES:
        newScorecard[category] = this.currentDice.reduce((acc, die) => {
          return die === 6 ? acc + 6 : acc
        }, 0)
        break
      case Game.Categories.THREE_OF_A_KIND:
        tally = this.currentDice.reduce((acc, die) => {
          acc.sum += die
          acc.counts[die] += 1
          acc.valid = acc.valid || acc.counts[die] === 3
          return acc
        }, {sum: 0, valid: false, counts: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}})
        newScorecard[category] = tally.valid ? tally.sum : 0
        break
      case Game.Categories.FOUR_OF_A_KIND:
        tally = this.currentDice.reduce((acc, die) => {
          acc.sum += die
          acc.counts[die] += 1
          acc.valid = acc.valid || acc.counts[die] === 4
          return acc
        }, {sum: 0, valid: false, counts: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}})
        newScorecard[category] = tally.valid ? tally.sum : 0
        break
      case Game.Categories.FULL_HOUSE:
        tally = this.currentDice.reduce((acc, die) => {
          acc.counts[die] += 1
          const counts = Object.values(acc.counts)
          acc.valid = acc.valid || (
            counts.includes(3)
            && counts.includes(2)
          )
          return acc
        }, {valid: false, counts: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}})
        newScorecard[category] = tally.valid ? 25 : 0
        break
      case Game.Categories.SMALL_STRAIGHT:
        tally = this.currentDice.reduce((acc, die) => {
          acc[die] = true
          acc.valid = acc.valid || [
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6]
          ].some(straight => straight.every(value => acc.hasOwnProperty(value)))
          return acc
        }, {valid: false})
        newScorecard[category] = tally.valid ? 30 : 0
        break
      case Game.Categories.LARGE_STRAIGHT:
        tally = this.currentDice.reduce((acc, die) => {
          acc[die] = true
          acc.valid = acc.valid || [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6]
          ].some(straight => straight.every(value => acc.hasOwnProperty(value)))
          return acc
        }, {valid: false})
        newScorecard[category] = tally.valid ? 40 : 0
        break
      case Game.Categories.YATZY:
        newScorecard[category] = isYatzy ? 50 : 0
        break
      case Game.Categories.CHANCE:
        newScorecard[category] = this.currentDice.reduce((acc, die) => {
          return acc + die
        }, 0)
        break
    }

    const newBonuses = this.bonuses += (
      isYatzy
      && this.scorecard.hasOwnProperty(Game.Categories.YATZY)
      && this.scorecard[Game.Categories.YATZY] > 0
      && this.bonuses < 3
    ) ? 1 : 0

    return new Game(
      this.seed,
      0,
      this.totalDiceRolls,
      this.currentDice,
      newScorecard,
      newBonuses
    )
  }

  get id() {
    return speakeasy.hotp({
      secret: this.seed,
      counter: 0
    })
  }

  get done() {
    return Object.values(Game.Categories).every(k => this.scorecard.hasOwnProperty(k))
  }

  get upperSubtotal() {
    return [
      Game.Categories.ACES, Game.Categories.TWOS, Game.Categories.THREES,
      Game.Categories.FOURS, Game.Categories.FIVES, Game.Categories.SIXES
    ].reduce((acc, category) => acc + (this.scorecard[category] || 0), 0)
  }

  get lowerSubtotal() {
    return [
      Game.Categories.THREE_OF_A_KIND, Game.Categories.FOUR_OF_A_KIND,
      Game.Categories.FULL_HOUSE, Game.Categories.SMALL_STRAIGHT,
      Game.Categories.LARGE_STRAIGHT, Game.Categories.YATZY,
      Game.Categories.CHANCE
    ].reduce((acc, category) => acc + (this.scorecard[category] || 0), 0)
  }

  get total() {
    return this.upperSubtotal + this.lowerSubtotal
      + (this.upperSubtotal > 62 ? 35 : 0)
      + (this.scorecard.bonus * 100 || 0)
  }
}
