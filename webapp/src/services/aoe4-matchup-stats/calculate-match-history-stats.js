import groupBy from 'lodash/groupBy'
import countBy from 'lodash/countBy'
import getUnixTime from 'date-fns/getUnixTime'
import addDuration from 'date-fns-duration'
import { groupByWinRate } from './group-by-win-rate'
import { civSelectionRate } from './civ-selection-rate'
import { groupByAvgDuration } from './group-by-avg-duration'
import { avgDuration } from './avg-duration'
import { ratingHistoryMapping } from './rating-history-mapping'
import { autoMatcherV2 } from './auto-matcher-v2'
import timeframeOptions from '../../constants/timeframe-periods.json'

export function calculateMatchHistoryStats(profileId, matchHistory, ratingHistory, ladderId, timeframeId) {
  const timeFrameOption = timeframeOptions[timeframeId]
  let startTimeUnix = 0
  if (timeFrameOption.duration) {
    startTimeUnix = getUnixTime(addDuration(Date.now(), timeFrameOption.duration))
  }

  const mappedRatingHistory = ratingHistoryMapping(ratingHistory, startTimeUnix)
  const autoMatchHistory = autoMatcherV2(
    profileId,
    matchHistory,
    mappedRatingHistory,
    ladderId,
    startTimeUnix,
  )

  const outcomeGrouped = groupBy(autoMatchHistory, match => {
    return match.outcome
  })

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

  const opponentCivGrouped = groupBy(autoMatchHistory, match => {
    return match.opponentCivIds[0]
  })

  const civWinRates = groupByWinRate(civGrouped)
  const opponentCivWinRates = groupByWinRate(opponentCivGrouped)
  const civAvgDurations = groupByAvgDuration(civGrouped)

  const mapCivSelectionRates = civSelectionRate(mapGrouped)
  let winsMostAgainst = null
  if (Object.keys(opponentCivWinRates).length > 0) {
    winsMostAgainst = Object.keys(opponentCivWinRates).reduce((a, b) => {
      if (opponentCivWinRates[a] > opponentCivWinRates[b]) {
        return a
      }
      return b
    })
  }

  let loseMostAgainst = null
  if (Object.keys(opponentCivWinRates).length > 0) {
    loseMostAgainst = Object.keys(opponentCivWinRates).reduce((a, b) => {
      if (opponentCivWinRates[a] < opponentCivWinRates[b]) {
        return a
      }
      return b
    })
  }

  let mostPlayedCiv = null
  if (Object.keys(civPlayCounts).length > 0) {
    mostPlayedCiv = Object.keys(civPlayCounts).reduce((a, b) => {
      if (civPlayCounts[a] > civPlayCounts[b]) {
        return a
      }

      return b
    })
  }

  return {
    outcomeGrouped,
    avgDuration: avgDuration(autoMatchHistory),
    mapWinRates,
    mapAvgDurations,
    civWinRates,
    civAvgDurations,
    mapCivSelectionRates,
    opponentCivWinRates,
    winsMostAgainst,
    loseMostAgainst,
    mostRecentCiv: autoMatchHistory[0] ? autoMatchHistory[0].civId : null,
    civPlayCounts,
    mostPlayedCiv,
  }
}
