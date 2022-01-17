import groupBy from 'lodash/groupBy'
import countBy from 'lodash/countBy'
import { groupByWinRate } from './group-by-win-rate'
import { civSelectionRate } from './civ-selection-rate'
import { winRate } from './win-rate'
import { groupByAvgDuration } from './group-by-avg-duration'
import { avgDuration } from './avg-duration'
import { ratingHistoryMapping } from './rating-history-mapping'
import { autoMatcherV2 } from './auto-matcher-v2'

export function calculateMatchHistoryStats(profileId, matchHistory, ratingHistory) {
  const mappedRatingHistory = ratingHistoryMapping(ratingHistory)
  const autoMatchHistory = autoMatcherV2(profileId, matchHistory, mappedRatingHistory)

  const mapGrouped = groupBy(autoMatchHistory, match => {
    return match.mapId
  })

  const mapWinRates = groupByWinRate(mapGrouped)
  const mapAvgDurations = groupByAvgDuration(mapGrouped)

  const civPlayCounts = countBy(autoMatchHistory, match => {
    return match.civId
  })

  const civGrouped = groupBy(autoMatchHistory, match => {
    return match.civId
  })

  const civWinRates = groupByWinRate(civGrouped)
  const civAvgDurations = groupByAvgDuration(civGrouped)

  const mapCivSelectionRates = civSelectionRate(mapGrouped)

  const mostPlayedCiv = Object.keys(civPlayCounts).reduce((a, b) => {
    if (civPlayCounts[a] > civPlayCounts[b]) {
      return a
    }

    return b
  })

  return {
    winRate: winRate(autoMatchHistory),
    avgDuration: avgDuration(autoMatchHistory),
    mapWinRates,
    mapAvgDurations,
    civWinRates,
    civAvgDurations,
    mapCivSelectionRates,
    mostRecentCiv: autoMatchHistory[0].civId,
    civPlayCounts,
    mostPlayedCiv,
  }
}
