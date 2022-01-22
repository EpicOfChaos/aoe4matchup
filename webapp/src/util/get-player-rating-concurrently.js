import { HISTORY_COUNT } from '../constants/aoe4-net'
import { getPlayerRating } from '../services/aoeiv-net/client'

export async function getPlayerRatingConcurrently(profileId, ladderId, playerLadder) {
  if (playerLadder == null) {
    return []
  }

  const totalGames = playerLadder.games
  let totalFetches = Math.ceil(totalGames / HISTORY_COUNT)
  const fetchPromises = []
  for (let i = 0; i < totalFetches; i += 1) {
    fetchPromises.push(getPlayerRating(profileId, ladderId, i * HISTORY_COUNT))
  }
  const playerRatings = await Promise.all(fetchPromises)
  while (playerRatings[playerRatings.length - 1].length === HISTORY_COUNT) {
    playerRatings.push(await getPlayerRating(profileId, ladderId, totalFetches * HISTORY_COUNT))
    totalFetches += 1
  }
  return [].concat(...playerRatings)
}
