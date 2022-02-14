import { MATCH_HISTORY_COUNT } from '../constants/aoe4-net'
import { getMatchHistory } from '../services/aoeiv-net/client'

export async function getMatchHistorySynchronously(profileId, playerLadder) {
  if (playerLadder == null) {
    return []
  }

  const matchHistories = []
  let totalFetches = 0
  do {
    const matchHistory = await getMatchHistory(profileId, totalFetches * MATCH_HISTORY_COUNT)
    matchHistories.push(matchHistory)
    totalFetches += 1
  } while (matchHistories[matchHistories.length - 1].length === MATCH_HISTORY_COUNT)

  return [].concat(...matchHistories)
}
