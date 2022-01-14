export function calculateLikelyCivPick(playersData, mapId) {
  const playersLikelyCivPick = {}
  const profileIds = Object.keys(playersData)
  for (const profileId of profileIds) {
    const { stats } = playersData[profileId]
    const { mostRecentPlayedCiv, mostPlayedCiv } = stats
    let mostLikelyCiv = null
    if (mapId != null) {
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

    playersLikelyCivPick[profileId] = mostLikelyCiv
  }
  return playersLikelyCivPick
}
