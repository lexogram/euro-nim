/**
 * src/components/Checkbox.jsx
 */


import Theme from "../assets/theme"
import {
  HiddenCheckbox,
  StyledRulesButton
} from "./Styles"


export const Checkbox = ({ checked, onChange, disabled }) => {
  const className = "unselectable"
  // console.log("Checkbox", checked, onChange)

  return (
    <label
      htmlFor="showRules"
      className={className}
    >
      <HiddenCheckbox
        type="checkbox"
        id="showRules"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      <StyledRulesButton
        checked={checked}
      >
        {Theme.config.strings.showRules}
      </StyledRulesButton>
    </label>
  )
}