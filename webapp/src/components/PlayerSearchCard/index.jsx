import React from 'react'
import { Card, CardContent, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
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
        <Typography
          sx={{ fontSize: 20, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
          color="text.primary"
          gutterBottom
        >
          <PersonOutlineIcon fontSize="large" color="primary" />
          Compare Player
          <Tooltip
            title="Search for a player to compare statistics. Currently you are only able to find and compare 1v1 quick match participants"
            placement="top"
            arrow
          >
            <InfoOutlinedIcon color="secondary" fontSize="small" />
          </Tooltip>
        </Typography>
        <LadderSearch />
      </CardContent>
    </Card>
  )
}
