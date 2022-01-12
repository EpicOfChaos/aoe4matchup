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
      elevation={4}
    >
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
          Compare Player
        </Typography>
        <LadderSearch />
      </CardContent>
    </Card>
  )
}
