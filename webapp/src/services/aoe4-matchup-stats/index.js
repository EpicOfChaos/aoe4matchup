import { calculateMatchHistoryStats } from './calculate-match-history-stats'
import aoeStrings from '../aoeiv-net/aoeiv-strings.json'

export function calculateStats(profileId, matchHistory, playerRating, ladderId, timeframeId) {
  const playerMatchHistoryStats = calculateMatchHistoryStats(
    profileId,
    matchHistory,
    playerRating,
    ladderId,
    timeframeId,
  )

  const playerStatistics = {
    outcomeGrouped: playerMatchHistoryStats.outcomeGrouped,
    avgDuration: playerMatchHistoryStats.avgDuration,
    mostRecentPlayedCiv: playerMatchHistoryStats.mostRecentCiv,
    civWinRates: playerMatchHistoryStats.civWinRates,
    mostPlayedCiv: playerMatchHistoryStats.mostPlayedCiv,
    opponentCivWinRates: playerMatchHistoryStats.opponentCivWinRates,
    winsMostAgainst: playerMatchHistoryStats.winsMostAgainst,
    loseMostAgainst: playerMatchHistoryStats.loseMostAgainst,
    mapStats: {},
  }
  for (const map of aoeStrings.map_type) {
    const mapId = map.id
    const playerMapCivRates = playerMatchHistoryStats.mapCivSelectionRates[mapId]
    if (playerMapCivRates) {
      const mapHighestSelectedCiv = Object.keys(playerMapCivRates).reduce((a, b) => {
        if (playerMapCivRates[a] >= playerMapCivRates[b]) {
          return a
        }
        return b
      })
      const mapHighestSelectedCivSelectionRate = playerMapCivRates[mapHighestSelectedCiv]
      playerStatistics.mapStats[mapId] = {
        mapHighestSelectedCiv,
        mapHighestSelectedCivSelectionRate,
        mapWinRate: playerMatchHistoryStats.mapWinRates[mapId],
        mapAvgDuration: playerMatchHistoryStats.mapAvgDurations[mapId],
      }
    }
  }

  return playerStatistics
}
