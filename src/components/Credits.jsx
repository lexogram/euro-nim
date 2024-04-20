/**
 * src/components/Credits.jsx
 */

import Theme from '../assets/theme.js'
import {
  StyledCredits
} from './Styles.jsx'


export const Credits = ({ visible }) => {
  const credits = Theme.config.credits

  const items = credits.credit.map((data, index) => (
    <li key={index}>
      <h2><a target="credits" href={data.url}>{data.name}</a></h2>
      <p>{Theme.config.credits.by} {data.author}</p>
      <p><a target="credits" href={data.licenseURL}>{data.license}</a></p>
    </li>
    )
  )

  return (
    <StyledCredits
      $visible={visible}
    >
      <h1>{Theme.config.credits.credits}</h1>
      <ul>
        {items}
      </ul>
    </StyledCredits>
  )
}