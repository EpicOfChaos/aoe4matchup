import { MATCH_HISTORY_COUNT } from '../constants/aoe4-net'
import { getMatchHistory } from '../services/aoeiv-net/client'

export async function getMatchHistoryConcurrently(profileId, playerLadder) {
  if (playerLadder == null) {
    return []
  }
  const totalGames = playerLadder.games
  let totalFetches = Math.ceil(totalGames / MATCH_HISTORY_COUNT)
  const fetchPromises = []
  for (let i = 0; i < totalFetches; i += 1) {
    fetchPromises.push(getMatchHistory(profileId, i * MATCH_HISTORY_COUNT))
  }
  const matchHistories = await Promise.all(fetchPromises)
  while (matchHistories[matchHistories.length - 1].length === MATCH_HISTORY_COUNT) {
    matchHistories.push(await getMatchHistory(profileId, totalFetches * MATCH_HISTORY_COUNT))
    totalFetches += 1
  }
  return [].concat(...matchHistories)
}
