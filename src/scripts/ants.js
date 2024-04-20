/**
 * src/scripts/ants.js
 */

import Theme from "../assets/theme"
import { toneColor } from "./utilities"

export const ants = (function sanitize(options) {
  if (typeof options !== "object") {
    options = {}
  }

  const defaults = {
    color:   "#fff"
  , length:  10
  , ratio:   5
  , opacity: 0
  , speed:   10
  }

  let temp = options.color
  if ( typeof temp === "string"
     && /#[A-Fa-f0-9]{3,6}$/.test(temp)
     && [0, 4, 7].indexOf(temp.length) > 0
     ) {} else {
    options.color = defaults.color
  }
  const color = options.color

  temp = getNumber(options.length, 1, 200)
  if (temp === false) {
    options.length = defaults.length
  } else {
    options.length = temp
  }
  const length = options.length

  temp = getNumber(options.ratio, 1, 10)
  if (temp === false) {
    options.ratio = defaults.ratio
  } else {
    options.ratio = temp
  }
  const ratio = options.ratio

  const width = options.width = length / ratio

  // An empty string for options.radius gives a curve the same as
  // the rounded end of the dashes. 0 gives a square corner.
  temp = getNumber(options.radius, 0, 100)
  if (temp === false) {
    options.radius = width / 4
  } else {
    options.radius = temp
  }

  temp = getNumber(options.opacity, 0, 1)
  if (temp === false) {
    options.opacity = defaults.opacity
  } else {
    options.opacity = temp
  }

  temp = getNumber(options.speed, 0, 100)
  if (temp === false) {
    options.speed = defaults.speed
  } else {
    options.speed = temp
  }
  const speed = options.speed

  options.dashArray = length * (ratio - 1) / ratio
                    + " "
                    + length * (ratio + 1) / ratio

  options.time = speed ? 10 / speed : 0

  options.dark  = toneColor(color, 0.75)
  options.light = toneColor(color, 1.33)

  return options

  function getNumber(value, min, max) {
    value = parseFloat(value)

    if ( isNaN(value) ) {
      return false
    } else {
      return Math.max(min, Math.min(value, max))
    }
  }
})(Theme.config.select)
