/**
 * src/components/Button.jsx
 */


import Theme from "../assets/theme"
import { StyledButton } from "./Styles"


export const Button = ({ side, gameState, buttonDown }) => {
  const {
    gameOver
  , vsAI
  , player
  , button
  , selected
  , removed
  , hints
  , undo
  , winning
  , unlocked
  } = gameState

  let disabled = !(selected && selected.length)

  const getClassName = () => {
    let className = "unselectable" // always

    if (button) {
      // The player is interacting with one of the buttons...
      if (button.side === side && button.down) {
        // ... and it's this one, and it's pressed
        className += " pressed"
      }
    } else if ( disabled
             && ( (side === "left" && player === 1)
               || (side === "right" & player === 2)
                )
             ) {
      className += " prompt"
    }

    return className
  }


  // console.log(disabled, gameState)

  let text

  if (side === "left") {
    if (vsAI && removed.length === removed.initial) {
      disabled = false
    }

    if (gameOver) {
      text = Theme.config.strings.playMate
      disabled = false

    } else {
      switch (player) {
        default: // AI or player2 is playing
          text = Theme.config.strings.player1
          disabled = true
        break
        case 1:
          text = disabled
               ? vsAI
                 ? Theme.config.strings.yourTurn // Your turn
                 : Theme.config.strings.player1
                   + Theme.config.strings.toPlay // Player 1 to play
               : Theme.config.strings.play       // Play
        break
      }
    }

  } else if (side === "right") {
    if (gameOver) {
      text = Theme.config.strings.playAI
      disabled = false

    } else if (vsAI) {
      disabled = true

      if (player) {
        if (hints && undo && winning) {
          text = Theme.config.strings.undo
          disabled = false
        } else {
          text = Theme.config.strings.ai
        }
      } else {
        text = Theme.config.strings.aiThinking
      }

    } else {
      switch (player) {
        case 1:
          text = Theme.config.strings.player2
          disabled = true
        break
        case 2:
          text = disabled
               ? Theme.config.strings.player2
                 + Theme.config.strings.toPlay // Player 2 to play
               : Theme.config.strings.play     // Play
        break
      }
    }
  }

  // When a button is active (pressed or rolled-off), button will
  // by truthy
  const className = getClassName()

  if (!unlocked) { disabled = true }

  return (
     <StyledButton
       disabled={disabled}
       onMouseDown={buttonDown}
       onTouchStart={buttonDown}
       className={className}
     >
       {text}
     </StyledButton>
  )
}
