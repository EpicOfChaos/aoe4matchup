import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { Container, Paper, Typography } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import Grid from '@mui/material/Grid'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: '75px',
  },
  titleContainer: {
    padding: theme.spacing(2),
  },
  contentContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(8),
  },
}))

function Page({ title, actionItems, children }) {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <Paper elevation={2}>
        <Helmet title={title} />
        <Grid container className={classes.titleContainer}>
          <Grid item xs={7}>
            <Typography variant="h5" display="inline">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            {actionItems}
          </Grid>
        </Grid>
        <Paper elevation={3} className={classes.contentContainer}>
          {children}
        </Paper>
      </Paper>
    </Container>
  )
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  actionItems: PropTypes.node,
  children: PropTypes.node.isRequired,
}

Page.defaultProps = {
  actionItems: <></>,
}

export default Page
