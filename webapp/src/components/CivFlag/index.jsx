import React from 'react'
import propTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import aoeStrings from '../../services/aoeiv-net/aoeiv-strings.json'

const civNames = aoeStrings.civ.reduce((map, obj) => {
  return {
    ...map,
    [obj.id]: obj.string,
  }
}, {})

const useStyles = makeStyles(() => ({
  civFlag: {
    width: '35px',
    marginRight: '5px',
  },
}))

export default function CivFlag({ civId }) {
  const classes = useStyles()
  return (
    <img
      src={`/images/flags/flag_${civId}.png`}
      alt={`${civNames[civId]} flag`}
      className={classes.civFlag}
    />
  )
}

CivFlag.propTypes = {
  civId: propTypes.number.isRequired,
}
