import React from 'react'
import * as propTypes from 'prop-types'
import Page from '../containers/Page'
import { playerLeaderboardRecord } from '../prop-types/player-leaderboard-record'
import PlayerCard from '../components/PlayerCard'

export default function Matchup({ players }) {
  return (
    <Page title="Matchup">
      {players.map(record => {
        return <PlayerCard playerRecord={record} />
      })}
    </Page>
  )
}

Matchup.propTypes = {
  players: propTypes.arrayOf(playerLeaderboardRecord),
}

Matchup.defaultProps = {
  players: [],
}
