import React from 'react'
import propTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { hasFlag } from 'country-flag-icons'
import Flags from 'country-flag-icons/react/3x2'
import { differenceInDays, differenceInHours, differenceInMinutes, fromUnixTime } from 'date-fns'
import { Link } from '@mui/material'
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

export default function PlayerStatCompare({ playersStats, mapId }) {
  console.log(JSON.stringify(playersStats))
  const header = ['', ...Object.keys(playersStats)]
  const winPctRow = ['Win %']
  const lastPlayedCivRow = ['Last Played Civ (Win %)']
  const mostPlayedCivRow = ['Most Played Civ (Win %)']
  const tableRows = [winPctRow, lastPlayedCivRow, mostPlayedCivRow]
  const mapWinPctRow = []
  const mapCivWinPctRow = []
  if (mapId) {
    const mapName = mapNames[mapId]
    mapWinPctRow.push(`${mapName} Win %`)
    mapCivWinPctRow.push(`${mapName} Highest Win % Civ`)
    tableRows.push(mapWinPctRow)
    tableRows.push(mapCivWinPctRow)
  }

  for (const profileId of Object.keys(playersStats)) {
    const stats = playersStats[profileId]
    winPctRow.push(`${(stats.winRate * 100).toFixed(2)}%`)
    lastPlayedCivRow.push(
      `${civNames[stats.mostRecentPlayedCiv]} (${(stats.civWinRates[stats.mostRecentPlayedCiv] * 100).toFixed(
        2,
      )}%)`,
    )
    mostPlayedCivRow.push(
      `${civNames[stats.mostPlayedCiv]} (${(stats.civWinRates[stats.mostPlayedCiv] * 100).toFixed(2)}%)`,
    )
    if (mapId) {
      const { mapStats } = stats
      mapWinPctRow.push(`${(mapStats.mapWinRate * 100).toFixed(2)}%`)
      mapCivWinPctRow.push(
        `${civNames[mapStats.mapHighestWinRateCiv]} (${(mapStats.mapHighestWinRateCivWinRate * 100).toFixed(
          2,
        )}%)`,
      )
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {header.map(columnData => {
              return <TableCell>{columnData}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((row, i) => {
            return (
              <TableRow key={row[0]} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {row.map((data, j) => {
                  const variant = j === 0 ? 'head' : 'body'
                  return <TableCell variant={variant}>{data}</TableCell>
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
  playersStats: propTypes.object.isRequired,
  mapId: propTypes.string,
}

PlayerStatCompare.defaultProps = {
  mapId: null,
}
