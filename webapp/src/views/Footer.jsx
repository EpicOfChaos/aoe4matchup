import React from 'react'
import { Link, Typography } from '@mui/material'
import AppBar from '@mui/material/AppBar'

function Footer() {
  return (
    <AppBar position="fixed" color="primary" sx={{ padding: '20px', top: 'auto', bottom: 0 }}>
      <Typography variant="body2">
        AoE4matchup.com was created under Microsoft&apos;s &quot;
        <Link href="https://www.xbox.com/en-US/developers/rules">Game Content Usage Rules</Link>
        &quot; using assets from Age of Empires IV, and it is not endorsed by or affiliated with Microsoft.
      </Typography>
    </AppBar>
  )
}

export default Footer
