import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Header from './views/Header'
import Footer from './views/Footer'
import './App.css'
import Home from './views/Home'
import NotFound from './views/NotFound'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  content: {
    display: 'flex',
    flex: '1',
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
            <div className={classes.content}>
              <Switch>
                <Route exact path="/" component={Home} />
                {/*<Route exact path="/profile" component={Profile} />*/}
                {/*<Route path="/matchup/:profile1/profile2" component={Detail} />*/}
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
            <Footer />
          </Paper>
        )}
      />
    </Router>
  )
}

export default Routes
