import React, { lazy } from 'react'
import styled, { css } from 'styled-components'
import { toneColor, translucify, getRandom } from './utilities'
import Theme from '../assets/theme.js'

const display = Theme.config.display
display.flashColor = translucify(display.flashColor, display.flashOpacity)
display.scarColor  = translucify(display.scarColor, display.flashOpacity)


export class Zalgo {
  constructor(options) {
    options = this.sanitize(options)
    this.element = options.element

    this.length = options.length
    this.letters = options.letters
    this.max = options.max
    this.decay = Math.min(10, (10 - options.decay))
    this.initial = options.initial
    this.duration = options.duration
    this.text = options.text
    this.scarStyle = options.scarStyle

    if (this.text) {
      this.renderText = this.text.split("")
      this.length = this.renderText.length
    } else {
      this.renderText = Array(this.length).fill("&nbsp;")
    }

    this.textArray = this.renderText.map( char => ({
      char
    , up: []
    , mid: []
    , down: []
    }))

    this.start = +new Date()
    this.zalgo = this.zalgo.bind(this)

    this.initialize()

    for ( let ii = 0; ii < this.initial; ii += 1 ) {
      this.zalgo(true)
    }
    this.zalgo()
  }


  sanitize(options) {
    const defaults = {
      length: 32
    , letters: "aceimnorsuvwxz   " // includes not breaking spaces
    , max: 23
    , decay: 3
    , initial: 0
    , text: false
    , scarStyle: { opacity: 0 }
    }

    if ( typeof options !== "object"
      || !(options.element instanceof HTMLElement)) {
      throw new Error("HTMLElement required for Zalgo")
    }

    let  temp = options.length
    if (isNaN(temp)) {
      options.length = defaults.length
    } else {
      options.length = Math.max(1, Math.min(temp, 64))
    }

    temp = options.letters
    if (typeof temp !== "string") {
      options.letters = defaults.letters
    }

    temp = options.max
    if (isNaN(temp)) {
      options.max = defaults.max
    } else {
      options.max = Math.max(8, Math.min(temp, 64))
    }

    temp = options.decay
    if (isNaN(temp)) {
      options.decay = defaults.decay
    } else {
      options.decay = Math.max(0, Math.min(temp, 10))
    }

    temp = options.initial
    if (isNaN(temp)) {
      options.initial = defaults.initial
    } else {
      options.initial = Math.max(0, Math.min(temp, 1024))
    }

    temp = options.duration
    if (isNaN(temp)) {
      options.duration = defaults.duration
    } else {
      options.duration = Math.max(0, temp)
    }

    temp = options.text
    if (typeof temp !== "string") {
      options.text = text || false
    }

    temp = options.scarStyle
    if (typeof temp !== "object") {
      options.scarStyle = defaults.scarStyle
    }

    return options
  }


  initialize() {
    this.combiningMarks = {
      up: [ "&#836;", "&#776;", "&#830;", "&#780;", "&#794;", "&#849;"
          // ̈́         ̈         ̾         ̌         ̚         ͑
          , "&#773;", "&#778;", "&#843;", "&#838;", "&#770;", "&#831;"
          // ̅         ̊         ͋        ͆         ̂         ̿
          , "&#779;", "&#774;", "&#769;", "&#842;", "&#772;", "&#783;"
          // ̋         ̆         ́         ͊         ̄         ̏
          , "&#768;", "&#782;", "&#844;", "&#777;", "&#771;", "&#775;"
          // ̀         ̎         ͌         ̉         ̃         ̇
          , "&#784;", "&#781;", "&#850;", "&#834;", "&#829;", "&#769;"
          // ̐         ̍         ͒         ͂         ̽         ́
          , "&#785;", "&#788;", "&#855;", "&#786;", "&#835;", "&#787;"
          //           ̔         ͗         ̒         ̓         ̓
          ]
    , mid:[ "&#789;", "&#795;", "&#801;", "&#802;", "&#807;", "&#808;"
          // ̕         ̛         ̡         ̢         ̧         ̨
          , "&#832;", "&#833;", "&#847;", "&#856;", "&#860;", "&#861;"
          // ̀         ́        ͏         ͘         ͜        ͝
          , "&#862;", "&#863;", "&#864;", "&#865;", "&#866;", "&#820;"
          // ͞        ͟         ͠         ͡         ͢        ̴
          , "&#821;", "&#822;", "&#823;", "&#824;", "&#1161;"
          // ̵         ̶         ̷         ̸          ҉
          ]
    , down:["&#819;", "&#818;", "&#837;", "&#791;", "&#813;", "&#826;"
          // ̳         ̲         ͅ         ̗         ̭         ̺
          , "&#817;", "&#805;", "&#792;", "&#790;", "&#825;", "&#839;"
          // ̱         ̥         ̘         ̖         ̹         ͇
          , "&#797;", "&#846;", "&#814;", "&#812;", "&#799;", "&#798;"
          // ̝         ͎         ̮         ̬         ̟         ̞
          , "&#809;", "&#828;", "&#845;", "&#841;", "&#815;", "&#803;"
          // ̩         ̼         ͍         ͉        ̯         ̣
          , "&#858;", "&#804;", "&#816;", "&#840;", "&#851;", "&#810;"
          // ͚         ̤         ̰         ͈        ͓         ̪
          , "&#806;", "&#811;", "&#800;", "&#827;", "&#793;", "&#796;"
          // ̦         ̫         ̠         ̻         ̙         ̜
          ]
    }

    this.zones = Object.keys(this.combiningMarks)
  }


  getRandom(max) {
    let iterations = 3 // <<< HARD-CODED
    const ratio = max / iterations
    let random = 0

    while(iterations--) {
      random += (Math.random())
    }
    return Math.floor(random * ratio)
  }


  applyScarStyle() {
    const styles = Object.keys(this.scarStyle)
    styles.forEach( style => {
      this.element.style[style] = this.scarStyle[style]
    })
 }


  zalgo(noRender) {
    const randomIndex = this.getRandom(this.length)
    const victim = this.textArray[randomIndex]
    let random = Math.floor(Math.random() * this.zones.length)
    const zone = this.zones[random]
    const array = victim[zone]
    const marks = this.combiningMarks[zone]

    random = Math.floor(Math.random() * marks.length)
    const mark =  marks[random]
    random = Math.floor(Math.random() * this.letters.length)
    if (!this.text) {
      victim.char = this.letters[random]
    }

    if (zone === "mid") {
      if (array.indexOf(mark) < 0) {
        // Keep adding marks
        array.push(mark)
      }
    } else {
      array.push(mark)
      if (array.length > this.max) {
        array.shift()
      }
    }
    this.renderText[randomIndex] = victim.char
                                 + victim.up.join("")
                                 + victim.mid.join("")
                                 + victim.down.join("")

    if (!noRender) {
      this.element.innerHTML =  this.renderText.join("")

      const elapsed = +new Date - this.start
      if (!this.duration || (elapsed < this.duration)) {
        setTimeout(this.zalgo, ((elapsed) >>> this.decay) + 1)
      } else {
        this.applyScarStyle()
      }
    }
  }
}


const zalgoStyle = `
  position: absolute;
  top: 0;
  color: ${display.flashColor};
  margin: 0;
  pointer-events: none;

  text-align: center;
  font-weight: bold;
  transform-origin: top left;
  transition: color ${display.scarFade}ms;
`

const scarStyle = {
  color: display.scarColor
, fontWeight: "normal"
}


const doZalgo = (div) => {

  /// <<< HARD-CODED
  const ratio = 24
  /// HARD-CODED g>>>

  let element = div.querySelector("p")
  if (!element) {
    element = document.createElement("p")
    element.className = "zalgo unselectable"
    div.appendChild(element)
  }

  const getRandomSegment = (width, height, fontSize) => {
    // Choose a random point inside a rectangle
    const x   = getRandom(fontSize, width - fontSize)
    const y   = getRandom(fontSize, height - fontSize)
    let a     = getRandom(0, 360)
    const tan = Math.tan(a * Math.PI / 180)
    // y = ax + b where a is the slope = tan
    const b   = y - tan * x
    // y = b where segment crosses x = 0
    let x1 = 0
    let y1 = b
    if (b < 0) {
      y1 = 0
      x1 = - b / tan
    } else if (b > height) {
      y1 = height
      x1 = (y1 - b) / tan
    }

    let x2 = width
    let y2 = tan * x2 + b
    if (y2 < 0) {
      y2 = 0
      x2 = - b / tan
    } else if (y2 > height) {
      y2 = height
      x2 = (y2 - b) / tan
    }

    a = Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI

    return [{ x: x1, y: y1 }, { x: x2, y: y2 }, a]
  }

  const pythagoras = ( point1, point2 ) => {
    const deltaX = point1.x - point2.x
    const deltaY = point1.y - point2.y
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  const rect = div.getBoundingClientRect() // dimensions in px
  const height = rect.height
  const width  = rect.width
  const diagonal = Math.sqrt((height * height + width * width))

  let fontSize = width / ratio
  const segment = getRandomSegment(width, height, fontSize * 2)
  const angle   = segment[2]

  const startX = segment[0].x
  const startY = segment[0].y
  const length = pythagoras(segment[0], segment[1])
  const transform = `
    translate(${startX}px, ${startY}px)rotate(${angle}deg)
  `
  fontSize *= length / width

  element.setAttribute("style", zalgoStyle)
  element.style.transform = transform
  element.style.width = length + "px"
  element.style.fontSize = fontSize + "px"

  const hintCount = display.hints.length
  const text = hintCount
             ? display.hints[Math.floor(Math.random() * hintCount)].text
             : ""

  new Zalgo({
    element
  , initial: 512
  , duration: display.flashDuration
  , decay: 0
  , text: text
  , scarStyle
  })
}


let lastSet = []


const replaceLastSetWith = (newSet) => {
  // console.log("newSet:", newSet, "lastSet:", lastSet)
  lastSet.forEach( div => {
    const element = div.querySelector(".zalgo")
    if (element) {
      div.removeChild(element)
    }
  })

  lastSet = newSet
}


export const zalgo = elementArray => {
  replaceLastSetWith(elementArray)
  elementArray.forEach(element => doZalgo(element))
}