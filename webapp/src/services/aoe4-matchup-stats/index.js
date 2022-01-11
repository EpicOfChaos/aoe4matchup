import { calculateMatchHistoryStats } from './calculate-match-history-stats'

export function calculateStats(playersData, mapId) {
  const playerStatistics = {}
  for (const profileId of Object.keys(playersData)) {
    const { matchHistory, playerRating } = playersData[profileId]
    const playerMatchHistoryStats = calculateMatchHistoryStats(profileId, matchHistory, playerRating)
    playerStatistics[profileId] = {
      winRate: playerMatchHistoryStats.winRate,
      mapWinRate: playerMatchHistoryStats.mapWinRates[mapId],
      mostRecentPlayedCiv: playerMatchHistoryStats.mostRecentCiv,
      civWinRates: playerMatchHistoryStats.civWinRates,
      mostPlayedCiv: playerMatchHistoryStats.mostPlayedCiv,
    }
    if (mapId) {
      const playerMapCivRates = playerMatchHistoryStats.mapCivSelectionRates[mapId]
      const mapHighestWinRateCiv = Object.keys(playerMapCivRates).reduce((a, b) => {
        if (playerMapCivRates[a] >= playerMapCivRates[b]) {
          return a
        }
        return b
      })
      const mapHighestWinRateCivWinRate = playerMapCivRates[mapHighestWinRateCiv]

      playerStatistics[profileId].mapHighestWinRateCiv = mapHighestWinRateCiv
      playerStatistics[profileId].mapHighestWinRateCivWinRate = mapHighestWinRateCivWinRate
    }
  }

  return playerStatistics
}
