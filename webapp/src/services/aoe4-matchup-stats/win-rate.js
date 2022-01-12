export function winRate(matchHistory) {
  let totalWins = 0
  for (const match of matchHistory) {
    if (match.victory) {
      totalWins += 1
    }
  }

  return totalWins / matchHistory.length
}
