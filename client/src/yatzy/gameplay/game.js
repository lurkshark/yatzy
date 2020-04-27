import speakeasy from 'speakeasy'

const CATEGORIES = [
  'aces', 'twos', 'threes', 'fours', 'fives', 'sixes',
  'threeOfAKind', 'fourOfAKind', //'fullHouse',
  'smallStraight', 'largeStraight',
  'yatzy', 'chance'
]

export default class Game {

  constructor(
      seed = speakeasy
        .generateSecret()
        .base32,
      turnRolls = 0,
      totalDiceRolls = 0,
      currentDice = [0, 0, 0, 0, 0],
      scorecard = {}) {
    this.seed = seed
    this.turnRolls = turnRolls
    this.totalDiceRolls = totalDiceRolls
    this.currentDice = [...currentDice]
    this.scorecard = {...scorecard}
    this.done = CATEGORIES.every(k => this.scorecard.hasOwnProperty(k))
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
    let newTotalDiceRolls = this.totalDiceRolls
    const newCurrentDice = [...this.currentDice]
    const diceValue = (offset) => {
      const otp = +speakeasy.hotp({
        secret: this.seed,
        counter: offset
      })

      return (otp % 6) + 1
    }

    for (let i = 0; i < 5; i++) {
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
      this.scorecard
    )
  }

  canScore(category) {
    return (
      !this.done
      && this.turnRolls > 0
      && CATEGORIES.includes(category)
      && !this.scorecard.hasOwnProperty(category)
      // && enforce joker rules
    )
  }

  score(category) {
    if (!this.canScore(category)) return false
    const newScorecard = {...this.scorecard}
    let tally = {} // Used for reducing dice
    switch (category) {
      case 'aces':
        newScorecard['aces'] = this.currentDice.reduce((acc, die) => {
          return die === 1 ? acc + 1 : acc
        }, 0)
        break
      case 'twos':
        newScorecard['twos'] = this.currentDice.reduce((acc, die) => {
          return die === 2 ? acc + 2 : acc
        }, 0)
        break
      case 'threes':
        newScorecard['threes'] = this.currentDice.reduce((acc, die) => {
          return die === 3 ? acc + 3 : acc
        }, 0)
        break
      case 'fours':
        newScorecard['fours'] = this.currentDice.reduce((acc, die) => {
          return die === 4 ? acc + 4 : acc
        }, 0)
        break
      case 'fives':
        newScorecard['fives'] = this.currentDice.reduce((acc, die) => {
          return die === 5 ? acc + 5 : acc
        }, 0)
        break
      case 'sixes':
        newScorecard['sixes'] = this.currentDice.reduce((acc, die) => {
          return die === 6 ? acc + 6 : acc
        }, 0)
        break
      case 'threeOfAKind':
        tally = this.currentDice.reduce((acc, die) => {
          acc.sum += die
          acc.counts[die] += 1
          acc.valid = acc.valid || acc.counts[die] === 3
          return acc
        }, {sum: 0, valid: false, counts: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}})
        newScorecard['threeOfAKind'] = tally.valid ? tally.sum : 0
        break
      case 'fourOfAKind':
        tally = this.currentDice.reduce((acc, die) => {
          acc.sum += die
          acc.counts[die] += 1
          acc.valid = acc.valid || acc.counts[die] === 4
          return acc
        }, {sum: 0, valid: false, counts: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}})
        newScorecard['fourOfAKind'] = tally.valid ? tally.sum : 0
        break
      case 'smallStraight':
        tally = this.currentDice.reduce((acc, die) => {
          acc[die] = true
          acc.valid = acc.valid || [
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6]
          ].some(straight => straight.every(value => acc.hasOwnProperty(value)))
          return acc
        }, {valid: false})
        newScorecard['smallStraight'] = tally.valid ? 30 : 0
        break
      case 'largeStraight':
        tally = this.currentDice.reduce((acc, die) => {
          acc[die] = true
          acc.valid = acc.valid || [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6]
          ].some(straight => straight.every(value => acc.hasOwnProperty(value)))
          return acc
        }, {valid: false})
        newScorecard['largeStraight'] = tally.valid ? 40 : 0
        break
      case 'yatzy':
        tally = this.currentDice.reduce((acc, die) => {
          acc[die] += 1
          acc.valid = acc[die] === 5
          return acc
        }, {valid: false, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0})
        newScorecard['yatzy'] = tally.valid ? 50 : 0
        break
      case 'chance':
        newScorecard['chance'] = this.currentDice.reduce((acc, die) => {
          return acc + die
        }, 0)
        break
    }

    return new Game(
      this.seed,
      0,
      this.totalDiceRolls,
      this.currentDice,
      newScorecard
    )
  }
}
