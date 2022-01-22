import { ratingMapping } from './rating-mapping'

export function ratingHistoryMapping(ratingHistory, startTimeUnix) {
  if (ratingHistory === null || ratingHistory.length === 0) {
    return []
  }

  const relevantRatings = ratingHistory.filter(rating => {
    return rating.timestamp > startTimeUnix
  })
  if (relevantRatings.length === 0) {
    return []
  }

  const mappedHistory = [...ratingMapping(relevantRatings[0], relevantRatings[1])]
  for (let i = 1; i < relevantRatings.length; i += 1) {
    mappedHistory.push(...ratingMapping(relevantRatings[i], relevantRatings[i + 1]))
  }
  return mappedHistory
}
