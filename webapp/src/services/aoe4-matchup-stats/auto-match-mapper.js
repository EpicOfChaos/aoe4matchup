import find from 'lodash/find'

export function autoMatchMapper(profileId, matchHistory, ratingHistory) {
  return matchHistory
    .filter(match => {
      return match.name === 'AUTOMATCH' && match.num_players === 2
    })
    .map((match, i) => {
      const player = find(match.players, p => {
        return p.profile_id.toString() === profileId
      })
      if (!player) {
        console.log(`messed up match #${i}`, match)
      }
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
