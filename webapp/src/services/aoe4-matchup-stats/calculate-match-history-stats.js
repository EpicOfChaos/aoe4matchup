import groupBy from 'lodash/groupBy'
import countBy from 'lodash/countBy'
import { autoMatchMapper } from './auto-match-mapper'
import { groupByWinRate } from './group-by-win-rate'
import { civSelectionRate } from './civ-selection-rate'
import { winRate } from './win-rate'

export function calculateMatchHistoryStats(profileId, matchHistory, ratingHistory) {
  const autoMatchHistory = autoMatchMapper(profileId, matchHistory, ratingHistory)

  const mapGrouped = groupBy(autoMatchHistory, match => {
    return match.mapId
  })

  const mapWinRates = groupByWinRate(mapGrouped)

  const civPlayCounts = countBy(autoMatchHistory, match => {
    return match.civId
  })

  const civGrouped = groupBy(autoMatchHistory, match => {
    return match.civId
  })

  const civWinRates = groupByWinRate(civGrouped)

  const mapCivSelectionRates = civSelectionRate(mapGrouped)

  const opponentCivWinRates = groupByWinRate(
    groupBy(autoMatchHistory, match => {
      return match.opponentCivId
    }),
  )

  const mostPlayedCiv = Object.keys(civPlayCounts).reduce((a, b) => {
    if (civPlayCounts[a] > civPlayCounts[b]) {
      return a
    }

    return b
  })

  return {
    winRate: winRate(autoMatchHistory),
    mapWinRates,
    civWinRates,
    mapCivSelectionRates,
    opponentCivWinRates,
    mostRecentCiv: autoMatchHistory[0].civId,
    civPlayCounts,
    mostPlayedCiv,
  }
}
