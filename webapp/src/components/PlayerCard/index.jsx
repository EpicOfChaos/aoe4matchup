import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import * as propTypes from 'prop-types'
import { playerLeaderboardRecord } from '../../prop-types/player-leaderboard-record'

export default function PlayerCard({ playerRecord }) {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {playerRecord.name}
        </Typography>
        {/*<Typography variant="h5" component="div">*/}
        {/*  be{bull}nev{bull}o{bull}lent*/}
        {/*</Typography>*/}
        {/*<Typography sx={{ mb: 1.5 }} color="text.secondary">*/}
        {/*  adjective*/}
        {/*</Typography>*/}
      </CardContent>
    </Card>
  )
}

PlayerCard.propTypes = {
  playerRecord: propTypes.objectOf(playerLeaderboardRecord).isRequired,
}
