/**
 * src/components/ButtonBlock.jsx
 */

import Theme from "../assets/theme"
import { Credits } from "./Credits"
import { ToggleButton } from "./Styles"


export const ButtonBlock = ({ callback, buttonStates }) => {
  // console.log("ButtonBlock", "callback:", callback, "buttonStates:", buttonStates)
  return (
    <div
      id="block"
      style={{
        position: "absolute"
      , bottom: 0
      , left: 0
      , display: "flex"
      , justifyContent: "space-between"
      , width: "100%"
      }}
    >
      <Credits
        visible={buttonStates.credits}
      />
      <ToggleButton
        $active={buttonStates.credits}
        $on={Theme.config.menu.credits}
        $off={Theme.config.menu.credits}
        onClick={() => callback("credits")}
        style={{zIndex: 3}}
      />
      <div>
        <ToggleButton
          $active={buttonStates.sfx}
          on={Theme.config.menu.sfx}
          $off={Theme.config.menu.nosfx}
          onClick={() => callback("sfx")}
        />
        <ToggleButton
          $active={buttonStates.music}
          $on={Theme.config.menu.music}
          $off={Theme.config.menu.nomusic}
          // disabled={!buttonStates.sfx}
          onClick={() => callback("music")}
        />
      </div>
    </div>
  )
}