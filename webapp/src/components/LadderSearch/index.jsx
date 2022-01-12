import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import propTypes from 'prop-types'
import debounce from 'lodash/debounce'
import { useHistory, useLocation } from 'react-router-dom'
import { getLeaderBoard } from '../../services/aoeiv-net/client'
import { DEFAULT_LEADER_BOARD_ID } from '../../constants/aoe4-net'

const fetchSearch = async (query, cb) => {
  const res = await getLeaderBoard(DEFAULT_LEADER_BOARD_ID, 25, query)
  cb(res.leaderboard)
}

const debouncedFetchData = debounce((query, cb) => {
  if (query) {
    fetchSearch(query, cb)
  } else {
    cb([])
  }
}, 500)

export default function LadderSearch({ searchIconPadding }) {
  const location = useLocation()
  const theme = useTheme()
  const history = useHistory()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    debouncedFetchData(searchQuery, res => {
      setSearchResults(res)
    })
  }, [searchQuery])

  return (
    <Autocomplete
      clearOnBlur
      clearOnEscape
      onChange={(event, newValue) => {
        if (newValue && newValue.profile_id) {
          if (location.pathname === '/matchup') {
            const searchParams = new URLSearchParams(location.search)
            searchParams.append('player', newValue.profile_id)
            history.push({
              pathname: location.pathname,
              search: searchParams.toString(),
            })
          } else {
            history.push(`/matchup?player=${newValue.profile_id}`)
          }
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          placeholder="search player"
          onChange={event => setSearchQuery(event.target.value)}
          sx={{
            color: 'inherit',
            width: '250px',
            '& .MuiOutlinedInput-root': {
              color: 'inherit',
              padding: theme.spacing(1, 1, 1, 0),
              // vertical padding + font size from searchIcon
              paddingLeft: searchIconPadding,
            },
          }}
        />
      )}
      options={searchResults}
      getOptionLabel={option => option.name}
      freeSolo
    />
  )
}

LadderSearch.propTypes = {
  searchIconPadding: propTypes.string,
}

LadderSearch.defaultProps = {
  searchIconPadding: '0',
}
