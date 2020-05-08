const MAX_SIZE = 64

export default class Archive {

  constructor(
    currentGameIndex = 0,
    gameIdLookup = {},
  ) {
    this.currentGameIndex = currentGameIndex
    this.gameIdLookup = gameIdLookup
  }

  static Repository(localforage) {
    return {
      load: async () => {
        const archiveKey = 'Archive:Main'
        const archiveData = await localforage.getItem(archiveKey)
        return archiveData === null
          ? Archive.Repository(localforage).save(new Archive())
          : new Archive(archiveData.currentGameIndex, archiveData.gameIdLookup)
      },
      save: async (archive) => {
        const archiveKey = 'Archive:Main'
        await localforage.setItem(archiveKey, {
          currentGameIndex: archive.currentGameIndex,
          gameIdLookup: archive.gameIdLookup
        })
        return archive
      }
    }
  }

  get currentGameId() {
    return this.gameIdLookup[this.currentGameIndex]
  }

  registerGameId(gameId) {
    if (this.currentGameId === gameId) return this
    const newCurrentGameIndex = (this.currentGameIndex + 1) % MAX_SIZE
    const newGameIdLookup = {...this.gameIdLookup}
    newGameIdLookup[newCurrentGameIndex] = gameId
    return new Archive(
      newCurrentGameIndex,
      newGameIdLookup
    )
  }
}
