import { HISTORY_COUNT } from '../constants/aoe4-net'
import { getPlayerRating } from '../services/aoeiv-net/client'

export async function getPlayerRatingSynchronously(profileId, ladderId, playerLadder) {
  if (playerLadder == null) {
    return []
  }

  let totalFetches = 0
  const playerRatings = []

  do {
    playerRatings.push(await getPlayerRating(profileId, ladderId, totalFetches * HISTORY_COUNT))
    totalFetches += 1
  } while (playerRatings[playerRatings.length - 1].length === HISTORY_COUNT)
  return [].concat(...playerRatings)
}
