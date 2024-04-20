/**
 * src/components/Items.jsx
 */

import Theme from "../assets/theme"
import { Hintbox } from "./Hintbox"
import { Restart } from "./Restart"
import { ButtonBlock } from "./ButtonBlock"
import {
  StyledMenu,
  StyledSubset
} from "./Styles"


export const Items = ({ onChange, menuOpen, menuState, pane  }) => {
  const menu = Theme.config.menu
  const { restart, allowHints } = menu
  const { callback, checkList, gameState } = menuState
  const { credits, music, sfx, gameOver } = gameState

  const menuItems = (function menuItems() {

  // console.log("menuItems gameState", gameState)

    if (!allowHints) {
      return []
    }

    return ["undo", "steps", "tips", "groups"]
    .filter( hint => {
      const allow = "allow"
                  + hint[0].toUpperCase()
                  + hint.substring(1)

      // console.log("filter", allow, menu[allow])

      if (menu[allow]) {
        return true
      }
    }).map( hint => (
      <Hintbox
        key={hint}
        id={hint}
        label={menu[hint]}
        checked={checkList[hint]}
        onChange={(event) => onChange(event, hint)}
        disabled={!checkList.hints}
      />
    ))
  })()

  // console.log(menu)

  const hints = (menuItems) => (
    <StyledMenu
     id="Items"
     ref={pane}
     open={menuOpen}
    >
      <Restart
        disabled={gameOver}
        onClick={() => onChange("restart")}
      >
        {restart}
      </Restart>
      <Hintbox
        key="hints"
        id="hints"
        label={menu.hints}
        checked={checkList.hints}
        onChange={(event) => onChange(event, "hints")}
      />
      <StyledSubset>
        {menuItems}
      </StyledSubset>
      <ButtonBlock
        callback={callback}
        buttonStates={{ credits, music, sfx }}
      />
    </StyledMenu>
  )

  return hints(menuItems)
}