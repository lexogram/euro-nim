/**
 * src/components/Board.jsx
 */

import React from 'react'
import {
  StyledImage,
  StyledShrinkWrap,
  StyledFrame,
  StyledRow,
  StyledBoard
} from './Styles.jsx'


/**
 * this.props will be:
 * { id: "board"
 * , action: pointer to GamePage.startDrag()
 * , rows: []
 * }
 *
 * @class      Board (name)
 */
export class Board extends React.Component {
  _getRowsToRender() {
    const {
      removed
    , selected
    , activeIds
    , dragIds
    , gameOver
    } = this.props.gameState

    // console.log("Board._getRowsToRender: props.activeIds", this.props.activeIds)

    const rows = this.props.rows.map((row, rowIndex) => {
      const gaps = row.reduce((gaps, cell) => (
        gaps + !(removed.indexOf(cell.name) < 0)
      ), 0)
      // console.log("row:", row, "gaps:", gaps)

      const cells = row.map((cell, cellIndex) => {
        // { "name": "cell_N"
        // , "theme": {
        //     "rotation": `transform: rotate(DEGREEdeg);
        //                  filter: drop-shadow(X Y Z COLOR);`
        //   , "padding": "TOPvmin RIGHTvmin LEFTvmin BOTTOMvmin"
        //   , "spacing": "TOPvmin RIGHTvmin LEFTvmin BOTTOMvmin"
        //   , "equal":   "TOPvmin RIGHTvmin LEFTvmin BOTTOMvmin"
        //   }
        // , "image": <URL>
        // }
        //
        // console.log(this.props)
        const id        = cell.name
        const className = selected.indexOf(id) < 0
                        ? ""
                        : "selected"
        const active    = !gameOver
                       && !activeIds.length
                       || !(activeIds.indexOf(id) < 0)
        const cursor    = active
                        ? "pointer"
                        : "not-allowed"

        // console.log("active:", active, "id:", id, "gameOver:", gameOver, "activeIds:", activeIds)

        const image = (removed.indexOf(id) < 0)
                    ? (<StyledImage
                        theme={cell.theme} // rotation & drop-shadow filter
                        src={cell.image}
                        cursor={cursor}
                        gameOver={this.props.gameOver}
                      />)
                    : ""

        // console.log("groups:", this.props.gameState.groups)

        return (
          <StyledShrinkWrap
            key={id}
            theme={cell.theme} // uses padding
            $groups={this.props.gameState.groups
                 && this.props.gameState.hints
                 && this.props.gameState.vsAI}
            $gaps={gaps}
          >
            <StyledFrame
              className={className}
              id={id}
              data-title={cell.title}
            >
              {image}
            </StyledFrame>
          </StyledShrinkWrap>
        )
      }) // End of row.map()

      return (
        <StyledRow
          key={rowIndex}
          id={"row-" + rowIndex}
        >
          {cells}
        </StyledRow>
      )
    })

    return rows
  }


  render() {
    const rows = this._getRowsToRender()
    // console.log("Board", this.props.gameState)

    return (
      <StyledBoard
        id="Board"
        onMouseDown={this.props.action}
        onTouchStart={this.props.action}
      >
        {rows}
      </StyledBoard>
    )
  }
}
