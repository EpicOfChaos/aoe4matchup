import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Autocomplete, TextField } from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'
import debounce from 'lodash/debounce'
import { useHistory, useLocation } from 'react-router-dom'
import { getLeaderBoard } from '../../services/aoeiv-net/client'
import { DEFAULT_LEADER_BOARD_ID } from '../../constants/aoe4-net'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))
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

export default function LadderSearch() {
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
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Autocomplete
        clearOnBlur
        clearOnEscape
        onChange={(event, newValue) => {
          if (newValue && newValue.profile_id) {
            if (location.pathname === '/matchup') {
              console.log('On matchup page, adding player')
              const searchParams = new URLSearchParams(location.search)
              searchParams.append('player', newValue.profile_id)
              history.push({
                pathname: location.pathname,
                search: searchParams.toString(),
              })
            } else {
              console.log('not on matchup page, redirecting')
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
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
              },
            }}
          />
        )}
        options={searchResults}
        getOptionLabel={option => option.name}
        freeSolo
      />
    </Search>
  )
}
