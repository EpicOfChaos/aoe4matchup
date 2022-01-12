import React, { useMemo } from 'react'
import propTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import aoeStrings from '../../services/aoeiv-net/aoeiv-strings.json'

const mapNames = aoeStrings.map_type.reduce((map, obj) => {
  return {
    ...map,
    [obj.id]: obj.string,
  }
}, {})

const civNames = aoeStrings.civ.reduce((map, obj) => {
  return {
    ...map,
    [obj.id]: obj.string,
  }
}, {})

export default function PlayerStatCompare({ playerOrder, playersData, mapId }) {
  const { headerRow, metricRows } = useMemo(() => {
    console.log('Calculating compare rows')
    const header = ['']
    const rankRow = ['Rank']
    const ratingRow = ['Rating (Highest Rating)']
    const winPctRow = ['Win %']
    const lastPlayedCivRow = ['Last Played Civ (Win %)']
    const mostPlayedCivRow = ['Most Played Civ (Win %)']
    const tableRows = [rankRow, ratingRow, winPctRow, lastPlayedCivRow, mostPlayedCivRow]
    const mapWinPctRow = []
    const mapCivWinPctRow = []
    if (mapId) {
      const mapName = mapNames[mapId]
      mapWinPctRow.push(`${mapName} Win %`)
      mapCivWinPctRow.push(`${mapName} Highest Win % Civ`)
      tableRows.push(mapWinPctRow)
      tableRows.push(mapCivWinPctRow)
    }

    for (const profileId of playerOrder) {
      if (!playersData[profileId]) {
        // eslint-disable-next-line no-continue
        continue
      }
      const { stats } = playersData[profileId]
      const playerData = playersData[profileId]
      const { playerLadder } = playerData
      header.push(playerLadder.name)
      rankRow.push(`${playerLadder.rank}`)
      ratingRow.push(`${playerLadder.rating} (${playerLadder.highest_rating})`)
      winPctRow.push(`${((playerLadder.wins / playerLadder.games) * 100).toFixed(2)}%`)
      lastPlayedCivRow.push(
        `${civNames[stats.mostRecentPlayedCiv]} (${(
          stats.civWinRates[stats.mostRecentPlayedCiv] * 100
        ).toFixed(2)}%)`,
      )
      mostPlayedCivRow.push(
        `${civNames[stats.mostPlayedCiv]} (${(stats.civWinRates[stats.mostPlayedCiv] * 100).toFixed(2)}%)`,
      )
      if (mapId) {
        const { mapStats } = stats
        mapWinPctRow.push(`${(mapStats[mapId].mapWinRate * 100).toFixed(2)}%`)
        mapCivWinPctRow.push(
          `${civNames[mapStats[mapId].mapHighestWinRateCiv]} (${(
            mapStats[mapId].mapHighestWinRateCivWinRate * 100
          ).toFixed(2)}%)`,
        )
      }
    }

    return { headerRow: header, metricRows: tableRows }
  }, [playerOrder, playersData, mapId])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headerRow.map(columnData => {
              return <TableCell key={columnData}>{columnData}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {metricRows.map((row, i) => {
            return (
              <TableRow key={row[0]} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {row.map((data, j) => {
                  const variant = j === 0 ? 'head' : 'body'
                  const align = j === 0 ? 'right' : 'left'
                  return (
                    <TableCell key={data} variant={variant} align={align}>
                      {data}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

PlayerStatCompare.propTypes = {
  playerOrder: propTypes.arrayOf(propTypes.string).isRequired,
  playersData: propTypes.object.isRequired,
  mapId: propTypes.string,
}

PlayerStatCompare.defaultProps = {
  mapId: null,
}
