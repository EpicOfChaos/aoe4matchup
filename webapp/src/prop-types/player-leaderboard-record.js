import * as propTypes from 'prop-types'

export const playerLeaderboardRecord = {
  profile_id: propTypes.number.isRequired,
  rank: propTypes.number.isRequired,
  rating: propTypes.number.isRequired,
  steam_id: propTypes.string.isRequired,
  icon: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  clan: propTypes.string.isRequired,
  country: propTypes.string.isRequired,
  previous_rating: propTypes.number.isRequired,
  highest_rating: propTypes.number.isRequired,
  streak: propTypes.number.isRequired,
  lowest_streak: propTypes.number.isRequired,
  highest_streak: propTypes.number.isRequired,
  games: propTypes.number.isRequired,
  wins: propTypes.number.isRequired,
  losses: propTypes.number.isRequired,
  drops: propTypes.number.isRequired,
  last_match_time: propTypes.number.isRequired,
}
