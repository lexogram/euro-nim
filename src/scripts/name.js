/** name.js **
 *
 * 
**/

import Theme from '../assets/theme.js'

const display = Theme.config.display


const pStyle = `
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: 0;

  color: ${display.flashColor}; 
  background-color: rgba(0,0,0,0.5);

  pointer-events: none;
  font-size: 1vmin;
`

const scarStyle = {
  color: display.scarColor
, fontWeight: "normal"
}


const showName = (div) => {
  const title = div.dataset.title

  if (title) {
    let p = div.querySelector("p")
    if (!p) {
      p = document.createElement("p")
      p.className = "title unselectable"
      div.appendChild(p)
    }

    p.innerHTML = title
    p.setAttribute("style", pStyle)
  }
}


let lastSet = []


const replaceLastSetWith = (newSet) => {
  // console.log("newSet:", newSet, "lastSet:", lastSet)
  lastSet.forEach( div => {
    const element = div.querySelector(".title")
    if (element) {
      div.removeChild(element)
    }
  })

  lastSet = newSet
}


export const name = elementArray => { 
  replaceLastSetWith(elementArray)
  elementArray.forEach(element => showName(element))
}