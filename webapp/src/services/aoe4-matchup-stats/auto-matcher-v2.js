import find from 'lodash/find'
import { differenceInMinutes, fromUnixTime } from 'date-fns'
import { OutcomeEnum } from './outcome.enum'

export function autoMatcherV2(profileId, matchHistory, ratingHistory) {
  const autoMatches = matchHistory.filter(match => {
    return match.name === 'AUTOMATCH' && match.num_players === 2
  })

  // The rating history can be delayed, if you are in a middle of a game you need to ignore first few games.
  while (ratingHistory[0].timestamp < autoMatches[0].started) {
    autoMatches.shift()
  }

  const mappedAutoMatches = []
  for (
    let autoMatchPos = 0, ratingPos = 0;
    autoMatchPos < autoMatches.length && ratingPos < ratingHistory.length;
    autoMatchPos += 1, ratingPos += 1
  ) {
    const autoMatch = autoMatches[autoMatchPos]
    const rating = ratingHistory[ratingPos]

    const player = find(autoMatch.players, p => {
      return p.profile_id.toString() === profileId
    })

    const opponents = autoMatch.players.filter(p => {
      return p.profile_id !== player.profile_id && p.team !== player.team
    })

    if (rating.outcome === OutcomeEnum.MISSING) {
      mappedAutoMatches.push({
        gameNumber: rating.gameNumber,
        matchId: autoMatch.match_id,
        mapId: autoMatch.map_type,
        civId: player.civ,
        opponentCivIds: opponents.map(p => {
          return p.civ
        }),
        durationInMinutes: null,
        outcome: rating.outcome,
      })
    }

    if (autoMatch.started > rating.timestamp) {
      ratingPos -= 1
      // eslint-disable-next-line no-continue
      continue
    }
    const duration = differenceInMinutes(fromUnixTime(rating.timestamp), fromUnixTime(autoMatch.started))
    if (duration > 180) {
      autoMatchPos -= 1
      // eslint-disable-next-line no-continue
      continue
    }
    mappedAutoMatches.push({
      gameNumber: rating.gameNumber,
      matchId: autoMatch.match_id,
      mapId: autoMatch.map_type,
      civId: player.civ,
      opponentCivIds: opponents.map(p => {
        return p.civ
      }),
      durationInMinutes: duration,
      outcome: rating.outcome,
    })
  }

  return mappedAutoMatches.filter(match => {
    return match.outcome === OutcomeEnum.WIN || match.outcome === OutcomeEnum.LOSS
  })
}
