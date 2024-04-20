/**
 * src/components/Menu.jsx
 */


import React from 'react'
import { Items } from './Items'
import {
  StyledControls,
  StyledSVG
} from "./Styles"


export class Menu extends React.Component {
  constructor (props) {
    // console.log("Menu props", props)
    super(props)

    // Create a ref so that we can detect a mousedown outside the
    // ref in closeMenu
    this.pane = React.createRef()

    this.callback = props.callback
    this.onChange = this.onChange.bind(this)
    this.openMenu = this.openMenu.bind(this)
    this.closeMenu  = this.closeMenu.bind(this)
    this.state = { menuOpen: false } // true } //
  }


  openMenu(event) {
    const canOpen = this.props.gameState.unlocked // belt and braces
                 && !this.state.menuOpen
                 && !this.ignoreOpen
    if (canOpen) {
      this.setState({ menuOpen: true })

      const listener = this.closeMenu
      document.body.addEventListener("touchstart", listener, true)
      document.body.addEventListener("mousedown", listener, true)
    }
  }


  closeMenu(event) {
    // Check if the click was inside the slide-out menu. If not,
    // close the menu

    if (event.type === "touchstart") {
      // Prevent the mouseup from firing right behind
      this.timeout = setTimeout(() => this.timeout = 0, 300)
    } else if (this.timeout) {
      return
    }

    const pane = this.pane.current
    if (pane&& !pane.contains(event.target)) {
      this.setState({ menuOpen: false })

      // Prevent
      this.ignoreOpen = true
      setTimeout(() => this.ignoreOpen = false, 100)

      const listener = this.closeMenu
      document.body.removeEventListener("touchstart", listener, true)
      document.body.removeEventListener("mousedown", listener, true)
    }
  }


  onChange(event, hint) {
    // console.log(event.target, hint)
    if (event === "restart") {
      this.setState({ menuOpen: false })
      return this.callback("restart")
    }

    // Toggle hint
    const checkList = this.props.checkList
    const state = checkList[hint] = !checkList[hint]
    const action = {}
    action[hint] = state

    this.setState({ checkList })

    this.callback(action) // { <hint>: <boolean> }
  }


  render() {
    // console.log("Menu prop:", this.props)
    return (
      <StyledControls
        id="Controls"
      >
        {/* <Items
          pane={this.pane}
          onChange={this.onChange}
          menuOpen={this.state.menuOpen}
          menuState={this.props}
        /> */}
        <StyledSVG
          id="openMenu"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          open={this.state.menuOpen}
          onClick={this.openMenu}
          disabled={!this.props.gameState.unlocked}
          $visible={!this.props.gameState.credits}
        >
          <g className="menu">
            <path d="
              M5,20
              L5,80
              H95
              L95,20
              z" opacity="0" />
            <path d="
              M15,10
              H85
              a 10 10 180 0 1 0 20
              H15
              a 10 10 180 0 1 0 -20
              z" />
            <path d="
              M15,40
              H85
              a 10 10 180 0 1 0 20
              H15
              a 10 10 180 0 1 0 -20
              z" />
            <path d="
              M15,70
              H85
              a 10 10 180 0 1 0 20
              H15
              a 10 10 180 0 1 0 -20
              z" />
          </g>
        </StyledSVG>
      </StyledControls>
    )
  }
}