/**
 * src/components/Game.jsx
 */


import React from 'react'
import { Board } from './Board.jsx'
import { Level } from './Level.jsx'
import { Ants } from './Ants.jsx'
import { Overlay } from './Overlay.jsx'
import { Button } from './Button.jsx'
import { Checkbox } from './Checkbox.jsx'
import { Menu } from './Menu.jsx'

import { preload } from '../scripts/preload'
import { Storage } from '../classes/Storage'
import { NoAnimation } from '../classes/NoAnimation'
import { Zalgo } from '../scripts/zalgo'
import { SetUp } from '../classes/SetUp.js'

import { AI } from '../scripts/ai.js'
import { shuffle
       , getRandomFromArray
       , getDifferences
       , getPageXY
       , setTrackedEvents
       , detectMovement
       , intersect
       , union
       , pointWithin
       , valuesMatch
       } from '../scripts/utilities.js'

import { adjusts } from '../scripts/adjusts.js'
import { Background, Pool } from '../scripts/audio.js'
import { name } from '../scripts/name.js'
import { flip } from '../scripts/flip.js'
import {
  randomPadding,
  randomRotation
} from '../scripts/random.js'

import levels from '../assets/levels.json'
import Theme from '../assets/theme.js'

import {
  Container,
  PlayArea,
  StyledButtons
} from './Styles.jsx'


class Game extends React.Component {
  constructor() {
    super()

    // The preloader will do its best to load all the assets in a
    // given number of milliseconds and then will start the game
    // without the missing assets. The list of missing assets will be
    // logged in the console.

    this.storage = new Storage(Theme.config.menu)

    this.aiPlay          = this.aiPlay.bind(this)
    this.setLevel        = this.setLevel.bind(this)
    this.startDrag       = this.startDrag.bind(this)
    this.buttonDown      = this.buttonDown.bind(this)
    this.toggleRules     = this.toggleRules.bind(this)
    this.menuCallback    = this.menuCallback.bind(this)
    this.killContextMenu = this.killContextMenu.bind(this)

    this.strings         = Theme.config.strings
    this.stringLUT       = this._getStringLUT(this.strings)

    // By default, provide no tips and no text animation...
    this.TextAnimator = NoAnimation // by default
    this.showTips = function () {}
    // ... but apply specific methods and classes if available
    switch (Theme.config.menu.tipType) {
      case "name":
        this.showTips = name ? name : this.showTips
      break
      case "flip":
        this.showTips = flip ? flip : this.showTips
      break
      case "zalgo":
        this.showTips = zalgo ? zalgo : this.showTips
        this.TextAnimator = Zalgo ? Zalgo : this.TextAnimator
      break
    }

    this.state = {
      gameOver:    true
    , selected:    [] // \
    , removed:     [] //  will contain StyledFrame ids
    , activeIds:   [] // /
    , showRules:   true
    , music:   this.storage.get("music")
    , sfx: this.storage.get("sfx")
    , ... this.storage.get("hints")

    // , winner:      true // HACK to show rules on startup

    // , activeRow: -1
    // , selected:  []
    // , vsAI:      false
    // , player:    0
    // , winner:    ""
    // , button:    { side <"left"|"right">, down: <boolean> }
    }

    // this.rowMap // { <img id>: <integer row number, ... }
    // this.ai

    // this.assets = [[{
    //   "name":"cellN",
    //   "theme": {
    //       'rotation": 'transform: rotate(ANGLEdeg);
    //        filter:    drop-shadow(Xvmin Yvmin 0.2vmin COLOR);`
    //     , "padding":  "TOPvmin RIGHTvmin LEFTvmin BOTTOMvmin"
    //     , "spacing":  "TOPvmin RIGHTvmin LEFTvmin BOTTOMvmin"
    //     }
    //   , "image": <url>
    //   }]
    // , [ <object>, ...]
    // , ... more rows
    // ]

    // this.selected = [ array of ids already selected on startDrag]
    // this.tracker = tracks changes in this.selected

    this._prepareMusic()
    this.pool = new Pool()
    this.setUp = new SetUp(this.storage, levels) // from const
    this.setUpPieces()
  }


  setUpPieces() {
    if (this.state.unlocked && !this.state.winner) {
      // Setup was already called from constructor.
      return
    }

    this.background = this._getBackgroundImage()
    this.resources = {
      title:  []
    , image:  []
    , select: []
    , reject: []
    }
    this.assets = this._getAssetsByRow(Theme.config.random)

    // const images = [].slice
    //                  .call(document.querySelectorAll("img.removed"))
    // images.forEach( image => {
    //   image.classList.remove("removed")
    // })
    this.pool.fillWith(this.assets)
  }


  /**
   * buttonDown is called by a mousedown or touchstart on either the
   * left (Play a Friend | Player 1) or the right button (Play the AI
   * | Undo)
   *
   * This method tracks the movement of the mouse or touch until
   * mouseup or touchend somewhere on the screen, showing the
   * state of the button (down | not pressed) as appropriate, and
   * triggering the expected action only if the cursor|touch is
   * over the button at the end of the gesture.
   *
   * ISSUE: on Android if the page is scrolled up to hide the
   * address bar, and you click on the button and drag up and then
   * down again, the page will scroll down and the button position
   * will readjust. However, the system will not know that the
   * button has moved and so the button may not trigger, or may
   * trigger unexpectedly.
   *
   * @param    {string}  side    "left" | "right"
   * @param    {<type>}  event   The event
   */
  buttonDown(side, event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === "touchstart") {
        this.timeout = setTimeout(() => { this.timeout = 0 }, 300)

    } else if (this.timeout) {
      return
    }

    const target = event.target
    let lastTouch

    const getElementUnderTouch = (event) => {
      const t = event.targetTouches[0]
      lastTouch = { targetTouches: [
        { clientX: t.clientX, clientY: t.clientY }
      ]}
      return document.elementFromPoint(t.clientX, t.clientY)
    }

    const toggleButtonState = (event) => {
      let type = event.type
      const button = this.state.button

      if (event.type === "touchmove") {
        const element = getElementUnderTouch(event)

        if (element === target) {
          if (button.down) {
            return
          } else {
            type = "mouseenter"
          }
        } else if (button.down) {
          type = "mouseleave"
        } else {
          return
        }
      }

      button.down = (type === "mouseenter")

      this.setState({ button })
    }

    const buttonUp = (event) => {
      if (event.type === "touchend") {
        event = { target: getElementUnderTouch(lastTouch) }
      }

      if (event.target === target) {
        const action = this.stringLUT[event.target.innerText]

        if (this[action]) {
          this[action]()
        }
      }

      // Cancel any further button action ... until the next click
      document.body.onmouseup
        = document.body.ontouchend
        = target.onmouseenter
        = target.onmouseleave
        = target.ontouchmove
        = null
      this.setState({ button: null })
    }

    if (event.type === "touchstart") {
      getElementUnderTouch(event)
    }
    this.setState({ button: { down: true, side }})

    document.body.onmouseup
      = document.body.ontouchend
      = buttonUp
    target.onmouseleave
      = target.onmouseenter
      = target.ontouchmove
      = toggleButtonState
  }


  toggleRules(event) {
    this.setState({ showRules: event.target.checked })
  }


  // TAKING A TURN

  playAI() {
    this.ai = new AI(this.aiPlay)
    this._startNewGame(true)

    const noHints = !this.state.hints
                 || !( this.state.undo
                    || this.state.steps
                    || this.state.tips
                    || this.state.groups
                     )
    this.setState({ noHints })
  }


  playMate() {
    this._startNewGame(false)
  }


  /**
   * Simulates a move made by the AI
   *
   * @param  {object} move  { row:   <integer row to take items from>
   *                        , count: <integer number of items to take>
   *                        }
   */
  aiPlay({ move, prediction }) {
    let { row, count, winning } = move
    this.setState({ winning })
    let { min, max } = { min: 400, max: 500 }
    let id

    this.showTips([])

    const lost = !winning && !prediction
    // console.log("AI played row", row, "count:", count, "winning:", winning)

    const getRandomDelay = (pause=0) => {
      if (lost) {
        return min
      }

      const random = Math.floor(Math.random() * (max - min)) + min
      max = random
      return random + pause
    }

    const getPromise = (id) => {
      return new Promise((resolve, reject) => {
        const delay = getRandomDelay()
        setTimeout(() => {
          this._playSFX({ plus: [id], minus: [] }, true)
          const selected = (this.state.selected).concat(id)
          this.setState({ selected })
          // console.log("Resolving " + id + " after " + delay + "ms")
          resolve(id)
        }, delay)
      })
    }

    const pressAIButton = () => {
      // Show AI Play button down...
      const button = { side: "right", down: true }
      this.setState({ button })

      // ... then "release" it shortly after
      setTimeout(applyAIMove, getRandomDelay(500))
    }

    const applyAIMove = () => {
      if (!winning) {
        this._setRestorePoint()
        // console.log("Restore to", this.restore)
      }

      this.setState({ button: null })
      this.showTips([])
      this._showPrediction(prediction)
          .then(
            () => this.play(1)
          )
    }

    // console.log("aiPlay row:", row, "count:", count)

    row = this._getMarkedItems(row, count)
    if (row.length !== count) {
      throw new Error()
    }

    // console.log("row", row)
    const sequence = row.reduce((sequence, id) => {
      return sequence.then(() => {
        return getPromise(id)
      })
    }, Promise.resolve())

    sequence.then(() => pressAIButton())
  }


  _getMarkedItems(row, count) {
    let items = []

    const getGroupedCells = () => {  
      const ids = this._getActiveIds(this.assets[row])
      let index = ids.length - 1
      let binary = this._getBinary(ids)
      let data = adjusts[binary]
      if (Array.isArray(data)) {
        data = data[data.length - 1]
      }

      binary = (data && data[count]) || binary

      while (binary) {
        if (binary % 2) {
          items.push(ids[index])
        }

        binary = binary >>> 1
        index -= 1
      }
    }

    const getConsecutiveBlock = () => {
      // Get an array of the remaining item ids in the chosen row
      const { removed } = this.state

      items = this.assets[row].filter( cell => (
        removed.indexOf(cell.name) < 0
      )).map( cell => cell.name )

      const index = Math.floor(Math.random() * (items.length - count))
      items = items.slice(index, index + count)
    }


    if (this.state.groups && this.state.hints) {
      getGroupedCells()

    } else {
      getConsecutiveBlock()
    }

    if (count > 1 && Math.floor(Math.random() * 2)) {
      items = items.reverse()
    }

    return items
  }


  _showPrediction(prediction) {
    if (!prediction || !this.state.tips || !this.state.hints) {
      return Promise.resolve()
    }

    // console.log(prediction)

    let { row, count } = prediction
    row = this._getMarkedItems(row, count) // array of ids
    row = "#" + row.join(", #")            // selector string
    row = [].slice.call(document.querySelectorAll(row)) // elements
    // ["cell-N", ...]

    this.showTips(row)

    return Promise.resolve()
  }


  play(player) {
    const checkForGameOver = (removed) => {
      if (removed.length === 16) {
        const player = this.state.player
        let winner

        if (player) {
          if (this.state.vsAI) {
            winner = ["AI-wins"]
            this.setState({ fail: true })

          } else {
            winner = ["player"+(3 - player), "wins"]
          }
        } else if (this.state.noHints) {
          winner = ["ace"]

        } else if (this.state.level === levels.length - 1){
          winner = ["you-top"]

        } else {
          winner = ["you-win"]
        }

        winner = winner.map( key => (
          this.strings[key]
        )).join("")
        this.setState({ winner })

        return true
      }

      return false
    }

    let { activeRow: row, selected } = this.state

    selected = selected.filter(id => id) // remove 0
    const pass = !selected.length // silence click on play if pass
    const removed = this.state.removed.concat(selected)
    const gameOver = checkForGameOver(removed)
    player = player || (this.state.vsAI
                 ? 0
                 : 3 - this.state.player // 1->2; 2->1
                 )

    this.setState({
      selected:  []
    , removed
    , activeRow: -1
    , activeIds: []
    , player
    , waitForAI: !player
    , gameOver
    , showRules: false
    })

    // console.log("play waitForAI:", !player)

    if (!gameOver && !player) {
      this._showGroups(row).then(() =>
        this.ai.reactToPlayerMove({ row, count: selected.length })
      )
    }

    this._playSound(gameOver, player, pass)
  }


  _showGroups(row) {
    const promise = Promise.resolve()

    if (!this.state.hints || !this.state.groups || row < 0) {
      return promise
    }

    const assets = this.assets[row]
    const ids = this._getActiveIds(assets)
    const binary = this._getBinary(ids)
    const groupData = adjusts[binary]

    if (!Array.isArray(groupData) || isNaN(groupData[0])) {
      // Items are already arranged in groups
      return promise
    }

    // If we get here, there are items to move

    const length = assets.length
    let promiseData = []
    let [ shifts, result ] = groupData  
    // Shifts will be a number of the format st[st]+
    // where the digits s = source and t = target location
    let source
      , sourceId
      , target
      , targetId
      , data

    while (shifts) {
      source = length - (shifts % 10)
      shifts = Math.floor(shifts / 10)
      target = length - (shifts % 10)
      shifts = Math.floor(shifts / 10)
      data   = this._getPromiseData(source, target, assets)
      promiseData.push(data)
    }

    promiseData = promiseData.map( data => this._groupPromise(data) )

    return Promise.all(promiseData)
  }


  _getPromiseData(source, target, assets) {
    const sourceId = assets[source].name
    const targetId = assets[target].name

    const element =  document.getElementById(sourceId)
    const left = element.getBoundingClientRect().left
               - document.getElementById(targetId)
                          .getBoundingClientRect().left

    return { source, target, element, left, assets }  
  }


  _groupPromise({ source, target, element, left, assets }) {
    return new Promise((resolve, reject) => {
      const completeMove = event => {
        element.removeEventListener("transitionend", completeMove)
        element.classList.remove("group")
        element.style.removeProperty("left")
        resolve()
      }  
        
      // Swap visible with removed item...
      [ assets[source], assets[target]]
        = [assets[target], assets[source]]
      // ... and apply the left adjust so swapped item won't move
      element.style.left = left + "px"

      // Then apply a class that cancels the left adjust and
      // includes a transition duration...
      setTimeout(() => {
        element.classList.add("group")
      }, 0)

      // ... and prepare to remove both left and cancel-left-class
      // when the transition ends
      element.addEventListener("transitionend", completeMove)
    })
  }


  _getBinary(ids) {
    return ids.reduce((binary, cellName) => {
      return binary * 2 + (cellName ? 1 : 0)
    }, 0)
  }  


  _getActiveIds(assets) {
    return assets.map( asset => (
      this.state.removed.indexOf(asset.name) < 0
      ? asset.name
      : 0
    ))
  }


  _setRestorePoint() {
    const removed = this.state.removed.concat(this.state.selected)
    const objectsInRows = this.assets.map( row => (
      row.filter( cell => removed.indexOf(cell.name) < 0 )
         .reduce( counter => counter + 1, 0 )
    ))
    const assets = JSON.parse(JSON.stringify(this.assets))
    // console.log("objectsInRows:", objectsInRows)
    const rowsWithObjects = objectsInRows.map((count, index) => (
      count ? index : -1
    )).filter( index => !(index < 0))

    // console.log("rowsWithObjects:", rowsWithObjects)

    this.restore = {
      removed
    , assets
    , gameState: {
        objectsInRows
      , rowsWithObjects
      }
    }
  }


  // <<<PRELOADING 

  _unlockGame(result) {
    result = result.filter( item => !!item )
    if (result.length) {
      console.log("Missing assets:" + JSON.stringify(result))
    }
    this.setState({ unlocked: true })
  }


  // <<< SELECTING ITEMS 

  startDrag(event) {
    // console.log("startDrag waitForAI:", this.state.waitForAI)
    if (this.state.waitForAI) {
      // console.log("action denied")
      return
    }

    event.preventDefault()
    event.stopPropagation()
    if (event.type === "touchstart") {
        this.timeout = setTimeout(() => { this.timeout = 0 }, 300)

    } else if (this.timeout) {
      return
    }

    if (this.state.gameOver) {
      return
    }

    const target = event.target
    if (target.tagName !== "IMG") {
      return
    }

    const id = target.parentNode.id
    if (!(this.state.removed.indexOf(id) < 0)) {
      console.log("Removed image clicked?!", id)
      return
    }

    const rowNumber = this.rowMap[id]
    const activeRow = this.state.activeRow

    if (activeRow < 0) {
      // This is necessarily a selection (not a deselection), because
      // nothing is selected in any row
      this.setState({ activeRow: rowNumber })
      // console.log("activeRow", rowNumber)

    } else if (activeRow !== rowNumber) {
      // Can't select objects in two different rows
      return
    }

    this.tracker = getDifferences()
    this._showSelection(event, rowNumber, id)
  }


  _showSelection(event, rowNumber, id) {
    this.selected = [...this.state.selected]
    const isSelect = this.selected.indexOf(id) < 0
    const rowDetails = this._getRowDetails(rowNumber, isSelect)
    // { activeIds, dragIds [, outlineRects, unionRect] }
    //
    // outlineRects and unionRect will be missing if dragIds only has
    // one entry, meaning that there is no point in using drag to
    // extend the selection.
    // console.log(rowDetails)

    // Ensure that all the items in the clicked row will show the
    // pointer cursor, and that all others will show not-allowed
    const { activeIds, dragIds } = rowDetails
    const allowDrag = !!rowDetails.outlineRects
                   && ( isSelect
                        ? Theme.config.select.enableSelect
                        : Theme.config.select.enableDeselect
                      )
    // console.log("_showSelection activeIds:", activeIds)
    this.setState({ dragIds })

    // Change the selection state of the image that was pressed
    // (this may reset activeIds to [], if the clicked item was the
    // only item selected in this row)...
    this._previewSelection(isSelect, [ id ], activeIds, rowNumber)

    // ... and then deal with extending or annulling the change
    if (allowDrag) {
      this._prepareToExtendSelection(event, isSelect, id, rowDetails)
    } else {
      this._checkForRetraction(event, isSelect, id, activeIds)
    }
  }


  _getRowDetails(rowNumber, isSelect) {
    const rowDetails = {}
    const { selected, removed } = this.state

    // Get an array of ids...
    // * in row rowNumber...
    // * that are not marked as removed
    const activeIds
      = rowDetails.activeIds
      = Object.keys(this.rowMap)
              .filter( id => this.rowMap[id] === rowNumber
                          && removed.indexOf(id) < 0
                     )

    // Filter for only those which can be selected by a drag action
    const dragIds = rowDetails.dragIds = activeIds.filter(
      id => (selected.indexOf(id) < 0) === isSelect
    )

    if (dragIds.length === 1) {
      // The item that the player clicked is the only one in this row
      // in the current state, so there is no reason to calculate
      // data for a marching ants selection rect.

    } else {
      // Make a string list of ids of the elements that can be
      // selected, ...
      const selector = "#" + dragIds.join(", #")

      const elements = [].slice
                         .call(document.querySelectorAll(selector))

      // ... find the rect of each corresponding element, ...
      const outlineRects = rowDetails.outlineRects = elements.map(
        element => element.getBoundingClientRect()
      )
      // ... and the rect that finds them all and in the darkness binds
      // them
      rowDetails.unionRect = union(outlineRects)
    }

    return rowDetails
  }


  _prepareToExtendSelection(event, isSelect, id, rowDetails) {
    // By default, React provides a single-use event, so we need to
    // tell React not to recycle it, so we can continue to use it.
    event.persist()

    // Get ready to drag-select others in the same line
    detectMovement(event, 10) // promise
    .then(
      (drag) => this._showMarchingAnts(event, isSelect, rowDetails)
    , (drop) => this._previewSelection(isSelect, [ id ], rowDetails.activeIds)
    ).catch(
      (error) => console.log("Marching Ants promise", error)
    )
  }


  _checkForRetraction(event, isSelect, id, activeIds) {
    let within = true

    const drag = (event) => {
      const { x, y } = getPageXY(event)
      const elements = document.elementsFromPoint(x, y)

      // The click was on the image; the id that we are tracking
      // is on the (square) div that contains the image
      if (elements[1] && elements[1].id === id) {
        if (!within) {
          this._previewSelection(isSelect, [ id ], activeIds)
          within = true
        }

      } else if (within) {
        this._previewSelection(isSelect, [], activeIds)
        within = false
      }
    }

    const drop = (event) => {
      this._updateSelection()
      setTrackedEvents(cancel)
    }

    const cancel = setTrackedEvents({ event, drag, drop })
  }


  _showMarchingAnts(event, isSelect, rowDetails) {
    // This method is called only once per drag action, so we can
    // store the start loc here.
    const activeIds = rowDetails.activeIds
    const { x: startX, y: startY } = getPageXY(event)

    // Find which items intersect with the dragged ants rect, and
    // what their individual rects are
    const getSelectionMap = (antRect) => (
      rowDetails.outlineRects.reduce((map, rect, index) => {
        if (intersect(rect, antRect)) {
          map.ids.push(rowDetails.dragIds[index])
          map.rects.push(rect)
        }
        return map
      }, { ids: [], rects: [] })
    )

    const drag = (event) => {
      let { x, y } = getPageXY(event)

      // Check if the mouse is currently inside the largest marching
      // ant rect, before we modify x and y:
      const within = pointWithin(x, y, rowDetails.unionRect)

      const right  = Math.max(startX, x)
      x            = Math.min(startX, x)
      const width  = right - x
      const bottom = Math.max(startY, y)
      y            = Math.min(startY, y)
      const height = bottom - y

      let antRect  = { x, y, right, bottom, width, height }
      const map    = getSelectionMap(antRect)

      const revert = (!within && map.ids.length < 2 )

      // console.log("isConfirmedSelect:", isConfirmedSelect, "map.ids:", map.ids )

      if (revert) {
        // Cancel ants rect if the clicked image is the only one that
        // intersects rect, and the { x, y } point is outside its
        // bounding rect
        antRect = null
        map.ids = []

      } else {
        antRect = union(map.rects)
      }

      if (valuesMatch(antRect, this.state.antRect)) {
        // No update needed, even if the mouse / touch has moved
      } else {
        this._previewSelection(isSelect, map.ids, activeIds)
        this.setState({ antRect })
      }
    }

    const drop = () => {
      setTrackedEvents(cancel)
      this._updateSelection()
    }

    const cancel = setTrackedEvents({ event, drag, drop })
  }


  _previewSelection(isSelect, selectionChange, activeIds, rowNumber) {
    const changes = this.tracker(selectionChange)
    this._playSFX(changes, isSelect)

    // Add or remove the items that have changed since the action
    // started
    const selected  = isSelect
                      ? selectionChange.concat(this.selected)// true
                      : this.selected.filter( id => (        // false
                          selectionChange.indexOf(id) < 0
                        ))

    this.previewState = {
      selected
    , activeIds
    , rowNumber
    }

    // console.log("_previewSelection isSelect", isSelect, "selected:", selected, "activeRow:", this.state.activeRow, rowNumber)

    this.setState({ selected, activeIds })
  }


  _updateSelection() {
    let { selected, rowNumber, activeIds } = this.previewState

    // Reset activeRow and activeIds if the last element in what was
    // the activeRow is deselected
    const activeRow = selected.length
                    ? isNaN(rowNumber)
                      ? this.state.activeRow
                      : rowNumber
                    : -1
   activeIds = activeRow < 0
             ? []
             : activeIds
    // console.log("activeRow:", activeRow, "activeIds:", activeIds)

    this.setState({ activeRow, activeIds, antRect: null })
  }


  // <<< IMAGES AND MUSIC


  _prepareMusic() {
    const { simultaneous, music } = Theme.config.basic
    this.audioPlayer = new Background({ simultaneous, music })

    const checkForGameNotOver = () => {
      if (this.state.gameOver) {
        setTimeout(checkForGameNotOver, 100)

      } else if (this.state.music) {
        return this.audioPlayer.play()
      }
    }

    checkForGameNotOver()
  }


  _playSFX(changes, isSelect) {
    if (!this.state.sfx) {
      return
    }

    const random = Theme.config.random.sounds
    let type = isSelect ? "select" : "reject"
    changes.plus.forEach( id => this.pool.playSFX(id, type, random) )
    type = isSelect ? "reject" : "select"
    changes.minus.forEach( id => this.pool.playSFX(id, type, random) )
  }


  _playSound(gameOver, player, pass) {
    if (pass || !this.state.sfx) {
      return
    }

    const sound = gameOver
                ? this.state.vsAI
                  ? player
                    ? this.state.noHints
                      ? "ace"  // the human beat the AI with no help
                      : "best"// the human beat the AI
                    : "lose" // the human lost against the AI
                  : "win"   // one of the human players won
                : "play"   // the game is not over
    const file = Theme.config.basic[sound]
    this.pool.play(file)
   }


  _getBackgroundImage(){
    const images = Theme.config.basic.backgrounds

    // Take random item from near beginning and put it at the end
    let index = images.length
    if (!index) {
      return ""
    }

    index = Math.floor(Math.random() * index / 2 )

    const background = images.splice(index, 1)[0]
    images.push(background)

    return background.url
  }

  // <<< SETUP

  _getAssetsByRow(random) {
    // There may be:
    // * only one image (which should be in basic)
    // * an image in every slot in basic and rows -two
    //   to -four
    // * an image in only certain slots of rows -two to -four
    // * extra images that can be used
    //
    // For each cell, we may have:
    // * an image
    // * a sound effect
    // * an animGIF or sprite image to use for the disappearance
    // * an "empty space" image
    //
    // Returns an array of 16 elements with the format:
    // [ [ { image: <url>
    //     , select: <url>
    //     , reject: <url>
    //     }
    //   ]
    // , [ + 3 such items for row 2 ]
    // , [ + 5 such items for row 3 ]
    // , [ + 7 such items for row 4 ]
    // ]

    const assetsByRow = []

    if (random.single) {
      const unique = this._getRowData("row1")[0]
      // TODO

    }  else if (!random.order) {
      // Two possible cases to possible cases to check for:
      // 1. Only the default assets are provided
      // 2. Images are provided for all 16 cells
      // If neither of these cases are true, then
      // * Use whatever assets are available
      // * Repeat as necessary to fill up the slots
      // * Post a warning message in the Console

      assetsByRow.push(this._getRowData("row1"))
      assetsByRow.push(this._getRowData("row2"))
      assetsByRow.push(this._getRowData("row3"))
      assetsByRow.push(this._getRowData("row4"))

      // TODO: Ensure that all elements have a sound

    } else {
      // * Create an array of all the assets available
      // * Use the default select and reject assets wherever
      //   no such assets are provided for a particular image
      // * Distribute the elements of the array at random among
      //   the 4 rows

      let available = []
        .concat(this._getRowData("row1"))
        .concat(this._getRowData("row2"))
        .concat(this._getRowData("row3"))
        .concat(this._getRowData("row4"))

      if (random.useExtras) {
        available = available.concat(this._getRowData("extras"))
      }

      shuffle(available)

      assetsByRow.unshift(available.slice(9, 16))
      assetsByRow.unshift(available.slice(4, 9))
      assetsByRow.unshift(available.slice(1, 4))
      assetsByRow.unshift(available.slice(0, 1))
    }

    this._ensureRowsAreFullyPopulated(assetsByRow)
    this._ensureCellsHaveEnoughResources(assetsByRow)

    return assetsByRow
  }


  _getRowData(rowKey) { // "rowN" | ... | "extras"
    const row_data = []
    const data = Theme.config.counters[rowKey]
    const count = data.length

    // console.log("rowdata", data)

    data.forEach((cellData, index) => {
      const keys =  Object.keys(this.resources)
      const cell = this._getCell(rowKey, count, cellData, index)

      row_data.push(cell)

      keys.forEach( key => {
        if (cellData[key]) {
          this.resources[key].push(cellData[key])
        }
      })
    })

    return row_data
  }


  _getCell(rowKey, count, cellData, index) {
    const { random, display } = Theme.config
    const cellName = rowKey + "-cell" + index
    const padding = randomPadding(random)
    const top = parseFloat(padding.split(" ")[0])

    let cell = {
      name: cellName
    , theme: {
        rotation: randomRotation(random, display)
        // may be 0° + no shadow
      , padding:  randomPadding(random, )  // may be 0
      , spacing:  randomPadding(random, count, index, top)
      , equal:    randomPadding(random, 1, index, top)
      }
    , ...cellData
    }

    return cell
  }


  _ensureRowsAreFullyPopulated(assetsByRow) {
    const expected = [1,3,5,7]
    const actual = assetsByRow.map( rowData => {
      return rowData.length
    })

    const availableResources = Object.keys(this.resources).filter(
      key => this.resources[key].length
    )

    if (availableResources.indexOf("image") < 0) {
      // No images are defined. Nothing will appear in the Play Area.
      // This situation needs human intervention
      return
    }

    const getRandomCellData = () => {
      const data = {}

      availableResources.forEach( key => {
        data[key] = getRandomFromArray(this.resources[key])
      })

      return data
    }

    expected.forEach((count, index) => {
      const row = assetsByRow[index]
      const rowKey = "row" + (index + 1) // row count starts at 1
      let ii = actual[index]
      let cellData,
          cell

      if (count - ii) {
        for ( ; ii < count; ii += 1 ) {
          cellData = getRandomCellData()
          cell = this._getCell(rowKey, count, cellData, ii)
          row.push(cell)
        }
      }
    })
  }


  _ensureCellsHaveEnoughResources(assetsByRow) {
    const items = ["image", "select", "reject"]

    assetsByRow.forEach( row => {
      row.forEach( cellData => {
        items.forEach( item => {
          if (!cellData[item]) {
            cellData[item] = getRandomFromArray(this.resources[item])
          }
        })
      })
    })
  }


  // <<< BUTTON NAMES

  _getStringLUT(stringMap) {
    const keys = Object.keys(stringMap)
    const LUT  = {}

    keys.forEach( key => {
      LUT[stringMap[key]] = key
    })

    return LUT
  }


  // <<< BUTTON ACTIONS

  _press(target) {
  }


  _startNewGame(vsAI) {
    this.setUpPieces()
    this._setRowMap() // cell.names have changed
    const { hints, steps, fail, groups } = this.state
    const assets = JSON.parse(JSON.stringify(this.assets))
    const options = { vsAI, hints, steps, fail, assets, groups }
    const { state, restore } = this.setUp.get(options)  

    // console.log(state)
    // console.log(restore)

    this.setState( state )  
    this.restore = restore
    if (vsAI) {
      this.ai.restore( this.restore.gameState )
    }
  }


  _setRowMap() {
    this.rowMap = {}

    this.assets.forEach((row, index) => {
      row.forEach(({ name }) => {
        this.rowMap[name] = index
      })
    })
  }


  killContextMenu(event) {
    if (event) {
      event.preventDefault()
      return false
    }

    const images = [].slice.call(document.querySelectorAll("img"))
      images.forEach( image => {
        image.oncontextmenu = this.killContextMenu
      }
    )
  }


  undo(event) {
    this.setState({
      removed: this.restore.removed
    , winning: false
    , fail: true
    })
    this.assets = JSON.parse(JSON.stringify(this.restore.assets))
    this.ai.restore( this.restore.gameState )

    // console.log(this.assets)
  }


  menuCallback(action) {
    // console.log("menuCallback", "action:", action)

    switch (action) {
      case "restart":
        this.showTips([])
        return this.setState({
          gameOver: true
        , removed: []
        , selected: []
        , fail: 0
        })

      case "music":
      case "sfx":
        this._toggleSound(action)
        // Fall through...
      case "credits":
       this.setState({
          [action]: !this.state[action]
        })
        return
    }

    // Otherwise toggle hint
    this.setState( action )
    this.storage.setHints(action)

    if (this.state.vsAI && !this.state.gameOver) {
      // Remove win privileges if the player asks for hints
      const type = Object.keys(action)[0] //undo, steps, tips, groups
      const state = action[type]
      let noHints = this.state.noHints

      if (state && noHints) {
        switch (type) {
          case "hints":
            noHints = !( this.state.undo
                      || this.state.steps
                      || this.state.tips
                      || this.state.groups
                       )
          break
          default:
            noHints = false
        }
        this.setState({ noHints })
      }
      // console.log("noHints:", noHints)
    }
  }


  _toggleSound(action) {
    const newState = !this.state[action]
    this.storage.setAudio(action, newState)

    if (action === "music") {
      if (newState) {
        this.audioPlayer.play()
      } else {
        this.audioPlayer.pause()
      }
    }
  }


  setLevel(event) {
    const rect = event.target.getBoundingClientRect()
    const horizontal = rect.width > rect.height
    let timeout
    let lastX
      , lastY

    const drag = (event) => {
      if (timeout) {
        return
      } else {
        timeout = setTimeout(() => {
           update(event);timeout = 0
        }, 250)
        update(event)
      }
    }


    const drop = (event) => {
      update(event)
      setTrackedEvents(cancel)
    }


    const update = (event) => {
      const { x, y } = getPageXY(event)
      if (x === undefined) {
        return
      } else if (x === lastX && y === lastY) {
        return
      }

      lastX = x
      lastY = y

      const ratio = (
        horizontal
        ? (x - window.scrollX - rect.x) / rect.width
        : (rect.bottom - y + window.scrollY) / rect.height
      )

      const level = Math.round(ratio * levels.length)
      this.setUp.setLevel(level)
      // this.setState({ level })

      this.playAI()
    }


    const cancel = setTrackedEvents({ event, drag, drop })
    update(event)
  }


  render() {
    // console.log("Game gameOver:", this.state.gameOver)
    return (
      <Container
        id="Container"
      >
        <PlayArea
          id="PlayArea"
          $background={this.background}
        >
          <div
            className="background"
          ></div>
          <Board
            action={this.startDrag}
            setLevel={this.setLevel}
            rows={this.assets}
            gameState={this.state}
            // { selected, removed, activeIds, dragIds, gameOver }
          />

          <Level
            steps={ this.state.steps
                 && this.state.hints
                 && this.state.vsAI
                  }
            level={this.state.level + 1}
            action={this.setLevel}
          />

          <Ants
            rect={this.state.antRect}
          />

          <Overlay
            TextAnimator={this.TextAnimator}
            gameState={this.state}
          />
        </PlayArea>

        <StyledButtons
          id="Buttons"
        >
          <Button
            key="left"
            side="left"
            gameState={this.state}
            buttonDown={this.buttonDown.bind(this, "left")}
          />
          <Checkbox
            checked={this.state.showRules}
            onChange={this.toggleRules}
            disabled={!this.state.unlocked}
          />
          <Button
            key="right"
            side="right"
            gameState={this.state}
            buttonDown={this.buttonDown.bind(this, "right")}
          />
        </StyledButtons>

        <Menu
          callback={this.menuCallback}
          checkList={this.storage.get("hints")}
          gameState={this.state}
        />
      </Container>
    )
  }



  componentDidMount() {
    this.killContextMenu() // COMMENT OUT for debugging
    preload(2000).then( result => result )
                 .catch( error => error )
                 .then( result => this._unlockGame(result))
  }
}


export default Game;