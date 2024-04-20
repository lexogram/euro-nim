/**
 * src/components/Overlay.jsx
 */

import React from 'react'
import { StyledOverlay } from './Styles.jsx'
import Theme from '../assets/theme.js'

export class Overlay  extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.decorateText = this.decorateText.bind(this)
  }


  massageText(string, splitHeader) {
    let header
    const array = string.split("\n")
    if (splitHeader) {
      header = array.shift()
    }
    const text = array.map((chunk, index) => {
      const match = /^(.*)\*(.*)\*(.*)$/.exec(chunk)

      if  (match) {
        return <p key={index}>
          {match[1] || ""}
          <strong>{match[2]}</strong>
          {match[3] || ""}
        </p>
      }

      return <p key={index}>{chunk}</p>
    })

    if (splitHeader) {
      return { header, text }
    }

    return text
  }


  decorateText() {
    if (!( this.props.gameState.vsAI
       && !this.props.gameState.noHints
       )) {
      return
    }

    const options = {
      element: this.ref.current   
    , initial: 0
    , duration: 0
    , decay: 10
    , text: this.ref.current.innerText
    }
    new (this.props.TextAnimator)(options)
  }

  render() {
    // console.log("Overlay", props)
    let {
      unlocked
    , showRules
    , winner
    , tips
    , noHints } = this.props.gameState

    let text = ""
    const className = noHints
                    ? "ace"
                    : ""
    const css = {}

    if (!unlocked) {
      // LOADING
      text = <div><img
        src={Theme.config.basic.spinner}
        style={{
          width: "10vmin"
        , height: "10vmin"
        , opacity: 0.5
      }}
      /></div>

    } else if (showRules) {
      // SHOW RULES
      text = this.massageText(Theme.config.strings.rules)

      text = <div>
        <h1>{Theme.config.strings.title}</h1>
        <h2>{Theme.config.strings.slogan}</h2>
        <div>
          {text}
        </div>
      </div>

    } else if (winner) {
      // WINNER
      winner = this.massageText(winner, true)
      text = <div>
        <h1
          ref={this.ref}
          className={className}
        >
          {winner.header}
        </h1>
        {winner.text}
      </div>
      
      setTimeout(this.decorateText, 0)

    } else {
      css.display = "none"
    }

    return (
      <StyledOverlay
        id="Overlay"
        style={css}
      >
        {text}
      </StyledOverlay>
    )
  }
}
