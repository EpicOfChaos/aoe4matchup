import React, { useEffect, useState } from 'react'

import Page from '../containers/Page'
import { getLeaderBoard } from '../services/aoeiv-net/client'
import LeaderBoard from '../components/LeaderBoard'

function Home() {
  const [leaderboard, setLeaderboard] = useState([])
  useEffect(async () => {
    setLeaderboard(await getLeaderBoard())
  })
  return (
    <Page title="Leaderboard">
      {leaderboard.leaderboard.length > 0 ? (
        <LeaderBoard rows={leaderboard.leaderboard} />
      ) : (
        <div>Loading...</div>
      )}
    </Page>
  )
}

export default Home
