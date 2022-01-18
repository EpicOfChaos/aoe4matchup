export function calculateLikelyCivPick(playersData, mapId) {
  const playersLikelyCivPick = {}
  const profileKeys = Object.keys(playersData)
  for (const profileKey of profileKeys) {
    const { stats } = playersData[profileKey]
    const { mostRecentPlayedCiv, mostPlayedCiv } = stats
    let mostLikelyCiv = null
    if (mapId != null && stats.mapStats[mapId]) {
      const { mapHighestSelectedCiv, mapHighestSelectedCivSelectionRate } = stats.mapStats[mapId]
      if (
        mapHighestSelectedCivSelectionRate > 0.55 ||
        mostRecentPlayedCiv === mapHighestSelectedCiv ||
        mostPlayedCiv === mapHighestSelectedCiv
      ) {
        mostLikelyCiv = mapHighestSelectedCiv
      }
    }
    if (mostLikelyCiv === null) {
      mostLikelyCiv = mostRecentPlayedCiv
    }

    playersLikelyCivPick[profileKey] = mostLikelyCiv
  }
  return playersLikelyCivPick
}
