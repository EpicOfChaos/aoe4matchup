import { ratingMapping } from './rating-mapping'

export function ratingHistoryMapping(ratingHistory) {
  const mappedHistory = [...ratingMapping(ratingHistory[0], ratingHistory[1])]
  for (let i = 1; i < ratingHistory.length; i += 1) {
    mappedHistory.push(...ratingMapping(ratingHistory[i], ratingHistory[i + 1]))
  }
  return mappedHistory
}
