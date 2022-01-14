import React, { useEffect, useState, useMemo } from 'react'
import uniq from 'lodash/uniq'
import { useHistory, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Page from '../containers/Page'
import { useQuery } from '../util/user-query'
import { getLeaderBoardForPlayer, getMatchHistory, getPlayerRating } from '../services/aoeiv-net/client'
import { calculateStats } from '../services/aoe4-matchup-stats'
import PlayerStatCompare from '../components/PlayerStatCompare'
import { DEFAULT_LEADER_BOARD_ID } from '../constants/aoe4-net'
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
  const [mapId, setMapId] = useState(null)
  useEffect(() => {
    const players = uniq(query.getAll('player'))
    const map = query.get('mapId')
    setMapId(map)
    getPlayerData(players, playersData).then(data => {
      setPlayersData(data)
    })
  }, [query])

  const playersLikelyCivPick = useMemo(() => {
    return calculateLikelyCivPick(playersData, mapId)
  }, [playersData, mapId])
  return (
    <Page title="Matchup">
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <PlayerSearchCard />
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
      </Box>
      {playersData && Object.keys(playersData).length > 0 && (
        <Box>
          <PlayerStatCompare
            playerOrder={uniq(query.getAll('player'))}
            playersData={playersData}
            playersLikelyCivPick={playersLikelyCivPick}
            mapId={mapId}
          />
        </Box>
      )}
    </Page>
  )
}
