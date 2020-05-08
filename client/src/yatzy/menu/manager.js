import Archive from '../data/archive'
import Game from '../data/game'

export default class MenuManager {

  constructor(coordinator, view) {
    this.coordinator = coordinator
    this.localforage = coordinator.localforage
    this.view = view
  }

  async start() {
    // Load most recent game and set view state
    const archive = await Archive.Repository(this.localforage).load()
    const currentGame = archive.currentGameId === null
      ? null
      : await Game.Repository(this.localforage).load(archive.currentGameId)
    const isGameInProgress = currentGame !== null && !currentGame.done
    if (isGameInProgress) {
      this.view.showContinueExperimentButton()
    } else {
      this.view.showStartNewExperimentButton()
    }
  }
}
