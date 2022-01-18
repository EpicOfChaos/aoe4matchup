import React from 'react'
import { Link, Typography } from '@mui/material'
import AppBar from '@mui/material/AppBar'

function Footer() {
  return (
    <AppBar position="relative" color="primary" sx={{ padding: '20px' }}>
      <Typography variant="body2">
        AoE4matchup.com was created under Microsoft&apos;s &quot;
        <Link color="secondary" href="https://www.xbox.com/en-US/developers/rules">
          Game Content Usage Rules
        </Link>
        &quot; using assets from Age of Empires IV, and it is not endorsed by or affiliated with Microsoft.
        Special thanks to{' '}
        <Link color="secondary" href="https://aoeiv.net/#api">
          AoEIV.net
        </Link>{' '}
        for the underlying data provided.
      </Typography>
    </AppBar>
  )
}

export default Footer
