/**
 * src/classes/SetUp.js
 */



export class SetUp {
  constructor(storage, levels) {
    this.storage = storage
    this.levels = levels
    this.level = storage.get("level")
    this.maxLevel = this.levels.length - 1
  }


  get({ vsAI, hints, steps, assets, fail, level, groups }) {
    this.assets = assets // \\
    this.groups = groups // // used in _getRemoved

    if (this.level < 0) {
      // Play the full game the first time, even if steps is true
      if (vsAI) {
        this.level = 0
      }
      
      level = this.maxLevel
      fail = 0
    }

    if (!vsAI || !hints || !steps ) {
      // Use combination with all items in place
      level = this.maxLevel
    } else if (isNaN(level)) {
      level = this.level
    }

    this._adjustLevel(fail, steps)

    let removed
      , gameState

    if (level === this.maxLevel) {
      removed = []
      gameState = {
        objectsInRows:   [1, 3, 5, 7]
      , rowsWithObjects: [0, 1, 2, 3]
      }
    } else {
      ({ removed, gameState } = this._getSetup(level))
    }

    removed.initial = removed.length

    const restore = {
      removed
    , assets
    , gameState
    }

    const state = {
      gameOver:  false
    , showRules: false
    , fail:      false
    , waitForAI: false
    , vsAI
    , level
    , removed
    , player:    1
    , activeRow: -1
    , activeIds: []
    , selected:  []
    , winner:    ""
    }

    return { state, restore }
  }


  setLevel(level) {
    if (isNaN(level)) {
      return false
    }

    this.level = Math.max(0, Math.min(level, this.maxLevel))
    return this.level
  }


  getLevel(level) {
    if (isNaN(level)) {
      level = this.level
    } else {
      level = Math.max(0, Math.min(level, this.maxLevel))
    }

    return this.levels[level].toString()
  }


  _adjustLevel(fail, steps, level) {
    if (!steps || fail === 0) {
      return
    } if (!fail) {
      this.level = Math.min(this.level + 1, this.maxLevel)
      this.storage.setLevel(this.level)
      return
    }

    // Move the failed level back a few places... unless we're already
    // at maxLevel
    const combination = this.levels.splice(this.level, 1)[0]
    const range  = Math.ceil(
                     Math.min(this.maxLevel - this.level, 16) / 2
                   ) // between 0 and 8
    const random = Math.ceil(Math.random() * range) // 0 - 8
                 + range                            // 0 - 8
                 + this.level
    this.levels.splice(random, 0, combination)
  }


  _getSetup(level) {
    const objectsInRows = this._getPlaces(level)
    const rowsWithObjects = objectsInRows.map((rowCount, index) => (
      rowCount ? index : false
    )).filter( index => index !== false )

    const removed = this._getRemoved(objectsInRows)

    return {
      removed
    , gameState: {
        objectsInRows
      , rowsWithObjects
      }
    }
  }


  _getPlaces(level) {
    const combination = [...this.levels[level]]
    const places = [0, 0, 0, 0]
    const spaces = [1,3,5,7]
    let rowCount

    while (rowCount = combination.pop()) {
      const index = this._getRowIndex(rowCount, spaces)
      places[index] = rowCount
      spaces[index] = 0
    }

    return places
  }


  _getRowIndex(rowCount, spaces) {
    const available = spaces.map(
      (spaceCount, index) => (rowCount > spaceCount) ? false : index
    ).filter(
      index => index !== false
    )

    const random = Math.floor(Math.random() * available.length)
    return available[random]
  }


  _getRemoved(objectsInRows) {
    const removed = []
    const rowArray = this.assets.map( rowData => (
      rowData.map( cell => cell.name )
    ))

    // console.log(rowLUT)
    rowArray.forEach((rowData, index) => {
      const cells     = rowArray[index]
      let cellCount   = rowData.length
      const itemCount = objectsInRows[index]
      let excess      = cellCount - itemCount

      if (excess) {
        if (this.groups) {
          const binary    = {1: 1, 3: 7, 5: 31, 7: 127}[cellCount]
          let adjustData = adjusts[binary]
          adjustData = adjustData[adjustData.length - 1]
          adjustData = adjustData[excess] || binary

          while (adjustData) {
            cellCount -= 1

            if (adjustData % 2) {
              removed.push(cells[cellCount])
            }

            adjustData = adjustData >>> 1
          }

        } else {
          // Remove random items
          while (excess--) {
            const random = Math.floor(Math.random() * cells.length)
            removed.push(cells.splice(random, 1)[0])
          }
        }
      }
    })

    return removed
  }
}
