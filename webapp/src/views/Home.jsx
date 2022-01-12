import React, { useEffect, useState } from 'react'

import Page from '../containers/Page'
import { getLeaderBoard } from '../services/aoeiv-net/client'
import LeaderBoard from '../components/LeaderBoard'
import { DEFAULT_LEADER_BOARD_ID } from '../constants/aoe4-net'

function Home() {
  const [leaderboard, setLeaderboard] = useState([])
  useEffect(() => {
    async function getLeaderBoardData() {
      setLeaderboard(await getLeaderBoard(DEFAULT_LEADER_BOARD_ID, 10))
    }

    getLeaderBoardData()
  }, [])

  return (
    <Page title="Leaderboard">
      {leaderboard && leaderboard.count > 0 ? (
        <LeaderBoard rows={leaderboard.leaderboard} />
      ) : (
        <div>Loading...</div>
      )}
    </Page>
  )
}

export default Home
