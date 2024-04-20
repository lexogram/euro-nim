/** name.js **
 *
 * 
**/

import Theme from '../assets/theme.js'

const back = Theme.config.basic.back





const flipItem = (div) => {
  let backImage = div.querySelector("img.back")
  if (!backImage) {
    backImage = document.createElement("img")
    backImage.className = "back unselectable"
    div.appendChild(backImage)

    backImage.setAttribute("style", imageStyle())
  }

  backImage.src = back
}



const imageStyle = () => {
  let style = ""
  const random = Theme.config.random

  // Allow up to ± random-rotation
  if (!random.maximize && random.rotation) {
    const degrees = Math.random() * random.rotation
    const radians = Math.PI * (degrees + 45) / 180

    style += "transform: rotate(" + degrees + "deg);"
  }

  style += `position: absolute;
  width:100%;
  `

  return style
}


let lastSet = []


const replaceLastSetWith = (newSet) => {
  // console.log("newSet:", newSet, "lastSet:", lastSet)
  lastSet.forEach( div => {
    const element = div.querySelector(".back")
    if (element) {
      div.removeChild(element)
    }
  })

  lastSet = newSet
}


export const flip = elementArray => { 
  replaceLastSetWith(elementArray)
  elementArray.forEach(element => flipItem(element))
}