/** ai.js **
 *
 *
**/



export class AI {
  constructor(callback) {
    this.callback = callback

    this.losers = [
      "1357"
      , "1247"
      , "1256"
      , "1346"
      , "1155"
      , "1144"
      , "1133"
      , "1122"
      , "0257"
      , "0347"
      , "0356"
      , "0246"
      , "0145"
      , "0123"
      , "0111"
      , "0055"
      , "0044"
      , "0033"
      , "0022"
      , "0001"
    ]

    this.rowsWithObjects = [0, 1, 2, 3]
    this.objectsInRows   = [1, 3, 5, 7]
  }


  reactToPlayerMove(move) {
    this._updateModel(move)
    move = this._chooseMove()
    this._updateModel(move)

    const prediction = move.winning
                     ? 0
                     : this._chooseMove()
    // console.log(move, prediction)
    // console.log(this)

    this.callback({ move, prediction })
  }


  restore({ rowsWithObjects, objectsInRows }) {
    this.rowsWithObjects = [...rowsWithObjects]
    this.objectsInRows = [...objectsInRows]
  }


  _updateModel({ row, count }) {
    if (row < 0) {
      // The player skipped the first move
      return
    }

    const remaining = this.objectsInRows[row] - count
    this.objectsInRows[row] = remaining

    if (!remaining) {
      const index = this.rowsWithObjects.indexOf(row)
      this.rowsWithObjects.splice(index, 1)
    }
  }


  _chooseMove() {
    const string = this._convertToString(this.objectsInRows)

    if (string === "0000") {
      // The AI lost, so no prediction is possible
      return 0
    }

    if (this.losers.indexOf(string) < 0) {
      return this._findWinningMove()
    } else {
      return this._chooseRandomMove()
    }
  }


  _findWinningMove() {
    let rowsWithOneMatch = 0
    let rowsWithMultipleMatches = 0
    let rowIndex
    let rowToTakeFrom
    let taken


    const checkMatchCounts = () => {
      let matchesInRow
      const total = this.objectsInRows.length

      for ( let ii = 0; ii < total; ii += 1 ) {
        matchesInRow = this.objectsInRows[ii]

        switch (matchesInRow) {
          case 0:
          break

          case 1:
            rowsWithOneMatch++
          break

          default:
            rowsWithMultipleMatches++
            rowToTakeFrom = ii
        }
      }
    }


    const createOddNumberOfRowsWithOneMatch = () => {
      let adjust = 0

      if (!rowsWithMultipleMatches) {
        // No row has more than one match.
        rowToTakeFrom = this.rowsWithObjects[0]
        adjust = 1
      }

      if ((rowsWithOneMatch + adjust) % 2) {
        // Delete all matches in the row with multiple matches
        taken = this.objectsInRows[rowToTakeFrom]
      } else {
        // Leave one match in the row with multiple matches
        taken = this.objectsInRows[rowToTakeFrom] - 1
      }
    }


    const reduceXORtoZero = () => {
      let excess = 0
      let matchCount
        , leave
        , ii
      const total = this.objectsInRows.length

      for ( ii = 0; ii < total; ii += 1 ) {
        excess = excess ^ this.objectsInRows[ii]
      }

      for ( ii = 0; ii < total; ii += 1) {
        matchCount = this.objectsInRows[ii]
        leave = excess ^ matchCount

        if (leave > matchCount) {
          continue
        }

        rowToTakeFrom = ii
        taken = matchCount - leave
        break
      }
    }

    checkMatchCounts()

    if (rowsWithMultipleMatches < 2) {
      createOddNumberOfRowsWithOneMatch()
    } else {
      reduceXORtoZero()
    }

    return { row: rowToTakeFrom, count: taken, winning: true }
  }


  _chooseRandomMove() {
    // console.log("randomMove")
    const nonEmptyRows = this.rowsWithObjects.length
    const index = Math.floor(Math.random() * nonEmptyRows)
    const row   = this.rowsWithObjects[index]
    const max   = this.objectsInRows[row]
    const count = Math.ceil(Math.random() * max); // 1 - max

    // console.log("random move row:", row, "count:", count)

    return { row, count, winning: false }
  }


  _convertToString(array) {
    var string

    array = array.slice(0) // use clone of array
    array.sort(); // [7, 5, 0, 1] => [0, 1, 5, 7]
    string = array.join(""); // "0157"

    return string
  }
}