import React from 'react'
import { useTheme } from '@mui/material/styles'
import { Autocomplete, Card, CardContent, TextField, Tooltip, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import propTypes from 'prop-types'
import ladderOptions from '../../services/aoeiv-net/aoeiv-ladder-strings.json'

export default function LadderSelect({ ladder, selectFunction }) {
  const theme = useTheme()

  return (
    <Card
      sx={{
        // width: '260px',
        marginBottom: theme.spacing(2),
        // marginRight: theme.spacing(2),
      }}
      elevation={4}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 20, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
          color="text.primary"
          gutterBottom
        >
          <MilitaryTechIcon fontSize="large" color="primary" />
          Select Ladder
          <Tooltip title="Select the ladder data you want to use for the statistics." placement="top" arrow>
            <InfoOutlinedIcon color="secondary" fontSize="small" />
          </Tooltip>
        </Typography>
        <Autocomplete
          value={ladder}
          getOptionLabel={option => option.label}
          options={Object.values(ladderOptions)}
          onChange={(event, newValue) => {
            let newLadderId = null
            if (newValue && newValue.id != null) {
              newLadderId = newValue.id
            }
            selectFunction(newLadderId)
          }}
          renderInput={params => (
            <TextField
              {...params}
              fullWidth
              placeholder="select ladder"
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

LadderSelect.propTypes = {
  ladder: propTypes.object.isRequired,
  selectFunction: propTypes.func.isRequired,
}
