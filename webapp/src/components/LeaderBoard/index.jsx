import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import PropTypes from 'prop-types'
// import { hasFlag } from 'country-flag-icons'
// import Flags from 'country-flag-icons/react/3x2'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  countryFlag: {
    height: '14px',
  },
}))

export default function LeaderBoard({ rows }) {
  const classes = useStyles()
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell align="right">Rating</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Games</TableCell>
            <TableCell align="right">Wins</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            // const CountryFlag = (row.country && hasFlag(row.country) && Flags[row.country]) || null
            return (
              <TableRow key={row.rank} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.rank}
                </TableCell>
                <TableCell align="right">{row.rating}</TableCell>
                <TableCell align="right">
                  {/*{CountryFlag && <CountryFlag className={classes.countryFlag} />}*/}
                  &nbsp;
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.games}</TableCell>
                <TableCell align="right">{row.wins}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

LeaderBoard.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
}
