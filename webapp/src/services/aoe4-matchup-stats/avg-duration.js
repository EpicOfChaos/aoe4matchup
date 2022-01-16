export function avgDuration(matchHistory) {
  let totalMatches = matchHistory.length
  let totalDuration = 0
  for (const match of matchHistory) {
    if (match.durationInMinutes > 180 || match.durationInMinutes < 0) {
      totalMatches -= 1
      // eslint-disable-next-line no-continue
      continue
    }
    totalDuration += match.durationInMinutes
  }

  return totalDuration / totalMatches
}
