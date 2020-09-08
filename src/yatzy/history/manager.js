import Archive from '../data/archive'
import Game from '../data/game'
import Detail from '../detail'

export default class HistoryManager {

  constructor(coordinator, view) {
    this.coordinator = coordinator
    this.localforage = coordinator.localforage
    this.view = view
  }

  async start() {
    // Load most recent game and set view state
    const archive = await Archive.Repository(this.localforage).load()
    const games = archive.recentGames(7)

    this.recentGames = games.filter(game => game.done).slice(0, 6)
    this.view.showRecentGames(this.recentGames)
  }

  shareRecentGame(gameIndex) {
    this.coordinator.gotoScene(
      new Detail(this.coordinator, {
        gameId: this.recentGames[gameIndex].id
      })
    )
  }
}
