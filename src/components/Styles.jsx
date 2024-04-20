/**
 * src/components/Styles.jsx
 */

import styled from 'styled-components'
import { getFontFamily } from '../scripts/fontFamily'
import Theme from '../assets/theme'
import { 
  toneColor,
  translucify
} from '../scripts/utilities.js'
const size = "12.8vmin"

export const colors = {
  basic:      Theme.config.colors.backgroundColor
  , tint:     toneColor(Theme.config.colors.backgroundColor, 1.2)
  , darker:   toneColor(Theme.config.colors.backgroundColor, 0.95)
  , shade:    toneColor(Theme.config.colors.backgroundColor, 0.8)
  , winner:   translucify( Theme.config.colors.backgroundColor
                         , Theme.config.colors.opacity / 100)
  , text:      Theme.config.colors.textColor
  , prompt:    translucify(Theme.config.colors.promptColor, 0.6667)
  , disabled:  translucify(Theme.config.colors.textColor, 0.25)

  , menu:      translucify(
                 toneColor( Theme.config.colors.backgroundColor, 1.05)
               , Theme.config.colors.opacity / 100
               )
  , checked:   toneColor(Theme.config.colors.backgroundColor, 1.25)
  , unchecked: toneColor(Theme.config.colors.backgroundColor, 0.9)
  , focus:     toneColor(Theme.config.colors.backgroundColor, 1.333)

  , levels:    translucify(
                 toneColor(Theme.config.colors.backgroundColor, 1.1)
               , .95)
  , level:     translucify(Theme.config.colors.promptColor, 0.5)

  , highlight: toneColor(Theme.config.display.borderColor, 1.25)
  , shadow:    toneColor(Theme.config.display.borderColor, 0.75)
}


export const Container = styled.div`
  background-color: ${() => Theme.config.colors.backgroundColor};

  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: '${() => getFontFamily(Theme.config.strings.fontFamily)}', sans-serif;
  color: ${() => Theme.config.colors.textColor};
  text-align: center;

  @media(min-aspect-ratio: 4/3) {
    justify-content: flex-start;
  }
`


export const PlayArea = styled.div`
  position: relative;
  height: calc(100vh - 10vmin);
  width: 100vw;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  & div.background { 
    position: absolute;
    background-image: url(${props => props.$background});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${Theme.config.basic.bgOpacity};
    width: 100%;
    height: 100%;
  }

  @media(max-aspect-ratio: 100/118) {
    align-items: start;
  }

  @media(max-aspect-ratio: 100/121) {
    align-items: center;
  }

  @media(max-aspect-ratio: 20/23) {
    height: calc(100vh - 15vmin);
  }

  @media(min-aspect-ratio: 4/3) {
    height: 100vh;
    width: calc(100vw - 33.333vh);
  }
`

export const StyledButtons = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;

  @media(max-aspect-ratio: 20/23) {
    // height: 15vmin;
  }

  @media(min-aspect-ratio: 4/3) {
    width: auto;
    height: 100vh;
    bottom: auto;
    right: 0;
    flex-direction: column;
    align-items: flex-end;
  }
`


export const StyledBoard = styled.div`
  position: relative;


  background-image: url(${Theme.config.basic.background});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;


  height: calc(100vh - 10vmin);
  width: calc(100vh - 10vmin);
  color: #fff;

  @media(max-aspect-ratio: 20/23) {
    height: 100vw;
    width: 100vw;
  }

  @media(min-aspect-ratio: 4/3) {
    height: 100vh;
    width: 100vh;
  }
`


export const StyledRow = styled.div`
  display: flex;
  justify-content: ${Theme.config.basic.alignment};
  align-items: center;
  height: 22.5vmin;

  @media(max-aspect-ratio: 100/118) {
    height: 25vw;
    }
  }

  @media(min-aspect-ratio: 4/3) {
    height: 25vh;
    }
  }
`


export const StyledShrinkWrap = styled.div`
  display: inline-block;
  box-sizing: border-box;
  transition: padding ${props =>
    props.$groups
   ? Theme.config.menu.groupDuration
   : 0
  }s;
  padding: ${props =>
    props.groups
    ? props.$gaps
      ? props.theme.equal
      : props.theme.spacing
    : props.theme.padding
  };
`


export const StyledFrame = styled.div`
  ${props => props.children
           ? ""
           : "visibility: hidden;"}

  position: relative;
  display: flex;
  overflow: hidden;
  ${ Theme.config.random.maximize
    ? `width: calc(${size} - 0.2vmin);`
    : `height: calc(${size} - 2vmin);
       width: calc(${size} - 2vmin);`
  }
  background-color: ${Theme.config.display.bgColor};
  border:${Theme.config.display.borderWidth}vmin solid ${colors.shadow};
  border-top-color: ${colors.highlight};
  border-left-color: ${colors.highlight};
  border-radius: ${Theme.config.display.borderRadius}vmin;

  &.group {
    left: 0!important
    transition: left ${Theme.config.menu.groupDuration}s;
  }

  &.selected {
    background-color: ${Theme.config.display.selected};
  }

  &.selected img {
    opacity: ${Theme.config.display.selectOpacity}
  }
`


export const StyledImage = styled.img`
  position: relative;
  height: 100%;
  width: 100%;
  cursor: ${props => props.cursor};
  ${props => props.theme.rotation}
`


/// STEP-BY-STEP LEVEL

export const StyledLevel = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: ${props => props.$length}%;
  height: 3vmin;
  background-color: ${props => props.color};

  ${props => props.$steps ? "" : "display: none;" }
  ${props => props.onMouseDown ? "" : "pointer-events: none;"}

  @media(min-aspect-ratio: 106/110) {
    height: ${props => props.$length}vh;
    width: 3vmin;
  }
`

export const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 10vmin);
  width: 100vw;
  pointer-events: none;
  background-color: ${colors.winner};
  font-size: ${Theme.config.strings.fontSize + "vmin"};

  & h1 {
    margin: 0.25em 0 0
  }
  & h2 {
    margin: 0;
    margin-bottom: 0.5em;
    text-decoration: underline;
    font-size: 1em;
  }
  & h1.ace {
    font-size: ${Theme.config.strings.aceSize}vmin;
    font-style: normal;
  }

  & p {
    margin: 0;
  }

  & p:empty {
    height: 0.5em;
  }

  @media(max-aspect-ratio: 20/23) {
    width: 100vw;
  }

  @media(min-aspect-ratio: 4/3) {
    height: 100vh;
    width: calc(100vw - 33vh);
  }
`


export const StyledButton = styled.button`
  width: 33vmin;
  height: 10vmin;
  border-radius: 2vmin;
  font-size: ${Theme.config.strings.buttonSize + "vmin"};
  font-family: '${() => getFontFamily(Theme.config.strings.fontFamily)}', sans-serif;

  background: ${colors.basic};
  border: 0.5vmin solid ${colors.shade};
  border-top-color: ${colors.tint};
  border-left-color: ${colors.tint};
  color: ${colors.text}
  pointer-events: auto;
  cursor: pointer;

  &.pressed {
    background: ${colors.darker};
    border-color: ${colors.tint};
    border-top-color: ${colors.shade};
    border-left-color: ${colors.shade};
  }
  &:disabled {
    border-width: 0.25vmin;
    color: ${colors.disabled};
    cursor: default;
  }
  &.prompt {
    color: ${colors.prompt};
  }
  &:focus {
    outline: none;
  }

  @media(max-aspect-ratio: 20/23) {
    height: 15vmin;
  }

  @media(min-aspect-ratio: 4/3) {
    height: 25vmin;
  }
`


export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;

  &:disabled ~ *{
    color: ${colors.disabled};
  }
`


export const StyledRulesButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${Theme.config.strings.buttonSize + "vmin"};
  width: 33vmin;
  height: 10vmin;
  box-sizing: border-box;
  border: 0.5vmin solid;
  border-radius: 2vmin;
  border-top-color:    ${props => ( props.checked
                                  ? colors.shade
                                  : colors.tint
                                  )};
  border-left-color:   ${props => ( props.checked
                                  ? colors.shade
                                  : colors.tint
                                  )};
  border-bottom-color: ${props => ( props.checked
                                  ? colors.tint
                                  : colors.shade
                                  )};
  border-right-color:  ${props => ( props.checked
                                  ? colors.tint
                                  : colors.shade
                                  )};
  background:          ${props => ( props.checked
                                  ? colors.darker
                                  : colors.basic
                                  )};
  pointer-events: auto;

  @media(max-aspect-ratio: 20/23) {
    height: 15vmin;
  }

  @media(min-aspect-ratio: 4/3) {
    height: 25vmin;
  }
`



export const StyledControls = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1;
  text-align: left;
  background-color: #6006;
`


export const StyledSVG = styled.svg`
  position: fixed;
  display: ${props => props.$visible ? "block" : "none"}
  width: 15vmin;
  height: 15vmin;
  fill: ${Theme.config.colors.textColor};
  opacity: ${props => (
    props.open ? 1 : (props.over ? 0.75 : 0.25)
  )}
  left: ${props => props.open ? "27vmin" : 0}
  transition: left .27s linear, opacity .15s;
  transition-property: left, opacity;
  transition-delay: ${props => props.open ? ".15s, 0s;" : "0s, .27s;"}
  ${props => props.$disabled
           ? `pointer-events: none;cursor: default;`
           : `cursor: pointer;`
    }
`


export const StyledMenu = styled.div`
  position: fixed;
  box-sizing: border-box;
  top: 0;
  left: ${props => props.open ? 0 : "-42vmin;"}
  ${props => props.open
          ? "box-shadow: 0 0 3vmin 0 rgba(0,0,0,0.75);"
          : ""
  }
  height: 100vh;
  width: 42vmin;
  padding: 2vmin;
  padding-top: 18vmin;
  background-color: ${colors.menu};

  transition: left .42s linear;
`


export const StyledSubset = styled.div`
  margin: 2vmin 0 0 6vmin;
`


export const StyledLabel = styled.label`
  display: block;
  margin-top: 4vmin;
  cursor: ${({ disabled }) => disabled ? "default" : "pointer"}
`


export const Check = styled.svg`
  fill: none;
  stroke: ${Theme.config.colors.textColor}
  stroke-width: ${Theme.config.strings.buttonSize / 8 + "vmin"};
`


export const StyledCheckbox = styled.div`
  display: inline-block;
  width: ${Theme.config.strings.buttonSize + "vmin"}
  height: ${Theme.config.strings.buttonSize + "vmin"}
  background: ${props => (
    props.checked ? colors.checked : colors.unchecked
  )}
  border-radius: 3px;
  transition: all 150ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px ${colors.focus};
  }

  ${Check} {
    visibility: ${props => (props.checked ? 'visible' : 'hidden')}
  }
`


export const StyledSpan = styled.span`
  font-size: ${Theme.config.strings.buttonSize + "vmin"};
  margin-left: 0.5em;
`


export const ToggleButton = styled.button`
  background-color: transparent;
  background-image: url(${
    props => props.$active
           ? props.$on
           : props.$off
  });
  border: 0.5vmin solid ${colors.shade};
  border-radius: 10vmin;
  width: 10vmin;
  height: 10vmin;
  margin: 0.75vmin;

  ${props => /*!props.disabled
             ?*/ !props.$active
               ? `border-top-color: ${colors.tint};
                  border-left-color: ${colors.tint};`
               : `background-color: ${colors.darker};
                  border-color: ${colors.tint};
                  border-top-color: ${colors.shade};
                  border-left-color: ${colors.shade};`
              /*: `border-color: ${colors.basic};
                 opacity: 0.2;`*/
  }

  &:focus {
    outline: none;
  }
`


export const StyledCredits = styled.div`
display: ${props => props.$visible
                  ? "block"
                  : "none"
           }
position: fixed;
top: 0;
left: 0;
height: 100vh;
width: 100vw;
background-color: ${colors.winner};
text-align: center;
overflow-y: auto

& ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

& h1 {
  font-size: ${Theme.config.credits.h1Size}vmin;
  margin: 1em 0 0;
}

& h2 {
  font-size: ${Theme.config.credits.h2Size}vmin;
  margin: 1.5em 0 0;
}

& p {
  font-size: ${Theme.config.credits.pSize}vmin;
  margin: 0.25em;
}

& a {
  color: ${colors.text}
}
`


export const StyledAnts = styled.rect`
@keyframes ants {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: ${props => props.$ants.length * 2}; }
}

@keyframes tsan {
  from { stroke-dashoffset: ${props => -props.$ants.length}; }
  to { stroke-dashoffset: ${props => props.$ants.length}; }
}
`