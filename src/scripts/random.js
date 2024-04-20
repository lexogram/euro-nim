/**
 * src/scripts/randomPadding.js
 */


export const randomPadding = (random, count, index) => {
  const getSpacing = (count, index) => {
    switch (count) {
      case 1:
        return 1 // centre

      case 3:
        switch(index) {
          case 0: return 2

          case 1: return 0
          case 2: return 2
        }

      case 5:
        switch (index) {
          case 0: return 2

          case 1: return 0
          case 2: return 2/3
          case 3: return 4/3
          case 4: return 2
        }

      case 7:
        switch (index) {
          case 0: return 2

          case 1: return 0
          case 2: return 2

          case 3: return 0
          case 4: return 2/3
          case 5: return 4/3
          case 6: return 2
        }
    }
  }

  // cell size ≈ 12.8vmin x 22.5vmin (or 25), image size is 2vmin less,
  // leaving at least 11.7vmin of leeway vertically
  const max = 11.7
  const range = random.yAxis
              ? random.yAxis * max / 100
              : 0

  const h = count // calculate spacing based on position
          ? getSpacing(count, index)
          : random.xAxis // calculate spacing randomly
            ? Math.random() * 2
            : 1

  const v = count // padding was calculated earlier: use given top
          ? max / 2 //top
          : range // we haven't calculated padding yet: use range
            ? (Math.random() * range) + (max - range) / 2
            : max / 2
  const padding = `${v}vmin ${h}vmin ${max - v}vmin ${2 - h}vmin`

  return padding
}


export const randomRotation = (random, display) => {
  // Allow up to ± random-rotation
  const degrees = !random.maximize && random.rotation
                ? Math.random() * random.rotation
                  - random.rotation / 2
                : 0
  const radians = Math.PI * (degrees + 45) / 180
  const length  = display.shadowLength
  const color   = display.shadowColor
  const x = Math.sin(radians) * length
  const y = Math.cos(radians) * length

  return "transform: rotate(" + degrees + "deg);"
       + "filter: drop-shadow("
           +x+"vmin "+y+"vmin "+length+"vmin "+color
       + ");"
}