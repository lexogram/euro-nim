/**
 * src/utilities/Storage.js
 */


export class Storage {
  constructor(menu) {
    const defaults = {
      hints: {
        hints: menu.hintsByDefault
      , undo: menu.undoByDefault
      , tips: menu.tipsByDefault
      , steps: menu.stepsByDefault
      , groups: menu.groupsByDefault
      }
    , level: -1
    , music: true
    , sfx: true
    }
    // console.log("default storage", defaults)

    try {
      this.storageName = window.localStorage ? "Nim" : false
      let storage = localStorage.getItem(this.storageName)
      if  (!storage) {throw new Error("Storage is empty")}
      this.storage = JSON.parse(storage)
    } catch(error) {
      this.storage = defaults
    }

    // console.log("actual storage", this.storage)
  }


  get(key) {
    return this.storage[key]
  }


  setHints(map) {
    this.storage.hints = {...this.storage.hints, ...map}
    this._save()
  }


  setLevel(level) {
    this.storage.level = level
    this._save()
  }


  setAudio(type, state) {
    this.storage[type] = state
    this._save()
  }


  _save() {
    if (this.storageName) {
      const storageString = JSON.stringify(this.storage)
      localStorage.setItem(this.storageName, storageString)
    }
  }
}
