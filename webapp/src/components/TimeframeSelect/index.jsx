import React from 'react'
import propTypes from 'prop-types'
import { Autocomplete, Card, CardContent, TextField, Tooltip, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTheme } from '@mui/material/styles'
import addDuration from 'date-fns-duration'
import intlFormat from 'date-fns/intlFormat/index'
import timeframeOptions from '../../constants/timeframe-periods.json'

function getTimeFrameLabel(option) {
  if (option.duration) {
    const durationDate = intlFormat(
      addDuration(Date.now(), option.duration),
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      {
        locale: navigator.language,
      },
    )

    return `${option.name} - ${durationDate}`
  }

  return option.name
}

export default function TimeframeSelect({ timeframe, selectFunction }) {
  const theme = useTheme()

  return (
    <Card
      sx={{
        // width: '260px',
        marginBottom: theme.spacing(2),
      }}
      elevation={4}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 20, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
          color="text.primary"
          gutterBottom
        >
          <AccessTimeIcon fontSize="large" color="primary" />
          Select Timeframe
          <Tooltip title="Select a timeframe to compare specific statistics." placement="top" arrow>
            <InfoOutlinedIcon color="secondary" fontSize="small" />
          </Tooltip>
        </Typography>
        <Autocomplete
          value={timeframe}
          getOptionLabel={option => getTimeFrameLabel(option)}
          options={Object.values(timeframeOptions)}
          onChange={(event, newValue) => {
            let newTimeframeId = null
            if (newValue && newValue.id != null) {
              newTimeframeId = newValue.id
            }
            selectFunction(newTimeframeId)
          }}
          renderInput={params => (
            <TextField
              {...params}
              fullWidth
              placeholder="select timeframe"
              sx={{
                color: 'inherit',
                width: '230px',
                '& .MuiOutlinedInput-root': {
                  color: 'inherit',
                  padding: theme.spacing(1, 1, 1, 0),
                },
              }}
            />
          )}
        />
      </CardContent>
    </Card>
  )
}

TimeframeSelect.propTypes = {
  timeframe: propTypes.object.isRequired,
  selectFunction: propTypes.func.isRequired,
}
