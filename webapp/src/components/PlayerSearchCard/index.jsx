import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LadderSearch from '../LadderSearch'

export default function PlayerSearchCard() {
  const theme = useTheme()
  return (
    <Card
      sx={{
        width: '280px',
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(2),
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
