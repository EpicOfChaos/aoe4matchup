import React, { useEffect, useState } from 'react'
import { alpha, styled, useTheme, makeStyles } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import MoreIcon from '@mui/icons-material/MoreVert'
import { Autocomplete, TextField } from '@mui/material'
import debounce from 'lodash/debounce'
import { ColorModeContext } from '../ColorModeContext'
import { getLeaderBoard } from '../services/aoeiv-net/client'
import { DEFAULT_LEADER_BOARD_ID } from '../constants/aoe4-net'

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

export default function Header() {
  const theme = useTheme()
  const colorMode = React.useContext(ColorModeContext)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  // const history = useHistory()

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={colorMode.toggleColorMode}>
        <IconButton size="large" aria-label={`enable ${theme.palette.mode} mode`} color="inherit">
          {theme.palette.mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <p>
          {theme.palette.mode === 'light' ? 'Dark' : 'Light'}
          Mode
        </p>
      </MenuItem>
    </Menu>
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    debouncedFetchData(searchQuery, res => {
      setSearchResults(res)
    })
  }, [searchQuery])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Age of Empires 4 - Matchup
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <Autocomplete
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
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label={`enable ${theme.palette.mode} mode`}
              color="inherit"
              onClick={colorMode.toggleColorMode}
            >
              {theme.palette.mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  )
}
