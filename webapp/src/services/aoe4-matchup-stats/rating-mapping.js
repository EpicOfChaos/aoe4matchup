import { formatISO, fromUnixTime } from 'date-fns'
import { OutcomeEnum } from './outcome.enum'

export function ratingMapping(rating, previousRating) {
  const missingMapping = []
  let outcome = OutcomeEnum.UNKNOWN
  const gameNumber = rating.num_wins + rating.num_losses
  let previousGameNumber = 0
  if (!previousRating) {
    if (rating.num_wins === 1) {
      outcome = OutcomeEnum.WIN
    } else if (rating.num_losses === 1) {
      outcome = OutcomeEnum.LOSS
    } else {
      // fill in gaps
      const gameNumberDifference = gameNumber - previousGameNumber
      for (let i = 1; i < gameNumberDifference; i += 1) {
        missingMapping.push({
          gameNumber: gameNumber - i,
          outcome: OutcomeEnum.MISSING,
        })
      }
    }
  } else {
    previousGameNumber = previousRating.num_wins + previousRating.num_losses
    const gameNumberDifference = gameNumber - previousGameNumber
    if (gameNumberDifference === 1) {
      if (rating.num_wins > previousRating.num_wins) {
        outcome = OutcomeEnum.WIN
      } else {
        outcome = OutcomeEnum.LOSS
      }
    } else {
      // fill in gaps
      for (let i = 1; i < gameNumberDifference; i += 1) {
        missingMapping.push({
          gameNumber: gameNumber - i,
          outcome: OutcomeEnum.MISSING,
        })
      }
    }
  }

  return [
    {
      rating: rating.rating,
      numWins: rating.num_wins,
      numLosses: rating.num_losses,
      gameNumber,
      timestamp: rating.timestamp,
      ratingTimestamp: formatISO(fromUnixTime(rating.timestamp)),
      outcome,
    },
    ...missingMapping,
  ]
}
