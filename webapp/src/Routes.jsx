import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import Header from './views/Header'
import Footer from './views/Footer'
import './App.css'
import Home from './views/Home'
import NotFound from './views/NotFound'
import Leaderboard from './views/Leaderboard'

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
}))

function Routes() {
  const classes = useStyles()

  return (
    <Router>
      <Route
        render={() => (
          <Paper elevation={0} className={classes.root}>
            <Header />
            <Grid container direction="column">
              <Grid container direction="row">
                <Grid item xs>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/leaderboard" component={Leaderboard} />
                    <Route path="*" component={NotFound} />
                  </Switch>
                </Grid>
              </Grid>
            </Grid>
            <Footer />
          </Paper>
        )}
      />
    </Router>
  )
}

export default Routes
