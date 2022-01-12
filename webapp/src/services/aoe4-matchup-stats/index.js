import { calculateMatchHistoryStats } from './calculate-match-history-stats'
import aoeStrings from '../aoeiv-net/aoeiv-strings.json'

export function calculateStats(profileId, matchHistory, playerRating) {
  const playerMatchHistoryStats = calculateMatchHistoryStats(profileId, matchHistory, playerRating)
  const playerStatistics = {
    winRate: playerMatchHistoryStats.winRate,
    mostRecentPlayedCiv: playerMatchHistoryStats.mostRecentCiv,
    civWinRates: playerMatchHistoryStats.civWinRates,
    mostPlayedCiv: playerMatchHistoryStats.mostPlayedCiv,
    mapStats: {},
  }
  for (const map of aoeStrings.map_type) {
    const mapId = map.id
    const playerMapCivRates = playerMatchHistoryStats.mapCivSelectionRates[mapId]
    if (playerMapCivRates) {
      const mapHighestWinRateCiv = Object.keys(playerMapCivRates).reduce((a, b) => {
        if (playerMapCivRates[a] >= playerMapCivRates[b]) {
          return a
        }
        return b
      })
      const mapHighestWinRateCivWinRate = playerMapCivRates[mapHighestWinRateCiv]
      playerStatistics.mapStats[mapId] = {
        mapHighestWinRateCiv,
        mapHighestWinRateCivWinRate,
        mapWinRate: playerMatchHistoryStats.mapWinRates[mapId],
      }
    }
  }

  return playerStatistics
}
