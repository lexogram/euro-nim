/**
 * src/components/Hintbox.jsx
 */


import {
  StyledLabel,
  HiddenCheckbox,
  StyledCheckbox,
  Check,
  StyledSpan
} from "./Styles"


export const Hintbox = ({ id, label, checked, onChange, disabled }) => {
  const className = "unselectable"
  // console.log("Hintbox", checked, onChange)

  return (
    <StyledLabel
      key={id}
      htmlFor={id}
      className={className}
      disabled={disabled}
    >
      <HiddenCheckbox
        type="checkbox"
        id={id}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      <StyledCheckbox
        checked={checked}
      >
        <Check viewBox="0 0 24 24">
          <polyline points="20 4 9 17 4 12" />
        </Check>
      </StyledCheckbox>
      <StyledSpan>{label}</StyledSpan>
    </StyledLabel>
  )
}
