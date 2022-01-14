import find from 'lodash/find'

export function autoMatchMapper(profileId, matchHistory, ratingHistory) {
  const autoMatch = matchHistory.filter((match, i) => {
    return match.name === 'AUTOMATCH' && match.num_players === 2
  })

  // The rating history can be delayed, if you are in a middle of a game you need to ignore first few games.
  while (ratingHistory[0].timestamp < autoMatch[0].started) {
    autoMatch.shift()
  }

  return autoMatch.map((match, i) => {
    const player = find(match.players, p => {
      return p.profile_id.toString() === profileId
    })
    const opponentPlayer = find(match.players, p => {
      return p.profile_id.toString() !== profileId
    })

    return {
      matchId: match.match_id,
      mapId: match.map_type,
      civId: player.civ,
      opponentCivId: opponentPlayer.civ,
      victory:
        ((ratingHistory[i] && ratingHistory[i].num_wins) || 0) >
        ((ratingHistory[i + 1] && ratingHistory[i + 1].num_wins) || 0),
    }
  })
}
