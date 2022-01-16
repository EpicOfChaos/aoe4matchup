import React, { useEffect, useState, useMemo } from 'react'
import uniq from 'lodash/uniq'
import { useHistory, useLocation } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import { CircularProgress } from '@mui/material'
import Page from '../containers/Page'
import { useQuery } from '../util/user-query'
import { getLeaderBoardForPlayer, getMatchHistory, getPlayerRating } from '../services/aoeiv-net/client'
import { calculateStats } from '../services/aoe4-matchup-stats'
import PlayerStatCompare from '../components/PlayerStatCompare'
import { DEFAULT_LEADER_BOARD_ID, MATCH_HISTORY_COUNT } from '../constants/aoe4-net'
import PlayerSearchCard from '../components/PlayerSearchCard'
import MapSelection from '../components/MapSelection'
import { calculateLikelyCivPick } from '../services/aoe4-matchup-stats/calculate-likely-civ-pick'

async function getPlayerData(players, existingPlayersData) {
  const playerData = {}
  for (const player of players) {
    if (existingPlayersData[player]) {
      playerData[player] = existingPlayersData[player]
    } else {
      const [matchHistory, playerRating, playerLadder] = await Promise.all([
        getMatchHistory(player),
        getPlayerRating(player),
        getLeaderBoardForPlayer(DEFAULT_LEADER_BOARD_ID, player),
      ])
      if (matchHistory.length === MATCH_HISTORY_COUNT) {
        let start = MATCH_HISTORY_COUNT
        let moreMatchHistory = []
        do {
          moreMatchHistory = await getMatchHistory(player, start)
          matchHistory.push(...moreMatchHistory)
          start += MATCH_HISTORY_COUNT
        } while (moreMatchHistory.length === MATCH_HISTORY_COUNT)
      }
      playerData[player] = {
        matchHistory,
        playerRating,
        playerLadder,
        stats: calculateStats(player, matchHistory, playerRating),
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
  useEffect(() => {
    const players = uniq(query.getAll('player'))
    const map = query.get('mapId')
    setMapId(map)
    setLoading(true)
    getPlayerData(players, playersData).then(data => {
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
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <PlayerSearchCard />
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
                />
              </Grid>
            </Grid>
          )
        )}
      </Grid>
    </Page>
  )
}
