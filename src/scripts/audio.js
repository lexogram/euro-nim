/** audio.js **
 *
 *  
**/


import { removeFrom } from './utilities'


class AudioPlayer {
  constructor(options) {
    options = options || {}
    // TODO: sanitize options
    this.fadeTime = isNaN(options.fadeTime)  
                  ? 500
                  : Math.max(1, options.fadeTime)
    this.volume   = isNaN(options.volume)
                  ? 1.0
                  : Math.max(0, Math.min(volume, 1.0))

    this.audio = new Audio()
    this.audio.autoPlay = false
    this.checkDelay = 100

    this._pause = this._pause.bind(this)

    const events = [
      "canplaythrough"
    , "error"
    , "playing"
    , "pause"
    , "ended"
    ]
    const listener = this.stateUpdate.bind(this)
    this.cancel = this._addListeners(this.audio, events, listener)

    if (options.url) {
      this.setURL(options.url, !!options.loop)
    }
  }


  setURL(url, loopOrCallback) {
    switch (typeof loopOrCallback) {
      case "number":
        if (loopOrCallback) {
          break
        }
        // if loopOrCallback is explicitly 0, then fall through and
        // remove callback
      case "function":
        this.audio.loop = false
        this.callback = loopOrCallback
      break

      case "boolean":
        this.audio.loop = !!loopOrCallback
    }

    this.audio.src = url
    this.ready = false
    this.error = false
    this.paused = false
    this.playing = false

    return this._checkForPlaythrough()
  }


  setVolume(volume) {
    volume = parseFloat(volume)

    if (isNaN(volume)) {
      return
    }

    this.audio.volume = this.volume = Math.max(0, Math.min(volume, 1))
  }


  play() { // Returns a promise
    if (this.playing) {
      return Promise.resolve("Already playing")
    }

    if (!this.paused) {
      return this._startToPlay()

    } else {
      return this._unPause()
    }
  }


  pause() {
    let promise

    if (this.playing) {
      promise = this._fade(-1).then ((result) =>  
        this._pause(result)
      )
    } else {
      promise = Promise.resolve("Not currently playing")
    }

    return promise
  }


  _checkForPlaythrough() {
    return Promise.resolve()

    const x =new Promise((resolve, reject) => {

      const checkForPlaythrough = () => {
        if (this.ready) {
          resolve("Audio ready for playthrough")

        } else if (this.error) {
          reject("Audio error for " + this.audio.currentSrc)

        } else {
          // console.log("checking", this.audio.currentSrc)
          setTimeout(checkForPlaythrough, this.checkDelay)
        }
      }

      checkForPlaythrough()  
    })
  }


  _startToPlay() {
    return this._checkForPlaythrough().then(
      () => this.audio.play()
    , (error) => console.log(error)
    )
  }


  _fade(direction) {
    let volume  = (direction < 0)
                ? this.audio.volume
                : this.volume
    const delay = 10 // ms
    const delta = (volume / this.fadeTime) * delay
    if (this.audio.volume === 0) {
      volume = 0
    }

    const promise = new Promise((resolve, reject) => {
      const fade = () => {
        volume += delta * direction
        volume = Math.max(0, Math.min(volume, this.volume))
        this.audio.volume = volume

        if (volume === this.volume) {
          resolve("faded in")

        } else if (!volume ) {
          resolve("faded out")

        } else {
          setTimeout(fade, delay)
        }
      }

      fade()
    })

    return promise
  }


  _pause(result) {
    this.audio.pause()
    this.paused = true
    this.playing = false

    return result
  }


  _unPause() {
    this.audio.volume = 0
    this.audio.play()
    this.playing = true
    return this._fade(+1)
  }


  _addListeners(element, events, listener) {
    events.forEach( event => {
      this.audio.addEventListener(event, listener, false)
    })
  
    return { element, events, listener }
  }


  _removeListeners(cancelData) {
    const element = cancelData.element
    const listener = cancelData.listener
    const events = cancelData.events
    events.forEach( event => {
      element.removeEventListener(event, listener, false)
    })
  }


  stateUpdate(event) {
    switch (event.type) {
      case "canplaythrough":
        this.ready = true
      break

      case "playing":
        this.playing = true
        this.paused = false
      break

      case "pause":
        this.paused = true
        this.playing = false
      break

      case "ended":
        this.paused = false
        this.playing = false
        if (this.callback) {
          this.callback(this)
        }
      break

      case "error":
        this.ready = false
        // console.log("Audio error: " + this.audio.currentURL)
    }
  }
}



export class Background {
  constructor({ simultaneous, music }) {
    this.simultaneous = simultaneous
    // this.audioData
    // this.audioPlayer
    // this.audioPlayers

    this.loadNext = this.loadNext.bind(this)
    this.playing = false

    if (simultaneous) {
      this.playSimultaneous(music)
    } else {
      this.playConsecutive(music)
    }
  }


  play() {
    if (this.simultaneous) {
      this.audioPlayers.forEach(player => player.play())
    } else {
      this.audioPlayer.play()
    }

    this.playing = true
  }


  pause() {
    if (this.simultaneous) {
      this.audioPlayers.forEach(player => player.pause())
    } else {
      this.audioPlayer.pause()
    }

    this.playing = false
  }


  playSimultaneous (audio) {
    this.audioPlayers = []

    audio.forEach( data => {
      const audioPlayer = new AudioPlayer({})

      audioPlayer.setVolume( data.volume )
      audioPlayer.setURL( data.url, true) // loop, returns promise
                 
      this.audioPlayers.push(audioPlayer)
    })
  }


  playConsecutive(audioData) {
    this.audioData = audioData
    this.audioPlayer = new AudioPlayer()
    this.loadNext()
  }


  loadNext() {
    const data = this.audioData.shift()
    this.audioData.push(data)

    this.audioPlayer.setVolume( data.volume )
    this.audioPlayer.setURL( data.url, this.loadNext)
                    .then(() => {
                      if (this.playing) {
                        return this.audioPlayer.play()
                      }
                    })    
  }
}



export class Pool {
  constructor() {  
    this.pool = this._createAudioPool(7)
  }


  fillWith(assets) {
    this.LUT = this._createLUT(assets)
    // console.log("LUT", this.LUT)
    this.used = []
    this.lock = []

    this.recyclePlayer = this.recyclePlayer.bind(this)
  }


  playSFX(name, type, random) {
    const url = random
              ? this._getRandom(type)
              : this.LUT[name][type]

    this.play(url)
  }


  play(url) {
    if (!url) {
      return
    }
    
    const player = this.pool.pop()

    if (!player) {
      // There are too many sounds playing
      return
    }

    player.setURL(url, this.recyclePlayer)
          .then(() => {
             player.play()
           })
  }


  recyclePlayer(player) {
    removeFrom(this.used, player)
    removeFrom(this.lock, player)
    this.pool.unshift(player)
  }


  _createLUT(arrayOfArrays) {
    const cellLUT = {}

    arrayOfArrays.forEach(array => {
      array.forEach(itemData => {
        cellLUT[itemData.name] = itemData  
      })
    })

    return cellLUT
  }


  _createAudioPool(count) {
    return Array(count).fill(1).map( item => new AudioPlayer())
  }


  _getRandom(type) {
    const cellNames   = Object.keys(this.LUT)
    const randomIndex = Math.floor(Math.random() * cellNames.length)
    const randomCell  = this.LUT[cellNames[randomIndex]]

    return randomCell[type]
  }
}