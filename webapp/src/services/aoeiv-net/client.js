import axios from 'axios'
import { DEFAULT_LEADERBOARD_COUNT, GAME_ID } from '../../constants/aoe4-net'

let client

function getApiClient() {
  if (!client) {
    client = axios.create({
      baseURL: 'https://aoeiv.net/api/',
    })
  }
  return client
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
  console.log(data)
  return data
}
