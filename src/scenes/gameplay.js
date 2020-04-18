import {useReducer, useState} from 'preact/hooks'
import Game from '../game'

const HOLD_NONE = [false, false, false, false, false]

export default function Gameplay() {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'toggleHold':
        const newHolding = [...state.holding]
        if (state.game.turnRolls === 3) return state
        newHolding[action.index] = !newHolding[action.index]
        return {
          ...state,
          holding: state.game.turnRolls === 0 ? [...HOLD_NONE] : newHolding
        }
      case 'rollGame':
        if (!state.game.canRoll(state.holding)) return state
        return {
          ...state,
          game: state.game.roll(state.holding),
        }
      case 'scoreGame':
        if (!state.game.canScore(action.category)) return state
        return {
          ...state,
          game: state.game.score(action.category),
          holding: [...HOLD_NONE]
        }
    }
  }, {game: new Game(), holding: [...HOLD_NONE]})

  const classForCategory = (category) => {
    if (state.game.canScore(category)) {
      return 'can-score'
    } else if (state.game.scorecard[category]) {
      return 'did-score'
    } else if (state.game.scorecard[category] === 0) {
      return 'zero-score'
    } else {
      return 'no-score'
    }
  }

  const classForDice = (index) => {
    return state.holding[index] ? 'dice-holding' : 'dice-rolling'
  }

  const toggleHolding = (index) => {
    dispatch({type: 'toggleHold', index: index})
  }

  return (
    <div class="wrapper">
      <h1 class="title">Yatzy Deathmatch</h1>
      <hr />
      <div class="gameplay-scorecard-upper-container">
        <div>&#x2680; Aces</div>
        <div class={classForCategory('aces')}
            onClick={() => dispatch({type: 'scoreGame', category: 'aces'})}>
          {state.game.scorecard['aces']}
        </div>
        <div>&#x2683; Fours</div>
        <div class={classForCategory('fours')}
            onClick={() => dispatch({type: 'scoreGame', category: 'fours'})}>
          {state.game.scorecard['fours']}
        </div>
        <div>&#x2681; Twos</div>
        <div class={classForCategory('twos')}
            onClick={() => dispatch({type: 'scoreGame', category: 'twos'})}>
          {state.game.scorecard['twos']}
        </div>
        <div>&#x2684; Fives</div>
        <div class={classForCategory('fives')}
            onClick={() => dispatch({type: 'scoreGame', category: 'fives'})}>
          {state.game.scorecard['fives']}
        </div>
        <div>&#x2682; Threes</div>
        <div class={classForCategory('threes')}
            onClick={() => dispatch({type: 'scoreGame', category: 'threes'})}>
          {state.game.scorecard['threes']}
        </div>
        <div>&#x2685; Sixes</div>
        <div class={classForCategory('sixes')}
            onClick={() => dispatch({type: 'scoreGame', category: 'sixes'})}>
          {state.game.scorecard['sixes']}
        </div>
      </div>
      <hr />
      <div class="gameplay-dice-container">
        <div class={classForDice(0)} onClick={() => toggleHolding(0)}>
          {state.game.currentDice[0]}
        </div>
        <div class={classForDice(1)} onClick={() => toggleHolding(1)}>
          {state.game.currentDice[1]}
        </div>
        <div class={classForDice(2)} onClick={() => toggleHolding(2)}>
          {state.game.currentDice[2]}
        </div>
        <div class={classForDice(3)} onClick={() => toggleHolding(3)}>
          {state.game.currentDice[3]}
        </div>
        <div class={classForDice(4)} onClick={() => toggleHolding(4)}>
          {state.game.currentDice[4]}
        </div>
      </div>
      <button
        class="gameplay-roll-button"
        disabled={!state.game.canRoll(state.holding)}
        onClick={() => dispatch({type: 'rollGame'})}>~ ROLL ~</button>
    </div>
  )
}
