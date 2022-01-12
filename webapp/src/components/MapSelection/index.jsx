import React from 'react'
import { Autocomplete, Card, CardContent, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import propTypes from 'prop-types'
import aoeStrings from '../../services/aoeiv-net/aoeiv-strings.json'

export default function MapSelection({ selectFunction }) {
  const theme = useTheme()

  return (
    <Card
      sx={{
        width: '280px',
        margin: '20px',
      }}
      elevation={4}
    >
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
          Select Map
        </Typography>
        <Autocomplete
          getOptionLabel={option => option.string}
          options={aoeStrings.map_type}
          onChange={(event, newValue) => {
            let newMapId = null
            if (newValue && newValue.id != null) {
              newMapId = newValue.id
            }
            selectFunction(newMapId)
          }}
          renderInput={params => (
            <TextField
              {...params}
              fullWidth
              placeholder="search map"
              sx={{
                color: 'inherit',
                width: '250px',
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

MapSelection.propTypes = {
  selectFunction: propTypes.func.isRequired,
}
