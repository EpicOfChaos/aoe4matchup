import axios from 'axios'
import {
  DEFAULT_LANGUAGE,
  DEFAULT_LEADER_BOARD_ID,
  DEFAULT_LEADERBOARD_COUNT,
  GAME_ID,
  HISTORY_COUNT,
  MATCH_HISTORY_COUNT,
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
  const { data } = await getApiClient().get('/leaderboard', {
    params,
  })
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

  const { data } = await getApiClient().get('/leaderboard', {
    params,
  })
  return data
}

export async function getMatchHistory(profileId, start = 0) {
  const { data } = await getApiClient().get('/player/matches', {
    params: {
      game: GAME_ID,
      language: DEFAULT_LANGUAGE,
      count: MATCH_HISTORY_COUNT,
      start,
      profile_id: profileId,
    },
  })

  return data
}

export async function getPlayerRating(profileId, leaderBoardId = DEFAULT_LEADER_BOARD_ID, start = 0) {
  const { data } = await getApiClient().get('/player/ratinghistory', {
    params: {
      game: GAME_ID,
      language: DEFAULT_LANGUAGE,
      start,
      count: HISTORY_COUNT,
      profile_id: profileId,
      leaderboard_id: leaderBoardId,
    },
  })

  return data
}
