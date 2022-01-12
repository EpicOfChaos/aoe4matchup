import React, { useMemo } from 'react'
import propTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
import { useHistory, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const history = useHistory()

  const { headerRow, metricRows } = useMemo(() => {
    const header = [{ key: 'header', data: '' }]
    const rankRow = [{ key: 'rank', data: 'Rank' }]
    const ratingRow = [{ key: 'rating', data: 'Rating (Highest Rating)' }]
    const winPctRow = [{ key: 'win_pct', data: 'Win %' }]
    const lastPlayedCivRow = [{ key: 'last_civ', data: 'Last Played Civ (Win %)' }]
    const mostPlayedCivRow = [{ key: 'most_civ', data: 'Most Played Civ (Win %)' }]
    const tableRows = [rankRow, ratingRow, winPctRow, lastPlayedCivRow, mostPlayedCivRow]
    const mapWinPctRow = []
    const mapCivWinPctRow = []
    if (mapId != null) {
      const mapName = mapNames[mapId]
      mapWinPctRow.push({ key: 'map_win_pct', data: `${mapName} Win %` })
      mapCivWinPctRow.push({ key: 'map_civ_sel_pct', data: `${mapName} Most Selected Civ (Select %)` })
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
      header.push({
        key: `${header[0].key}_${profileId}`,
        profileId: playerLadder.profile_id,
        name: playerLadder.name,
      })
      rankRow.push({ key: `${rankRow[0].key}_${profileId}`, data: `${playerLadder.rank}` })
      ratingRow.push({
        key: `${ratingRow[0].key}_${profileId}`,
        data: `${playerLadder.rating} (${playerLadder.highest_rating})`,
      })
      winPctRow.push({
        key: `${winPctRow[0].key}_${profileId}`,
        data: `${((playerLadder.wins / playerLadder.games) * 100).toFixed(2)}%`,
      })
      lastPlayedCivRow.push({
        key: `${lastPlayedCivRow[0].key}_${profileId}`,
        data: `${civNames[stats.mostRecentPlayedCiv]} (${(
          stats.civWinRates[stats.mostRecentPlayedCiv] * 100
        ).toFixed(2)}%)`,
      })
      mostPlayedCivRow.push({
        key: `${mostPlayedCivRow[0].key}_${profileId}`,
        data: `${civNames[stats.mostPlayedCiv]} (${(stats.civWinRates[stats.mostPlayedCiv] * 100).toFixed(
          2,
        )}%)`,
      })
      if (mapId != null) {
        const { mapStats } = stats
        if (mapStats[mapId]) {
          mapWinPctRow.push({
            key: `${mapWinPctRow[0].key}_${profileId}`,
            data: `${(mapStats[mapId].mapWinRate * 100).toFixed(2)}%`,
          })
          mapCivWinPctRow.push({
            key: `${mapCivWinPctRow[0].key}_${profileId}`,
            data: `${civNames[mapStats[mapId].mapHighestSelectedCiv]} (${(
              mapStats[mapId].mapHighestSelectedCivSelectionRate * 100
            ).toFixed(2)}%)`,
          })
        } else {
          mapWinPctRow.push({ key: `${mapWinPctRow[0].key}_${profileId}`, data: 'NA' })
          mapCivWinPctRow.push({ key: `${mapCivWinPctRow[0].key}_${profileId}`, data: 'NA' })
        }
      }
    }

    return { headerRow: header, metricRows: tableRows }
  }, [playerOrder, playersData, mapId])
  return (
    <Paper elevation={4}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headerRow.map((columnData, i) => {
              return (
                <TableCell
                  sx={{
                    width: '50px',
                  }}
                  key={columnData.profileId}
                >
                  {columnData.name}
                  {i > 0 && (
                    <IconButton
                      size="small"
                      aria-label="remove player"
                      onClick={() => {
                        const searchParams = new URLSearchParams(location.search)
                        const players = searchParams.getAll('player')
                        const remainingPlayers = players.filter(player => {
                          return player !== columnData.profileId.toString()
                        })
                        searchParams.delete('player')
                        remainingPlayers.forEach(p => {
                          searchParams.append('player', p)
                        })
                        history.push({
                          pathname: location.pathname,
                          search: searchParams.toString(),
                        })
                      }}
                      color="inherit"
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {metricRows.map(row => {
            return (
              <TableRow key={`tr_${row[0].key}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {row.map((data, j) => {
                  const variant = j === 0 ? 'head' : 'body'
                  const align = j === 0 ? 'right' : 'left'
                  return (
                    <TableCell key={data.key} variant={variant} align={align}>
                      {data.data}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
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
