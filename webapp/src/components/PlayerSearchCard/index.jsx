import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import LadderSearch from '../LadderSearch'

export default function PlayerSearchCard() {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 24 }} color="text.primary" gutterBottom>
          Find Player
        </Typography>
        <LadderSearch />
      </CardContent>
    </Card>
  )
}
