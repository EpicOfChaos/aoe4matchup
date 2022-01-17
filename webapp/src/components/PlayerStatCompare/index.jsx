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
import { TableContainer, Tooltip } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import aoeStrings from '../../services/aoeiv-net/aoeiv-strings.json'
import CivFlag from '../CivFlag'

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

export default function PlayerStatCompare({ playerOrder, playersData, playersLikelyCivPick, mapId }) {
  const location = useLocation()
  const history = useHistory()

  const { headerRow, metricRows } = useMemo(() => {
    const header = [{ key: 'header', data: '' }]
    const matchupPickRow = [
      {
        key: 'matchupPick',
        data: 'AoE4 Matchup Pick',
        tooltip: 'Civilization most likely to be picked by the player for this matchup.',
      },
    ]
    const rankRow = [{ key: 'rank', data: 'Rank' }]
    const ratingRow = [{ key: 'rating', data: 'Rating (Highest Rating)' }]
    const winPctRow = [{ key: 'win_pct', data: 'Win %' }]
    const avgDurationRow = [{ key: 'avg_duration', data: 'Avg Game Duration' }]
    const lastPlayedCivRow = [{ key: 'last_civ', data: 'Last Played Civ (Win %)' }]
    const mostPlayedCivRow = [{ key: 'most_civ', data: 'Most Played Civ (Win %)' }]
    const tableRows = [
      matchupPickRow,
      rankRow,
      ratingRow,
      winPctRow,
      avgDurationRow,
      lastPlayedCivRow,
      mostPlayedCivRow,
    ]
    const mapWinPctRow = []
    const mapCivWinPctRow = []
    const mapAvgDurationRow = []
    if (mapId != null) {
      const mapName = mapNames[mapId]
      mapWinPctRow.push({ key: 'map_win_pct', data: `${mapName} Win %` })
      mapAvgDurationRow.push({ key: 'map_avg_duration', data: `${mapName} Avg Game Duration` })
      mapCivWinPctRow.push({ key: 'map_civ_sel_pct', data: `${mapName} Most Selected Civ (Select %)` })
      tableRows.push(mapWinPctRow)
      tableRows.push(mapAvgDurationRow)
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
      const playerLikelyCivPick = playersLikelyCivPick[profileId]

      header.push({
        key: `${header[0].key}_${profileId}`,
        profileId: playerLadder.profile_id,
        name: playerLadder.name,
      })
      matchupPickRow.push({
        key: `${matchupPickRow[0].key}_${profileId}`,
        data: `${civNames[playerLikelyCivPick]} (${(stats.civWinRates[playerLikelyCivPick] * 100).toFixed(
          2,
        )}%)`,
        civId: playerLikelyCivPick,
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
      avgDurationRow.push({
        key: `${avgDurationRow[0].key}_${profileId}`,
        data: `${Math.round(stats.avgDuration)} minutes`,
      })
      lastPlayedCivRow.push({
        key: `${lastPlayedCivRow[0].key}_${profileId}`,
        data: `${civNames[stats.mostRecentPlayedCiv]} (${(
          stats.civWinRates[stats.mostRecentPlayedCiv] * 100
        ).toFixed(2)}%)`,
        civId: stats.mostRecentPlayedCiv,
      })
      mostPlayedCivRow.push({
        key: `${mostPlayedCivRow[0].key}_${profileId}`,
        data: `${civNames[stats.mostPlayedCiv]} (${(stats.civWinRates[stats.mostPlayedCiv] * 100).toFixed(
          2,
        )}%)`,
        civId: stats.mostPlayedCiv,
      })
      if (mapId != null) {
        const { mapStats } = stats
        if (mapStats[mapId]) {
          mapWinPctRow.push({
            key: `${mapWinPctRow[0].key}_${profileId}`,
            data: `${(mapStats[mapId].mapWinRate * 100).toFixed(2)}%`,
          })
          mapAvgDurationRow.push({
            key: `${mapAvgDurationRow[0].key}_${profileId}`,
            data: `${Math.round(mapStats[mapId].mapAvgDuration)} minutes`,
          })
          mapCivWinPctRow.push({
            key: `${mapCivWinPctRow[0].key}_${profileId}`,
            data: `${civNames[mapStats[mapId].mapHighestSelectedCiv]} (${(
              mapStats[mapId].mapHighestSelectedCivSelectionRate * 100
            ).toFixed(2)}%)`,
            civId: mapStats[mapId].mapHighestSelectedCiv,
          })
        } else {
          mapWinPctRow.push({ key: `${mapWinPctRow[0].key}_${profileId}`, data: 'NA' })
          mapAvgDurationRow.push({ key: `${mapAvgDurationRow[0].key}_${profileId}`, data: 'NA' })
          mapCivWinPctRow.push({ key: `${mapCivWinPctRow[0].key}_${profileId}`, data: 'NA' })
        }
      }
    }

    return { headerRow: header, metricRows: tableRows }
  }, [playerOrder, playersData, playersLikelyCivPick, mapId])
  return (
    <Paper elevation={4}>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {headerRow.map((columnData, i) => {
                const styles = {
                  minWidth: '150px',
                }
                return (
                  <TableCell sx={styles} key={columnData.profileId}>
                    {columnData.name}
                    {i > 0 && (
                      <Tooltip title="Remove player from matchup comparison." placement="top" arrow>
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
                          <ClearIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
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
                    const styles = {
                      minWidth: '150px',
                    }

                    return (
                      <TableCell key={data.key} variant={variant} align={align} sx={styles}>
                        {data.civId && <CivFlag civId={data.civId} />}
                        {data.data}
                        {data.tooltip && (
                          <Tooltip title={data.tooltip} placement="top" arrow>
                            <InfoOutlinedIcon
                              color="secondary"
                              fontSize="small"
                              sx={{
                                marginBottom: '-5px',
                              }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

PlayerStatCompare.propTypes = {
  playerOrder: propTypes.arrayOf(propTypes.string).isRequired,
  playersData: propTypes.object.isRequired,
  playersLikelyCivPick: propTypes.object.isRequired,
  mapId: propTypes.string,
}

PlayerStatCompare.defaultProps = {
  mapId: null,
}
