/**
 * src/components/Level.jsx
 */

import levels from '../assets/levels.json'
import {
  colors,
  StyledLevel
} from './Styles'

export const Level = ({ level, steps, action }) => {
  const ratio = level * 100 / levels.length

  return (
    <div>
      <StyledLevel
        $length="100"
        color={colors.levels}
        $steps={steps}
        onMouseDown={action}
        onTouchStart={action}
      />
      <StyledLevel
        $length={ratio}
        color={colors.level}
        $steps={steps}
      />
    </div>
  )
}

