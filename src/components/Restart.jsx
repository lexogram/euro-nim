/**
 * src/components/Restart.jsx
 */


import {
  StyledButton
} from "./Styles"


export const Restart = ({ children, onClick, disabled }) => {
  // console.log("children:", children, "onClick:", onClick, "disabled:", disabled )
  return (
  <StyledButton
    disabled={disabled}
    onClick={onClick}
    style={{
      width: "38vmin"
    }}
  >
    {children}
  </StyledButton>
)}