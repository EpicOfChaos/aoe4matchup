import axios from 'axios'
import {
  DEFAULT_LANGUAGE,
  DEFAULT_LEADER_BOARD_ID,
  DEFAULT_LEADERBOARD_COUNT,
  GAME_ID,
  HISTORY_COUNT,
} from '../../constants/aoe4-net'

let client

function getApiClient() {
  if (!client) {
    client = axios.create({
      baseURL: 'https://aoeiv.net/api/',
    })
  }
  return client
}

export async function getLeaderBoardForPlayer(leaderBoardId, profileId) {
  const params = {
    game: GAME_ID,
    count: 1,
    leaderboard_id: leaderBoardId,
    profile_id: profileId,
  }
  console.log('Player Leaderboard: ', params)
  const { data } = await getApiClient().get('/leaderboard', {
    params,
  })
  console.log('Player Leaderboard Data: ', data)
  return (data && data.leaderboard && data.leaderboard[0]) || null
}

export async function getLeaderBoard(leaderBoardId, count = DEFAULT_LEADERBOARD_COUNT, nameSearch = null) {
  const params = {
    game: GAME_ID,
    count,
    leaderboard_id: leaderBoardId,
  }
  if (nameSearch) {
    params.search = nameSearch
  }
  console.log('Params', params)

  const { data } = await getApiClient().get('/leaderboard', {
    params,
  })
  return data
}

export async function getMatchHistory(profileId) {
  const { data } = await getApiClient().get('/player/matches', {
    params: {
      game: GAME_ID,
      language: DEFAULT_LANGUAGE,
      count: HISTORY_COUNT,
      profile_id: profileId,
    },
  })

  return data
}

export async function getPlayerRating(profileId, leaderBoardId = DEFAULT_LEADER_BOARD_ID) {
  const { data } = await getApiClient().get('/player/ratinghistory', {
    params: {
      game: GAME_ID,
      language: DEFAULT_LANGUAGE,
      count: HISTORY_COUNT,
      profile_id: profileId,
      leaderboard_id: leaderBoardId,
    },
  })

  return data
}
