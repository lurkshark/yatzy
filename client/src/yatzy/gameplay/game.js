// import speakeasy from 'speakeasy'

const CATEGORIES = [
  'aces', 'twos', 'threes', 'fours', 'fives', 'sixes',
//  'threeOfAKind', 'fourOfAKind', 'fullHouse',
//  'smallStraight', 'largeStraight',
//  'yatzy', 'chance'
]

export default class Game {

  constructor(
      seed = 0,
      turnRolls = 0,
      totalDiceRolls = 0,
      currentDice = [0, 0, 0, 0, 0],
      scorecard = {}) {
    this.seed = seed
    this.turnRolls = turnRolls
    this.totalDiceRolls = totalDiceRolls
    this.currentDice = [...currentDice]
    this.scorecard = {...scorecard}
    this.done = CATEGORIES.every(k => this.scorecard[k])
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
      return (offset % 6) + 1
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
      && !this.scorecard[category]
      // && enforce joker rules
    )
  }

  score(category) {
    if (!this.canScore(category)) return false
    const newScorecard = {...this.scorecard}
    switch (category) {
      case 'aces':
        newScorecard['aces'] = this.currentDice.reduce((acc, dice) => {
          return dice === 1 ? acc + 1 : acc
        }, 0)
        break
      case 'twos':
        newScorecard['twos'] = this.currentDice.reduce((acc, dice) => {
          return dice === 2 ? acc + 2 : acc
        }, 0)
        break
      case 'threes':
        newScorecard['threes'] = this.currentDice.reduce((acc, dice) => {
          return dice === 3 ? acc + 3 : acc
        }, 0)
        break
      case 'fours':
        newScorecard['fours'] = this.currentDice.reduce((acc, dice) => {
          return dice === 4 ? acc + 4 : acc
        }, 0)
        break
      case 'fives':
        newScorecard['fives'] = this.currentDice.reduce((acc, dice) => {
          return dice === 5 ? acc + 5 : acc
        }, 0)
        break
      case 'sixes':
        newScorecard['sixes'] = this.currentDice.reduce((acc, dice) => {
          return dice === 6 ? acc + 6 : acc
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
