/**
 * src/components/Ants.jsx
 */

import { StyledAnts } from "./Styles"
import { ants } from "../scripts/ants"


const antsAnimation = {
  animation: `ants ${ants.time}s linear infinite`
}

export const Ants = ({ rect }) => {
  if (!rect) {
    return ""
  }

  const svg = (
    <svg
      id="Ants"
      width="100vw"
      height="100vh"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        position: "fixed"
      , top: 0
      , left: 0
      , pointerEvents: "none"
      }}
    >
      <StyledAnts
        x={rect.x}
        y={rect.y}
        rx={ants.radius}
        width={rect.width}
        height={rect.height}
        stroke={ants.dark}
        strokeWidth={ants.width}
        strokeLinecap="round"
        strokeOpacity="0.75"
        strokeDasharray={ants.dashArray}
        style={antsAnimation}
        fill={ants.dark}
        fillOpacity={ants.opacity}
        $ants={ants}
      />
      <StyledAnts
        x={rect.x}
        y={rect.y}
        rx={ants.radius}
        width={rect.width}
        height={rect.height}
        stroke={ants.light}
        strokeWidth={ants.width}
        strokeOpacity="0.75"
        strokeLinecap="round"
        strokeDasharray={ants.dashArray}
        style={{ animation: `tsan ${ants.time}s linear infinite` }}
        fill="none"
        $ants={ants}
      />
    </svg>
  )

  return svg
}
