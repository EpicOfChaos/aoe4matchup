import React, { useEffect, useState } from 'react'
import uniq from 'lodash/uniq'
import Page from '../containers/Page'
import { useQuery } from '../util/user-query'
import { getLeaderBoardForPlayer, getMatchHistory, getPlayerRating } from '../services/aoeiv-net/client'
import { calculateStats } from '../services/aoe4-matchup-stats'
import PlayerStatCompare from '../components/PlayerStatCompare'
import { DEFAULT_LEADER_BOARD_ID } from '../constants/aoe4-net'
import PlayerSearchCard from '../components/PlayerSearchCard'

async function getPlayerData(players, existingPlayersData) {
  const playerData = {}
  for (const player of players) {
    if (existingPlayersData[player]) {
      console.log('found existing player data not fetching new for ', player)
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

export default function Matchup() {
  const query = useQuery()
  const [playersData, setPlayersData] = useState({})
  const [mapId, setMapId] = useState(null)
  useEffect(() => {
    const players = uniq(query.getAll('player'))
    console.log('Player Profile Ids: ', players)
    const map = query.get('mapId')
    setMapId(map)
    getPlayerData(players, playersData).then(data => {
      setPlayersData(data)
    })
  }, [query])

  console.log('Player Data: ', playersData)
  console.log('Map Id: ', mapId)
  return (
    <Page title="Matchup">
      <PlayerSearchCard />
      {playersData && Object.keys(playersData).length > 0 && (
        <PlayerStatCompare
          playerOrder={uniq(query.getAll('player'))}
          playersData={playersData}
          mapId={mapId}
        />
      )}
    </Page>
  )
}
