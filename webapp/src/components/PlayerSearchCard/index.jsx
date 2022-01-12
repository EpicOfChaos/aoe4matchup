import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import LadderSearch from '../LadderSearch'

export default function PlayerSearchCard() {
  return (
    <Card
      sx={{
        width: '280px',
        margin: '20px',
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
          Find Player
        </Typography>
        <LadderSearch />
      </CardContent>
    </Card>
  )
}
