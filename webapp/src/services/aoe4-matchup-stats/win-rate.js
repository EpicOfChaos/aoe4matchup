import { OutcomeEnum } from './outcome.enum'

export function winRate(matchHistory) {
  let totalWins = 0
  for (const match of matchHistory) {
    if (match.outcome === OutcomeEnum.WIN) {
      totalWins += 1
    }
  }

  return totalWins / matchHistory.length
}
