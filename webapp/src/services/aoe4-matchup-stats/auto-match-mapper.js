import find from 'lodash/find'
import { fromUnixTime, differenceInMinutes } from 'date-fns'

export function autoMatchMapper(profileId, matchHistory, ratingHistory) {
  // matchHistory.forEach((match, i) => {
  //   // eslint-disable-next-line no-param-reassign
  //   match.startedTimestamp = formatISO(fromUnixTime(match.started))
  // })
  // console.log(JSON.stringify(matchHistory))
  const autoMatch = matchHistory.filter(match => {
    return match.name === 'AUTOMATCH' && match.num_players === 2
  })

  // The rating history can be delayed, if you are in a middle of a game you need to ignore first few games.
  while (ratingHistory[0].timestamp < autoMatch[0].started) {
    autoMatch.shift()
  }
  // ratingHistory.forEach((rating, i) => {
  //   // eslint-disable-next-line no-param-reassign
  //   rating.index = i
  //   // eslint-disable-next-line no-param-reassign
  //   rating.ratingTimestamp = formatISO(fromUnixTime(rating.timestamp))
  // })
  // console.log(JSON.stringify(autoMatch))
  // console.log(JSON.stringify(ratingHistory))
  let offset = 0
  return autoMatch.map((match, i) => {
    const player = find(match.players, p => {
      return p.profile_id.toString() === profileId
    })
    const opponentPlayer = find(match.players, p => {
      return p.profile_id.toString() !== profileId
    })

    if (
      ratingHistory[i + offset].rating === ratingHistory[i + offset + 1].rating ||
      differenceInMinutes(fromUnixTime(ratingHistory[i + offset].timestamp), fromUnixTime(match.started)) >
        300
    ) {
      // console.log('Adding offset', [
      //   ratingHistory[i + offset].rating,
      //   ratingHistory[i + offset + 1].rating,
      //   differenceInMinutes(fromUnixTime(ratingHistory[i + offset].timestamp), fromUnixTime(match.started)),
      // ])
      offset += 1
    }
    if (
      differenceInMinutes(fromUnixTime(ratingHistory[i + offset].timestamp), fromUnixTime(match.started)) < 0
    ) {
      // console.log('minus 1')
      offset -= 1
    }
    const duration = differenceInMinutes(
      fromUnixTime(ratingHistory[i + offset].timestamp),
      fromUnixTime(match.started),
    )
    // console.log(`matchId: ${match.match_id} ${i + offset} duration: ${duration}`)
    return {
      matchId: match.match_id,
      mapId: match.map_type,
      civId: player.civ,
      opponentCivId: opponentPlayer.civ,
      durationInMinutes: duration,
      victory:
        ((ratingHistory[i + offset] && ratingHistory[i + offset].num_wins) || 0) >
        ((ratingHistory[i + offset + 1] && ratingHistory[i + offset + 1].num_wins) || 0),
    }
  })
}
