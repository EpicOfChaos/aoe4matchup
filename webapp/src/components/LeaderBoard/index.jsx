import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import PropTypes from 'prop-types'
import { hasFlag } from 'country-flag-icons'
import Flags from 'country-flag-icons/react/3x2'
import { makeStyles } from '@mui/styles'
import { differenceInDays, differenceInHours, differenceInMinutes, fromUnixTime } from 'date-fns'
import { Link } from '@mui/material'

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
            <TableCell align="right">Losses</TableCell>
            <TableCell align="right">Win %</TableCell>
            <TableCell align="right">Last Match Ended</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            const CountryFlag = (row.country && hasFlag(row.country) && Flags[row.country]) || null
            const minutesFromLastMatch = differenceInMinutes(new Date(), fromUnixTime(row.last_match_time))

            let lastMatch = ''
            if (minutesFromLastMatch >= 1440) {
              lastMatch = `${differenceInDays(new Date(), fromUnixTime(row.last_match_time))} days ago`
            } else if (minutesFromLastMatch >= 120) {
              lastMatch = `${differenceInHours(new Date(), fromUnixTime(row.last_match_time))} hours ago`
            } else {
              lastMatch = `${minutesFromLastMatch} minutes ago`
            }
            return (
              <TableRow key={row.rank} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.rank}
                </TableCell>
                <TableCell align="right">{row.rating}</TableCell>
                <TableCell align="right">
                  <Link
                    to={{
                      pathname: '/matchup',
                      state: [row],
                    }}
                  >
                    {CountryFlag && <CountryFlag className={classes.countryFlag} />}
                    &nbsp;
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell align="right">{row.games}</TableCell>
                <TableCell align="right">{row.wins}</TableCell>
                <TableCell align="right">{row.losses}</TableCell>
                <TableCell align="right">{((row.wins / row.games) * 100).toFixed(2)}%</TableCell>
                <TableCell align="right">{lastMatch}</TableCell>
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
