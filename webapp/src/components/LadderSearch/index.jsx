import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import propTypes from 'prop-types'
import debounce from 'lodash/debounce'
import { useHistory, useLocation } from 'react-router-dom'
import { getLeaderBoard } from '../../services/aoeiv-net/client'

const fetchSearch = async (ladderId, query, cb) => {
  const res = await getLeaderBoard(ladderId, 25, query)
  cb(res.leaderboard)
}

const debouncedFetchData = debounce((ladderId, query, cb) => {
  if (query) {
    fetchSearch(ladderId, query, cb)
  } else {
    cb([])
  }
}, 500)

export default function LadderSearch({ ladderId, searchIconPadding }) {
  const location = useLocation()
  const theme = useTheme()
  const history = useHistory()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    debouncedFetchData(ladderId, searchQuery, res => {
      setSearchResults(res)
    })
  }, [searchQuery, ladderId])

  return (
    <Autocomplete
      clearOnBlur
      clearOnEscape
      onChange={(event, newValue) => {
        if (newValue && newValue.profile_id) {
          if (location.pathname === '/') {
            const searchParams = new URLSearchParams(location.search)
            searchParams.append('player', newValue.profile_id)
            history.push({
              pathname: location.pathname,
              search: searchParams.toString(),
            })
          } else {
            history.push(`/?player=${newValue.profile_id}`)
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
  ladderId: propTypes.string.isRequired,
  searchIconPadding: propTypes.string,
}

LadderSearch.defaultProps = {
  searchIconPadding: '0',
}
