import React, { useEffect, useState, useMemo } from 'react'
import uniq from 'lodash/uniq'
import { useHistory, useLocation } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import { CircularProgress } from '@mui/material'
import Page from '../containers/Page'
import { useQuery } from '../util/user-query'
import { getLeaderBoardForPlayer } from '../services/aoeiv-net/client'
import { calculateStats } from '../services/aoe4-matchup-stats'
import PlayerStatCompare from '../components/PlayerStatCompare'
import { DEFAULT_LEADER_BOARD_ID } from '../constants/aoe4-net'
import PlayerSearchCard from '../components/PlayerSearchCard'
import MapSelection from '../components/MapSelection'
import { calculateLikelyCivPick } from '../services/aoe4-matchup-stats/calculate-likely-civ-pick'
import LadderSelect from '../components/LadderSelect'
import { playerKey } from '../constants/player-key'
import ladderOptions from '../services/aoeiv-net/aoeiv-ladder-strings.json'
import timeframeOptions from '../constants/timeframe-periods.json'
import TimeframeSelect from '../components/TimeframeSelect'
import { getMatchHistorySynchronously } from '../util/get-match-history-synchronously'
import { getPlayerRatingSynchronously } from '../util/get-player-rating-synchronously'

async function getPlayerData(ladderId, players, existingPlayersData, timeframeId) {
  const playerData = {}
  for (const player of players) {
    if (existingPlayersData[playerKey(ladderId, player)]) {
      const existingData = existingPlayersData[playerKey(ladderId, player)]
      existingData.stats = calculateStats(
        player,
        existingData.matchHistory,
        existingData.playerRating,
        ladderId,
        timeframeId,
      )
      playerData[playerKey(ladderId, player)] = existingData
    } else {
      const playerLadder = await getLeaderBoardForPlayer(ladderId, player)
      const matchHistory = await getMatchHistorySynchronously(player, playerLadder)
      const playerRating = await getPlayerRatingSynchronously(player, ladderId, playerLadder)

      playerData[playerKey(ladderId, player)] = {
        matchHistory,
        playerRating,
        playerLadder,
        stats: calculateStats(player, matchHistory, playerRating, ladderId, timeframeId),
      }
    }
  }
  return playerData
}

export default function Home() {
  const location = useLocation()
  const history = useHistory()
  const query = useQuery()
  const [playersData, setPlayersData] = useState({})
  const [loading, setLoading] = useState(false)
  const [mapId, setMapId] = useState(null)
  const [ladder, setLadder] = useState(ladderOptions[DEFAULT_LEADER_BOARD_ID])
  const [timeframe, setTimeframe] = useState(timeframeOptions['1'])
  useEffect(() => {
    const players = uniq(query.getAll('player'))
    const map = query.get('mapId')
    let ladderId = query.get('ladderId')
    if (ladderId != null) {
      setLadder(ladderOptions[ladderId])
    } else {
      ladderId = ladder.id
    }

    let timeframeId = query.get('timeframeId')
    if (timeframeId != null) {
      setTimeframe(timeframeOptions[timeframeId])
    } else {
      timeframeId = timeframe.id
    }

    setMapId(map)
    setLoading(true)
    getPlayerData(ladderId, players, playersData, timeframeId).then(data => {
      setPlayersData(data)
      setLoading(false)
    })
  }, [query])

  const playersLikelyCivPick = useMemo(() => {
    return calculateLikelyCivPick(playersData, mapId)
  }, [playersData, mapId])
  return (
    <Page title="Matchup">
      <Grid container direction="column">
        <Grid container direction="row" justifyContent="space-evenly">
          <Grid item>
            <LadderSelect
              ladder={ladder}
              selectFunction={selectedLadderId => {
                const searchParams = new URLSearchParams(location.search)

                if (selectedLadderId != null) {
                  searchParams.set('ladderId', selectedLadderId)
                } else {
                  searchParams.delete('ladderId')
                }
                history.push({
                  pathname: location.pathname,
                  search: searchParams.toString(),
                })
              }}
            />
          </Grid>
          <Grid item>
            <PlayerSearchCard ladderId={ladder.id} />
          </Grid>
          <Grid item>
            <MapSelection
              selectFunction={selectedMapId => {
                const searchParams = new URLSearchParams(location.search)

                if (selectedMapId != null) {
                  searchParams.set('mapId', selectedMapId)
                } else {
                  searchParams.delete('mapId')
                }
                history.push({
                  pathname: location.pathname,
                  search: searchParams.toString(),
                })
              }}
            />
          </Grid>
          <Grid item>
            <TimeframeSelect
              timeframe={timeframe}
              selectFunction={selectedTimeframeId => {
                const searchParams = new URLSearchParams(location.search)

                if (selectedTimeframeId != null) {
                  searchParams.set('timeframeId', selectedTimeframeId)
                } else {
                  searchParams.delete('timeframeId')
                }
                history.push({
                  pathname: location.pathname,
                  search: searchParams.toString(),
                })
              }}
            />
          </Grid>
        </Grid>
        {loading ? (
          <Grid container direction="row">
            <Grid container item xs={12} alignItems="center" justifyContent="center">
              <CircularProgress />
            </Grid>
          </Grid>
        ) : (
          playersData &&
          Object.keys(playersData).length > 0 && (
            <Grid container direction="row">
              <Grid item xs={12}>
                <PlayerStatCompare
                  playerOrder={uniq(query.getAll('player'))}
                  playersData={playersData}
                  playersLikelyCivPick={playersLikelyCivPick}
                  mapId={mapId}
                  ladderId={ladder.id}
                  timeframeId={timeframe.id}
                />
              </Grid>
            </Grid>
          )
        )}
      </Grid>
    </Page>
  )
}
