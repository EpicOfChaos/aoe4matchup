import React, { useEffect, useState } from 'react'
import uniq from 'lodash/uniq'
import Page from '../containers/Page'
import { useQuery } from '../util/user-query'
import { getMatchHistory, getPlayerRating } from '../services/aoeiv-net/client'
import { calculateStats } from '../services/aoe4-matchup-stats'

async function getPlayerData(players) {
  const playerData = {}
  for (const player of players) {
    const [matchHistory, playerRating] = await Promise.all([getMatchHistory(player), getPlayerRating(player)])
    playerData[player] = {
      matchHistory,
      playerRating,
    }
  }
  return playerData
}

export default function Matchup() {
  const query = useQuery()
  const [playersData, setPlayersData] = useState({})
  const [playersStats, setPlayersStats] = useState({})
  useEffect(() => {
    const players = uniq(query.getAll('player'))
    console.log('Player Profile Ids: ', players)
    getPlayerData(players).then(data => {
      setPlayersData(data)
      setPlayersStats(calculateStats(data))
    })
  }, [query])

  console.log('Player Data: ', playersData)
  console.log('Player Stat Data: ', playersStats)
  return (
    <Page title="Matchup">
      <div>Hello</div>
    </Page>
  )
}
