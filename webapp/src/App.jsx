import React from 'react'
import ReactGA from 'react-ga4'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './App.css'
import { ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { createTheme, useMediaQuery } from '@mui/material'
import Routes from './Routes'
import { ColorModeContext } from './ColorModeContext'

const helmetContext = {}
const THEME_KEY = 'aoe4matchup-theme'

ReactGA.initialize('G-VH28V7RSJF')
ReactGA.send('pageview')
function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const storedTheme = localStorage.getItem(THEME_KEY)
  let initialTheme = prefersDarkMode ? 'dark' : 'light'
  if (storedTheme) {
    initialTheme = storedTheme
  }

  const [mode, setMode] = React.useState(initialTheme)
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => {
          const newTheme = prevMode === 'light' ? 'dark' : 'light'
          localStorage.setItem(THEME_KEY, newTheme)
          return newTheme
        })
      },
    }),
    [],
  )

  const theme = React.useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: '#006897',
        },
        secondary: {
          main: '#ffb248',
        },
      },
    })
  }, [mode])

  return (
    <Grid direction="column">
      <HelmetProvider context={helmetContext}>
        <Helmet titleTemplate="%s | Age of Empires 4 - Matchup" defaultTitle="Age of Empires 4 - Matchup" />
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <Routes />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </HelmetProvider>
    </Grid>
  )
}

export default App
